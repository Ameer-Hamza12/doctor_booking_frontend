import { useAuth } from "../context/AuthContext";
import MainNavbar from "../components/navbar/MainNavbar";
import AdminNavbar from "../components/navbar/AdminNavbar";
import DoctorNavbar from "../components/navbar/DoctorNavbar";
//import PatientNavbar from "./PatientNavbar"; // You'll need to create this

const Navbar = () => {
  const { user } = useAuth();

  // Show different navbars based on user role
  if (!user) {
    return <MainNavbar />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminNavbar />;
    case 'doctor':
      return <DoctorNavbar />;
    case 'patient':
      return <MainNavbar />; // or create a PatientNavbar
    default:
      return <MainNavbar />;
  }
};

export default Navbar;