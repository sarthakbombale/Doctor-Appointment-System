import axiosInstance from "../api/axiosInstance.js";


export const getAdminDashboard = () => {
  return axiosInstance.get("/dashboard/admin");
};

export const getDoctorDashboard = () => {
  return axiosInstance.get("/dashboard/doctor");
};

export const getUserDashboard = () => {
  return axiosInstance.get("/dashboard/user");
};


