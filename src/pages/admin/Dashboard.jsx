import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Users, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX,
  Clock,
  AlertCircle,
  Search,
  User,
  Activity,
  TrendingUp,
  Shield,
  Mail,
  Phone,
  Filter,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Download,
  Eye,
  Edit,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingDoctors: 0,
    activeDoctors: 0,
    blockedDoctors: 0,
    recentRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('doctors');

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch doctors with status filter
  const fetchDoctors = async (status = '') => {
    try {
      const params = {};
      if (status && status !== 'all') {
        params.status = status;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await api.get('/admin/doctors', { params });
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDoctors();
  }, []);

  // Handle filter change
  useEffect(() => {
    fetchDoctors(filter);
  }, [filter]);

  // Search doctors
  const handleSearch = () => {
    fetchDoctors(filter);
  };

  // Approve doctor
  const handleApproveDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to approve this doctor?')) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      
      // Update local state
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isApproved: true, 
          isBlocked: false,
          approvedBy: user,
          approvedAt: new Date().toISOString()
        } : doc
      ));
      
      // Refresh stats
      fetchStats();
      
      alert('Doctor approved successfully!');
    } catch (error) {
      alert('Error approving doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  // Block doctor
  const handleBlockDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to block this doctor?')) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/block`);
      
      // Update local state
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isApproved: false, 
          isBlocked: true 
        } : doc
      ));
      
      // Refresh stats
      fetchStats();
      
      alert('Doctor blocked successfully!');
    } catch (error) {
      alert('Error blocking doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  // Unblock doctor
  const handleUnblockDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to unblock this doctor?')) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/unblock`);
      
      // Update local state
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isBlocked: false 
        } : doc
      ));
      
      // Refresh stats
      fetchStats();
      
      alert('Doctor unblocked successfully!');
    } catch (error) {
      alert('Error unblocking doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  // Toggle user active status
  const handleToggleUserActive = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      
      // Update local state
      setDoctors(doctors.map(doc => 
        doc._id === userId ? { 
          ...doc, 
          isActive: !currentStatus 
        } : doc
      ));
      
      alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      alert('Error toggling user status: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (doctor) => {
    if (doctor.isBlocked) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <UserX className="w-3 h-3 mr-1.5" />
          Blocked
        </span>
      );
    }
    
    if (doctor.isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <UserCheck className="w-3 h-3 mr-1.5" />
          Approved
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <Clock className="w-3 h-3 mr-1.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminNavbar />
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome back, <span className="font-semibold">{user?.name}</span></p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="flex items-center text-white hover:text-blue-100">
                <Bell className="w-5 h-5" />
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <button className="flex items-center text-white hover:text-blue-100">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <User className="w-7 h-7 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Stethoscope className="w-7 h-7 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-xl">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent (7d)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentRegistrations}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Doctor Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Pending Approval</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingDoctors}</div>
            </div>
            <p className="text-sm text-gray-600">Doctors waiting for verification</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-green-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Active Doctors</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.activeDoctors}</div>
            </div>
            <p className="text-sm text-gray-600">Verified and practicing doctors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-red-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Blocked Doctors</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.blockedDoctors}</div>
            </div>
            <p className="text-sm text-gray-600">Accounts temporarily suspended</p>
          </motion.div>
        </div>

        {/* Doctor Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
                <p className="text-gray-600 mt-1">Approve, block, or manage doctor accounts</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approved
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className="p-8">
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-6">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Doctor Info */}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {doctor.profileImage ? (
                            <img
                              className="h-14 w-14 rounded-xl object-cover border-2 border-gray-200"
                              src={doctor.profileImage}
                              alt={doctor.name}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center border-2 border-gray-200">
                              <Stethoscope className="w-7 h-7 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                            {getStatusBadge(doctor)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {doctor.email}
                            </div>
                            {doctor.phone && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {doctor.phone}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              Joined {formatDate(doctor.createdAt)}
                            </div>
                          </div>
                          {doctor.specialization && (
                            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {doctor.specialization}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {!doctor.isApproved && !doctor.isBlocked && (
                          <button
                            onClick={() => handleApproveDoctor(doctor._id)}
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                        )}
                        
                        <div className="flex gap-3">
                          {!doctor.isBlocked ? (
                            <button
                              onClick={() => handleBlockDoctor(doctor._id)}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnblockDoctor(doctor._id)}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Unblock
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleToggleUserActive(doctor._id, doctor.isActive)}
                            className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all ${
                              doctor.isActive 
                                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            }`}
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            {doctor.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {(doctor.doctorDetails?.licenseNumber || doctor.approvedAt) && (
                      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctor.doctorDetails?.licenseNumber && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">License Number:</span>
                            <span className="ml-2 text-sm text-gray-600">{doctor.doctorDetails.licenseNumber}</span>
                          </div>
                        )}
                        {doctor.approvedAt && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Approved On:</span>
                            <span className="ml-2 text-sm text-gray-600">{formatDate(doctor.approvedAt)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                View All
                <ChevronDown className="w-4 h-4 ml-1 rotate-270" />
              </button>
            </div>
            <div className="space-y-6">
              {[
                { action: 'approved', doctor: 'Dr. Sarah Johnson', time: '2 hours ago', color: 'bg-green-100 text-green-800' },
                { action: 'blocked', doctor: 'Dr. Michael Chen', time: '1 day ago', color: 'bg-red-100 text-red-800' },
                { action: 'registered', doctor: 'Dr. Lisa Parker', time: '2 days ago', color: 'bg-blue-100 text-blue-800' },
                { action: 'approved', doctor: 'Dr. Robert Wilson', time: '3 days ago', color: 'bg-green-100 text-green-800' },
                { action: 'unblocked', doctor: 'Dr. James Brown', time: '4 days ago', color: 'bg-purple-100 text-purple-800' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${activity.color}`}>
                      {activity.action === 'approved' && <CheckCircle className="w-5 h-5" />}
                      {activity.action === 'blocked' && <XCircle className="w-5 h-5" />}
                      {activity.action === 'unblocked' && <UserCheck className="w-5 h-5" />}
                      {activity.action === 'registered' && <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.doctor}</div>
                      <div className="text-sm text-gray-600 capitalize">{activity.action} account</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Platform Overview</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-100">Doctor Approval Rate</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-2 bg-blue-400 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-100">Patient Satisfaction</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="h-2 bg-blue-400 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-100">Active Sessions</span>
                  <span className="font-bold">1,248</span>
                </div>
                <div className="h-2 bg-blue-400 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-blue-400">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/10 rounded-xl">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-blue-200 text-sm">Avg Response</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-xl">
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="text-blue-200 text-sm">Uptime</div>
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

export default AdminDashboard;