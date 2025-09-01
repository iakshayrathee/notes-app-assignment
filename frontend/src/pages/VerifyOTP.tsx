import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, ApiError } from '../utils/api';
import { authUtils } from '../utils/auth';
import { validateOTP } from '../utils/validation';

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/signup');
    }
  }, [userId, email, navigate]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpError = validateOTP(otp);
    if (otpError) {
      setError(otpError);
      return;
    }
    
    setLoading(true);
    setApiError('');
    
    try {
      const response = await api.verifyOTP({ userId, otp });
      authUtils.setToken(response.token);
      authUtils.setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo className="mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h2>
            <p className="text-gray-600">Sign up to enjoy the feature of HD</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </div>

              <Input
                placeholder="Enter your name"
                value="Jonas Khanwald"
                onChange={() => {}}
                disabled
              />

              <Input
                placeholder="11 December 1997"
                value="11 December 1997"
                onChange={() => {}}
                disabled
              />

              <Input
                placeholder="jonas_kahnwald@gmail.com"
                value={email}
                onChange={() => {}}
                disabled
              />

              <div className="relative">
                <Input
                  placeholder="OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  error={error}
                  maxLength={6}
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={loading || otp.length !== 6}
            >
              Sign up
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Blue gradient background */}
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
