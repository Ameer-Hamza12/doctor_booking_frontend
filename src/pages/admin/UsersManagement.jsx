// frontend/src/pages/admin/Users.jsx
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
  Filter
} from 'lucide-react';

const UsersManagement = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, patients, doctors, admins

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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'patient': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-500">Manage all users in the system</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'patient').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'doctor').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilter('patients')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'patients' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <User className="w-4 h-4 mr-2" />
                Patients
              </button>
              <button
                onClick={() => setFilter('doctors')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'doctors' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Doctors
              </button>
              <button
                onClick={() => setFilter('admins')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'admins' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admins
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                            {user.date_of_birth && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(user.date_of_birth)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </span>
                        {user.role === 'doctor' && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">
                              Approved: {user.isApproved ? 'Yes' : 'No'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Blocked: {user.isBlocked ? 'Yes' : 'No'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          )}
                          <span className={user.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                        {user.lastLogin && (
                          <div className="text-xs mt-1">
                            Last Login: {formatDate(user.lastLogin)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => toggleUserActive(user._id, user.isActive)}
                            className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded ${
                              user.isActive 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            <Activity className="w-3 h-3 mr-1" />
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          
                          <button
                            onClick={() => alert('View details for ' + user.name)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;