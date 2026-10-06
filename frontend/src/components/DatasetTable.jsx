function DatasetTable({ datasets, onSelect }) {
  if (!datasets || datasets.length === 0) {
    return null;
  }

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const formatSize = (bytes) => {
    if (bytes === null || bytes === undefined) {
      return "—";
    }

    return `${(Number(bytes) / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="profile-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Dataset</th>
            <th>File Name</th>
            <th>File Size</th>
            <th>Uploaded</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {datasets.map((dataset) => (
            <tr key={dataset.id}>
              <td>
                <div className="dataset-cell">
                  <span className="dataset-icon">▤</span>

                  <div>
                    <strong>{dataset.name || "Untitled dataset"}</strong>
                    <small>ID: {dataset.id}</small>
                  </div>
                </div>
              </td>

              <td>{dataset.file_name || dataset.original_filename || "—"}</td>

              <td>{formatSize(dataset.file_size ?? dataset.size ?? null)}</td>

              <td>{formatDate(dataset.created_at || dataset.uploaded_at)}</td>

              <td>
                <button
                  type="button"
                  className="table-action"
                  onClick={() => onSelect(dataset)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetTable;
