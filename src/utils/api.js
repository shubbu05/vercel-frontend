import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor — handle JWT expiry & errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // JWT expired or invalid — force re-login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status === 500) {
      console.error("Server error:", error.response?.data?.message || "Internal server error");
    }

    return Promise.reject(error);
  }
);

export default api;
