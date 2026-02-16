import { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { CalendarCheck, Users, Clock, ArrowUpRight, PlusCircle } from "lucide-react";
import { getDoctorDashboard } from "../../api/dashboardApi.js";
import "../../styles/DoctorDashboard.css";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDoctorDashboard();
        if (res.data.success) {
          setStats(res.data.data || { totalAppointments: 0, totalPatients: 0 });
        }
      } catch {
        toast.error("Failed to load doctor dashboard");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <Container fluid className="doctor-dashboard-wrapper py-4">
      <div className="dashboard-greeting mb-4">
        <h3 className="fw-bold text-dark m-0">Welcome back, Doctor</h3>
        <p className="text-muted">Here is what's happening with your practice today.</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="doctor-stat-card border-0 shadow-sm bg-primary-gradient text-white">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="opacity-75 mb-1 fw-medium">Total Appointments</p>
                  <h2 className="display-5 fw-bold mb-0">{stats.totalAppointments}</h2>
                </div>
                <div className="stat-icon-wrapper">
                  <CalendarCheck size={32} />
                </div>
              </div>
              <div className="mt-3 small d-flex align-items-center gap-1 opacity-75">
                <Clock size={14} /> Updated just now
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="doctor-stat-card border-0 shadow-sm bg-success-gradient text-white">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="opacity-75 mb-1 fw-medium">Unique Patients</p>
                  <h2 className="display-5 fw-bold mb-0">{stats.totalPatients}</h2>
                </div>
                <div className="stat-icon-wrapper">
                  <Users size={32} />
                </div>
              </div>
              <div className="mt-3 small d-flex align-items-center gap-1 opacity-75">
                <ArrowUpRight size={14} /> 5 new this week
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;