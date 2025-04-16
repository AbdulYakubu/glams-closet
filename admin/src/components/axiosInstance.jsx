import axios from "axios";
import { backend_url } from "./App"; // Adjust if App.js path differs

const axiosInstance = axios.create({
  baseURL: backend_url,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.token = token; // Matches adminAuth expectation
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;