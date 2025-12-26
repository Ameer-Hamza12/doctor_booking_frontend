import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  Settings,
  Bell,
  ChevronDown,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Home
} from "lucide-react";

const DoctorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/doctor/profile");
  };

  return (
    <nav className="bg-linear-to-r from-blue-600 to-teal-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Stethoscope className="w-8 h-8" />
              <div className="ml-3">
                <h1 className="text-xl font-bold">Doctor Dashboard</h1>
                <p className="text-blue-100 text-sm">Welcome, Dr. {user?.name}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 ml-8">
              <a
                href="/doctor/dashboard"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </div>
              </a>
              <a
                href="/doctor/appointments"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointments
                </div>
              </a>
              <a
                href="/doctor/schedule"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule
                </div>
              </a>
              <a
                href="/doctor/messages"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </div>
              </a>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium">Dr. {user?.name}</div>
                    <div className="text-blue-100 text-sm">{user?.specialization || 'Doctor'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate('/doctor/settings')}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;