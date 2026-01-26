import axiosInstance from "../api/axiosInstance";


export const applyForDoctor = (data) => {
  return axiosInstance.post("/doc/apply", data);
};

export const updateDoctorStatus = (doctorId, data) => {
  return axiosInstance.post(`/doc/docStatus/${doctorId}`, data);
};

export const getMyDoctorApplication = () => {
  return axiosInstance.get("/doc/my-application");
};

export const updateDoctor = (id, data) => {
  return axiosInstance.patch(`/doc/update/${id}`, data);
};

export const deleteDoctor = (id) => {
  return axiosInstance.delete(`/doc/delete/${id}`);
};

export const getAllDoctorDetails = () => {
  return axiosInstance.get("/doc/admin/all-doctors");
};

export const getDoctorApplications = () => {
  return axiosInstance.get("/doc/applications");
};

