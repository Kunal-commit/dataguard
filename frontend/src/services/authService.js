import api from "../api";

const authService = {
  async login(username, password) {
    const response = await api.post("/auth/login/", {
      username,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post("/auth/register/", {
      username,
      email,
      password,
    });

    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  getAccessToken() {
    return localStorage.getItem("access_token");
  },
};

export default authService;
