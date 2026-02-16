import { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { getAdminDashboard } from "../../api/dashboardApi.js";
import { toast } from "react-toastify";
import { Users, UserCheck, CalendarDays, TrendingUp, Activity, ShieldAlert } from "lucide-react";
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
          setStats(res.data.data || { totalUsers: 0, totalDoctors: 0, totalAppointments: 0 });
        }
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  const adminStats = [
    {
      title: "Registered Patients",
      value: stats.totalUsers,
      icon: <Users size={28} />,
      class: "stat-users",
      trend: "+12% from last month"
    },
    {
      title: "Verified Doctors",
      value: stats.totalDoctors,
      icon: <UserCheck size={28} />,
      class: "stat-doctors",
      trend: "4 pending approval"
    },
    {
      title: "Total Bookings",
      value: stats.totalAppointments,
      icon: <CalendarDays size={28} />,
      class: "stat-appointments",
      trend: "85 today"
    }
  ];

  return (
    <Container fluid className="admin-dashboard-wrapper py-4">
      <div className="dashboard-header mb-4">
        <h3 className="fw-bold text-dark m-0">System Overview</h3>
        <p className="text-muted small">Real-time statistics for the Doctor Appointment System</p>
      </div>

      <Row className="g-4 mb-5">
        {adminStats.map((item, index) => (
          <Col lg={4} md={6} key={index}>
            <Card className="admin-stat-card border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`icon-box ${item.class}`}>
                    {item.icon}
                  </div>
                  <div className="trend-label small">
                    <TrendingUp size={14} className="me-1" /> {item.trend}
                  </div>
                </div>
                <h6 className="text-muted fw-semibold mb-1">{item.title}</h6>
                <h2 className="fw-bold mb-0">{item.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Activity className="text-primary" size={20} />
              <h5 className="fw-bold m-0">Platform Activity</h5>
            </div>
            <div className="placeholder-chart">
               {/* This is where you'd later integrate Chart.js or Recharts */}
               <div className="text-center text-muted py-5">
                  <p>System Activity Graph Placeholder</p>
                  <small>Traffic and booking trends will appear here.</small>
               </div>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100 bg-dark text-white admin-notice-card">
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShieldAlert className="text-warning" size={20} />
              <h5 className="fw-bold m-0 text-white">Security Alerts</h5>
            </div>
            <ul className="list-unstyled mt-3 small">
              <li className="mb-3 border-bottom border-secondary pb-2">
                <div className="text-warning fw-bold">System Update</div>
                <div className="opacity-75">Vite build optimization scheduled for 2 AM.</div>
              </li>
              <li>
                <div className="text-info fw-bold">New Doctor Request</div>
                <div className="opacity-75">Check pending applications from the sidebar.</div>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;