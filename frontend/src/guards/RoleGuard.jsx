import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const RoleGuard = ({ allowedRoles }) => {
  const token = localStorage.getItem("token6163");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default RoleGuard;
