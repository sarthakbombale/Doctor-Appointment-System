import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { loginUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Login.css";

import {jwtDecode} from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      if (res.data.success) {
        const token = res.data.token;

        // Save token
        localStorage.setItem("token6163", token);

        // Decode role
        const decoded = jwtDecode(token);

        toast.success(res.data.msg || "Login successful");

        // Role-based redirect
        if (decoded.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (decoded.role === "Doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Container fluid className="login-container">
      <Card className="login-card">
        <h3>Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="login-btn w-100">
            Login
          </Button>

          <div className="login-footer">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
