import { useEffect, useState } from "react";
import { Table, Card, Badge, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Calendar, Clock, User, UserCheck, Hash, Activity } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import "../../styles/AllAppointments.css";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointment/all");
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: { bg: "warning-subtle", text: "warning-emphasis", label: "Pending" },
      Accepted: { bg: "info-subtle", text: "info-emphasis", label: "Confirmed" },
      Rejected: { bg: "danger-subtle", text: "danger-emphasis", label: "Cancelled" },
      Completed: { bg: "success-subtle", text: "success-emphasis", label: "Completed" },
    };

    const config = statusMap[status] || { bg: "secondary-subtle", text: "secondary", label: status };

    return (
      <Badge bg={config.bg} className={`${config.text} border px-2 py-1 fw-semibold`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold m-0 text-dark">Appointment Ledger</h3>
          <p className="text-muted small">Monitoring all patient-doctor interactions</p>
        </div>
        {!loading && (
          <div className="stats-pill bg-white border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2">
            <Activity size={16} className="text-primary" />
            <span className="small fw-bold">{appointments.length} Total Records</span>
          </div>
        )}
      </div>

      <Card className="border-0 shadow-sm appointment-card">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0 appointment-table">
            <thead>
              <tr>
                <th className="ps-4">Patient</th>
                <th>Assigned Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="pe-4 text-end">Reference</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted">Loading logs...</span>
                  </td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-icon bg-light text-primary">
                          <User size={14} />
                        </div>
                        <span className="fw-semibold">{appt.patient?.name || "Deleted User"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-icon bg-light text-success">
                          <UserCheck size={14} />
                        </div>
                        <span>Dr. {appt.doctor?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="small fw-bold d-flex align-items-center gap-1">
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
                    <td className="pe-4 text-end">
                      <code className="text-muted x-small">
                        <Hash size={10} /> {String(appt.id).slice(-8)}
                      </code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No appointments recorded in the system.
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

export default AllAppointments;