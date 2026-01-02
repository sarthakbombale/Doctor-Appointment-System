import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token6163");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return <Outlet />;
};

export default ProtectedRoute;