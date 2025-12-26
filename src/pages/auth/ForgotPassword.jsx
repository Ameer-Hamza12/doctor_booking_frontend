// frontend/src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import MainNavbar from '../../components/navbar/MainNavbar';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.error || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNavbar />
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
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
            <p className="text-slate-500 mt-2">
              {success 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reset email sent!</p>
                  <p className="text-sm mt-1">
                    If an account exists with {email}, you will receive password reset instructions.
                    Check your spam folder if you don't see it.
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
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Return to Login
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="w-full border border-blue-600 text-blue-600 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition"
              >
                Reset Another Email
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="mt-8 text-center text-slate-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;