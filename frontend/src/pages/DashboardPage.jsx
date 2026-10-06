import StatCard from "../components/StatCard";
import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";

function DashboardPage({
  datasets,
  validationRun,
  issues,
  averageQuality,
  onNavigate,
  onSelectDataset,
  selectedDataset,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Monitor your datasets and data quality from one place.</p>
        </div>

        <button className="primary-button" onClick={() => onNavigate("upload")}>
          + New Dataset
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Datasets"
          value={datasets.length}
          icon="▣"
          description="Uploaded datasets"
        />

        <StatCard
          title="Validation Runs"
          value={validationRun ? 1 : 0}
          icon="✓"
          description="Latest session"
        />

        <StatCard
          title="Issues Found"
          value={issues.length}
          icon="!"
          description="Latest validation"
        />

        <StatCard
          title="Latest Quality"
          value={averageQuality === "--" ? "--" : `${averageQuality}%`}
          icon="%"
          description="Latest validation score"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel large-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Datasets</h2>
              <p>Your recently uploaded datasets</p>
            </div>

            <button
              className="text-button"
              onClick={() => onNavigate("datasets")}
            >
              View all →
            </button>
          </div>

          {datasets.length === 0 ? (
            <EmptyState
              icon="▣"
              title="No datasets yet"
              description="Upload your first CSV dataset to start checking data quality."
              buttonText="Upload Dataset"
              onClick={() => onNavigate("upload")}
            />
          ) : (
            <DatasetTable
              datasets={datasets.slice(0, 5)}
              onSelect={onSelectDataset}
            />
          )}
        </section>

        <section className="panel quick-panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common tasks</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => onNavigate("upload")}>
              <span className="quick-icon">↑</span>
              <div>
                <strong>Upload Dataset</strong>
                <small>Add a new CSV file</small>
              </div>
            </button>

            <button onClick={() => onNavigate("datasets")}>
              <span className="quick-icon">▣</span>
              <div>
                <strong>Browse Datasets</strong>
                <small>View your datasets</small>
              </div>
            </button>

            <button
              onClick={() =>
                onNavigate(selectedDataset ? "dataset-detail" : "datasets")
              }
            >
              <span className="quick-icon">✓</span>
              <div>
                <strong>Run Validation</strong>
                <small>Check data quality</small>
              </div>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default DashboardPage;
