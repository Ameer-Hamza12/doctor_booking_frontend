import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DoctorNavbar from '../../components/navbar/DoctorNavbar';
import { 
  User,
  Briefcase,
  GraduationCap,
  Building,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle,
  Clock,
  Edit,
  Save,
  X,
  Upload,
  Award,
  Star,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    experience: '',
    licenseNumber: '',
    consultationFee: '',
    qualifications: [{ degree: '', university: '', year: '' }],
    hospital: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // Fetch doctor profile
  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctor/profile');
      const data = response.data.data;
      
      setDoctorProfile(data);
      setFormData({
        experience: data.experience || '',
        licenseNumber: data.licenseNumber || '',
        consultationFee: data.consultationFee || '',
        qualifications: data.qualifications?.length > 0 
          ? data.qualifications 
          : [{ degree: '', university: '', year: '' }],
        hospital: data.hospital || {
          name: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        }
      });
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hospital info changes
  const handleHospitalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      hospital: {
        ...prev.hospital,
        [name]: value
      }
    }));
  };

  // Handle qualification changes
  const handleQualificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [name]: value
    };
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  // Add new qualification field
  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', university: '', year: '' }]
    }));
  };

  // Remove qualification field
  const removeQualification = (index) => {
    if (formData.qualifications.length > 1) {
      const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        qualifications: updatedQualifications
      }));
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.licenseNumber || !formData.consultationFee) {
        alert('License number and consultation fee are required');
        return;
      }

      // Prepare data for API
      const profileData = {
        experience: parseInt(formData.experience) || 0,
        licenseNumber: formData.licenseNumber,
        consultationFee: parseInt(formData.consultationFee) || 0,
        qualifications: formData.qualifications.filter(q => 
          q.degree && q.university && q.year
        ),
        hospital: formData.hospital
      };

      await api.post('/doctor/profile', profileData);
      
      setIsEditing(false);
      fetchDoctorProfile(); // Refresh data
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    fetchDoctorProfile(); // Reset to original data
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your professional profile and information
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
                  Verified & Approved
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Admin Approval
                </>
              )}
            </span>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h2>
                    <p className="text-gray-600">
                      {doctorProfile?.userId?.specialization || 'General Physician'}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                      <span className="font-medium text-gray-900">
                        {doctorProfile?.ratings?.average?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({doctorProfile?.ratings?.count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                {/* Basic Information */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-3 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          max="50"
                        />
                      ) : (
                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                          <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{doctorProfile?.experience || 0} years</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Fee ($)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="consultationFee"
                          value={formData.consultationFee}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          required
                        />
                      ) : (
                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                          <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">${doctorProfile?.consultationFee || 0}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-blue-600" />
                    License Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical License Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your license number"
                        required
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{doctorProfile?.licenseNumber || 'Not provided'}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      This is your official medical practice license number
                    </p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-3 text-blue-600" />
                      Educational Qualifications
                    </h3>
                    {isEditing && (
                      <button
                        onClick={addQualification}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add Qualification
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-6">
                      {formData.qualifications.map((qual, index) => (
                        <div key={index} className="p-6 border border-gray-200 rounded-xl">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-900">Qualification #{index + 1}</h4>
                            {formData.qualifications.length > 1 && (
                              <button
                                onClick={() => removeQualification(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Degree
                              </label>
                              <input
                                type="text"
                                name="degree"
                                value={qual.degree}
                                onChange={(e) => handleQualificationChange(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., MBBS, MD"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                University
                              </label>
                              <input
                                type="text"
                                name="university"
                                value={qual.university}
                                onChange={(e) => handleQualificationChange(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="University name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                              </label>
                              <input
                                type="number"
                                name="year"
                                value={qual.year}
                                onChange={(e) => handleQualificationChange(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 2015"
                                min="1900"
                                max={new Date().getFullYear()}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {doctorProfile?.qualifications?.length > 0 ? (
                        doctorProfile.qualifications.map((qual, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-start">
                              <Award className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                              <div>
                                <h4 className="font-bold text-gray-900">{qual.degree}</h4>
                                <p className="text-gray-600">{qual.university}</p>
                                <p className="text-sm text-gray-500">Graduated {qual.year}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No qualifications added yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hospital/Clinic Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building className="w-5 h-5 mr-3 text-blue-600" />
                    Hospital/Clinic Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital/Clinic Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.hospital.name}
                          onChange={handleHospitalChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter hospital name"
                        />
                      ) : (
                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                          <Building className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{doctorProfile?.hospital?.name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.hospital.address}
                          onChange={handleHospitalChange}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Full address"
                        />
                      ) : (
                        <div className="flex items-start px-4 py-3 bg-gray-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                          <span className="text-gray-900">{doctorProfile?.hospital?.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.hospital.city}
                            onChange={handleHospitalChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{doctorProfile?.hospital?.city || '-'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            value={formData.hospital.state}
                            onChange={handleHospitalChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{doctorProfile?.hospital?.state || '-'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.hospital.zipCode}
                            onChange={handleHospitalChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{doctorProfile?.hospital?.zipCode || '-'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-8">
            {/* Profile Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Profile Completion</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Basic Information</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>License Details</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Qualifications (Add more)</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Contact Information</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {doctorProfile?.approvedBy ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Admin Approval</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                        <span>Pending Approval</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center">
                  <Upload className="w-5 h-5 mr-3" />
                  Upload Documents
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center">
                  <Shield className="w-5 h-5 mr-3" />
                  Verify License
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  View Schedule
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors flex items-center">
                  <Star className="w-5 h-5 mr-3" />
                  View Reviews
                </button>
              </div>
            </motion.div>

            {/* Profile Tips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl border border-blue-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Tips</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3"></div>
                  Complete all fields for better visibility
                </li>
                
                <li className="flex items-start text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3"></div>
                  Add multiple qualifications to build trust
                </li>
                
                <li className="flex items-start text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3"></div>
                  Keep your license number updated
                </li>
                
                <li className="flex items-start text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3"></div>
                  Higher profile completion = More patients
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;