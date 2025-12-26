// frontend/src/pages/admin/Doctors.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  DollarSign, 
  Award, 
  Building, 
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Search,
  Filter,
  TrendingUp,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

const Doctors = () => {
  const { user: adminUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/admin/doctors');
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to load doctors: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApproveDoctor = async (doctorId) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isApproved: true, 
          isBlocked: false,
          approvedBy: adminUser._id,
          approvedAt: new Date().toISOString()
        } : doc
      ));
      
      alert('Doctor approved successfully!');
    } catch (error) {
      alert('Error approving doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBlockDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to block this doctor?')) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/block`);
      
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isApproved: false, 
          isBlocked: true 
        } : doc
      ));
      
      alert('Doctor blocked successfully!');
    } catch (error) {
      alert('Error blocking doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUnblockDoctor = async (doctorId) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/unblock`);
      
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { 
          ...doc, 
          isBlocked: false 
        } : doc
      ));
      
      alert('Doctor unblocked successfully!');
    } catch (error) {
      alert('Error unblocking doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleUserActive = async (doctorId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this doctor?`)) return;
    
    try {
      await api.put(`/admin/users/${doctorId}/toggle-active`);
      
      setDoctors(doctors.map(doc => 
        doc._id === doctorId ? { ...doc, isActive: !currentStatus } : doc
      ));
      
      alert(`Doctor ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      alert('Error toggling doctor status: ' + (error.response?.data?.error || error.message));
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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'pending') return matchesSearch && !doctor.isApproved && !doctor.isBlocked;
    if (filter === 'approved') return matchesSearch && doctor.isApproved && !doctor.isBlocked;
    if (filter === 'blocked') return matchesSearch && doctor.isBlocked;
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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Stethoscope className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctors Management</h1>
                <p className="text-sm text-gray-500">Detailed doctor profiles and management</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors by name, specialization, or email..."
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
                All Doctors
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending Approval
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approved
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`px-4 py-2 rounded-lg flex items-center ${filter === 'blocked' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Blocked
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No doctors found</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                {/* Doctor Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      {doctor.isBlocked ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <UserX className="w-3 h-3 mr-1" />
                          Blocked
                        </span>
                      ) : doctor.isApproved ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Specialization</h4>
                    <p className="text-gray-900 font-medium">{doctor.specialization || 'Not specified'}</p>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-3 mb-6">
                    {doctor.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.phone}
                      </div>
                    )}
                    
                    {doctor.doctorDetails?.licenseNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-gray-400" />
                        License: {doctor.doctorDetails.licenseNumber}
                      </div>
                    )}
                    
                    {doctor.doctorDetails?.experience > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.doctorDetails.experience} years experience
                      </div>
                    )}
                    
                    {doctor.doctorDetails?.consultationFee > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        Fee: ${doctor.doctorDetails.consultationFee}
                      </div>
                    )}
                    
                    {doctor.doctorDetails?.hospital?.name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.doctorDetails.hospital.name}
                      </div>
                    )}
                    
                    {doctor.doctorDetails?.ratings?.average > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        Rating: {doctor.doctorDetails.ratings.average.toFixed(1)} 
                        <span className="text-gray-400 ml-1">
                          ({doctor.doctorDetails.ratings.count} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Qualifications */}
                  {doctor.doctorDetails?.qualifications && doctor.doctorDetails.qualifications.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Qualifications</h4>
                      <div className="space-y-1">
                        {doctor.doctorDetails.qualifications.slice(0, 2).map((qual, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {qual.degree} - {qual.university} ({qual.year})
                          </div>
                        ))}
                        {doctor.doctorDetails.qualifications.length > 2 && (
                          <div className="text-sm text-blue-600">
                            +{doctor.doctorDetails.qualifications.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Verified</p>
                        <p className={doctor.isVerified ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                          {doctor.isVerified ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Active</p>
                        <p className={doctor.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {doctor.isActive ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Joined</p>
                        <p>{formatDate(doctor.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Login</p>
                        <p>{doctor.lastLogin ? formatDate(doctor.lastLogin) : 'Never'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {!doctor.isApproved && !doctor.isBlocked && (
                      <button
                        onClick={() => handleApproveDoctor(doctor._id)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                    )}
                    
                    {!doctor.isBlocked ? (
                      <button
                        onClick={() => handleBlockDoctor(doctor._id)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblockDoctor(doctor._id)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Unblock
                      </button>
                    )}
                    
                    <button
                      onClick={() => toggleUserActive(doctor._id, doctor.isActive)}
                      className={`col-span-2 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded ${
                        doctor.isActive 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {doctor.isActive ? 'Deactivate Account' : 'Activate Account'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;