import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientNavbar from '../../components/navbar/PatientNavbar';
import ProfileCompletionCard from '../patient/components/ProfileCompletionCard.jsx';
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
  XCircle,
  Home,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    pending: 0,
    unread: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile data
      const profileResponse = await api.get('/patient/profile');
      setProfile(profileResponse.data.profile);

      // Fetch appointments
      const appointmentsResponse = await api.get('/patient/appointments');
      setAppointments(appointmentsResponse.data.appointments || []);

      // Calculate stats
      const upcoming = (appointmentsResponse.data.appointments || []).filter(
        app => app.status === 'confirmed' || app.status === 'scheduled'
      ).length;
      
      const completed = (appointmentsResponse.data.appointments || []).filter(
        app => app.status === 'completed'
      ).length;
      
      const pending = (appointmentsResponse.data.appointments || []).filter(
        app => app.status === 'pending'
      ).length;

      setStats({
        upcoming,
        completed,
        pending,
        unread: 5 // This would come from notifications API
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle 
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: AlertCircle 
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800', 
          icon: XCircle 
        };
      default:
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: CheckCircle 
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <PatientNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Profile Completion Card */}
        <ProfileCompletionCard profile={profile} user={user} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Visits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.unread}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Appointments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
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
                    to="/patient/medical-records"
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
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments yet</p>
                    <Link 
                      to="/patient/find-doctors" 
                      className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Book your first appointment →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => {
                      const { color, icon: Icon } = getStatusBadge(appointment.status);
                      return (
                        <div 
                          key={appointment._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {appointment.doctor?.name || 'Dr. Unknown'}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {appointment.doctor?.specialization || 'General Physician'}
                              </p>
                              <p className="text-gray-500 text-sm mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 ${color} rounded-full text-sm font-medium`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {appointment.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Notifications */}
          <div className="space-y-8">
            {/* Profile Card with Medical Info */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-8 text-white">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mr-4">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user?.name}</h3>
                    <p className="text-blue-100">Patient</p>
                    {profile?.age && profile?.gender && (
                      <p className="text-blue-100 text-sm mt-1">
                        {profile.age} years • {profile.gender}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </span>
                    <span className="font-medium text-gray-900">{user?.email}</span>
                  </div>
                  
                  {user?.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </span>
                      <span className="font-medium text-gray-900">{user?.phone}</span>
                    </div>
                  )}

                  {profile?.bloodGroup && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Blood Group
                      </span>
                      <span className="font-bold text-gray-900">{profile.bloodGroup}</span>
                    </div>
                  )}

                  {profile?.allergies && profile.allergies.length > 0 && (
                    <div>
                      <span className="text-gray-700 flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                        Allergies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.allergies.slice(0, 3).map((allergy, index) => (
                          <span 
                            key={index}
                            className="inline-block px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200"
                          >
                            {allergy}
                          </span>
                        ))}
                        {profile.allergies.length > 3 && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{profile.allergies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile?.emergencyContact?.name && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{profile.emergencyContact.name}</p>
                          <p className="text-sm text-gray-600">{profile.emergencyContact.relationship}</p>
                        </div>
                        <a 
                          href={`tel:${profile.emergencyContact.phone}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {profile.emergencyContact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/patient/profile"
                  className="w-full mt-6 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-center block"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-green-200">
                <h3 className="text-xl font-bold text-gray-900">Health Tips</h3>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                  <div className="p-4 bg-white/50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">Stay Hydrated</h4>
                    <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily for optimal health.</p>
                  </div>
                  
                  <div className="p-4 bg-white/50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">Regular Exercise</h4>
                    <p className="text-sm text-gray-600">Aim for 30 minutes of moderate exercise most days of the week.</p>
                  </div>
                  
                  <div className="p-4 bg-white/50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">Medication Adherence</h4>
                    <p className="text-sm text-gray-600">Take medications as prescribed and keep track of refills.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;