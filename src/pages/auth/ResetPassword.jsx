// frontend/src/pages/auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import MainNavbar from '../../components/navbar/MainNavbar';
import { authService } from '../../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Extract token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. No token found.');
    }
    setToken(tokenFromUrl || '');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, and number');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      setSuccess(true);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.error || 'Password reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Invalid Reset Link</h1>
              <p className="text-slate-600 mt-2">
                The password reset link is invalid or has expired.
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          {/* Back button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {success ? 'Password Reset!' : 'Set New Password'}
            </h1>
            <p className="text-slate-500 mt-2">
              {success 
                ? 'Your password has been successfully reset' 
                : 'Create a new password for your account'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Password reset successful!</p>
                  <p className="text-sm mt-1">
                    You will be redirected to login page in 3 seconds...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Footer */}
          {!success && (
            <p className="mt-8 text-center text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;