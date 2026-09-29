import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → on nettoie et on renvoie au login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;