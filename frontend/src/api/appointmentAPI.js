import axiosInstance from "../api/axiosInstance";

export const createAppointment = (data) => {
  return axiosInstance.post("/appointment/createAppoint", data);
};

export const updateAppointmentStatusByDoctor = (id, data) => {
  return axiosInstance.patch(
    `/appointment/statusUpdateByDoctor/${id}`,
    data
  );
};

export const updateAppointment = (id, data) => {
  return axiosInstance.put(`/appointment/updateAppoint/${id}`, data);
};

export const deleteAppointment = (id) => {
  return axiosInstance.delete(`/appointment/deleteAppoint/${id}`);
};

export const getAppointmentsByUser = () => {
  return axiosInstance.get("/appointment/getAppointmentsByUser");
};

export const getAppointmentsOfDoctor = () => {
  return axiosInstance.get("/appointment/showAppointmentsOfDoctor");
};
