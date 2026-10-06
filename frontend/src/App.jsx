import { useCallback, useEffect, useState } from "react";

import "./App.css";

import api from "./api";

import authService from "./services/authService";
import datasetService from "./services/datasetService";
import validationService from "./services/validationService";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DatasetsPage from "./pages/DatasetsPage";
import UploadPage from "./pages/UploadPage";
import DatasetDetailPage from "./pages/DatasetDetailPage";
import ValidationPage from "./pages/ValidationPage";

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    const firstError = Object.values(data).flat()[0];

    if (firstError) return String(firstError);
  }

  return error?.message || "Something went wrong. Please try again.";
}

function App() {
  // Authentication
  const [token, setToken] = useState(() => authService.getAccessToken());
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigation and notifications
  const [page, setPage] = useState("dashboard");
  const [message, setMessage] = useState("");

  // Dataset state
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [profile, setProfile] = useState(null);

  // Validation state
  const [rules, setRules] = useState([]);
  const [validationRun, setValidationRun] = useState(null);
  const [issues, setIssues] = useState([]);

  // Rule form state
  const [ruleType, setRuleType] = useState("required");
  const [columnName, setColumnName] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((error) => {
    setMessage(getErrorMessage(error));
  }, []);

  // Fetch datasets belonging to the logged-in user.
  const fetchDatasets = useCallback(async () => {
    try {
      const data = await datasetService.getDatasets();
      setDatasets(Array.isArray(data) ? data : []);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  // Load datasets whenever authentication is available.
  useEffect(() => {
    if (!token) return;

    fetchDatasets();
  }, [token, fetchDatasets]);

  // Login and registration
  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegistering) {
        await authService.register(username, email, password);

        setMessage("Registration successful. Please log in.");
        setIsRegistering(false);
        setPassword("");
        return;
      }

      const data = await authService.login(username, password);

      setToken(data.access);
      setPage("dashboard");
      setPassword("");
      setMessage("Welcome to DataGuard!");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    authService.logout();

    setToken(null);
    setUsername("");
    setEmail("");
    setPassword("");

    setDatasets([]);
    setSelectedDataset(null);
    setProfile(null);
    setRules([]);
    setValidationRun(null);
    setIssues([]);

    setPage("dashboard");
    setMessage("");
  };

  // Navigate between pages.
  const handleNavigate = (nextPage) => {
    setPage(nextPage);
    setMessage("");
  };

  // Open a dataset and load its profile and validation rules.
  const handleSelectDataset = async (dataset) => {
    setSelectedDataset(dataset);
    setProfile(null);
    setRules([]);
    setValidationRun(null);
    setIssues([]);
    setMessage("");
    setPage("dataset-detail");
    setLoading(true);

    try {
      const [profileResponse, rulesResponse] = await Promise.all([
        datasetService.getProfile(dataset.id),
        validationService.getRules(dataset.id),
      ]);

      // Some APIs return { profile: {...} }, while others return
      // the profile object directly.
      setProfile(profileResponse?.profile ?? profileResponse);

      setRules(Array.isArray(rulesResponse) ? rulesResponse : []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Upload a CSV dataset.
  const handleUpload = async (name, file) => {
    if (!name || !file) {
      setMessage("Please provide a dataset name and select a file.");
      return false;
    }

    setLoading(true);
    setMessage("");

    try {
      await datasetService.uploadDataset(name, file);

      await fetchDatasets();

      setMessage("Dataset uploaded successfully.");
      setPage("datasets");

      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a validation rule to the selected dataset.
  const handleAddRule = async (event) => {
    event?.preventDefault();

    if (!selectedDataset) {
      setMessage("Please select a dataset first.");
      return;
    }

    if (!columnName.trim()) {
      setMessage("Please select a column.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let parameters = {};

      if (ruleType === "range") {
        parameters = { min: 18, max: 60 };
      } else if (ruleType === "datatype") {
        parameters = { type: "integer" };
      }

      await validationService.addRule(selectedDataset.id, {
        rule_type: ruleType,
        column_name: columnName.trim(),
        parameters,
      });

      const updatedRules = await validationService.getRules(selectedDataset.id);

      setRules(Array.isArray(updatedRules) ? updatedRules : []);

      setMessage("Validation rule added successfully.");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Execute validation and load the resulting issues.
  const handleRunValidation = async () => {
    if (!selectedDataset) {
      setMessage("Please select a dataset first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await validationService.runValidation(selectedDataset.id);

      // Support either a direct validation-run object or a
      // response that wraps it in a validation_run property.
      const run = result?.validation_run ?? result;

      setValidationRun(run);
      setIssues([]);

      if (run?.id != null) {
        const issuesResponse = await validationService.getIssues(run.id);

        setIssues(Array.isArray(issuesResponse) ? issuesResponse : []);
      }

      setPage("validation");
      setMessage("Validation completed successfully.");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Return to the login/register screen when signed out.
  if (!token) {
    return (
      <LoginPage
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        message={message}
        loading={loading}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  const pageDetails = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Monitor your data quality at a glance.",
    },
    datasets: {
      title: "Datasets",
      subtitle: "Manage and explore your uploaded datasets.",
    },
    upload: {
      title: "Upload Dataset",
      subtitle: "Import a CSV file to begin data analysis.",
    },
    "dataset-detail": {
      title: selectedDataset?.name || "Dataset Details",
      subtitle: "Explore your data profile and validation rules.",
    },
    validation: {
      title: "Validation Results",
      subtitle: "Review data quality checks and validation issues.",
    },
  };

  const currentPage = pageDetails[page] ?? pageDetails.dashboard;

  const averageQuality =
    datasets.length > 0
      ? Math.round(
          datasets.reduce((total, dataset) => {
            return total + (Number(dataset.quality_score) || 0);
          }, 0) / datasets.length,
        )
      : 0;

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={handleNavigate}
        onLogout={handleLogout}
        username={username || "User"}
      />

      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumb">
            <span>DataGuard</span>
            <span className="breadcrumb-separator">/</span>
            <span>{currentPage.title}</span>
          </div>

          <button
            type="button"
            className="top-upload-button"
            onClick={() => handleNavigate("upload")}
          >
            + Upload Dataset
          </button>
        </div>

        <div className="content">
          <Header
            title={currentPage.title}
            subtitle={currentPage.subtitle}
            username={username || "User"}
          />

          {message && (
            <div className="global-message" role="status" aria-live="polite">
              <span>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {loading && page !== "upload" && (
            <LoadingSpinner message="Loading..." />
          )}

          {!loading && page === "dashboard" && (
            <DashboardPage
              datasets={datasets}
              validationRun={validationRun}
              issues={issues}
              averageQuality={averageQuality}
              onNavigate={handleNavigate}
              onSelectDataset={handleSelectDataset}
              selectedDataset={selectedDataset}
            />
          )}

          {!loading && page === "datasets" && (
            <DatasetsPage
              datasets={datasets}
              onNavigate={handleNavigate}
              onSelectDataset={handleSelectDataset}
            />
          )}

          {page === "upload" && (
            <UploadPage
              loading={loading}
              onUpload={handleUpload}
              onNavigate={handleNavigate}
            />
          )}

          {page === "dataset-detail" && !loading && (
            <DatasetDetailPage
              dataset={selectedDataset}
              profile={profile}
              rules={rules}
              ruleType={ruleType}
              setRuleType={setRuleType}
              columnName={columnName}
              setColumnName={setColumnName}
              onAddRule={handleAddRule}
              onRunValidation={handleRunValidation}
              loading={loading}
              onNavigate={handleNavigate}
            />
          )}

          {page === "validation" && !loading && (
            <ValidationPage
              validationRun={validationRun}
              issues={issues}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
