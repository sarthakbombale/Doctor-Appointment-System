import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav, Tab, Nav as BaseNav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarCheck, FaShieldAlt, FaArrowRight, FaClock, FaSearch, FaCheckCircle, FaUserCheck, FaNotesMedical } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");

  useEffect(() => {
    const token = localStorage.getItem("token6163");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "Admin") navigate("/admin/dashboard");
        else if (decoded.role === "Doctor") navigate("/doctor/dashboard");
        else if (decoded.role === "User") navigate("/user/dashboard");
      } catch (err) {
        console.error("Token decoding failed:", err);
        localStorage.removeItem("token6163");
      }
    }
  }, [navigate]);

  return (
    <div className="saas-landing">
      {/* NAVBAR */}
      <Navbar collapseOnSelect expand="lg" variant="light" className="py-3 sticky-top landing-nav">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-gradient">
            <FaUserMd className="me-2 text-primary" />MedConnect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
              <Nav.Link href="#features" className="fw-medium text-secondary">Features</Nav.Link>
              <Nav.Link href="#workflows" className="fw-medium text-secondary">Workflows</Nav.Link>
              <Link to="/login" className="btn btn-link text-decoration-none fw-semibold text-dark">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-medium">
                Get Started
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO SECTION */}
      <header className="hero-section py-5 d-flex align-items-center">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="text-center text-lg-start">
              <span className="badge-pill mb-3 d-inline-block">✨ Next-Gen Practice Management</span>
              <h1 className="display-4 fw-extrabold text-dark mb-3 lh-sm">
                Healthcare management, <span className="text-gradient">simplified.</span>
              </h1>
              <p className="lead text-muted mb-4 pe-lg-4">
                Connect patients with elite healthcare professionals instantly. Book appointments, manage medical histories, and process schedules with zero friction.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                <Link to="/register" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow d-flex align-items-center justify-content-center gap-2">
                  Create Free Account <FaArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 py-3 rounded-pill">
                  Schedule Demo
                </Link>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image-wrapper position-relative">
                <div className="floating-blob"></div>
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" 
                  alt="Medical Dashboard Preview" 
                  className="img-fluid rounded-4 shadow-2xl position-relative z-1"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* FEATURES SECTION */}
      <section id="features" className="py-5 bg-light-subtle">
        <Container className="py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <h2 className="fw-bold text-dark">Engineered for Modern Clinics</h2>
            <p className="text-muted">Everything required to digitize workflows, maximize productivity, and upgrade clinical environments.</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 feature-card border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="icon-box bg-primary-soft text-primary mb-3">
                    <FaCalendarCheck size={24} />
                  </div>
                  <h5 className="fw-bold text-dark">Instant Scheduling</h5>
                  <p className="text-muted small mb-0">Automated slot matching eliminates double bookings and reduces patient waiting room gridlocks.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 feature-card border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="icon-box bg-success-soft text-success mb-3">
                    <FaClock size={24} />
                  </div>
                  <h5 className="fw-bold text-dark">Real-time Pipeline</h5>
                  <p className="text-muted small mb-0">Doctors review queues dynamically while updating visit states from pending to completed in one click.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 feature-card border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="icon-box bg-purple-soft text-purple mb-3">
                    <FaShieldAlt size={24} />
                  </div>
                  <h5 className="fw-bold text-dark">Enterprise Grade Security</h5>
                  <p className="text-muted small mb-0">Role-level access tokens and strict authentication layers protect confidential data securely.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* WORKFLOWS SECTION */}
      <section id="workflows" className="py-5 bg-white">
        <Container className="py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge-pill mb-2 d-inline-block">Interactive Workflows</span>
            <h2 className="fw-bold text-dark">How MedConnect Works</h2>
            <p className="text-muted">Explore how seamlessly information flows between patients and practitioners.</p>
            
            {/* Custom Interactive Tab Controls */}
            <div className="d-inline-flex bg-light p-1 rounded-pill mt-3 workflow-tabs">
              <Button 
                variant={activeTab === "patient" ? "primary" : "light"} 
                className="rounded-pill px-4 py-2 text-sm"
                onClick={() => setActiveTab("patient")}
              >
                Patient Journey
              </Button>
              <Button 
                variant={activeTab === "doctor" ? "primary" : "light"} 
                className="rounded-pill px-4 py-2 text-sm"
                onClick={() => setActiveTab("doctor")}
              >
                Doctor Operations
              </Button>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="workflow-content mt-4">
            {activeTab === "patient" ? (
              <Row className="align-items-center g-5">
                <Col lg={6}>
                  <div className="workflow-steps">
                    <div className="d-flex gap-3 mb-4 step-item">
                      <div className="step-num bg-primary text-white">1</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaSearch className="text-primary" size={16}/> Find Your Specialist</h5>
                        <p className="text-muted small">Browse through verified, highly rated doctor applications filtered by specialization and medical departments.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 mb-4 step-item">
                      <div className="step-num bg-primary text-white">2</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaCalendarCheck className="text-primary" size={16}/> Instant Booking</h5>
                        <p className="text-muted small">Select an available date and time slot that perfectly suits your schedule and dispatch your request instantly.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 step-item">
                      <div className="step-num bg-primary text-white">3</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaCheckCircle className="text-success" size={16}/> Live Updates</h5>
                        <p className="text-muted small">Track your pending appointment directly from your custom user dashboard as the practitioner reviews your application status.</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=550&q=80" 
                    alt="Patient booking workspace" 
                    className="img-fluid rounded-4 shadow-sm border"
                  />
                </Col>
              </Row>
            ) : (
              <Row className="align-items-center g-5">
                <Col lg={6} className="order-lg-2">
                  <div className="workflow-steps">
                    <div className="d-flex gap-3 mb-4 step-item">
                      <div className="step-num bg-indigo text-white">1</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaUserCheck className="text-indigo" size={16}/> Evaluate Patient Queue</h5>
                        <p className="text-muted small">Access your `DocMyAppointments` schedule dashboard to view pending, upcoming, and urgent incoming client requests.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 mb-4 step-item">
                      <div className="step-num bg-indigo text-white">2</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaClock className="text-indigo" size={16}/> Accept or Reject Stalls</h5>
                        <p className="text-muted small">Approve slot times with one click or reject conflicts cleanly to keep your practice timeline highly efficient.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 step-item">
                      <div className="step-num bg-indigo text-white">3</div>
                      <div>
                        <h5 className="fw-bold d-flex align-items-center gap-2"><FaNotesMedical className="text-success" size={16}/> Complete & Archive Consultations</h5>
                        <p className="text-muted small">When your physical or digital session concludes, safely flag the visit state as "Completed" to securely log history records.</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="text-center order-lg-1">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=550&q=80" 
                    alt="Doctor operations dashboard" 
                    className="img-fluid rounded-4 shadow-sm border"
                  />
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;