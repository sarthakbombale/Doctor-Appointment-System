import { useEffect, useState } from "react";
import { Table, Button, Card, Badge, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Check, X, CheckCircle, Clock, User, Calendar } from "lucide-react";
import {
  getAppointmentsOfDoctor,
  updateAppointmentStatusByDoctor,
} from "../../api/appointmentApi.js";
import "../../styles/DocMyAppointments.css";

const DocMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointmentsOfDoctor();
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (error) {
      console.error("Doctor appointments fetch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      // Ensure 'status' matches the backend's allowedStatus: ["Pending", "Accepted", "Rejected", "Completed"]
      const res = await updateAppointmentStatusByDoctor(id, { status });
      if (res.data.success) {
        toast.success(res.data.msg);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update appointment status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning-subtle" className="text-warning-emphasis border">Pending</Badge>;
      case "Accepted":
        return <Badge bg="success-subtle" className="text-success-emphasis border">Accepted</Badge>;
      case "Rejected":
        return <Badge bg="danger-subtle" className="text-danger-emphasis border">Rejected</Badge>;
      case "Completed":
        return <Badge bg="primary-subtle" className="text-primary-emphasis border">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold m-0">My Consultations</h3>
          <p className="text-muted small">Manage your patient appointments and status</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm doc-app-card">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0 custom-doc-table">
            <thead>
              <tr>
                <th className="ps-4">Patient</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <div className="text-muted mt-2 small">Loading schedule...</div>
                  </td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="patient-init">
                          <User size={14} />
                        </div>
                        <span className="fw-semibold">{appt.patient?.name || "N/A"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="small d-flex align-items-center gap-1">
                          <Calendar size={12} className="text-muted" />
                          {new Date(appt.dateTime).toLocaleDateString()}
                        </span>
                        <span className="x-small text-muted d-flex align-items-center gap-1">
                          <Clock size={12} />
                          {new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(appt.status)}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {appt.status === "Pending" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateStatus(appt.id, "Accepted")}
                            >
                              <Check size={14} className="me-1" /> Accept
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateStatus(appt.id, "Rejected")}
                            >
                              <X size={14} className="me-1" /> Reject
                            </Button>
                          </>
                        )}

                        {appt.status === "Accepted" && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="action-btn"
                            onClick={() => updateStatus(appt.id, "Completed")}
                          >
                            <CheckCircle size={14} className="me-1" /> Mark Done
                          </Button>
                        )}
                        
                        {(appt.status === "Completed" || appt.status === "Rejected") && (
                          <span className="text-muted x-small italic">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No appointments found in your schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DocMyAppointments;