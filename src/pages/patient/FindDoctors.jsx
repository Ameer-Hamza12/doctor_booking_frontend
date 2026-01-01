import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientNavbar from '../../components/navbar/PatientNavbar';
import api from '../../services/api';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  Award,
  Calendar,
  ChevronDown,
  Phone,
  Mail,
  Stethoscope,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const FindDoctors = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    minExperience: '',
    maxFee: '',
    sortBy: 'rating'
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    consultationType: 'online',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Fetch doctors list
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patient/doctors');
      const doctorsData = response.data.data;
      
      console.log('Doctors data:', doctorsData); // Debug log
      
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      
      // Extract unique specializations
      const specs = [...new Set(doctorsData.map(doc => doc.specialization))];
      setSpecializations(specs);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots for selected doctor
  const fetchAvailableSlots = async (doctorId) => {
    try {
      setLoadingSlots(true);
      const response = await api.get(`/doctor/${doctorId}/slots/available`);
      setAvailableSlots(response.data.data.availableSlots || {});
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots({});
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors based on search and filters
  useEffect(() => {
    let result = doctors;
    
    // Search by name, specialization, or qualifications
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor => {
        const nameMatch = doctor.name?.toLowerCase().includes(term) || false;
        const specMatch = doctor.specialization?.toLowerCase().includes(term) || false;
        
        // Check qualifications array for matches
        let qualMatch = false;
        if (doctor.qualifications && Array.isArray(doctor.qualifications)) {
          qualMatch = doctor.qualifications.some(q => 
            q.degree?.toLowerCase().includes(term) || 
            q.university?.toLowerCase().includes(term)
          );
        }
        
        return nameMatch || specMatch || qualMatch;
      });
    }
    
    // Filter by specialization
    if (filters.specialization) {
      result = result.filter(doctor => 
        doctor.specialization === filters.specialization
      );
    }
    
    // Filter by experience
    if (filters.minExperience) {
      result = result.filter(doctor => 
        doctor.experience >= parseInt(filters.minExperience)
      );
    }
    
    // Filter by consultation fee
    if (filters.maxFee) {
      result = result.filter(doctor => 
        doctor.consultationFee <= parseInt(filters.maxFee)
      );
    }
    
    // Sort doctors
    result.sort((a, b) => {
      switch(filters.sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'fee_low':
          return (a.consultationFee || 0) - (b.consultationFee || 0);
        case 'fee_high':
          return (b.consultationFee || 0) - (a.consultationFee || 0);
        default:
          return 0;
      }
    });
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, filters]);

  // Handle booking modal open
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    fetchAvailableSlots(doctor._id);
    setBookingData({
      date: '',
      timeSlot: '',
      consultationType: 'online',
      notes: ''
    });
  };

  // Handle booking submission
  const handleSubmitBooking = async () => {
    try {
      if (!bookingData.date || !bookingData.timeSlot) {
        alert('Please select date and time slot');
        return;
      }

      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        consultationType: bookingData.consultationType,
        notes: bookingData.notes
      };

      const response = await api.post('/patient/appointments', appointmentData);
      
      setBookingStatus({
        type: 'success',
        message: 'Appointment booked successfully! Check your email for confirmation.'
      });
      
      // Reset form and close modal after 3 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        setSelectedDoctor(null);
        setBookingStatus(null);
      }, 3000);
      
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to book appointment'
      });
    }
  };

  // Format qualifications for display
  const formatQualifications = (qualifications) => {
    if (!qualifications || !Array.isArray(qualifications)) return '';
    
    return qualifications.map(q => `${q.degree} (${q.university})`).join(', ');
  };

  // Format doctor name with "Dr." prefix
  const formatDoctorName = (name) => {
    if (!name) return 'Doctor';
    return name.startsWith('Dr.') ? name : `Dr. ${name}`;
  };

  // Format hospital address
  const formatHospitalAddress = (hospital) => {
    if (!hospital) return 'No hospital information';
    return `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zipCode}`;
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
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Find & Book Doctors</h1>
          <p className="text-blue-100 text-lg">
            Book appointments with verified doctors online. Choose from {doctors.length} specialists.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Name, specialization, degree..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              
              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience (years)
                </label>
                <select
                  value={filters.minExperience}
                  onChange={(e) => setFilters({...filters, minExperience: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Experience</option>
                  <option value="1">1+ years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                  <option value="15">15+ years</option>
                  <option value="20">20+ years</option>
                  <option value="25">25+ years</option>
                </select>
              </div>
              
              {/* Fee Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Fee ($)
                </label>
                <select
                  value={filters.maxFee}
                  onChange={(e) => setFilters({...filters, maxFee: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Fee</option>
                  <option value="50">Up to $50</option>
                  <option value="100">Up to $100</option>
                  <option value="200">Up to $200</option>
                  <option value="500">Up to $500</option>
                  <option value="1000">Up to $1000</option>
                  <option value="1500">Up to $1500</option>
                  <option value="10000">Up to $10,000</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                  <option value="fee_low">Fee: Low to High</option>
                  <option value="fee_high">Fee: High to Low</option>
                </select>
              </div>
              
              <button
                onClick={() => setFilters({
                  specialization: '',
                  minExperience: '',
                  maxFee: '',
                  sortBy: 'rating'
                })}
                className="w-full px-4 py-2.5 text-blue-600 border-2 border-blue-600 rounded-xl font-medium hover:bg-blue-50"
              >
                Clear All Filters
              </button>
            </motion.div>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Doctors
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All doctors are verified
                </span>
              </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      specialization: '',
                      minExperience: '',
                      maxFee: '',
                      sortBy: 'rating'
                    });
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    {/* Doctor Header */}
                    <div className="p-6">
                      <div className="flex items-start">
                        {/* Doctor Image */}
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center overflow-hidden mr-4">
                          {doctor.profileImage ? (
                            <img 
                              src={doctor.profileImage} 
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-10 h-10 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{formatDoctorName(doctor.name)}</h3>
                              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                                <span className="font-bold">{doctor.rating?.toFixed(1) || '0.0'}</span>
                                <span className="text-gray-500 text-sm ml-1">
                                  ({doctor.totalReviews || 0} reviews)
                                </span>
                              </div>
                              <div className="text-lg font-bold text-gray-900 mt-1">
                                ${doctor.consultationFee}
                              </div>
                            </div>
                          </div>
                          
                          {/* Hospital Information */}
                          <div className="mt-3">
                            <div className="flex items-start text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">
                                {doctor.hospital?.name || 'Not specified'}
                                {doctor.hospital?.city && `, ${doctor.hospital.city}`}
                              </span>
                            </div>
                          </div>
                          
                          {/* Doctor Info */}
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">{doctor.experience || 0} years experience</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">Available Today</span>
                            </div>
                          </div>
                          
                          {/* Qualifications */}
                          {doctor.qualifications && doctor.qualifications.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600">
                                {doctor.qualifications.map((q, index) => (
                                  <span key={index}>
                                    {q.degree} ({q.university})
                                    {index < doctor.qualifications.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </p>
                            </div>
                          )}
                          
                          {/* License Number */}
                          {doctor.licenseNumber && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                License: {doctor.licenseNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {doctor.isApproved ? (
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified & Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending Approval
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
                  <p className="text-gray-600 mt-1">with {formatDoctorName(selectedDoctor.name)}</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Booking Status */}
              {bookingStatus && (
                <div className={`mb-6 p-4 rounded-xl ${
                  bookingStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {bookingStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    {bookingStatus.message}
                  </div>
                </div>
              )}

              {/* Doctor Info Summary */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center overflow-hidden mr-4">
                    {selectedDoctor.profileImage ? (
                      <img 
                        src={selectedDoctor.profileImage} 
                        alt={selectedDoctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{formatDoctorName(selectedDoctor.name)}</h4>
                    <p className="text-blue-600">{selectedDoctor.specialization}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                        {selectedDoctor.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 text-gray-400 mr-1" />
                        {selectedDoctor.experience || 0} years
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        ${selectedDoctor.consultationFee}
                      </span>
                    </div>
                    {selectedDoctor.hospital && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {selectedDoctor.hospital.name}, {selectedDoctor.hospital.city}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Select Time Slot
                  </label>
                  
                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading available slots...</p>
                    </div>
                  ) : Object.keys(availableSlots).length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No available slots for selected doctor</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(availableSlots).map(([day, slots]) => (
                        slots.map((slot, index) => (
                          <button
                            key={`${day}-${index}`}
                            onClick={() => setBookingData({
                              ...bookingData, 
                              timeSlot: `${day} ${slot.startTime}-${slot.endTime}`
                            })}
                            className={`p-3 rounded-lg border text-center ${
                              bookingData.timeSlot === `${day} ${slot.startTime}-${slot.endTime}`
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            <div className="text-sm font-medium">{day}</div>
                            <div className="text-sm mt-1">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </button>
                        ))
                      ))}
                    </div>
                  )}
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBookingData({...bookingData, consultationType: 'online'})}
                      className={`p-4 rounded-xl border-2 text-center ${
                        bookingData.consultationType === 'online'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">Online</div>
                      <div className="text-sm text-gray-500 mt-1">Video Call</div>
                    </button>
                    
                    <button
                      onClick={() => setBookingData({...bookingData, consultationType: 'offline'})}
                      className={`p-4 rounded-xl border-2 text-center ${
                        bookingData.consultationType === 'offline'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">In-Person</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {selectedDoctor.hospital?.name || 'Hospital Visit'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    rows="3"
                    placeholder="Describe your symptoms or any special requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Booking Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-medium">${selectedDoctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-medium">$5.00</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="font-bold text-gray-900">${selectedDoctor.consultationFee + 5}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleSubmitBooking}
                    disabled={!bookingData.date || !bookingData.timeSlot}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking (${selectedDoctor.consultationFee + 5})
                  </button>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400"
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

export default FindDoctors;