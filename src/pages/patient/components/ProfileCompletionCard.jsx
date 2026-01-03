import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight,
  Edit2,
  Droplets,
  Calendar,
  Phone,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const ProfileCompletionCard = ({ profile: propProfile, user }) => {
  const [dismissed, setDismissed] = useState(false);
  const [localProfile, setLocalProfile] = useState(propProfile);
  
  useEffect(() => {
    setLocalProfile(propProfile);
  }, [propProfile]);

  if (!localProfile || dismissed) return null;

  const isComplete = localProfile.gender && localProfile.age && localProfile.bloodGroup && localProfile.emergencyContact?.name;
  const completionPercentage = calculateCompletionPercentage(localProfile);

  const missingFields = [
    !localProfile.gender && 'Gender',
    !localProfile.age && 'Age',
    !localProfile.bloodGroup && 'Blood Group',
    (!localProfile.allergies || localProfile.allergies.length === 0) && 'Allergies',
    (!localProfile.emergencyContact?.name || !localProfile.emergencyContact?.phone) && 'Emergency Contact',
    (!localProfile.medicalHistory || localProfile.medicalHistory.length === 0) && 'Medical History'
  ].filter(Boolean);

  function calculateCompletionPercentage(profile) {
    const fields = [
      'gender',
      'age', 
      'bloodGroup',
      'allergies',
      'emergencyContact',
      'medicalHistory'
    ];
    
    const completed = fields.filter(field => {
      if (field === 'allergies' || field === 'medicalHistory') {
        return profile[field] && profile[field].length > 0;
      }
      if (field === 'emergencyContact') {
        return profile[field]?.name && profile[field]?.phone;
      }
      return profile[field];
    }).length;

    return Math.round((completed / fields.length) * 100);
  }

  const handleDismiss = async () => {
    try {
      // You could store dismissal preference in localStorage or backend
      localStorage.setItem('profileCardDismissed', 'true');
      setDismissed(true);
    } catch (error) {
      console.error('Error dismissing card:', error);
    }
  };

  if (isComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl shadow-lg overflow-hidden mb-8 border border-green-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profile Complete!</h3>
                <p className="text-green-700">Your medical profile is 100% complete</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">{localProfile.gender}, {localProfile.age} years</span>
              </div>
              {localProfile.bloodGroup && (
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-gray-700">{localProfile.bloodGroup}</span>
                </div>
              )}
              {localProfile.emergencyContact?.name && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">{localProfile.emergencyContact.name}</span>
                </div>
              )}
            </div>
            
            <Link
              to="/patient/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-amber-50 to-orange-100 rounded-3xl shadow-lg overflow-hidden mb-8 border border-amber-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-amber-500 rounded-xl mr-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
              <p className="text-amber-700">{completionPercentage}% profile complete</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Profile Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-amber-800 mb-3">Please add the following information:</p>
          <div className="flex flex-wrap gap-2">
            {missingFields.map((field, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 bg-white/50 text-amber-800 rounded-full text-sm border border-amber-300"
              >
                <ChevronRight className="w-3 h-3 mr-1" />
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/patient/profile"
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity text-center"
          >
            Complete Profile Now
          </Link>
          
          <button
            onClick={handleDismiss}
            className="px-6 py-3 border-2 border-amber-300 text-amber-700 rounded-xl font-bold hover:bg-white/50 transition-colors"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionCard;