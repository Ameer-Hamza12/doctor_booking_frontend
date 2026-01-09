import { Routes, Route } from "react-router-dom";


// Public pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Auth pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/UsersManagement";
import Doctors from "../pages/admin/Doctors";
import AdminProfile from "../pages/admin/AdminProfile";


// Doctor
import DoctorDashboard from "../pages/doctor/Dashboard";
import Schedule from "../pages/doctor/Schedule";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorProfile from "../pages/doctor/DoctorProfile";


// Patient
import PatientDashboard from "../pages/patient/Dashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";
import FindDoctors from "../pages/patient/FindDoctors";
import PatientProfile from "../pages/patient/PatientProfile";
import ProfileCompletionCard from "../pages/patient/components/ProfileCompletionCard";


import RoleBasedRoute from "./RoleBasedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/schedule" element={<Schedule />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/find-doctors" element={<FindDoctors />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/profile-completion" element={<ProfileCompletionCard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
