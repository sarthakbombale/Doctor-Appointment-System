import axiosInstance from "../api/axiosInstance.js";


export const getUserInfo = () => {
  return axiosInstance.get("/user/getUserInfo");
};

export const updateUser = (formData) => {
  return axiosInstance.put("/user/updateUser", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getUserList = () => {
  return axiosInstance.get("/user/userList");
};

export const getDoctorList = () => {
  return axiosInstance.get("/doc/approved-doctors");
};
