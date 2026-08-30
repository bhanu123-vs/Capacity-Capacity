import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Building2, 
  Award, 
  GraduationCap, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send,
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  requestEmailOtp, 
  verifyEmailOtp, 
  resendEmailOtp, 
  resetPasswordWithOtp 
} from '../../services/authService';

type ModalView = 'signin' | 'signup' | 'forgot-password';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    signupWithFirebase, 
    loginWithFirebase, 
    authenticateWithOtpUser,
    authLoading,
    setActiveTab
  } = useApp();

  const [currentView, setCurrentView] = useState<ModalView>('signin');
  const [role, setRole] = useState<UserRole>('Trainee');

  const [email, setEmail] = useState('bhanuvenkatanagesh@gmail.com');
  const [name, setName] = useState('Bhanu Venkata Nagesh');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [department, setDepartment] = useState('Numerical Weather Prediction (NWP) Division');
  const [centerLocation, setCenterLocation] = useState('HQ Mausam Bhavan, New Delhi');
  const [employeeId, setEmployeeId] = useState('IMD-TR-2024-8842');
  
  // Forgot Password
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState(['', '', '', '', '', '']);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Sign Up OTP states
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpCode, setSignupOtpCode] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes validity

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: any = null;
    if ((signupOtpSent || forgotOtpSent) && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [signupOtpSent, forgotOtpSent, otpTimer]);

  if (!isAuthModalOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
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

  // Sign In submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      await loginWithFirebase(email, password);
      setIsAuthModalOpen(false);
      setActiveTab('Dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Authentication error. Please check credentials or use Forgot Password.');
    }
  };

  // Sign Up: Step 1 (Send OTP)
  const handleSignUpSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.includes('@')) {
      setFormError('Please provide a valid name and email address.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await requestEmailOtp({
        email,
        role,
        name: name.trim(),
        department,
        centerLocation,
        employeeId,
        purpose: 'signup'
      });

      if (res.success) {
        setSignupOtpSent(true);
        setOtpTimer(300); // 5 minutes
        setSuccessMessage(`Verification OTP dispatched to ${email}. Valid for 5 minutes.`);
      } else {
        setFormError(res.error || res.message || 'Failed to dispatch verification code.');
      }
    } catch (err: any) {
      setFormError('Network error requesting OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Sign Up: Step 2 (Verify OTP)
  const handleSignUpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const fullOtp = signupOtpCode.join('').trim();
    if (fullOtp.length !== 6) {
      setFormError('Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyEmailOtp({
        email,
        otp: fullOtp,
        role,
        name: name.trim(),
        department,
        centerLocation,
        employeeId,
        password
      });

      if (res.success && res.user) {
        setSuccessMessage('Account verified and created successfully!');
        await authenticateWithOtpUser(res.user, res.token);
        
        try {
          await signupWithFirebase(email, password, {
            name: name.trim(),
            role,
            department,
            centerLocation,
            employeeId,
            designation: role === 'Admin' ? 'Central Director' : role === 'Trainer' ? 'Senior Faculty' : 'Trainee Meteorologist'
          });
        } catch (e) {
          // Local session user already authenticated
        }
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setActiveTab('Dashboard');
        }, 500);
      } else {
        setFormError(res.error || res.message || 'OTP is incorrect. Please check your email and try again.');
      }
    } catch (err: any) {
      setFormError('Error verifying registration OTP. Please check code and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Forgot Password: Step 1 (Send Reset OTP)
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const targetEmail = resetEmail.trim() || email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setFormError('Please enter your registered email address.');
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
        setOtpTimer(300); // 5 minutes
        setSuccessMessage(`Reset code sent to ${targetEmail}. Valid for 5 minutes.`);
      } else {
        setFormError(res.error || res.message || 'Failed to send reset code.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Forgot Password: Step 2 (Reset Password)
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const targetEmail = resetEmail.trim() || email.trim();
    const fullOtp = forgotOtpCode.join('').trim();

    if (fullOtp.length !== 6) {
      setFormError('Please enter the complete 6-digit OTP.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError('Passwords do not match.');
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
        setSuccessMessage('Password changed successfully! You can now sign in.');
        setEmail(targetEmail);
        setPassword(newPassword);
        setTimeout(() => {
          setCurrentView('signin');
          setForgotOtpSent(false);
          setForgotOtpCode(['', '', '', '', '', '']);
        }, 1200);
      } else {
        setFormError(res.error || res.message || 'OTP is incorrect. Please check your email and try again.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResend = async (targetEmail: string) => {
    if (otpTimer > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      const res = await resendEmailOtp(targetEmail);
      if (res.success) {
        setOtpTimer(300); // 5 minutes
        setSuccessMessage(`Fresh OTP sent to ${targetEmail}. Valid for 5 minutes.`);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Officer Authentication</h2>
              <p className="text-xs text-slate-500">Capacity Connect • MoES / IMD</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Switcher (Sign In vs Sign Up) */}
        {currentView !== 'forgot-password' ? (
          <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={() => { setCurrentView('signin'); setFormError(null); setSuccessMessage(null); }}
              className={`py-3 text-xs font-bold border-b-2 flex-1 text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                currentView === 'signin' ? 'border-blue-800 text-blue-800 bg-white' : 'border-transparent text-slate-500'
              }`}
            >
              <Lock size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setCurrentView('signup'); setFormError(null); setSuccessMessage(null); }}
              className={`py-3 text-xs font-bold border-b-2 flex-1 text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                currentView === 'signup' ? 'border-blue-800 text-blue-800 bg-white' : 'border-transparent text-slate-500'
              }`}
            >
              <UserIcon size={14} />
              <span>Sign Up (With OTP)</span>
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => { setCurrentView('signin'); setFormError(null); setSuccessMessage(null); setForgotOtpSent(false); }}
              className="text-xs font-bold text-slate-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </button>
            <span className="text-xs font-bold text-slate-800">Password Reset</span>
          </div>
        )}

        {/* Role Selector */}
        {currentView !== 'forgot-password' && (
          <div className="p-3.5 border-b border-slate-100 bg-white shrink-0">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Officer Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Trainee', 'Trainer', 'Admin'] as UserRole[]).map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-800 text-white border-blue-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r === 'Trainee' && <Award size={13} />}
                    {r === 'Trainer' && <GraduationCap size={13} />}
                    {r === 'Admin' && <Shield size={13} />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
          {formError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN */}
          {currentView === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@imd.gov.in"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setCurrentView('forgot-password');
                      setFormError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-semibold text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
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

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer mt-1"
              >
                Sign In as {role}
              </button>
            </form>
          )}

          {/* 2. SIGN UP WITH OTP */}
          {currentView === 'signup' && (
            <div>
              {!signupOtpSent ? (
                <form onSubmit={handleSignUpSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bhanu Venkata Nagesh"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@imd.gov.in"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ID Number</label>
                      <input
                        type="text"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send OTP to Verify Email</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUpVerify} className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600">
                      Enter 6-digit code sent to <strong>{email}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSignupOtpSent(false)}
                      className="text-[11px] text-blue-700 hover:underline cursor-pointer font-semibold"
                    >
                      Edit details
                    </button>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    {signupOtpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`modal-signup-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const newArr = [...signupOtpCode];
                          newArr[idx] = val;
                          setSignupOtpCode(newArr);
                          if (val && idx < 5) {
                            document.getElementById(`modal-signup-otp-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-11 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-white"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {otpTimer > 0 ? (
                        <>Valid for: <strong className="text-blue-800 font-mono">{formatTimer(otpTimer)}</strong></>
                      ) : (
                        <span className="text-red-600 font-semibold">OTP expired (5 mins)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleResend(email)}
                      disabled={otpTimer > 0 || isSendingOtp}
                      className="font-bold text-blue-800 hover:underline disabled:opacity-40 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || signupOtpCode.join('').length !== 6}
                    className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Verifying & Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Create Account</span>
                        <Check size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. FORGOT PASSWORD */}
          {currentView === 'forgot-password' && (
            <div>
              {!forgotOtpSent ? (
                <form onSubmit={handleForgotSendOtp} className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Enter your email to receive a password reset OTP code.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="officer@imd.gov.in"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Sending Reset Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset OTP</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-3">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600">
                      Enter OTP sent to <strong>{resetEmail}</strong>
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    {forgotOtpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`modal-forgot-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const newArr = [...forgotOtpCode];
                          newArr[idx] = val;
                          setForgotOtpCode(newArr);
                          if (val && idx < 5) {
                            document.getElementById(`modal-forgot-otp-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-11 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800 focus:bg-white"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {otpTimer > 0 ? (
                        <>Valid for: <strong className="text-blue-800 font-mono">{formatTimer(otpTimer)}</strong></>
                      ) : (
                        <span className="text-red-600 font-semibold">OTP expired (5 mins)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleResend(resetEmail)}
                      disabled={otpTimer > 0 || isSendingOtp}
                      className="font-bold text-blue-800 hover:underline disabled:opacity-40 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || forgotOtpCode.join('').length !== 6}
                    className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <Check size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
