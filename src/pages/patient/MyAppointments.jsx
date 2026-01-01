import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientNavbar from '../../components/navbar/PatientNavbar';
import api from '../../services/api';
import { 
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  Video,
  MapPin,
  Download,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  FileText,
  Stethoscope,
  DollarSign,
  Star,
  MessageSquare,
  CalendarDays,
  User,
  Building,
  Navigation,
  Printer,
  Share2,
  Bell,
  FileCheck,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyAppointments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patient/appointments');
      const appointmentsData = response.data.data;
      
      setAppointments(appointmentsData);
      calculateStats(appointmentsData);
      filterAppointments(appointmentsData, selectedStatus, selectedDate, searchTerm);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (appointmentsList) => {
    const now = new Date();
    
    const stats = {
      total: appointmentsList.length,
      upcoming: appointmentsList.filter(app => 
        ['pending', 'confirmed'].includes(app.status) && 
        new Date(app.date) > now
      ).length,
      completed: appointmentsList.filter(app => 
        app.status === 'completed'
      ).length,
      cancelled: appointmentsList.filter(app => 
        app.status === 'cancelled'
      ).length
    };
    
    setStats(stats);
  };

  // Filter appointments
  const filterAppointments = (appointmentsList, status, date, search) => {
    let filtered = [...appointmentsList];
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status);
    }
    
    // Filter by date
    if (date) {
      const filterDate = new Date(date);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return appDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Filter by search term
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(app => 
        app.doctorId?.userId?.name?.toLowerCase().includes(term) ||
        app.doctorId?.specialization?.toLowerCase().includes(term) ||
        app.timeSlot.toLowerCase().includes(term) ||
        app.notes?.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments(appointments, selectedStatus, selectedDate, searchTerm);
  }, [selectedStatus, selectedDate, searchTerm]);

  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    try {
      setCancelling(true);
      
      await api.put(`/patient/appointments/${selectedAppointment._id}/cancel`, {
        reason: cancelReason
      });
      
      // Refresh appointments
      fetchAppointments();
      
      // Reset and close modal
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
      
      alert('Appointment cancelled successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Format full date
  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get time from time slot
  const getTimeFromSlot = (timeSlot) => {
    return timeSlot.split(' ')[1] || timeSlot;
  };

  // Get status configuration
  const getStatusConfig = (status, date) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    
    if (status === 'cancelled' || status === 'rejected') {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600',
        text: status === 'cancelled' ? 'Cancelled' : 'Rejected'
      };
    }
    
    if (status === 'completed') {
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        iconColor: 'text-blue-600',
        text: 'Completed'
      };
    }
    
    if (status === 'confirmed') {
      if (appointmentDate < now) {
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: ClockIcon,
          iconColor: 'text-amber-600',
          text: 'Missed'
        };
      }
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        text: 'Confirmed'
      };
    }
    
    if (status === 'pending') {
      if (appointmentDate < now) {
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          text: 'Expired'
        };
      }
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: ClockIcon,
        iconColor: 'text-yellow-600',
        text: 'Pending'
      };
    }
    
    return {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: AlertCircle,
      iconColor: 'text-gray-600',
      text: status
    };
  };

  // Check if appointment can be cancelled
  const canCancelAppointment = (appointment) => {
    if (['cancelled', 'completed', 'rejected'].includes(appointment.status)) {
      return false;
    }
    
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);
    
    return hoursUntilAppointment >= 24;
  };

  // Check if appointment is upcoming
  const isUpcoming = (appointment) => {
    return ['pending', 'confirmed'].includes(appointment.status) && 
           new Date(appointment.date) > new Date();
  };

  // Download appointment details
  const downloadAppointmentDetails = (appointment) => {
    const content = `
      Appointment Details
      ==================
      
      Patient: ${user?.name}
      Doctor: Dr. ${appointment.doctorId?.userId?.name}
      Specialization: ${appointment.doctorId?.specialization}
      Date: ${formatFullDate(appointment.date)}
      Time: ${appointment.timeSlot}
      Consultation Type: ${appointment.consultationType}
      Status: ${appointment.status}
      Amount: $${appointment.amount || 0}
      Appointment ID: ${appointment._id}
      
      Notes: ${appointment.notes || 'No notes provided'}
      
      Download Date: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <PatientNavbar />
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
      <PatientNavbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
              <p className="text-blue-100">Manage and track all your medical appointments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={fetchAppointments}
                className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Doctor, specialization..."
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

            {/* Action Buttons */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedDate('');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* List Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Appointments ({filteredAppointments.length})
              </h2>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <span className="text-sm text-gray-600">
                  Showing {filteredAppointments.length} of {appointments.length} appointments
                </span>
              </div>
            </div>
          </div>

          {/* Appointments Content */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {appointments.length === 0 
                  ? "You haven't booked any appointments yet." 
                  : "Try adjusting your filters or search terms"}
              </p>
              {appointments.length === 0 && (
                <a
                  href="/patient/find-doctors"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Book Your First Appointment
                </a>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredAppointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.status, appointment.date);
                  const StatusIcon = statusConfig.icon;
                  const isExpanded = expandedAppointment === appointment._id;
                  const canCancel = canCancelAppointment(appointment);
                  const isUpcomingAppointment = isUpcoming(appointment);
                  
                  return (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-6 ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      {/* Appointment Summary */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        {/* Left Column - Doctor & Date */}
                        <div className="flex items-start mb-4 md:mb-0">
                          {/* Doctor Avatar */}
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center overflow-hidden mr-4">
                            {appointment.doctorId?.userId?.profileImage ? (
                              <img 
                                src={appointment.doctorId.userId.profileImage} 
                                alt={appointment.doctorId?.userId?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-white" />
                            )}
                          </div>
                          
                          {/* Doctor Info */}
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Dr. {appointment.doctorId?.userId?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {appointment.doctorId?.specialization || 'General Physician'}
                            </p>
                            
                            <div className="flex flex-wrap items-center mt-2 gap-2">
                              <span className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                {getTimeFromSlot(appointment.timeSlot)}
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
                          </div>
                        </div>

                        {/* Right Column - Status & Actions */}
                        <div className="flex flex-col md:items-end space-y-3">
                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                            <StatusIcon className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`} />
                            {statusConfig.text}
                          </span>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setExpandedAppointment(isExpanded ? null : appointment._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-2 inline" />
                                  Less Details
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2 inline" />
                                  View Details
                                </>
                              )}
                            </button>
                            
                            {canCancel && (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowCancelModal(true);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="w-4 h-4 mr-2 inline" />
                                Cancel
                              </button>
                            )}
                            
                            {isUpcomingAppointment && (
                              <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                                <MessageSquare className="w-4 h-4 mr-2 inline" />
                                Join
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Appointment Details */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg flex items-center">
                                  <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                                  Appointment Details
                                </h4>
                                
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Appointment ID:</span>
                                    <span className="font-medium text-gray-900">{appointment._id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Booking Date:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(appointment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Consultation Fee:</span>
                                    <span className="font-medium text-gray-900">
                                      ${appointment.doctorId?.consultationFee || appointment.amount || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`font-medium ${
                                      appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                      {appointment.paymentStatus?.charAt(0).toUpperCase() + appointment.paymentStatus?.slice(1) || 'Pending'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Doctor Contact */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg flex items-center">
                                  <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                                  Doctor Information
                                </h4>
                                
                                <div className="space-y-3">
                                  {appointment.doctorId?.userId?.email && (
                                    <div className="flex items-center">
                                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-gray-700">{appointment.doctorId.userId.email}</span>
                                    </div>
                                  )}
                                  {appointment.doctorId?.userId?.phone && (
                                    <div className="flex items-center">
                                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-gray-700">{appointment.doctorId.userId.phone}</span>
                                    </div>
                                  )}
                                  {appointment.doctorId?.hospital?.name && (
                                    <div className="flex items-start">
                                      <Building className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                                      <div>
                                        <div className="text-gray-700">{appointment.doctorId.hospital.name}</div>
                                        {appointment.doctorId.hospital.address && (
                                          <div className="text-sm text-gray-600">{appointment.doctorId.hospital.address}</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Additional Notes */}
                            {appointment.notes && (
                              <div className="mt-6">
                                <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center">
                                  <ClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
                                  Your Notes
                                </h4>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                  <p className="text-gray-700">{appointment.notes}</p>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                              <button
                                onClick={() => downloadAppointmentDetails(appointment)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Details
                              </button>
                              
                              <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowDetailsModal(true);
                                }}
                                className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Full View
                              </button>
                              
                              {isUpcomingAppointment && (
                                <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center">
                                  <Bell className="w-4 h-4 mr-2" />
                                  Set Reminder
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Cancel Appointment</h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedAppointment(null);
                    setCancelReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel your appointment with <strong>Dr. {selectedAppointment.doctorId?.userId?.name}</strong>?
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Cancellation Policy:</span>
                  </div>
                  <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                    <li>Cancellations within 24 hours may incur a fee</li>
                    <li>Refunds may take 5-7 business days</li>
                    <li>You can reschedule instead of cancelling</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedAppointment(null);
                    setCancelReason('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400"
                >
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-4xl w-full my-8"
          >
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                  <p className="text-gray-600 mt-1">Complete information about your appointment</p>
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

              {/* Doctor Info */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center overflow-hidden mr-6">
                    {selectedAppointment.doctorId?.userId?.profileImage ? (
                      <img 
                        src={selectedAppointment.doctorId.userId.profileImage} 
                        alt={selectedAppointment.doctorId?.userId?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">
                          Dr. {selectedAppointment.doctorId?.userId?.name}
                        </h4>
                        <p className="text-blue-600 text-lg font-medium">
                          {selectedAppointment.doctorId?.specialization}
                        </p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                          <span className="font-medium">
                            {selectedAppointment.doctorId?.ratings?.average?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            ({selectedAppointment.doctorId?.ratings?.count || 0} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            ${selectedAppointment.doctorId?.consultationFee || selectedAppointment.amount || 0}
                          </div>
                          <div className="text-gray-600">Consultation Fee</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Appointment Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Date</div>
                            <div className="font-medium text-gray-900">
                              {formatFullDate(selectedAppointment.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Time Slot</div>
                            <div className="font-medium text-gray-900">
                              {selectedAppointment.timeSlot}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          {selectedAppointment.consultationType === 'online' ? (
                            <Video className="w-5 h-5 text-blue-400 mr-3" />
                          ) : (
                            <MapPin className="w-5 h-5 text-green-400 mr-3" />
                          )}
                          <div>
                            <div className="text-sm text-gray-600">Consultation Type</div>
                            <div className="font-medium text-gray-900">
                              {selectedAppointment.consultationType === 'online' ? 'Video Consultation' : 'In-person Visit'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status & Payment */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Status & Payment</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Appointment Status</span>
                          {(() => {
                            const config = getStatusConfig(selectedAppointment.status, selectedAppointment.date);
                            const Icon = config.icon;
                            return (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                                <Icon className={`w-4 h-4 mr-2 ${config.iconColor}`} />
                                {config.text}
                              </span>
                            );
                          })()}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-600">Payment Status</span>
                          <span className={`font-medium ${
                            selectedAppointment.paymentStatus === 'paid' ? 'text-green-600' : 
                            selectedAppointment.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {selectedAppointment.paymentStatus?.charAt(0).toUpperCase() + selectedAppointment.paymentStatus?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Doctor Contact */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Doctor Contact</h4>
                    <div className="space-y-4">
                      {selectedAppointment.doctorId?.userId?.email && (
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Email</div>
                            <div className="font-medium text-gray-900">
                              {selectedAppointment.doctorId.userId.email}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedAppointment.doctorId?.userId?.phone && (
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Phone</div>
                            <div className="font-medium text-gray-900">
                              {selectedAppointment.doctorId.userId.phone}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hospital Info */}
                  {selectedAppointment.doctorId?.hospital && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Hospital/Clinic</h4>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start mb-3">
                          <Building className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {selectedAppointment.doctorId.hospital.name}
                            </div>
                            {selectedAppointment.doctorId.hospital.address && (
                              <div className="text-sm text-gray-600 mt-1">
                                {selectedAppointment.doctorId.hospital.address}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {(selectedAppointment.doctorId.hospital.city || selectedAppointment.doctorId.hospital.state) && (
                          <div className="flex items-center text-sm text-gray-600 mt-2">
                            <Navigation className="w-4 h-4 mr-1" />
                            {[selectedAppointment.doctorId.hospital.city, selectedAppointment.doctorId.hospital.state]
                              .filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Your Notes */}
                  {selectedAppointment.notes && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Your Notes</h4>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-gray-700">{selectedAppointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-200">
                {canCancelAppointment(selectedAppointment) && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedAppointment(selectedAppointment);
                      setShowCancelModal(true);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel Appointment
                  </button>
                )}
                
                <button
                  onClick={() => downloadAppointmentDetails(selectedAppointment)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Summary
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Details
                </button>
                
                {isUpcoming(selectedAppointment) && (
                  <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Add to Calendar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;