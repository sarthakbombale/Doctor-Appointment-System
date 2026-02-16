import { useState } from "react";
import { Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { applyForDoctor } from "../../api/doctorAPI.js";
import { Briefcase, IndianRupee, ShieldCheck, ClipboardList, Info } from "lucide-react";
import "../../styles/ApplyDoctor.css";

const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    specialist: "",
    fees: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialist || !formData.fees) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await applyForDoctor({
        specialist: formData.specialist,
        fees: formData.fees,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Application submitted for review!");
        setFormData({ specialist: "", fees: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-doctor-wrapper py-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <ShieldCheck className="text-primary" size={32} />
        <h3 className="m-0 fw-bold">Professional Onboarding</h3>
      </div>

      <Row className="g-4">
        {/* Main Application Form */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm apply-card">
            <Card.Body className="p-4">
              <div className="form-intro mb-4">
                <h5 className="fw-bold">Medical Profile Details</h5>
                <p className="text-muted small">Provide your specialization and consultation details for the administration to verify.</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small">Area of Specialization</Form.Label>
                  <InputGroup className="custom-input-group">
                    <InputGroup.Text><Briefcase size={18} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="specialist"
                      placeholder="e.g. Cardiologist, Neurologist"
                      value={formData.specialist}
                      onChange={handleChange}
                      className="border-start-0"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted small">Your primary field of practice.</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small">Consultation Fees (per visit)</Form.Label>
                  <InputGroup className="custom-input-group">
                    <InputGroup.Text><IndianRupee size={18} /></InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="fees"
                      placeholder="e.g. 500"
                      value={formData.fees}
                      onChange={handleChange}
                      className="border-start-0"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted small">This fee will be visible to patients during booking.</Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 btn-apply-submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Application"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Informational Sidebar */}
        <Col lg={5}>
          <Card className="border-0 bg-light p-4 info-sidebar">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Info className="text-info" size={20} />
              <h6 className="fw-bold m-0">Verification Process</h6>
            </div>
            
            <div className="process-steps">
              <div className="step-item d-flex gap-3 mb-4">
                <div className="step-icon"><ClipboardList size={18} /></div>
                <div>
                  <p className="mb-0 fw-bold small">Application Review</p>
                  <p className="text-muted x-small">Our admin team will review your credentials within 24-48 hours.</p>
                </div>
              </div>
              
              <div className="step-item d-flex gap-3">
                <div className="step-icon"><ShieldCheck size={18} /></div>
                <div>
                  <p className="mb-0 fw-bold small">Profile Activation</p>
                  <p className="text-muted x-small">Once approved, your profile will be live and you can begin accepting appointments.</p>
                </div>
              </div>
            </div>

            <div className="notice-box mt-auto p-3 rounded bg-white border">
              <p className="m-0 text-muted x-small">
                <strong>Note:</strong> Please ensure your contact details in your account settings are up to date in case our team needs to reach you.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ApplyDoctor;