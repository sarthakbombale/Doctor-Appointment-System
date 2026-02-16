import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserDashboard } from "../../api/dashboardApi.js";
import { Calendar, CheckCircle, Clock, PlusCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcoming: 0, // Assuming your API can provide these
    completed: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getUserDashboard();
        if (res.data.success) {
          // Fallback values if your API only sends totalAppointments for now
          setStats({
            totalAppointments: res.data.data.totalAppointments || 0,
            upcoming: res.data.data.upcoming || 0,
            completed: res.data.data.completed || 0,
          });
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  const statItems = [
    { 
      title: "Total Visits", 
      value: stats.totalAppointments, 
      icon: <Calendar size={24} />, 
      color: "blue-bg" 
    },
    { 
      title: "Upcoming", 
      value: stats.upcoming, 
      icon: <Clock size={24} />, 
      color: "orange-bg" 
    },
    { 
      title: "Completed", 
      value: stats.completed, 
      icon: <CheckCircle size={24} />, 
      color: "green-bg" 
    },
  ];

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Patient Dashboard</h3>
          <p className="text-muted">Welcome back! Here is your health overview.</p>
        </div>
        <Button 
          className="btn-book-action d-flex align-items-center gap-2"
          onClick={() => navigate("/user/book-appointment")}
        >
          <PlusCircle size={18} /> Book New Appointment
        </Button>
      </div>

      {/* Stats Section */}
      <Row className="mb-4">
        {statItems.map((item, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className={`icon-wrapper ${item.color}`}>
                  {item.icon}
                </div>
                <div className="ms-3">
                  <p className="text-muted small mb-0">{item.title}</p>
                  <h2 className="fw-bold mb-0">{item.value}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions / Recent Activity Placeholder */}
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Activity</h5>
              <Button variant="link" className="text-decoration-none p-0">View All</Button>
            </div>
            <div className="empty-activity text-center py-5">
              <p className="text-muted">No recent appointments to show.</p>
            </div>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="quick-info-card border-0 shadow-sm p-3 bg-light">
            <h5 className="fw-bold mb-3">Health Tips</h5>
            <div className="tip-item mb-3">
              <ArrowRight size={14} className="text-primary me-2" />
              <small>Stay hydrated: Aim for 8 glasses of water a day.</small>
            </div>
            <div className="tip-item">
              <ArrowRight size={14} className="text-primary me-2" />
              <small>Regular checkups help in early detection.</small>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;