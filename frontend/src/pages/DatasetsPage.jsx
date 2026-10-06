import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";

function DatasetsPage({ datasets, onNavigate, onSelectDataset }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DATA MANAGEMENT</span>
          <h1>Datasets</h1>
          <p>Manage and inspect your uploaded CSV datasets.</p>
        </div>

        <button className="primary-button" onClick={() => onNavigate("upload")}>
          + Upload Dataset
        </button>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>All Datasets</h2>
            <p>{datasets.length} dataset(s) available</p>
          </div>
        </div>

        {datasets.length === 0 ? (
          <EmptyState
            icon="▣"
            title="Your dataset library is empty"
            description="Upload a CSV file to begin profiling and validating your data."
            buttonText="Upload Dataset"
            onClick={() => onNavigate("upload")}
          />
        ) : (
          <DatasetTable datasets={datasets} onSelect={onSelectDataset} />
        )}
      </section>
    </>
  );
}

export default DatasetsPage;
