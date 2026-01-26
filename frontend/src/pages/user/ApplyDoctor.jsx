import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { applyForDoctor } from "../../api/doctorApi";

const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    specialist: "",
    fees: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.specialist || !formData.fees) {
      toast.error("Specialist and fees are required");
      return;
    }

    try {
      const res = await applyForDoctor({
        specialist: formData.specialist,
        fees: formData.fees,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Application submitted successfully");
        setFormData({ specialist: "", fees: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "You have already applied or request failed"
      );
    }
  };

  return (
    <>
      <h3 className="mb-4">Apply For Doctor</h3>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialist</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialist"
                    placeholder="e.g. Cardiologist"
                    value={formData.specialist}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Consultation Fees</Form.Label>
                  <Form.Control
                    type="number"
                    name="fees"
                    placeholder="Enter fees"
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Submit Application
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ApplyDoctor;
