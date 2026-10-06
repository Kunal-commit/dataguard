function ValidationPage({ validationRun, issues, onNavigate }) {
  if (!validationRun) {
    return (
      <>
        <div className="page-heading">
          <div>
            <span className="eyebrow">DATA QUALITY</span>
            <h1>Validation</h1>
            <p>Review your latest validation results.</p>
          </div>
        </div>

        <section className="panel">
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No validation results yet</h3>
            <p>Select a dataset and run validation to see quality results.</p>

            <button
              className="primary-button"
              onClick={() => onNavigate("datasets")}
            >
              Select Dataset
            </button>
          </div>
        </section>
      </>
    );
  }

  const score = Number(validationRun.quality_score ?? 0);

  const qualityClass =
    score >= 90
      ? "quality-good"
      : score >= 70
        ? "quality-medium"
        : "quality-bad";

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DATA QUALITY</span>
          <h1>Validation Results</h1>
          <p>Review detected issues and your dataset quality score.</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => onNavigate("datasets")}
        >
          View Datasets
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <span>Quality Score</span>
            <strong className={qualityClass}>{score.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span>Total Rows</span>
            <strong>{validationRun.total_rows ?? 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span>Issues Found</span>
            <strong>{issues.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span>Passed Rows</span>
            <strong>{validationRun.passed_rows ?? "—"}</strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Validation Issues</h2>
            <p>Issues reported by the validation run.</p>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No issues found</h3>
            <p>No validation issues were returned for this run.</p>
          </div>
        ) : (
          <div className="profile-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Column</th>
                  <th>Rule</th>
                  <th>Issue</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => (
                  <tr key={issue.id ?? index}>
                    <td>{issue.row_number ?? issue.row_index ?? "—"}</td>
                    <td>{issue.column_name || "—"}</td>
                    <td>{issue.rule_type || "—"}</td>
                    <td>
                      {issue.message ||
                        issue.description ||
                        "Validation failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default ValidationPage;
