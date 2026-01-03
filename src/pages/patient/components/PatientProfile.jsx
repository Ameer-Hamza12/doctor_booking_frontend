// src/components/patient/PatientProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Save, 
  Calendar, 
  Droplets, 
  AlertCircle,
  Pill,
  Phone,
  ChevronRight,
  CheckCircle,
  Edit2,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import PatientNavbar from '../../../components/navbar/PatientNavbar';
import api from '../../../services/api';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showMessage, setShowMessage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    bloodGroup: '',
    allergies: [''],
    medicalHistory: [{ condition: '', diagnosedDate: '', status: 'active' }],
    medications: [{ name: '', dosage: '', frequency: '' }],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const response = await api.get('/patient/profile');
      if (response.data.profile) {
        setProfile(response.data.profile);
        setFormData({
          gender: response.data.profile.gender || '',
          age: response.data.profile.age || '',
          bloodGroup: response.data.profile.bloodGroup || '',
          allergies: response.data.profile.allergies?.length > 0 
            ? response.data.profile.allergies 
            : [''],
          medicalHistory: response.data.profile.medicalHistory?.length > 0
            ? response.data.profile.medicalHistory.map(h => ({
                condition: h.condition || '',
                diagnosedDate: h.diagnosedDate ? new Date(h.diagnosedDate).toISOString().split('T')[0] : '',
                status: h.status || 'active'
              }))
            : [{ condition: '', diagnosedDate: '', status: 'active' }],
          medications: response.data.profile.medications?.length > 0
            ? response.data.profile.medications
            : [{ name: '', dosage: '', frequency: '' }],
          emergencyContact: response.data.profile.emergencyContact || {
            name: '',
            relationship: '',
            phone: ''
          }
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      displayMessage('error', 'Failed to load profile data'); // Changed from showMessage
    } finally {
      setLoading(false);
    }
  };

  // Renamed from showMessage to displayMessage to avoid conflict
  const displayMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    setShowMessage(true);
    
    if (duration > 0) {
      setTimeout(() => {
        setShowMessage(false);
      }, duration);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template }]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleAllergyChange = (index, value) => {
    const newAllergies = [...formData.allergies];
    newAllergies[index] = value;
    
    // Add new empty field if last field is being filled
    if (index === newAllergies.length - 1 && value.trim() !== '') {
      newAllergies.push('');
    }
    
    setFormData(prev => ({
      ...prev,
      allergies: newAllergies
    }));
  };

  const validateForm = () => {
    if (!formData.gender) {
      displayMessage('error', 'Please select your gender'); // Changed from showMessage
      return false;
    }
    if (!formData.age || formData.age < 0 || formData.age > 120) {
      displayMessage('error', 'Please enter a valid age (0-120)'); // Changed from showMessage
      return false;
    }
    if (!formData.bloodGroup) {
      displayMessage('error', 'Please select your blood group'); // Changed from showMessage
      return false;
    }
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone) {
      displayMessage('error', 'Please fill in emergency contact details'); // Changed from showMessage
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setShowMessage(false);

    try {
      // Filter out empty allergies
      const filteredAllergies = formData.allergies.filter(a => a.trim() !== '');
      
      const profileData = {
        ...formData,
        age: Number(formData.age),
        allergies: filteredAllergies.length > 0 ? filteredAllergies : [],
        medicalHistory: formData.medicalHistory.filter(h => 
          h.condition.trim() !== '' && h.diagnosedDate
        ),
        medications: formData.medications.filter(m => 
          m.name.trim() !== '' && m.dosage.trim() !== ''
        )
      };

      const response = await api.put('/patient/profile', profileData);
      setProfile(response.data.profile);
      
      // Show success message
      displayMessage('success', 'Profile saved successfully! Your information has been updated.'); // Changed from showMessage
      
      // Scroll to top to show the message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      displayMessage('error', errorMessage); // Changed from showMessage
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <PatientNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const isProfileComplete = profile && 
    profile.gender && 
    profile.age && 
    profile.bloodGroup && 
    profile.emergencyContact?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PatientNavbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Profile</h1>
              <p className="text-blue-100">Manage your health information and medical history</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-xl ${
                isProfileComplete ? 'bg-green-500/20' : 'bg-amber-500/20'
              }`}>
                {isProfileComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Profile Complete</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Profile Incomplete</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Message Banner */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 rounded-2xl shadow-lg overflow-hidden ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-rose-100 border border-red-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl mr-4 ${
                    message.type === 'success' 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}>
                    {message.type === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${
                      message.type === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {message.type === 'success' ? 'Success!' : 'Error'}
                    </h3>
                    <p className={`mt-1 ${
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMessage(false)}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Banner for First-Time Users */}
        {!isProfileComplete && !showMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg overflow-hidden border border-blue-200"
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-blue-500 rounded-xl mr-4">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900">Complete Your Medical Profile</h3>
                  <p className="text-blue-800 mt-1">
                    A complete medical profile helps doctors provide better care and ensures 
                    you receive appropriate treatment in emergencies. All information is 
                    kept confidential and secure.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Droplets className="w-4 h-4 mr-2 text-red-500" />
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* User Info Display */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{user?.name}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                      {user?.phone && <p className="text-gray-600">{user.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Allergies</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('allergies', '')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Allergy
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => handleAllergyChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter allergy (e.g., Penicillin, Peanuts, Latex)"
                    />
                    {formData.allergies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('allergies', index)}
                        className="ml-3 p-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-sm text-gray-500">
                  Leave empty if you have no known allergies. Press + to add more.
                </p>
              </div>
            </div>

            {/* Medical History */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Medical History
                </h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('medicalHistory', { 
                    condition: '', 
                    diagnosedDate: '', 
                    status: 'active' 
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Condition
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.medicalHistory.map((history, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-900">Condition #{index + 1}</h4>
                      {formData.medicalHistory.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('medicalHistory', index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Condition
                        </label>
                        <input
                          type="text"
                          value={history.condition}
                          onChange={(e) => handleArrayChange('medicalHistory', index, 'condition', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Diabetes, Hypertension, Asthma"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnosed Date
                        </label>
                        <input
                          type="date"
                          value={history.diagnosedDate}
                          onChange={(e) => handleArrayChange('medicalHistory', index, 'diagnosedDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={history.status}
                          onChange={(e) => handleArrayChange('medicalHistory', index, 'status', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="resolved">Resolved</option>
                          <option value="chronic">Chronic</option>
                          <option value="monitoring">Monitoring</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-600" />
                  Current Medications
                </h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('medications', { 
                    name: '', 
                    dosage: '', 
                    frequency: '' 
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Medication
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.medications.map((medication, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-900">Medication #{index + 1}</h4>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('medications', index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medication Name
                        </label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => handleArrayChange('medications', index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Metformin, Lisinopril"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => handleArrayChange('medications', index, 'dosage', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 500mg, 10mg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency
                        </label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => handleArrayChange('medications', index, 'frequency', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Twice daily, Once a week"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-red-600" />
                  Emergency Contact *
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center group"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                    Save Profile Information
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800 flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  * Required fields. All information is stored securely and only 
                  accessible to your healthcare providers when necessary for treatment.
                </span>
              </p>
            </div>
          </form>
        </motion.div>

        {/* Profile Completion Tips */}
        {!isProfileComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-amber-800 mb-4">
                  A complete medical profile helps doctors provide better care. Please fill in:
                </p>
                <ul className="space-y-2 text-amber-800">
                  {!profile?.gender && <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2" />Gender</li>}
                  {!profile?.age && <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2" />Age</li>}
                  {!profile?.bloodGroup && <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2" />Blood Group</li>}
                  {(!profile?.emergencyContact?.name || !profile?.emergencyContact?.phone) && (
                    <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2" />Emergency Contact Information</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;