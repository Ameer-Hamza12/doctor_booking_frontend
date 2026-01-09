import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Loader,
    Camera,
    Activity,
    Heart,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const PatientProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        age: '',
        bloodGroup: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    const fetchProfile = async () => {
        try {
            const response = await api.get('/patient/profile');
            const data = response.data.data;
            setProfile(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                gender: data.gender || '',
                age: data.age || '',
                bloodGroup: data.bloodGroup || '',
                emergencyContact: data.emergencyContact || { name: '', relationship: '', phone: '' }
            });
            if (data.profileImage) {
                // Remove /api from the end of VITE_API_URL to get the base URL
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
                setImagePreview(`${baseUrl}/${data.profileImage}`);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('ec_')) {
            const field = name.split('_')[1];
            setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // 1. Update text profile
            await api.put('/patient/profile', formData);

            // 2. Update image if changed
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('profileImage', imageFile);
                await api.post('/patient/profile/image', imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert('Profile updated successfully');
            setIsEditing(false);
            setImageFile(null);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white relative">
                    <div className="absolute top-4 right-4 group">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-sm font-medium"
                        >
                            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 shadow-lg">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-white/50" />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{formData.name}</h1>
                            <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {profile?.email}
                            </p>
                            {profile?.isVerified && (
                                <span className="inline-block mt-2 bg-green-400/20 text-green-100 text-xs px-2 py-1 rounded-full border border-green-400/30">
                                    Verified Patient
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <User className="w-5 h-5 text-blue-600" /> Personal Details
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        disabled={!isEditing}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            disabled={!isEditing}
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            disabled={!isEditing}
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Activity className="w-5 h-5 text-red-500" /> Medical info
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    disabled={!isEditing}
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="">Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Heart className="w-4 h-4" /> Emergency Contact
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="ec_name"
                                        placeholder="Contact Name"
                                        disabled={!isEditing}
                                        value={formData.emergencyContact.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                    <input
                                        type="text"
                                        name="ec_relationship"
                                        placeholder="Relationship"
                                        disabled={!isEditing}
                                        value={formData.emergencyContact.relationship}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                    <input
                                        type="tel"
                                        name="ec_phone"
                                        placeholder="Emergency Phone"
                                        disabled={!isEditing}
                                        value={formData.emergencyContact.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-10 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchProfile();
                                    setImageFile(null);
                                }}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
};

export default PatientProfile;
