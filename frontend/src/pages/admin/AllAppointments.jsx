import { useEffect, useState } from "react";
import { Table, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      // Admin API (assumed)
      const res = await axiosInstance.get("/appointment/all");

      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Accepted":
        return <Badge bg="success">Accepted</Badge>;
      case "Rejected":
        return <Badge bg="danger">Rejected</Badge>;
      case "Completed":
        return <Badge bg="primary">Completed</Badge>;
      default:
        return status;
    }
  };

  return (
    <>
      <h3 className="mb-4">All Appointments</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Appointment ID</th>
                <th>User ID</th>
                <th>Doctor ID</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>{appt.id}</td>
                    <td>{appt.patient?.name}</td>
                    <td>{appt.doctor?.name}</td>
                    <td>{new Date(appt.dateTime).toLocaleString()}</td>
                    <td>{statusBadge(appt.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default AllAppointments;
