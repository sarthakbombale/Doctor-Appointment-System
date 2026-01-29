import { Routes, Route, Navigate } from "react-router-dom";

/* Layout */
import MainLayout from "./components/layout/MainLayout.jsx";

/* Guards */
import AuthGuard from "./guards/AuthGuard.jsx";
import RoleGuard from "./guards/RoleGuard.jsx";

/* Pages */
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Profile from "./pages/common/Profile.jsx";
import NotFound from "./pages/common/NotFound.jsx";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";
import AllDoctors from "./pages/admin/AllDoctors.jsx";
import DoctorApplications from "./pages/admin/DoctorApplications.jsx";
import AllAppointments from "./pages/admin/AllAppointments.jsx";

/* Doctor */
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.jsx";

/* User */
import UserDashboard from "./pages/user/UserDashboard.jsx";
import BookAppointment from "./pages/user/BookAppointment.jsx";
import MyAppointments from "./pages/user/MyAppointments.jsx";
import ApplyDoctor from "./pages/user/ApplyDoctor.jsx";
import DoctorList from "./pages/user/DoctorsList.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route element={<RoleGuard allowedRoles={["Admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AllUsers />} />
          <Route path="/admin/doctors" element={<AllDoctors />} />
          <Route
            path="/admin/doctor-applications"
            element={<DoctorApplications />}
          />
          <Route path="/admin/appointments" element={<AllAppointments />} />
        </Route>

        {/* Doctor */}
        <Route element={<RoleGuard allowedRoles={["Doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        </Route>

        {/* User */}
        <Route element={<RoleGuard allowedRoles={["User"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/doctors" element={<DoctorList />} />
          <Route path="/user/book-appointment" element={<BookAppointment />} />
          <Route path="/user/appointments" element={<MyAppointments />} />
          <Route path="/user/apply-doctor" element={<ApplyDoctor />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
