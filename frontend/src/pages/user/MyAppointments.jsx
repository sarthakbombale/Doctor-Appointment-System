import { useEffect, useState } from "react";
import { Table, Button, Card, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { Edit3, Trash2, Calendar, User, Clock } from "lucide-react";
import {
  getAppointmentsByUser,
  updateAppointment,
  deleteAppointment,
} from "../../api/appointmentApi.js";
import { getDoctorList } from "../../api/userApi.js";
import "../../styles/MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, docRes] = await Promise.all([
        getAppointmentsByUser(),
        getDoctorList(),
      ]);
      if (apptRes.data.success) setAppointments(apptRes.data.appointments || []);
      if (docRes.data.success) setDoctors(docRes.data.doctors || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEditClick = (appt) => {
    if (appt.status !== "Pending") return toast.info("Only pending appointments can be edited");
    setSelectedAppointment(appt);
    setDateTime(appt.dateTime.slice(0, 16));
    setDoctorId(appt.doctorId);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await updateAppointment(selectedAppointment.id, { dateTime, doctorId });
      if (res.data.success) {
        toast.success("Appointment updated");
        setShow(false);
        fetchData();
      }
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await deleteAppointment(id);
      if (res.data.success) {
        toast.success("Appointment cancelled");
        fetchData();
      }
    } catch { toast.error("Cancellation failed"); }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: "warning",
      Confirmed: "success",
      Cancelled: "danger",
      Completed: "info",
    };
    return <Badge bg={statusMap[status] || "secondary"} className="status-pill">{status}</Badge>;
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Loading your schedule...</p>
    </div>
  );

  return (
    <div className="appointments-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">My Appointments</h3>
        <Badge bg="primary" pill>{appointments.length} Total</Badge>
      </div>

      <Card className="table-card border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="m-0 align-middle appointment-table">
            <thead>
              <tr>
                <th>Doctor Details</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="doc-icon-small me-3">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="fw-bold">Dr. {appt.doctor?.name || "N/A"}</div>
                          <div className="text-muted x-small">Specialist</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="small fw-semibold"><Calendar size={14} className="me-1" />{formatDateTime(appt.dateTime).split(',')[0]}</span>
                        <span className="text-muted small"><Clock size={14} className="me-1" />{formatDateTime(appt.dateTime).split(',')[1]}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(appt.status)}</td>
                    <td className="text-center">
                      {appt.status === "Pending" ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="light" size="sm" className="action-btn edit" onClick={() => handleEditClick(appt)}>
                            <Edit3 size={16} />
                          </Button>
                          <Button variant="light" size="sm" className="action-btn delete" onClick={() => handleDelete(appt.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted small">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No appointments found. Start by booking one!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modern Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Select New Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                className="custom-input"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Change Doctor</Form.Label>
              <Form.Select
                className="custom-input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.user.id}>
                    Dr. {doc.user.name} ({doc.Specialist})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShow(false)}>Dismiss</Button>
          <Button className="btn-confirm-update" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyAppointments;