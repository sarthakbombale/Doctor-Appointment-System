import { useState } from "react";
import { Form, Button, Card, Container, Row, Col, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerUser } from "../../api/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Users, Image } from "lucide-react";
import "../../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    gender: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select gender");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("userImage", image);

    try {
      setLoading(true);
      const res = await registerUser(payload);
      if (res.data.success) {
        toast.success(res.data.msg || "Registration successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saas-page-wrapper register-override">
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="saas-register-card-box">
          <Card.Body>
            <div className="saas-card-header text-center mb-4">
              <h3>Create Account</h3>
              <p>Join MedConnect and organize your appointments cleanly</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Column One */}
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Full Name</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><User size={16} /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Email Address</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><Mail size={16} /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Password</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><Lock size={16} /></InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                {/* Column Two */}
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Contact Number</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><Phone size={16} /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="contactNumber"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.contactNumber}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Address Description</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><MapPin size={16} /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="City, State"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label className="saas-form-label">Gender Profile</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><Users size={16} /></InputGroup.Text>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="" disabled hidden>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>

                {/* Full Width Footer Area */}
                <Col xs={12} className="mt-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="saas-form-label">Profile Image Attachment</Form.Label>
                    <InputGroup className="saas-input-group">
                      <InputGroup.Text><Image size={16} /></InputGroup.Text>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" className="saas-primary-btn w-100 mb-3" disabled={loading}>
                    {loading ? "Registering profile assets..." : "Create Free Account"}
                  </Button>

                  <div className="saas-card-footer">
                    <span>Already have an account?</span> 
                    <Link to="/login" className="ms-1">Login</Link>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;