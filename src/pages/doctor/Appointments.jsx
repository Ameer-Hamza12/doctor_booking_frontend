import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DoctorNavbar from '../../components/navbar/DoctorNavbar';
import { 
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Video,
  MapPin,
  FileText,
  Download,
  Eye,
  RefreshCw,
  BarChart3,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const Appointments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    notes: ''
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedDate) params.append('date', selectedDate);
      
      const response = await api.get(`/doctor/appointments?${params.toString()}`);
      const data = response.data.data;
      
      setAppointments(data.appointments);
      setFilteredAppointments(data.appointments);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const handleUpdateStatus = async () => {
    try {
      setUpdatingStatus(true);
      
      await api.put(`/doctor/appointments/${selectedAppointment._id}/status`, {
        status: statusUpdateData.status,
        notes: statusUpdateData.notes
      });
      
      // Refresh appointments
      fetchAppointments();
      
      // Reset and close modal
      setShowDetailsModal(false);
      setSelectedAppointment(null);
      setStatusUpdateData({ status: '', notes: '' });
      
      alert('Appointment status updated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedStatus, selectedDate]);

  // Filter appointments based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAppointments(appointments);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = appointments.filter(appointment => 
      appointment.patientId.name.toLowerCase().includes(term) ||
      appointment.timeSlot.toLowerCase().includes(term) ||
      appointment.consultationType.toLowerCase().includes(term) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(term))
    );
    
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch(status) {
      case 'confirmed':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon,
          iconColor: 'text-yellow-600'
        };
      case 'completed':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
          iconColor: 'text-blue-600'
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  // Handle view details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setStatusUpdateData({
      status: appointment.status,
      notes: ''
    });
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <DoctorNavbar />
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
      <DoctorNavbar />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">
              Manage your appointments and patient consultations
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={fetchAppointments}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            <a
              href="/doctor/dashboard"
              className="inline-flex items-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600 mt-1">Confirmed</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600 mt-1">Cancelled</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Patient
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Patient name, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const statusConfig = getStatusConfig(appointment.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      {/* Patient Info */}
                      <div className="flex items-start mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                          {appointment.patientId.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {appointment.patientId.name}
                          </h3>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(appointment.date)}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {appointment.timeSlot}
                            </span>
                            <span className={`flex items-center text-sm ${appointment.consultationType === 'online' ? 'text-blue-600' : 'text-green-600'}`}>
                              {appointment.consultationType === 'online' ? (
                                <Video className="w-4 h-4 mr-1" />
                              ) : (
                                <MapPin className="w-4 h-4 mr-1" />
                              )}
                              {appointment.consultationType}
                            </span>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col md:items-end space-y-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                          <StatusIcon className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`} />
                          {appointment.status}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(appointment)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2 inline" />
                            View Details
                          </button>
                          
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setStatusUpdateData({ status: 'confirmed', notes: '' });
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 inline" />
                              Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full my-8"
          >
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                  <p className="text-gray-600 mt-1">Manage appointment and update status</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Patient Info */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mr-4">
                    {selectedAppointment.patientId.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedAppointment.patientId.name}
                    </h4>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedAppointment.patientId.email}
                      </span>
                      {selectedAppointment.patientId.phone && (
                        <span className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedAppointment.patientId.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      {formatDate(selectedAppointment.date)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      {selectedAppointment.timeSlot}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {selectedAppointment.consultationType === 'online' ? (
                        <Video className="w-5 h-5 text-blue-400 mr-2" />
                      ) : (
                        <MapPin className="w-5 h-5 text-green-400 mr-2" />
                      )}
                      {selectedAppointment.consultationType}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {(() => {
                      const config = getStatusConfig(selectedAppointment.status);
                      const Icon = config.icon;
                      return (
                        <div className="flex items-center">
                          <Icon className={`w-5 h-5 mr-2 ${config.iconColor}`} />
                          {selectedAppointment.status}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Patient Notes */}
              {selectedAppointment.notes && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Notes
                  </label>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}

              {/* Update Status Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Update Status</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={statusUpdateData.status}
                      onChange={(e) => setStatusUpdateData({
                        ...statusUpdateData,
                        status: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={statusUpdateData.notes}
                      onChange={(e) => setStatusUpdateData({
                        ...statusUpdateData,
                        notes: e.target.value
                      })}
                      rows="3"
                      placeholder="Add any notes for the patient..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !statusUpdateData.status}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Appointment Status'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Appointments;