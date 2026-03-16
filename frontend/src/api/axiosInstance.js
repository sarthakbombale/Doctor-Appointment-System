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
    // Log the actual response object to see real server messages
    console.error("API Error Detailed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
      url: config?.url,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token6163");
      // Optional: window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;