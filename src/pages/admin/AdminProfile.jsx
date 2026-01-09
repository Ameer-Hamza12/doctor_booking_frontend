import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Save,
    Loader,
    Camera,
    Shield,
    Calendar
} from 'lucide-react';
import api from '../../services/api';

const AdminProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date_of_birth: '' // Using date_of_birth from authController.register/updateProfile
    });

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/me'); // Admin is a User
            const data = response.data.data;
            setProfile(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : ''
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
        setFormData(prev => ({ ...prev, [name]: value }));
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
            // 1. Update text profile using auth endpoint
            await api.put('/auth/update-profile', formData);

            // 2. Update image if changed using admin endpoint
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('profileImage', imageFile);
                await api.post('/admin/profile/image', imageFormData, {
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
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-10 text-white relative">
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
                                        <Shield className="w-12 h-12 text-white/50" />
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
                            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {profile?.email}
                            </p>
                            <div className="mt-2 text-xs bg-red-500/20 text-red-100 px-2 py-1 rounded inline-block border border-red-500/30">
                                Administrator
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <User className="w-5 h-5 text-gray-600" /> Account Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    disabled={!isEditing}
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                                <input
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
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
                                className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
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

export default AdminProfile;
