import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Stethoscope,
  LogOut,
  Calendar,
  Menu,
  X,
  User
} from "lucide-react";

const MainNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const navLinkBase = "relative font-medium transition-colors pb-1";

  const navLinkClass = ({ isActive }) =>
    `${navLinkBase} ${
      isActive
        ? "text-blue-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-blue-600 font-bold text-xl"
        >
          <Stethoscope className="w-8 h-8" />
          <span>DoctorBooking</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          <NavLink to="/doctors" className={navLinkClass}>Doctors</NavLink>

          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <span className="text-slate-700 font-medium">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-700"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-6 py-6 space-y-5">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              Contact
            </NavLink>

            <NavLink
              to="/doctors"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              Doctors
            </NavLink>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium pt-3"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center bg-blue-600 text-white py-3 rounded-full font-medium"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;