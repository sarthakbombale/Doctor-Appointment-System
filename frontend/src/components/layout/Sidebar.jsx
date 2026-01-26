import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";
import { jwtDecode } from "jwt-decode";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
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
    <div className="sidebar">
      <h5 className="text-center py-3">Doctor App</h5>
      <Nav className="flex-column px-3">
        {/* ADMIN */}
        {role === "Admin" && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              All Users
            </NavLink>
            <NavLink
              to="/admin/doctors"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              All Doctors
            </NavLink>
            <NavLink
              to="/admin/doctor-applications"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Doctor Applications
            </NavLink>
            <NavLink
              to="/admin/appointments"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              All Appointments
            </NavLink>
          </>
        )}

        {/* DOCTOR */}
        {role === "Doctor" && (
          <>
            <NavLink
              to="/doctor/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              My Appointments
            </NavLink>
          </>
        )}

        {/* USER */}
        {role === "User" && (
          <>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
            {/* <NavLink
              to="/user/doctors"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Doctors
            </NavLink> */}
            <NavLink
              to="/user/book-appointment"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Book Appointment
            </NavLink>
            <NavLink
              to="/user/appointments"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              My Appointments
            </NavLink>
            <NavLink
              to="/user/apply-doctor"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Apply For Doctor
            </NavLink>
          </>
        )}

        {/* COMMON */}
        <NavLink to="/profile">Profile</NavLink>

        <button onClick={logout} className="sidebar-logout">
          Logout
        </button>
      </Nav>
    </div>
  );
};

export default Sidebar;
