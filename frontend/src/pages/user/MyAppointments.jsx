import { useEffect, useState } from "react";
import { Table, Button, Card, Modal, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAppointmentsByUser,
  updateAppointment,
  deleteAppointment,
} from "../../api/appointmentAPI";
import { getDoctorList } from "../../api/userAPI";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [doctorId, setDoctorId] = useState("");

  /* ================= FETCH DATA ================= */

  const fetchAppointments = async () => {
    try {
      const res = await getAppointmentsByUser();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await getDoctorList();
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  /* ================= ACTIONS ================= */

  const handleEditClick = (appt) => {
    if (appt.status !== "Pending") {
      toast.info("Only pending appointments can be edited");
      return;
    }

    setSelectedAppointment(appt);
    setDateTime(appt.dateTime.slice(0, 16));
    setDoctorId(appt.doctorId);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await updateAppointment(selectedAppointment.id, {
        dateTime,
        doctorId,
      });

      if (res.data.success) {
        toast.success("Appointment updated successfully");
        setShow(false);
        fetchAppointments();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      const res = await deleteAppointment(id);
      if (res.data.success) {
        toast.success("Appointment deleted");
        fetchAppointments();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= UI ================= */

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <h3 className="mb-4">My Appointments</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
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
                    <td>{appt.doctor?.name || "N/A"}</td>
                    <td>{formatDateTime(appt.dateTime)}</td>

                    <td>{appt.status}</td>
                    <td>
                      {appt.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(appt)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(appt.id)}
                          >
                            Delete
                          </Button>
                        </>
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

      {/* ================= EDIT MODAL ================= */}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyAppointments;
