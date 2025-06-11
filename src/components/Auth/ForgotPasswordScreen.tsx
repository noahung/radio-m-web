import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NeumorphicButton from '../UI/NeumorphicButton';
import LoadingSpinner from '../UI/LoadingSpinner';

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?w=800&h=1200&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-slate-900/85"></div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <div 
            className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/30 text-center max-w-sm w-full"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
            }}
          >
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-900/40 flex items-center justify-center"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            >
              <CheckCircle size={24} className="text-green-400" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-slate-400 mb-6">
              We've sent a password reset link to {email}
            </p>
            
            <NeumorphicButton
              onClick={() => navigate('/auth/login')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Back to Sign In
            </NeumorphicButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?w=800&h=1200&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-slate-900/85"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/auth/login')}
            className="p-2 rounded-2xl bg-slate-800/40 shadow-lg shadow-slate-900/30"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
            }}
          >
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
          <div className="w-10"></div>
        </header>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div 
              className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/30"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
              }}
            >
              <div className="text-center mb-6">
                <p className="text-slate-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-700/30 rounded-2xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/40 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <NeumorphicButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
                </NeumorphicButton>
              </form>

              <div className="mt-6 text-center">
                <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;