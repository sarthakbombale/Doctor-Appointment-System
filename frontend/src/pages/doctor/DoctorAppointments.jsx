import { useEffect, useState } from "react";
import { Table, Button, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAppointmentsOfDoctor,
  updateAppointmentStatusByDoctor,
} from "../../api/appointmentApi";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointmentsOfDoctor();
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

  const updateStatus = async (id, status) => {
    try {
      const res = await updateAppointmentStatusByDoctor(id, { status });
      if (res.data.success) {
        toast.success(res.data.msg);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to update appointment status"
      );
    }
  };

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
      <h3 className="mb-4">My Appointments</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>{appt.patient?.name || "N/A"}</td>
                    <td>{new Date(appt.dateTime).toLocaleString()}</td>
                    <td>{statusBadge(appt.status)}</td>
                    <td>
                      {appt.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() =>
                              updateStatus(appt.id, "Accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              updateStatus(appt.id, "Rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {appt.status === "Accepted" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            updateStatus(appt.id, "Completed")
                          }
                        >
                          Mark Completed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
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

export default MyAppointments;
