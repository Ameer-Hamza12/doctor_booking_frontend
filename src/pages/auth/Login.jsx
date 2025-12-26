// frontend/src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainNavbar from "../../components/navbar/MainNavbar";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await login({ email, password });
      
      if (!response.data.user.isVerified) {
        setErrors({ ...errors, general: "Please verify your email before logging in" });
        return;
      }

      if (response.data.user.role === 'doctor' && !response.data.user.isApproved) {
        setErrors({ ...errors, general: "Your doctor account is pending admin approval" });
        return;
      }

      const role = response.data.user.role;
      switch (role) {
        case 'admin': navigate('/admin/dashboard'); break;
        case 'doctor': navigate('/doctor/dashboard'); break;
        case 'patient': navigate('/patient/dashboard'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ ...errors, general: err.error || err.message || "Something went wrong" });
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
          className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to manage your appointments</p>
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
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ""});
                  }}
                  placeholder="yours@example.com"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                    errors.email 
                      ? "focus:ring-red-500 border border-red-300" 
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm ml-1 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: ""});
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 transition-all font-medium ${
                    errors.password 
                      ? "focus:ring-red-500 border border-red-300" 
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm ml-1 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-600 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;