import { useState } from "react";
import { Form, Button, Card, Container, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { loginUser } from "../../api/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Stethoscope, Mail, Lock } from "lucide-react"; // Modern medical icons
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

        if (decoded.role === "Admin") navigate("/admin/dashboard");
        else if (decoded.role === "Doctor") navigate("/doctor/dashboard");
        else navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Container>
        <div className="login-flex-container">
          {/* Left Side: Branding/Visual */}
          <div className="login-brand-section d-none d-md-flex">
            <div className="brand-content">
              <div className="brand-icon-circle">
                <Stethoscope size={48} color="#fff" />
              </div>
              <h1>DocPoint</h1>
              <p>Connecting patients with the best healthcare professionals seamlessly.</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <Card className="login-auth-card">
            <Card.Body>
              <div className="form-header">
                <h3>Welcome Back</h3>
                <p className="text-muted">Please enter your details to login</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup className="custom-input-group">
                    <InputGroup.Text><Mail size={18} /></InputGroup.Text>
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
                  <div className="d-flex justify-content-between">
                    <Form.Label>Password</Form.Label>
                  </div>
                  <InputGroup className="custom-input-group">
                    <InputGroup.Text><Lock size={18} /></InputGroup.Text>
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

                <Button 
                  type="submit" 
                  className="btn-medical-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Login to Dashboard"}
                </Button>

                <div className="login-footer">
                  <span>New to the platform?</span> 
                  <Link to="/register" className="ms-2">Create an Account</Link>
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