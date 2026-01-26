import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { getAdminDashboard } from "../../api/dashboardApi";
import { toast } from "react-toastify";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getAdminDashboard();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h3>Admin Dashboard</h3>

      <Row>
        <Col md={4} sm={6} xs={12}>
          <Card className="admin-card bg-users mb-3">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h2>{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} xs={12}>
          <Card className="admin-card bg-doctors mb-3">
            <Card.Body>
              <Card.Title>Total Doctors</Card.Title>
              <h2>{stats.totalDoctors}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} xs={12}>
          <Card className="admin-card bg-appointments mb-3">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <h2>{stats.totalAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
