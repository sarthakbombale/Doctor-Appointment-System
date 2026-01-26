import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDoctorDashboard } from "../../api/dashboardApi";
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
          setStats(res.data.data);
        }
      } catch {
        toast.error("Failed to load doctor dashboard");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="doctor-dashboard">
      <h3>Doctor Dashboard</h3>

      <Row>
        <Col md={6} sm={12}>
          <Card className="doctor-card bg-appointments mb-3">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <h2>{stats.totalAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={12}>
          <Card className="doctor-card bg-patients mb-3">
            <Card.Body>
              <Card.Title>Total Patients</Card.Title>
              <h2>{stats.totalPatients}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
