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
  Shield,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <nav className="bg-linear-to-r from-blue-600 to-teal-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8" />
              <div className="ml-3">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">Welcome, {user?.name}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 ml-8">
              <a
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </div>
              </a>
              <a
                href="/admin/users"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </div>
              </a>
              <a
                href="/admin/doctors"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Doctors
                </div>
              </a>
              <a
                href="/admin/appointments"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointments
                </div>
              </a>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Notifications</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-800">New doctor registration requires approval</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-800">Patient appointment scheduled successfully</p>
                        <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 rounded-full hover:bg-white/10">
              <Settings className="w-5 h-5" />
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
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-blue-100 text-sm">Administrator</div>
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
                      onClick={() => navigate('/admin/settings')}
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

export default AdminNavbar;