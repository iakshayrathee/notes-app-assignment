import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import Button from '../components/Button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { api, ApiError } from '../utils/api';
import { authUtils } from '../utils/auth';
import { validateEmail, validateName, validateDateOfBirth } from '../utils/validation';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    otp: ''
  });
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'form') {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;
      
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
      
      const dobError = validateDateOfBirth(formData.dateOfBirth);
      if (dobError) newErrors.dateOfBirth = dobError;
    } else if (step === 'otp') {
      if (!formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (formData.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      if (step === 'form') {
        const response = await api.signup({ 
          name: formData.name, 
          email: formData.email, 
          dateOfBirth: formData.dateOfBirth 
        });
        setUserId(response.userId);
        setStep('otp');
        toast.success('OTP sent to your email!');
      } else if (step === 'otp') {
        const response = await api.verifyOTP({ userId, otp: formData.otp });
        authUtils.setToken(response.token);
        authUtils.setUser(response.user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
        toast.error(error.message);
      } else {
        setApiError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (token: string) => {
    setLoading(true);
    setApiError('');
    
    try {
      const response = await api.googleAuth(token);
      authUtils.setToken(response.token);
      authUtils.setUser(response.user);
      toast.success('Google sign-up successful!');
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
        toast.error(error.message);
      } else {
        setApiError('Google sign-up failed');
        toast.error('Google sign-up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setApiError(error);
    toast.error(error);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Logo - Top Left on Desktop Only */}
      <div className="absolute top-4 left-4 z-10 hidden lg:block">
        <Logo />
      </div>
      
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile Logo and Header - Centered */}
          <div className="mb-6 text-center lg:text-left mt-16 lg:mt-0">
            <div className="flex justify-center lg:hidden mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-600">Create your account to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {step === 'form' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jonas Khanwald"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange('dateOfBirth')}
                      className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="jonas_kahnwald@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="w-full px-3 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    readOnly
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      readOnly
                      className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleInputChange('otp')}
                      maxLength={6}
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>
              </>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Loading...' : step === 'form' ? 'Get OTP' : 'Sign up'}
            </button>

            {step === 'form' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  disabled={loading}
                />
              </>
            )}
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-gray-500">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-blue-500 font-medium hover:text-blue-600"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img 
          src="/images/right-column.png" 
          alt="Abstract blue design" 
          className="w-full h-[99.5vh]  rounded-xl"
        />
      </div>
    </div>
  );
};

export default SignUp;
