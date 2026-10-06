import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Always use the latest access token.
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// If the access token expires, refresh it and retry the request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login/") ||
      originalRequest.url?.includes("/auth/register/") ||
      originalRequest.url?.includes("/auth/refresh/")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.reload();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh/`,
        { refresh: refreshToken },
      );

      const newAccessToken = response.data.access;

      localStorage.setItem("access_token", newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.reload();

      return Promise.reject(refreshError);
    }
  },
);

export default api;
