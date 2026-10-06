import { useState } from "react";

function UploadPage({ loading, onUpload, onNavigate }) {
  const [datasetName, setDatasetName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!datasetName.trim() || !selectedFile) {
      return;
    }

    const uploaded = await onUpload(datasetName.trim(), selectedFile);

    if (uploaded) {
      setDatasetName("");
      setSelectedFile(null);
      event.target.reset();
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DATA MANAGEMENT</span>
          <h1>Upload Dataset</h1>
          <p>Add a CSV dataset to DataGuard.</p>
        </div>
      </div>

      <section className="upload-layout">
        <div className="panel upload-panel">
          <div className="upload-header">
            <div className="upload-big-icon">↑</div>
            <div>
              <h2>Upload your CSV</h2>
              <p>Choose a CSV file and give your dataset a meaningful name.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Dataset Name</label>
              <input
                type="text"
                placeholder="e.g. Customer Records"
                value={datasetName}
                onChange={(event) => setDatasetName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>CSV File</label>

              <label className="file-dropzone">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] || null)
                  }
                  required
                />

                <span className="file-icon">↑</span>

                <strong>
                  {selectedFile ? selectedFile.name : "Choose a CSV file"}
                </strong>

                <small>
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB selected`
                    : "CSV files only"}
                </small>
              </label>
            </div>

            <div className="upload-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onNavigate("datasets")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Dataset"}
              </button>
            </div>
          </form>
        </div>

        <div className="panel info-panel">
          <h3>What happens next?</h3>

          <div className="process-step">
            <span>1</span>
            <div>
              <strong>Upload</strong>
              <p>Your CSV is added to your dataset library.</p>
            </div>
          </div>

          <div className="process-step">
            <span>2</span>
            <div>
              <strong>Profile</strong>
              <p>Inspect columns, missing values and unique values.</p>
            </div>
          </div>

          <div className="process-step">
            <span>3</span>
            <div>
              <strong>Validate</strong>
              <p>Configure rules and identify data quality issues.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UploadPage;
