import { useAuth } from '../../context/AuthContext';
import PatientNavbar from '../../components/navbar/PatientNavbar';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  User, 
  Settings, 
  Bell, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PatientNavbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
              <p className="text-blue-100">Manage your health appointments and medical records</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-xl">
                <User className="w-5 h-5 mr-2" />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Visits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    to="/patient/find-doctors"
                    className="group bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Find Doctors</h3>
                    <p className="text-gray-600">Book appointments with verified specialists</p>
                  </Link>

                  <Link
                    to="/patient/appointments"
                    className="group bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-600 rounded-xl">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">My Appointments</h3>
                    <p className="text-gray-600">View and manage your appointments</p>
                  </Link>

                  <Link
                    to="/patient/prescriptions"
                    className="group bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-600 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Medical History</h3>
                    <p className="text-gray-600">Access your prescriptions and records</p>
                  </Link>

                  <Link
                    to="/patient/profile"
                    className="group bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-600 rounded-xl">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Settings</h3>
                    <p className="text-gray-600">Update your personal information</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Appointments</h2>
                  <Link to="/patient/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-xl mr-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Dr. Sarah Johnson</h4>
                        <p className="text-gray-600 text-sm">Cardiologist</p>
                        <p className="text-gray-500 text-sm mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Today, 2:30 PM • Online
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-xl mr-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Dr. Michael Chen</h4>
                        <p className="text-gray-600 text-sm">Neurologist</p>
                        <p className="text-gray-500 text-sm mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Tomorrow, 10:00 AM • In-person
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-xl mr-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Dr. Emily Wilson</h4>
                        <p className="text-gray-600 text-sm">Dermatologist</p>
                        <p className="text-gray-500 text-sm mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Yesterday, 3:45 PM • Completed
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Notifications */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-8 text-white">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mr-4">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user?.name}</h3>
                    <p className="text-blue-100">Patient</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email</span>
                    <span className="font-medium text-gray-900">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Phone</span>
                    <span className="font-medium text-gray-900">{user?.phone || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Member Since</span>
                    <span className="font-medium text-gray-900">Jan 2024</span>
                  </div>
                </div>
                
                <Link
                  to="/patient/profile"
                  className="w-full mt-6 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-center block"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Notifications
                </h3>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="font-medium text-gray-900">Appointment Confirmed</p>
                    <p className="text-sm text-gray-600 mt-1">Your appointment with Dr. Johnson is confirmed</p>
                    <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="font-medium text-gray-900">Prescription Ready</p>
                    <p className="text-sm text-gray-600 mt-1">Your prescription is available for download</p>
                    <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="font-medium text-gray-900">Payment Successful</p>
                    <p className="text-sm text-gray-600 mt-1">Your payment of $75 has been processed</p>
                    <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                  </div>
                </div>
                
                <button className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;