// frontend/src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, MailCheck } from 'lucide-react';
import MainNavbar from '../../components/navbar/MainNavbar';
import { authService } from '../../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setMessage('No verification token found in the URL');
          setSuccess(false);
          setLoading(false);
          return;
        }

        console.log('Verifying email with token:', token);
        const response = await authService.verifyEmail(token);
        
        setMessage(response.message || 'Email verified successfully!');
        setSuccess(true);
        
        // Auto redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        
      } catch (error) {
        console.error('Verification error:', error);
        setMessage(
          error.error || 
          error.message || 
          'Email verification failed. The link may have expired or is invalid.'
        );
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <>
      <MainNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              {loading ? (
                <Loader className="w-10 h-10 animate-spin" />
              ) : success ? (
                <MailCheck className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>
            <h1 className="text-3xl font-bold">
              {loading ? 'Verifying Email' : success ? 'Email Verified!' : 'Verification Failed'}
            </h1>
            <p className="text-blue-100 mt-2">
              {loading ? 'Please wait while we verify your email address' : 
               success ? 'Your email has been successfully verified' : 
               'We could not verify your email'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {loading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Processing verification...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {success ? (
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600" />
                  )}
                </div>
                
                <p className={`text-lg font-medium mb-2 ${
                  success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message}
                </p>
                
                {success && (
                  <p className="text-gray-500 text-sm mb-6">
                    You will be redirected to login page in 5 seconds...
                  </p>
                )}

                <div className="space-y-3 mt-8">
                  <button
                    onClick={() => navigate(success ? '/login' : '/signup')}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
                      success 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {success ? 'Go to Login' : 'Try Again'}
                  </button>
                  
                  {!success && (
                    <button
                      onClick={() => navigate('/')}
                      className="w-full py-3 px-4 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                      Back to Home
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Need help?{' '}
              <a href="mailto:support@doctorbooking.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;