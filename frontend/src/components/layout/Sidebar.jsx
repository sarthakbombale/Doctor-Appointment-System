import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

// Icons
import {
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

import "../../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const token = localStorage.getItem("token6163");
  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const logout = () => {
    localStorage.removeItem("token6163");
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* HEADER */}
      <div className="sidebar-header">
        {!isCollapsed && <h5 className="logo">Doctor App</h5>}
        <FaBars
          className="toggle-icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <Nav className="flex-column sidebar-nav">
        {/* ADMIN */}
        {role === "Admin" && (
          <>
            <NavLink to="/admin/dashboard">
              <MdDashboard />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/admin/users">
              <FaUsers />
              {!isCollapsed && <span>All Users</span>}
            </NavLink>

            <NavLink to="/admin/doctors">
              <FaUserMd />
              {!isCollapsed && <span>All Doctors</span>}
            </NavLink>

            <NavLink to="/admin/doctor-applications">
              <FaClipboardList />
              {!isCollapsed && <span>Doctor Applications</span>}
            </NavLink>

            <NavLink to="/admin/appointments">
              <FaCalendarAlt />
              {!isCollapsed && <span>Appointments</span>}
            </NavLink>
          </>
        )}

        {/* DOCTOR */}
        {role === "Doctor" && (
          <>
            <NavLink to="/doctor/dashboard">
              <MdDashboard />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/doctor/appointments">
              <FaCalendarAlt />
              {!isCollapsed && <span>My Appointments</span>}
            </NavLink>
          </>
        )}

        {/* USER */}
        {role === "User" && (
          <>
            <NavLink to="/user/dashboard">
              <MdDashboard />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/user/book-appointment">
              <FaCalendarAlt />
              {!isCollapsed && <span>Book Appointment</span>}
            </NavLink>

            <NavLink to="/user/appointments">
              <FaClipboardList />
              {!isCollapsed && <span>My Appointments</span>}
            </NavLink>

            <NavLink to="/user/apply-doctor">
              <FaUserMd />
              {!isCollapsed && <span>Apply For Doctor</span>}
            </NavLink>
          </>
        )}

        {/* COMMON */}
        <NavLink to="/profile">
          <FaUser />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <button className="sidebar-logout" onClick={logout}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </Nav>
    </aside>
  );
};

export default Sidebar;
