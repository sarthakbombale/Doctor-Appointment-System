import { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDoctorList } from "../../api/userApi";
import { createAppointment } from "../../api/appointmentApi";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    dateTime: "",
  });

  const fetchDoctors = async () => {
    try {
      const res = await getDoctorList();
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (error) {
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId || !formData.dateTime) {
      toast.error("Please select doctor and date");
      return;
    }

    try {
      const res = await createAppointment(formData);

      if (res.data.success) {
        toast.success(res.data.msg || "Appointment booked successfully");
        setFormData({ doctorId: "", dateTime: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to book appointment"
      );
    }
  };

  return (
    <>
      <h3 className="mb-4">Book Appointment</h3>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Doctor</Form.Label>
                  <Form.Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Book Appointment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookAppointment;
