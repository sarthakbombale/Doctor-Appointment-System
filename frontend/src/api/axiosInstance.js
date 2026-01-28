import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7005/api",
  timeout: 10000,
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.msg || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token6163");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
