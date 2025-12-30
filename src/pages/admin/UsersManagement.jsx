import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search,
  User,
  Stethoscope,
  Activity,
  Eye,
  Trash2,
  Filter,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Edit,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const UsersManagement = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, patients, doctors, admins
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserActive = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !currentStatus } : u
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
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'doctor': return 'from-blue-500 to-cyan-500';
      case 'patient': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'patient': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleStats = (role) => {
    const roleUsers = users.filter(u => u.role === role);
    const activeUsers = roleUsers.filter(u => u.isActive && !u.isBlocked).length;
    return { total: roleUsers.length, active: activeUsers };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'patients') return matchesSearch && user.role === 'patient';
    if (filter === 'doctors') return matchesSearch && user.role === 'doctor';
    if (filter === 'admins') return matchesSearch && user.role === 'admin';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-32">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminNavbar />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{getRoleStats('patient').active}</p>
                <p className="text-sm text-gray-500">Total: {getRoleStats('patient').total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{getRoleStats('doctor').active}</p>
                <p className="text-sm text-gray-500">Total: {getRoleStats('doctor').total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{getRoleStats('admin').total}</p>
                <p className="text-sm text-gray-500">All active</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
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
                <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
                <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onClick={() => setFilter('patients')}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center ${filter === 'patients' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Patients
                  </button>
                  <button
                    onClick={() => setFilter('doctors')}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center ${filter === 'doctors' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Doctors
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="p-8">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* User Info */}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRoleBadgeColor(user.role)} flex items-center justify-center`}>
                              {getRoleIcon(user.role)}
                            </div>
                            {user.isVerified && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleBadgeColor(user.role)} text-white`}>
                              {getRoleIcon(user.role)}
                              <span className="ml-1.5">{user.role}</span>
                            </span>
                            {!user.isActive && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </span>
                            )}
                            {user.isBlocked && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Blocked
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </div>
                          {user.role === 'doctor' && (
                            <div className="flex items-center space-x-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {user.isApproved ? 'Approved' : 'Pending Approval'}
                              </span>
                              {user.specialization && (
                                <span className="text-sm text-gray-700">
                                  {user.specialization}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => toggleUserActive(user._id, user.isActive)}
                          className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all ${
                            user.isActive 
                              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          }`}
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Last Login:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email Verified:</span>
                        <span className={`ml-2 text-sm ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {user.isVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Account Status:</span>
                        <span className={`ml-2 text-sm ${
                          user.isBlocked ? 'text-red-600' : 
                          user.isActive ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                    <p className="text-gray-600">Complete information about {selectedUser.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex items-center space-x-4">
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${getRoleBadgeColor(selectedUser.role)} flex items-center justify-center`}>
                      {getRoleIcon(selectedUser.role)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleBadgeColor(selectedUser.role)} text-white`}>
                          {selectedUser.role}
                        </span>
                        {selectedUser.isVerified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedUser.email}</span>
                        </div>
                      </div>
                      
                      {selectedUser.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone Number</label>
                          <div className="mt-1 flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{selectedUser.phone}</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-700">Account Created</label>
                        <div className="mt-1 flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{formatDateTime(selectedUser.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Login</label>
                        <div className="mt-1">
                          <span className="text-gray-900">
                            {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never logged in'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Account Status</label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Active:</span>
                            <span className={`font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedUser.isActive ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Blocked:</span>
                            <span className={`font-medium ${selectedUser.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                              {selectedUser.isBlocked ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Verified:</span>
                            <span className={`font-medium ${selectedUser.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                              {selectedUser.isVerified ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Specific Info */}
                  {selectedUser.role === 'doctor' && (
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Specialization</label>
                          <div className="mt-1">
                            <span className="text-gray-900">{selectedUser.specialization || 'Not specified'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Approval Status</label>
                          <div className="mt-1">
                            <span className={`font-medium ${selectedUser.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                              {selectedUser.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          toggleUserActive(selectedUser._id, selectedUser.isActive);
                          setSelectedUser(null);
                        }}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                          selectedUser.isActive 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
                      </button>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;