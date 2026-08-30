import { UserProfile, UserRole } from '../types';

export interface SendOtpParams {
  email: string;
  role?: UserRole;
  name?: string;
  department?: string;
  centerLocation?: string;
  employeeId?: string;
  purpose?: 'login' | 'signup' | 'forgot-password' | 'verify';
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  email?: string;
  expiresInSeconds?: number;
  error?: string;
}

export interface VerifyOtpParams {
  email: string;
  otp: string;
  role?: UserRole;
  name?: string;
  department?: string;
  centerLocation?: string;
  employeeId?: string;
  password?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  token?: string;
  error?: string;
}

export interface ResetPasswordParams {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function requestEmailOtp(params: SendOtpParams): Promise<SendOtpResponse> {
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to request OTP:', err);
    return {
      success: false,
      message: 'Network error communicating with auth server.',
      error: err.message,
    };
  }
}

export async function verifyEmailOtp(params: VerifyOtpParams): Promise<VerifyOtpResponse> {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to verify OTP:', err);
    return {
      success: false,
      message: 'Network error verifying OTP.',
      error: err.message,
    };
  }
}

export async function resetPasswordWithOtp(params: ResetPasswordParams): Promise<ResetPasswordResponse> {
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to reset password:', err);
    return {
      success: false,
      message: 'Network error communicating with reset server.',
      error: err.message,
    };
  }
}

export async function resendEmailOtp(email: string): Promise<SendOtpResponse> {
  try {
    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to resend code.',
      error: err.message,
    };
  }
}
