'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeClosed, Mail, Smartphone } from 'lucide-react';

const AuthForm = ({ type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signInMethod, setSignInMethod] = useState('email'); // 'phone', 'email', or 'google'
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign-up specific states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // OTP states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  
  // Account setup states
  const [gender, setGender] = useState('');
  const [preference, setPreference] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [accountSetupComplete, setAccountSetupComplete] = useState(false);
  
  // Forgot password states
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email', 'reset', 'success'
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Add your sign-in logic here
      console.log('Sign in attempt:', { 
        method: signInMethod,
        phoneNumber,
        email,
        password 
      });
      
      // Show OTP modal after successful sign-up
      if (type === 'sign-up') {
        setShowOtpModal(true);
      }
    } catch (error) {
      setErrorMessage("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = () => {
    const otpCode = otpValues.join('');
    console.log('OTP submitted:', otpCode);
    // Add OTP verification logic here
  };

  const handleResendOtp = () => {
    console.log('Resending OTP...');
    setOtpTimer(59);
    setCanResend(false);
    // Add resend OTP logic here
  };

  // Timer effect for OTP
  useEffect(() => {
    if (showOtpModal && otpTimer > 0) {
      const timer = setTimeout(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
  }, [showOtpModal, otpTimer]);

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Add Google OAuth logic here
  };

  // Only render sign-in form for now
  if (type !== 'sign-in' && type !== 'sign-up' && type !== 'account-setup' && type !== 'forgot-password') {
    return <div>Form type "{type}" coming soon...</div>;
  }

  // Forgot Password flow
  if (type === 'forgot-password') {
    // Success screen
    if (forgotPasswordStep === 'success') {
      return (
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Successful</h1>
            <p className="text-gray-600">
              Password reset successful. Please continue to login.
            </p>
          </div>
          
          <button
            onClick={() => console.log('Navigate to login')}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            Login
          </button>
        </div>
      );
    }

    // Reset password screen
    if (forgotPasswordStep === 'reset') {
      return (
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-8">
            Please enter the new password for your account for<br />
            <span className="font-medium">{resetEmail}</span>
          </p>
          
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pr-10 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showNewPassword ? <EyeClosed /> : <Eye />}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="block w-full pr-10 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showConfirmNewPassword ? <EyeClosed /> : <Eye />}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              onClick={() => {
                if (newPassword !== confirmNewPassword) {
                  setErrorMessage("Passwords don't match");
                  return;
                }
                console.log('Resetting password...');
                setForgotPasswordStep('success');
              }}
              disabled={!newPassword || !confirmNewPassword || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'RESET'}
            </button>
          </div>
        </div>
      );
    }

    // Email input screen (default)
    return (
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgotten Password</h1>
        <p className="text-gray-600 mb-8">
          Please enter the email of your account<br />
          we'll send a reset password link.
        </p>
        
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={() => {
              console.log('Sending reset link to:', resetEmail);
              // In real app, this would trigger OTP verification
              // For now, we'll go directly to reset password
              setForgotPasswordStep('reset');
            }}
            disabled={!resetEmail || isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'CONTINUE'}
          </button>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <a href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Account Setup form
  if (type === 'account-setup') {
    // Show success screen if setup is complete
    if (accountSetupComplete) {
      return (
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created Successfully</h1>
            <p className="text-gray-600">
              Your account has been successfully created.<br />
              Welcome onboard to Klekky.
            </p>
          </div>
          
          <button
            onClick={() => console.log('Navigate to login')}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            Login
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Set Up</h1>
        <p className="text-gray-600 mb-8">
          Provide additional info required before you can access our platform
        </p>
        
        <div className="space-y-6">
          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              1. Gender
            </label>
            <p className="text-sm text-gray-500 mb-3">Select your gender from the options below</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  gender === 'male'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">👨</span>
                <span className="text-sm font-medium">Male</span>
              </button>
              <button
                onClick={() => setGender('female')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  gender === 'female'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">👩</span>
                <span className="text-sm font-medium">Female</span>
              </button>
            </div>
          </div>

          {/* Preference Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              2. Preference
            </label>
            <p className="text-sm text-gray-500 mb-3">What kind of accounts are you looking for?</p>
            <div className="space-y-3">
              <button
                onClick={() => setPreference('business')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  preference === 'business'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  <div>
                    <p className="font-medium">Business Account</p>
                    <p className="text-sm text-gray-500">For business use and teams</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPreference('personal')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  preference === 'personal'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <p className="font-medium">Personal Account</p>
                    <p className="text-sm text-gray-500">For individual use</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3. Referral Code (Optional)
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter referral code if you have one"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              console.log('Account setup:', { gender, preference, referralCode });
              setAccountSetupComplete(true);
            }}
            disabled={!gender || !preference || isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Submit'}
          </button>
        </div>
      </div>
    );
  }

  // Sign-up form
  if (type === 'sign-up') {
    return (
      <div className="max-w-md max-h-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
        <p className="text-gray-600 mb-6">Create an account to unlock amazing features</p>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Choose a username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Choose country</option>
              <option value="NG">Nigeria</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Choose state"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter city"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pr-10 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Create password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeClosed /> : <Eye />}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pr-10 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeClosed /> : <Eye />}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree that i've read the{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-700">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-700">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !agreeToTerms}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'REGISTER'}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-purple-600 hover:text-purple-700 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Sign-in form (existing code)

  return (
    <div className="w-full max-h-full p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back</h1>
      
      {/* Tab Selector */}
      <div className="flex bg-gray-100 rounded-sm p-0.5 mb-6">
        <button
          onClick={() => setSignInMethod('email')}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-sm text-sm font-medium transition-all ${
            signInMethod === 'email'
              ? 'bg-white text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail size={16} className="mr-1.5" />
        </button>
        <button
          onClick={() => setSignInMethod('phone')}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-sm text-sm font-medium transition-all ${
            signInMethod === 'phone'
              ? 'bg-white text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Smartphone size={16} className="mr-1.5" />
        </button>
        <button
          onClick={() => setSignInMethod('google')}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-sm text-sm font-medium transition-all ${
            signInMethod === 'google'
              ? 'bg-white text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>
      </div>

      {/* Conditional Form Content */}
      {signInMethod === 'google' ? (
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or sign in with email/phone</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Phone Number or Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {signInMethod === 'phone' ? 'Phone Number' : 'Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">
                  {signInMethod === 'phone' }
                </span>
              </div>
              {signInMethod === 'phone' ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter phone number"
                  required
                />
              ) : (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter email address"
                  required
                />
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeClosed /> : <Eye/>}
                </span>
              </button>
            </div>
            
            {/* Forgot Password Link */}
            <div className="mt-2 text-right">
              <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Log in'}
          </button>
        </div>
      )}

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium">
          Register
        </a>
      </p>

      {/* OTP Modal - Full Page */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <div className="w-full max-w-md px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600 mb-8">
              We've sent an OTP to your email{' '}
              <span className="font-medium">{email || 'your email'}</span>
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-3 mb-8">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-lg font-semibold bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  maxLength={1}
                  pattern="[0-9]"
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
            )}

            {/* Verify Button */}
            <button
              onClick={handleOtpSubmit}
              disabled={otpValues.some(v => !v) || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Verifying...' : 'Verify Code (00:' + String(otpTimer).padStart(2, '0') + ')'}
            </button>

            {/* Resend Link */}
            <p className="text-center text-sm text-gray-600">
              Didn't get the OTP?{' '}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-400">Resend in {otpTimer}s</span>
              )}
            </p>

            {/* Back Link */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to {type === 'sign-up' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;