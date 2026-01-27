import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleGuard = ({ allowedRoles }) => {
  const token = localStorage.getItem("token6163");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // 🔑 normalize role
    const userRole = decoded.role?.toLowerCase();

    // 🔑 normalize allowed roles
    const normalizedAllowedRoles = allowedRoles.map(role =>
      role.toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default RoleGuard;
