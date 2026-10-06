import api from "../api";

const validationService = {
  async getRules(datasetId) {
    const response = await api.get(`/datasets/${datasetId}/rules/`);

    return response.data.results || response.data;
  },

  async addRule(datasetId, rule) {
    const response = await api.post(`/datasets/${datasetId}/rules/`, rule);

    return response.data;
  },

  async runValidation(datasetId) {
    const response = await api.post(`/datasets/${datasetId}/validate/`, {});

    return response.data;
  },

  async getIssues(runId) {
    const response = await api.get(`/validation-runs/${runId}/issues/`);

    return response.data.results || response.data;
  },
};

export default validationService;
