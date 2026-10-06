import api from "../api";

const datasetService = {
  async getDatasets(search = "") {
    const response = await api.get("/datasets/", {
      params: search ? { search } : {},
    });

    return response.data.results || response.data;
  },

  async uploadDataset(name, file) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const response = await api.post("/datasets/", formData);
    return response.data;
  },

  async getProfile(datasetId) {
    const response = await api.get(`/datasets/${datasetId}/profile/`);

    return response.data;
  },
};

export default datasetService;
