import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7005/api",
  timeout: 10000,
});

// Request Interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token6163");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // centralized error handling
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;