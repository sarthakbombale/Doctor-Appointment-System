import axios from "axios";

const axiosInstance = axios.create({
  // This switch ensures it works on your PC AND on Netlify
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7005/api",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token6163");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData vs JSON automatically
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const details = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.msg || error.response?.data?.message || error.message,
      url: error.config?.url,
    };

    if (error.response) {
      console.error("API Error Detailed:", details);
    } else if (error.request) {
      console.error("API Error: No response received", details);
    } else {
      console.error("API Error: Request setup failed", details);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token6163");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;