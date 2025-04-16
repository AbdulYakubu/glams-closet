import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // Fallback to localhost

const axiosInstance = axios.create({
  baseURL: backend_url,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;