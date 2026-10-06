function DatasetDetailPage({
  dataset,
  profile,
  rules,
  ruleType,
  setRuleType,
  columnName,
  setColumnName,
  onAddRule,
  onRunValidation,
  loading,
  onNavigate,
}) {
  if (!dataset) {
    return (
      <section className="panel">
        <h2>No dataset selected</h2>
        <p>Select a dataset to view its profile and validation rules.</p>

        <button
          className="primary-button"
          onClick={() => onNavigate("datasets")}
        >
          View Datasets
        </button>
      </section>
    );
  }

  const columns = profile?.columns || profile?.column_profiles || [];

  const columnNames = columns
    .map((column) =>
      typeof column === "string" ? column : column.name || column.column_name,
    )
    .filter(Boolean);

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DATASET PROFILE</span>
          <h1>{dataset.name}</h1>
          <p>Inspect your data and configure validation rules.</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => onNavigate("datasets")}
        >
          ← Back to Datasets
        </button>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Dataset Overview</h2>
            <p>Profiling information returned by DataGuard</p>
          </div>
        </div>

        {profile ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div>
                <span>Total Rows</span>
                <strong>
                  {profile.total_rows ?? profile.row_count ?? "—"}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <span>Total Columns</span>
                <strong>
                  {profile.total_columns ??
                    profile.column_count ??
                    columnNames.length ??
                    "—"}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <span>Validation Rules</span>
                <strong>{rules.length}</strong>
              </div>
            </div>
          </div>
        ) : (
          <p>Dataset profile is not available yet.</p>
        )}

        {columns.length > 0 && (
          <div className="profile-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Data Type</th>
                  <th>Missing Values</th>
                  <th>Unique Values</th>
                </tr>
              </thead>

              <tbody>
                {columns.map((column, index) => {
                  const name =
                    typeof column === "string"
                      ? column
                      : column.name ||
                        column.column_name ||
                        `Column ${index + 1}`;

                  return (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{column.dtype || column.data_type || "—"}</td>
                      <td>
                        {column.missing_values ?? column.null_count ?? "—"}
                      </td>
                      <td>
                        {column.unique_values ?? column.unique_count ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Validation Rules</h2>
            <p>Configure checks for your dataset columns.</p>
          </div>
        </div>

        <div className="form-group">
          <label>Column Name</label>

          {columnNames.length > 0 ? (
            <select
              value={columnName}
              onChange={(event) => setColumnName(event.target.value)}
            >
              <option value="">Select a column</option>
              {columnNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={columnName}
              onChange={(event) => setColumnName(event.target.value)}
              placeholder="Enter column name"
            />
          )}
        </div>

        <div className="form-group">
          <label>Rule Type</label>
          <select
            value={ruleType}
            onChange={(event) => setRuleType(event.target.value)}
          >
            <option value="required">Required</option>
            <option value="unique">Unique</option>
            <option value="range">Range</option>
            <option value="datatype">Data Type</option>
            <option value="email">Email</option>
          </select>
        </div>

        <button
          className="primary-button"
          onClick={onAddRule}
          disabled={loading}
        >
          Add Rule
        </button>

        <div className="profile-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Rule Type</th>
                <th>Parameters</th>
              </tr>
            </thead>

            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan="3">No rules configured.</td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.column_name}</td>
                    <td>{rule.rule_type}</td>
                    <td>{JSON.stringify(rule.parameters || {})}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          className="primary-button"
          onClick={onRunValidation}
          disabled={loading}
        >
          {loading ? "Validating..." : "Run Validation"}
        </button>
      </section>
    </>
  );
}

export default DatasetDetailPage;
