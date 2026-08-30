import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Award, 
  Shield, 
  ChevronRight,
  Send,
  Building2,
  KeyRound,
  Check,
  ArrowLeft,
  MapPin,
  BadgeCheck,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  requestEmailOtp, 
  verifyEmailOtp, 
  resendEmailOtp, 
  resetPasswordWithOtp 
} from '../../services/authService';
import { Footer } from '../common/Footer';

type AuthView = 'signin' | 'signup' | 'forgot-password';

export const AuthGatewayPage: React.FC = () => {
  const { 
    signupWithFirebase, 
    loginWithFirebase, 
    authenticateWithOtpUser,
    authLoading, 
    setIsGuestMode,
    setRole: setAppRole,
    setActiveTab
  } = useApp();

  // Active View: 'signin' | 'signup' | 'forgot-password'
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Trainee');

  // Form Fields
  const [email, setEmail] = useState('bhanuvenkatanagesh@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [name, setName] = useState('Bhanu Venkata Nagesh');
  const [department, setDepartment] = useState('Numerical Weather Prediction (NWP) Division');
  const [centerLocation, setCenterLocation] = useState('HQ Mausam Bhavan, New Delhi');
  const [employeeId, setEmployeeId] = useState('IMD-TR-2024-8842');
  
  // Forgot Password Fields
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState(['', '', '', '', '', '']);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Sign Up OTP State
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpCode, setSignupOtpCode] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes (300 seconds)

  // Feedback State
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Countdown Timer (5 Minutes)
  useEffect(() => {
    let interval: any = null;
    if ((signupOtpSent || forgotOtpSent) && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signupOtpSent, forgotOtpSent, otpTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectRole = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setFormError(null);
    setSuccessMessage(null);

    if (newRole === 'Trainee') {
      setDepartment('Numerical Weather Prediction (NWP) Division');
      setEmployeeId('IMD-TR-2024-8842');
      setCenterLocation('HQ Mausam Bhavan, New Delhi');
    } else if (newRole === 'Trainer') {
      setDepartment('Doppler Weather Radar (DWR) Training Center');
      setEmployeeId('MOES-FAC-2020-042');
      setCenterLocation('IMD Pune');
    } else {
      setDepartment('Central Directorate & Capacity Wing');
      setEmployeeId('MOES-ADM-001');
      setCenterLocation('HQ Mausam Bhavan, New Delhi');
    }
  };

  // 1. SIGN IN SUBMIT (Email & Password)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setFormError('Please provide both your registered email and password.');
      return;
    }

    try {
      await loginWithFirebase(email, password);
      setActiveTab('Dashboard');
    } catch (err: any) {
      // In case user registered locally or via OTP, allow seamless fallback or clear message
      setFormError(err.message || 'Sign In failed. Please check your email and password, or use Forgot Password to reset.');
    }
  };

  // 2. SIGN UP: STEP 1 (Collect Essential Data & Request OTP)
  const handleSignUpRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid official email address.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please check and retype.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await requestEmailOtp({
        email,
        role: selectedRole,
        name: name.trim(),
        department,
        centerLocation,
        employeeId,
        purpose: 'signup'
      });

      if (res.success) {
        setSignupOtpSent(true);
        setOtpTimer(300); // 5 minutes validity
        setSuccessMessage(`A 6-digit verification code has been dispatched to ${email}. Valid for 5 minutes.`);
      } else {
        setFormError(res.error || res.message || 'Failed to dispatch verification code.');
      }
    } catch (err: any) {
      setFormError('Network error while requesting verification OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. SIGN UP: STEP 2 (Verify OTP & Complete Account Creation)
  const handleSignUpVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const fullOtp = signupOtpCode.join('').trim();
    if (fullOtp.length !== 6) {
      setFormError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // Verify OTP on server
      const res = await verifyEmailOtp({
        email,
        otp: fullOtp,
        role: selectedRole,
        name: name.trim(),
        department,
        centerLocation,
        employeeId,
        password
      });

      if (res.success && res.user) {
        setSuccessMessage('Email verified successfully! Accessing your portal dashboard...');
        
        // Log in the user into session immediately
        await authenticateWithOtpUser(res.user, res.token);

        // Also sync with Firebase Auth in background if possible
        try {
          await signupWithFirebase(email, password, {
            name: name.trim(),
            role: selectedRole,
            department,
            centerLocation,
            employeeId,
            designation: selectedRole === 'Admin' ? 'Central Director' : selectedRole === 'Trainer' ? 'Senior Faculty' : 'Trainee Meteorologist'
          });
        } catch (fbErr) {
          console.warn("Background Firebase Auth sync note:", fbErr);
        }
        
        setActiveTab('Dashboard');
      } else {
        setFormError(res.error || res.message || 'OTP is incorrect. Please check your email and try again.');
      }
    } catch (err: any) {
      setFormError('Error verifying registration OTP. Please check your code and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. FORGOT PASSWORD: STEP 1 (Send Reset OTP)
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const targetEmail = resetEmail.trim() || email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setFormError('Please provide your registered email address to receive the password reset code.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await requestEmailOtp({
        email: targetEmail,
        purpose: 'forgot-password'
      });

      if (res.success) {
        setForgotOtpSent(true);
        setOtpTimer(300); // 5 minutes validity
        setSuccessMessage(`Password reset OTP dispatched to ${targetEmail}. Valid for 5 minutes.`);
      } else {
        setFormError(res.error || res.message || 'Could not send reset OTP.');
      }
    } catch (err: any) {
      setFormError('Network error while requesting reset code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 3. FORGOT PASSWORD: STEP 2 (Verify OTP & Change Password)
  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const targetEmail = resetEmail.trim() || email.trim();
    const fullOtp = forgotOtpCode.join('').trim();

    if (fullOtp.length !== 6) {
      setFormError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError('New passwords do not match. Please verify.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await resetPasswordWithOtp({
        email: targetEmail,
        otp: fullOtp,
        newPassword
      });

      if (res.success) {
        setSuccessMessage('Password changed successfully! You can now sign in with your new password.');
        setEmail(targetEmail);
        setPassword(newPassword);
        setTimeout(() => {
          setCurrentView('signin');
          setForgotOtpSent(false);
          setForgotOtpCode(['', '', '', '', '', '']);
          setNewPassword('');
          setConfirmNewPassword('');
        }, 1200);
      } else {
        setFormError(res.error || res.message || 'OTP is incorrect. Please check your email and try again.');
      }
    } catch (err: any) {
      setFormError('Error resetting password. Please check your OTP and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend Helper
  const handleResendOtp = async (targetEmail: string, purpose: 'signup' | 'forgot-password') => {
    if (otpTimer > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setFormError(null);
    try {
      const res = await resendEmailOtp(targetEmail);
      if (res.success) {
        setOtpTimer(300); // 5 minutes validity
        setSuccessMessage(`A fresh verification code has been dispatched to ${targetEmail}. Valid for 5 minutes.`);
      } else {
        setFormError(res.error || res.message || 'Failed to resend code.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleGuestExplore = () => {
    setAppRole(selectedRole);
    setActiveTab('Dashboard');
    setIsGuestMode(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans">
      {/* Official Government Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  CAPACITY CONNECT
                </span>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                  MoES • IMD
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ministry of Earth Sciences, Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleGuestExplore}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore as Guest</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 flex flex-col justify-center">
        
        {/* Page Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Meteorological Training & Capacity Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Sign In with your credentials or Sign Up with essential officer details and real-time Email OTP verification.
          </p>
        </div>

        {/* Central Auth Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto w-full overflow-hidden">
          
          {/* TOP PRIMARY TABS: SIGN IN vs SIGN UP */}
          {currentView !== 'forgot-password' ? (
            <div className="flex border-b border-slate-200 bg-slate-50/70">
              <button
                type="button"
                onClick={() => { 
                  setCurrentView('signin'); 
                  setFormError(null); 
                  setSuccessMessage(null); 
                }}
                className={`py-3.5 text-xs sm:text-sm font-bold flex-1 text-center transition-colors cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
                  currentView === 'signin'
                    ? 'border-blue-800 text-blue-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock size={16} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { 
                  setCurrentView('signup'); 
                  setFormError(null); 
                  setSuccessMessage(null); 
                }}
                className={`py-3.5 text-xs sm:text-sm font-bold flex-1 text-center transition-colors cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
                  currentView === 'signup'
                    ? 'border-blue-800 text-blue-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserIcon size={16} />
                <span>Sign Up (New Officer)</span>
              </button>
            </div>
          ) : (
            <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { 
                  setCurrentView('signin'); 
                  setFormError(null); 
                  setSuccessMessage(null); 
                  setForgotOtpSent(false);
                }}
                className="text-xs font-bold text-slate-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back to Sign In</span>
              </button>
              <span className="text-xs font-bold text-slate-800">Password Recovery</span>
            </div>
          )}

          {/* Officer Role Selector (Shown during Sign In and Sign Up) */}
          {currentView !== 'forgot-password' && (
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Officer Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Trainee', 'Trainer', 'Admin'] as UserRole[]).map((r) => {
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {r === 'Trainee' && <Award size={14} />}
                      {r === 'Trainer' && <GraduationCap size={14} />}
                      {r === 'Admin' && <Shield size={14} />}
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-6 space-y-4">
            
            {/* Feedback Alerts */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. SIGN IN FLOW (Enter Email & Password)                   */}
            {/* ========================================================= */}
            {currentView === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@imd.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setCurrentView('forgot-password');
                        setFormError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs font-semibold text-blue-800 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {selectedRole}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Don’t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('signup');
                        setFormError(null);
                        setSuccessMessage(null);
                      }}
                      className="font-bold text-blue-800 hover:underline cursor-pointer"
                    >
                      Sign Up with Email OTP
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* 2. SIGN UP FLOW (Essential Data + Email OTP Verification) */}
            {/* ========================================================= */}
            {currentView === 'signup' && (
              <div>
                {!signupOtpSent ? (
                  /* Step 1: Input Essential User Details */
                  <form onSubmit={handleSignUpRequestOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name & Title
                      </label>
                      <div className="relative">
                        <UserIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Bhanu Venkata Nagesh"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Email Address (OTP will be sent here)
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="officer@imd.gov.in or your.email@gmail.com"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password (min 6 chars)
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 pr-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 pr-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Department / Division
                        </label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Numerical Weather Prediction"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cadet / Employee ID
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          placeholder="IMD-TR-2024-001"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Station / Center Location
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={centerLocation}
                          onChange={(e) => setCenterLocation(e.target.value)}
                          placeholder="HQ Mausam Bhavan, New Delhi"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Dispatching Verification OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send OTP for Email Verification</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter Email Verification OTP */
                  <form onSubmit={handleSignUpVerifyOtp} className="space-y-4">
                    <div className="text-center space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-700">
                        A 6-digit OTP code was sent to <strong className="text-slate-900">{email}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => { setSignupOtpSent(false); setSignupOtpCode(['', '', '', '', '', '']); }}
                        className="text-[11px] text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        Edit Details / Email
                      </button>
                    </div>

                    <div className="flex justify-center items-center gap-2 my-4">
                      {signupOtpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`signup-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(-1);
                            const newArr = [...signupOtpCode];
                            newArr[idx] = val;
                            setSignupOtpCode(newArr);
                            if (val && idx < 5) {
                              document.getElementById(`signup-otp-${idx + 1}`)?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !signupOtpCode[idx] && idx > 0) {
                              document.getElementById(`signup-otp-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-11 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-white focus:ring-1 focus:ring-blue-800 text-slate-900"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        {otpTimer > 0 ? (
                          <>OTP valid for: <strong className="text-blue-800 font-mono">{formatTimer(otpTimer)}</strong></>
                        ) : (
                          <span className="text-red-600 font-semibold">OTP expired (5 mins passed)</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResendOtp(email, 'signup')}
                        disabled={otpTimer > 0 || isSendingOtp}
                        className="font-bold text-blue-800 hover:underline disabled:opacity-40 cursor-pointer"
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || signupOtpCode.join('').length !== 6}
                      className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Verifying & Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Email & Complete Registration</span>
                          <Check size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. FORGOT PASSWORD FLOW (OTP & New Password Reset)        */}
            {/* ========================================================= */}
            {currentView === 'forgot-password' && (
              <div>
                {!forgotOtpSent ? (
                  /* Step 1: Request Reset OTP */
                  <form onSubmit={handleForgotSendOtp} className="space-y-4">
                    <p className="text-xs text-slate-600">
                      Enter your registered email address. We will send a 6-digit OTP code to verify your identity and let you set a new password.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="officer@imd.gov.in"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Sending Reset Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Password Reset OTP</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter OTP + New Password */
                  <form onSubmit={handleForgotResetPassword} className="space-y-4">
                    <div className="text-center space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-700">
                        Enter reset OTP sent to <strong className="text-slate-900">{resetEmail}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => { setForgotOtpSent(false); setForgotOtpCode(['', '', '', '', '', '']); }}
                        className="text-[11px] text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        Change Email Address
                      </button>
                    </div>

                    {/* 6 OTP Boxes */}
                    <div className="flex justify-center items-center gap-2 my-3">
                      {forgotOtpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`forgot-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(-1);
                            const newArr = [...forgotOtpCode];
                            newArr[idx] = val;
                            setForgotOtpCode(newArr);
                            if (val && idx < 5) {
                              document.getElementById(`forgot-otp-${idx + 1}`)?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !forgotOtpCode[idx] && idx > 0) {
                              document.getElementById(`forgot-otp-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-11 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-white text-slate-900"
                        />
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        New Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 pr-9 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        {otpTimer > 0 ? (
                          <>OTP valid for: <strong className="text-blue-800 font-mono">{formatTimer(otpTimer)}</strong></>
                        ) : (
                          <span className="text-red-600 font-semibold">OTP expired (5 mins passed)</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResendOtp(resetEmail, 'forgot-password')}
                        disabled={otpTimer > 0 || isSendingOtp}
                        className="font-bold text-blue-800 hover:underline disabled:opacity-40 cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || forgotOtpCode.join('').length !== 6}
                      className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Save New Password</span>
                          <Check size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Bottom Help / Guest Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Official Training & Evaluation Hub</span>
            <button
              type="button"
              onClick={handleGuestExplore}
              className="font-bold text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore as {selectedRole}</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </main>

      {/* Human Institutional Footer */}
      <Footer />
    </div>
  );
};
