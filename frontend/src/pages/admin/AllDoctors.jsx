import { useEffect, useState } from "react";
import { Table, Card, Badge, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Stethoscope, Phone, Mail, User, IndianRupee, MoreVertical } from "lucide-react";
import { getAllDoctorDetails } from "../../api/doctorApi.js";
import "../../styles/AllDoctors.css";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctorDetails();
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      }
    } catch (error) {
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold m-0">Medical Directory</h3>
          <p className="text-muted small">Overview of all verified practitioners</p>
        </div>
        {!loading && (
          <Badge bg="info" className="text-dark px-3 py-2 rounded-pill shadow-sm">
            {doctors.length} Registered Doctors
          </Badge>
        )}
      </div>

      <Card className="border-0 shadow-sm doctor-table-card">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4">Doctor</th>
                <th>Specialization</th>
                <th>Contact info</th>
                <th>Fees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted">Loading specialists...</span>
                  </td>
                </tr>
              ) : doctors.length > 0 ? (
                doctors.map((doc, index) => (
                  <tr key={doc.doctorId || index}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="doctor-avatar me-3">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{doc.name}</div>
                          <div className="text-muted x-small">{doc.gender || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="soft-primary" className="specialist-badge d-inline-flex align-items-center gap-1">
                        <Stethoscope size={12} /> {doc.specialist || "General"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className="small d-flex align-items-center gap-2">
                          <Mail size={13} className="text-muted" /> {doc.email}
                        </span>
                        <span className="small d-flex align-items-center gap-2">
                          <Phone size={13} className="text-muted" /> {doc.contactNumber || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark d-flex align-items-center">
                        <IndianRupee size={14} /> {doc.fees || 0}
                      </div>
                    </td>
                    <td>
                      <Badge bg="success" className="dot-badge">Active</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <p className="text-muted m-0">No medical records found.</p>
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

export default AllDoctors;