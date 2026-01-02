import axiosInstance from "./axiosInstance";

// 🔹 Register User
export const saveAppointment = (data) => {
  return axiosInstance.post("/appointment/createAppoint", data);
};