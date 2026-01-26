import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token6163");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    jwtDecode(token); // validate token format
    return children;
  } catch (error) {
    localStorage.removeItem("token6163");
    return <Navigate to="/login" replace />;
  }
};

export default AuthGuard;
