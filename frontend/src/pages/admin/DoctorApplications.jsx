import { useEffect, useState } from "react";
import { Table, Card, Button, Badge, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Clock, User, Mail, IndianRupee } from "lucide-react";
import { updateDoctorStatus } from "../../api/doctorApi.js";
import axiosInstance from "../../api/axiosInstance.js";
import "../../styles/DoctorApplications.css";

const DoctorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // Track which button is loading

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/doc/applications");
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (doctorId, status) => {
    setActionId(doctorId);
    try {
      const res = await updateDoctorStatus(doctorId, status);
      if (res.data.success) {
        toast.success(res.data.msg || `Application ${status}`);
        fetchApplications();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const configs = {
      Pending: { bg: "warning-subtle", text: "warning-emphasis", icon: <Clock size={12} /> },
      Accepted: { bg: "success-subtle", text: "success-emphasis", icon: <CheckCircle size={12} /> },
      Rejected: { bg: "danger-subtle", text: "danger-emphasis", icon: <XCircle size={12} /> },
    };
    const config = configs[status] || { bg: "secondary", text: "white", icon: null };
    
    return (
      <Badge bg={config.bg} className={`${config.text} border d-inline-flex align-items-center gap-1 px-2 py-1`}>
        {config.icon} {status}
      </Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h3 className="fw-bold m-0">Doctor Applications</h3>
        <p className="text-muted small">Review and manage professional onboarding requests.</p>
      </div>

      <Card className="border-0 shadow-sm application-card">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0 custom-app-table">
            <thead>
              <tr>
                <th className="ps-4">Doctor Info</th>
                <th>Specialization</th>
                <th>Consultation Fee</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <div className="mt-2 text-muted small">Retrieving applications...</div>
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="app-avatar me-3">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{app.user?.name || "Unknown"}</div>
                          <div className="text-muted x-small d-flex align-items-center gap-1">
                            <Mail size={10} /> {app.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold text-secondary">{app.Specialist}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-dark fw-medium">
                        <IndianRupee size={14} className="text-muted" /> {app.fees}
                      </div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="text-end pe-4">
                      {app.status === "Pending" ? (
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            size="sm"
                            variant="success"
                            className="btn-action shadow-sm"
                            disabled={actionId === app.id}
                            onClick={() => handleStatusUpdate(app.id, "Accepted")}
                          >
                            <CheckCircle size={14} className="me-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="btn-action"
                            disabled={actionId === app.id}
                            onClick={() => handleStatusUpdate(app.id, "Rejected")}
                          >
                            <XCircle size={14} className="me-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted small italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No applications currently in queue.
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

export default DoctorApplications;