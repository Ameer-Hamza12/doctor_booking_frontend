// frontend/src/pages/auth/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainNavbar from "../../components/navbar/MainNavbar";
import { UserPlus, Mail, Lock, User, Phone, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    date_of_birth: "",
    specialization: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    date_of_birth: "",
    specialization: "",
    general: ""
  });
  
  const [loading, setLoading] = useState(false);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name cannot exceed 50 characters";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone && formData.role === "patient") return "Phone is required";
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const validateDateOfBirth = (date) => {
    if (!date && formData.role === "patient") return "Date of birth is required";
    if (date) {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) return "You must be at least 18 years old";
    }
    return "";
  };

  const validateSpecialization = (specialization) => {
    if (formData.role === "doctor" && !specialization) {
      return "Specialization is required for doctors";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      date_of_birth: validateDateOfBirth(formData.date_of_birth),
      specialization: validateSpecialization(formData.specialization),
      general: ""
    };

    setErrors(newErrors);
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: "",
      email: "",
      password: "",
      phone: "",
      date_of_birth: "",
      specialization: "",
      general: ""
    });
    clearError();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData);
      alert(response.message || "Registration successful! Please check your email.");
      navigate("/login");
    } catch (err) {
      // Handle backend validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const newErrors = { ...errors };
        err.errors.forEach(error => {
          if (error.field in newErrors) {
            newErrors[error.field] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ ...errors, general: err.error || err.message || "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Join DoctorBooking</h1>
            <p className="text-slate-500 mt-2">Create your account to start booking</p>
          </div>

          {/* General Error */}
          {(errors.general || authError) && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errors.general || authError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({...errors, name: ""});
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                      errors.name ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm ml-1 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({...errors, email: ""});
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                      errors.email ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm ml-1 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({...errors, password: ""});
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                    errors.password ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm ml-1 mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Join as a *</label>
              <div className="flex gap-4">
                {["patient", "doctor"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role });
                      // Clear role-specific errors when switching
                      if (role === "doctor") {
                        setErrors({...errors, phone: "", date_of_birth: ""});
                      } else {
                        setErrors({...errors, specialization: ""});
                      }
                    }}
                    className={`flex-1 py-3 rounded-2xl font-bold capitalize transition-all ${
                      formData.role === role
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            {formData.role === "patient" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({...errors, phone: ""});
                      }}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                        errors.phone ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm ml-1 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.date_of_birth}
                      onChange={(e) => {
                        setFormData({ ...formData, date_of_birth: e.target.value });
                        if (errors.date_of_birth) setErrors({...errors, date_of_birth: ""});
                      }}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                        errors.date_of_birth ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm ml-1 mt-1">{errors.date_of_birth}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Doctor Specialization */
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Specialization *</label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => {
                    setFormData({ ...formData, specialization: e.target.value });
                    if (errors.specialization) setErrors({...errors, specialization: ""});
                  }}
                  className={`w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                    errors.specialization ? "focus:ring-red-500 border border-red-300" : "focus:ring-blue-500"
                  }`}
                  placeholder="e.g. Cardiology"
                />
                {errors.specialization && (
                  <p className="text-red-500 text-sm ml-1 mt-1">{errors.specialization}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;