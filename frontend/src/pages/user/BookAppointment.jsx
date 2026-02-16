import { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDoctorList } from "../../api/userApi.js";
import { createAppointment } from "../../api/appointmentApi.js";
import { Calendar, User, Clock, DollarSign, Activity } from "lucide-react";
import "../../styles/BookAppointment.css";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ doctorId: "", dateTime: "" });
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctorList();
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      }
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.dateTime) {
      return toast.warn("Please select a doctor and date");
    }

    setLoading(true);
    try {
      const res = await createAppointment(formData);
      if (res.data.success) {
        toast.success("Appointment booked successfully!");
        setFormData({ doctorId: "", dateTime: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="booking-header mb-5">
        <h2><Activity className="me-2 text-primary" /> Schedule an Appointment</h2>
        <p className="text-muted">Find your specialist and choose a convenient time slot.</p>
      </div>

      <Row className="g-4">
        {/* Selection Column */}
        <Col lg={7}>
          <Card className="booking-card border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <div className="section-title mb-4">
                  <span className="step-number">1</span>
                  <h5>Select Professional</h5>
                </div>
                
                <Form.Group className="mb-4">
                  <div className="doctor-grid">
                    {doctors.map((doc) => (
                      <div 
                        key={doc.id} 
                        className={`doctor-option ${formData.doctorId === doc.user.id ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, doctorId: doc.user.id})}
                      >
                        <div className="d-flex align-items-center">
                          <div className="doc-avatar">
                             {doc.user.name.charAt(0)}
                          </div>
                          <div className="ms-3">
                            <p className="doc-name mb-0">Dr. {doc.user.name}</p>
                            <Badge bg="light" text="dark" className="spec-badge">{doc.Specialist}</Badge>
                            <div className="doc-meta">
                              <DollarSign size={12} /> <span>{doc.fees}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <div className="section-title mb-4">
                  <span className="step-number">2</span>
                  <h5>Choose Schedule</h5>
                </div>

                <Form.Group className="mb-4">
                  <div className="input-with-icon">
                    <Calendar className="input-icon" size={20} />
                    <Form.Control
                      type="datetime-local"
                      name="dateTime"
                      className="custom-input"
                      value={formData.dateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-100 btn-book-now"
                >
                  {loading ? "Confirming..." : "Confirm Appointment"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Info Column */}
        <Col lg={5}>
          <Card className="info-card border-0 bg-primary text-white p-4 h-100">
            <h4>Quick Guidelines</h4>
            <ul className="guideline-list mt-4">
              <li><Clock size={18} /> Ensure you arrive 15 minutes early.</li>
              <li><User size={18} /> Carry your previous medical reports.</li>
              <li><Activity size={18} /> Rescheduling is allowed up to 2 hours before.</li>
            </ul>
            <div className="mt-auto pt-5">
              <small className="opacity-75">Need help? Contact support at +91 98765 43210</small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;