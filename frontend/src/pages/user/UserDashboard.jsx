import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserDashboard } from "../../api/dashboardApi.js";
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getUserDashboard();
        if (res.data.success) {
          setStats(res.data.data || { totalAppointments: 0 });
        }
      } catch (error) {
        toast.error("Failed to load user dashboard");
        setStats({ totalAppointments: 0 });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="user-dashboard">
      <h3>User Dashboard</h3>

      <Row>
        <Col md={4} sm={6} xs={12}>
          <Card className="dashboard-card mb-3">
            <Card.Body>
              <Card.Title>My Appointments</Card.Title>
              <h2>{stats.totalAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
