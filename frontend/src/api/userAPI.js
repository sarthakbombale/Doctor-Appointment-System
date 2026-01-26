import axiosInstance from "../api/axiosInstance";


export const getUserInfo = () => {
  return axiosInstance.get("/user/getUserInfo");
};

export const updateUser = (data) => {
  return axiosInstance.put("/user/updateUser", data);
};

export const getUserList = () => {
  return axiosInstance.get("/user/userList");
};

export const getDoctorList = () => {
  return axiosInstance.get("/user/doctorList");
};
