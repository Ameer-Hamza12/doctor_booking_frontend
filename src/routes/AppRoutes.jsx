import { Routes, Route } from "react-router";

// Public pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

// Auth pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Doctors from "../pages/admin/Doctors";

// Doctor
import DoctorDashboard from "../pages/doctor/Dashboard";
import Schedule from "../pages/doctor/Schedule";
import DoctorAppointments from "../pages/doctor/Appointments";

// Patient
import PatientDashboard from "../pages/patient/Dashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";

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

      {/* Admin Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/doctors" element={<Doctors />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/schedule" element={<Schedule />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
