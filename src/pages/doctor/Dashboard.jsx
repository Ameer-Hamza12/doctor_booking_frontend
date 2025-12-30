import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  MessageCircle,
  Phone,
  Award,
  Stethoscope,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import DoctorNavbar from '../../components/navbar/DoctorNavbar';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalPatients: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });
  const [editingSlot, setEditingSlot] = useState(null);

  // Fetch doctor profile and data
  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctor profile
      const profileRes = await api.get('/doctor/profile');
      setDoctorProfile(profileRes.data.data);
      
      // Fetch time slots
      const slotsRes = await api.get('/doctor/slots');
      setTimeSlots(slotsRes.data.data.allSlots || []);
      
      // Fetch statistics
      const statsRes = await api.get('/doctor/stats');
      setStats({
        totalAppointments: 156,
        upcomingAppointments: 12,
        completedAppointments: 144,
        totalEarnings: doctorProfile?.consultationFee * 144 || 0,
        averageRating: statsRes.data.data.profileStats.rating,
        totalPatients: 89
      });
      
      // Mock recent appointments (replace with actual API)
      setRecentAppointments([
        { id: 1, patientName: 'John Doe', time: 'Today, 10:00 AM', status: 'confirmed' },
        { id: 2, patientName: 'Sarah Smith', time: 'Today, 11:30 AM', status: 'pending' },
        { id: 3, patientName: 'Mike Johnson', time: 'Tomorrow, 09:00 AM', status: 'confirmed' },
        { id: 4, patientName: 'Lisa Wang', time: 'Tomorrow, 02:00 PM', status: 'confirmed' },
        { id: 5, patientName: 'Robert Brown', time: 'Yesterday, 03:30 PM', status: 'completed' },
      ]);
      
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  // Add new time slot
  const handleAddTimeSlot = async () => {
    try {
      await api.post('/doctor/slots', {
        slots: [newSlot]
      });
      
      setShowAddSlotModal(false);
      setNewSlot({ day: 'Monday', startTime: '09:00', endTime: '10:00' });
      fetchDoctorData(); // Refresh data
      
      alert('Time slot added successfully!');
    } catch (error) {
      alert('Error adding time slot: ' + (error.response?.data?.error || error.message));
    }
  };

  // Update time slot availability
  const handleToggleSlotAvailability = async (slotId, currentStatus) => {
    try {
      await api.put(`/doctor/slots/${slotId}`, {
        isAvailable: !currentStatus
      });
      
      fetchDoctorData(); // Refresh data
      alert(`Time slot ${!currentStatus ? 'made available' : 'marked as unavailable'}!`);
    } catch (error) {
      alert('Error updating slot: ' + (error.response?.data?.error || error.message));
    }
  };

  // Delete time slot
  const handleDeleteTimeSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;
    
    try {
      await api.delete(`/doctor/slots/${slotId}`);
      fetchDoctorData(); // Refresh data
      alert('Time slot deleted successfully!');
    } catch (error) {
      alert('Error deleting slot: ' + (error.response?.data?.error || error.message));
    }
  };

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Group slots by day
  const groupSlotsByDay = () => {
    const groups = {};
    timeSlots.forEach(slot => {
      if (!groups[slot.day]) groups[slot.day] = [];
      groups[slot.day].push(slot);
    });
    
    // Sort days in order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return Object.keys(groups)
      .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
      .reduce((acc, day) => {
        acc[day] = groups[day];
        return acc;
      }, {});
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, Dr. {user?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {doctorProfile?.specialization || 'General Physician'} • {doctorProfile?.experience || 0} years experience
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              doctorProfile?.approvedBy 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {doctorProfile?.approvedBy ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Doctor
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Approval
                </>
              )}
            </span>
            
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </button>
          </div>
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
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAppointments}</p>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingAppointments}</p>
                <p className="text-sm text-gray-500">Appointments today</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalEarnings}</p>
                <p className="text-sm text-gray-500">Lifetime</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-600" />
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
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageRating.toFixed(1)}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Time Slots */}
          <div className="lg:col-span-2">
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
                    <h2 className="text-2xl font-bold text-gray-900">Time Slots Management</h2>
                    <p className="text-gray-600 mt-1">Manage your available appointment times</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search slots..."
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                      />
                    </div>
                    
                    <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                      <Filter className="w-4 h-4 mr-2 inline" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Slots Content */}
              <div className="p-8">
                {timeSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No time slots added yet</h3>
                    <p className="text-gray-600 mb-6">Add your available time slots to start accepting appointments</p>
                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Add Your First Time Slot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupSlotsByDay()).map(([day, slots]) => (
                      <div key={day}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                          {day}
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({slots.length} slot{slots.length !== 1 ? 's' : ''})
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {slots.map((slot) => (
                            <div
                              key={slot._id}
                              className={`p-4 rounded-xl border ${
                                slot.isAvailable 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="font-medium text-gray-900">
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                  </span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  slot.isAvailable 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {slot.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleToggleSlotAvailability(slot._id, slot.isAvailable)}
                                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg ${
                                    slot.isAvailable 
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {slot.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteTimeSlot(slot._id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Delete slot"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Slots Summary */}
                {timeSlots.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{timeSlots.length}</div>
                        <div className="text-sm text-gray-700">Total Slots</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">
                          {timeSlots.filter(s => s.isAvailable).length}
                        </div>
                        <div className="text-sm text-gray-700">Available Now</div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <div className="text-2xl font-bold text-amber-600">
                          {Math.round((timeSlots.filter(s => s.isAvailable).length / timeSlots.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-700">Availability Rate</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Stats & Recent */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 text-white"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Dr. {user?.name}</h3>
                  <p className="text-blue-100">{doctorProfile?.specialization || 'General Physician'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Experience</span>
                  <span className="font-bold">{doctorProfile?.experience || 0} years</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Consultation Fee</span>
                  <span className="font-bold">${doctorProfile?.consultationFee || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">License No.</span>
                  <span className="font-bold text-sm">{doctorProfile?.licenseNumber || 'Not set'}</span>
                </div>
                
                <div className="pt-4 border-t border-blue-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalPatients}</div>
                    <div className="text-blue-200 text-sm">Total Patients</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 px-4 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                View Full Profile
              </button>
            </motion.div>

            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-600">{appointment.time}</div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                <Calendar className="w-4 h-4 mr-2 inline" />
                View Calendar
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  View Messages
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  My Patients
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Analytics
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add Time Slot</h3>
                <button
                  onClick={() => setShowAddSlotModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day
                  </label>
                  <select
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-6">
                  <button
                    onClick={handleAddTimeSlot}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Add Slot
                  </button>
                  <button
                    onClick={() => setShowAddSlotModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;