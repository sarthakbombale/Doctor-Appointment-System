import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaVenusMars,
  FaImage,
} from "react-icons/fa";
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
    Object.entries(formData).forEach(([key, value]) =>
      payload.append(key, value)
    );
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
    <Container fluid className="register-container">
      {/* <Row className="justify-content-center">
    <Col md={6} lg={5}> */}
      <Card className="register-card">
        <h3 className="text-center mb-4">Create Account</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 input-group-custom">
            <FaUser />
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 input-group-custom">
            <FaEnvelope />
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 input-group-custom">
            <FaLock />
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 input-group-custom">
            <FaPhone />
            <Form.Control
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 input-group-custom">
            <FaHome />
            <Form.Control
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 input-group-custom">
            <FaVenusMars />
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 file-input-custom">
            <FaImage />
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </Form>
      </Card>
      {/* </Col>
      </Row> */}
    </Container>
  );
};

export default Register;
