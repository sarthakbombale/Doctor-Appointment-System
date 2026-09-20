import { useState } from "react";
import { toast } from "react-toastify";
import { Form, Button, Card, Container, InputGroup } from "react-bootstrap";
import { loginUser } from "../../api/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Stethoscope, Mail, Lock } from "lucide-react";
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem("token6163", token);
        const decoded = jwtDecode(token);
        toast.success("Welcome back!");

        const userRole = decoded.role?.toLowerCase();
        if (userRole === "admin") navigate("/admin/dashboard");
        else if (userRole === "doctor") navigate("/doctor/dashboard");
        else navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saas-page-wrapper">
      <Container className="d-flex justify-content-center align-items-center">
        <div className="saas-flex-container">
          {/* Left Branding Panel */}
          <div className="saas-brand-side d-none d-md-flex">
            <div className="brand-content-wrapper">
              <div className="brand-icon-shield">
                <Stethoscope size={40} strokeWidth={2.5} />
              </div>
              <h2>MedConnect</h2>
              <p>Connecting patients with premium healthcare networks seamlessly.</p>
            </div>
          </div>

          {/* Right Interactive Card */}
          <Card className="saas-auth-card">
            <Card.Body className="d-flex flex-column justify-content-center">
              <div className="saas-card-header">
                <h3>Welcome Back</h3>
                <p>Provide your credentials to access your dashboard</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
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

                <Form.Group className="mb-4">
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

                <Button type="submit" className="saas-primary-btn w-100 mb-3" disabled={loading}>
                  {loading ? "Authenticating..." : "Login to Dashboard"}
                </Button>

                <div className="saas-card-footer">
                  <span>New to the platform?</span> 
                  <Link to="/register" className="ms-1">Create an Account</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;