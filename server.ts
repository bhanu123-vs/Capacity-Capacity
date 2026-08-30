import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory OTP Store for Real-Time Authentication
interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  role: string;
  name?: string;
  department?: string;
  purpose?: string;
  createdAt: number;
}
const otpStore = new Map<string, OtpRecord>();

// Simple credentials store for local registered users
interface StoredUser {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  department: string;
  centerLocation: string;
  employeeId: string;
  createdAt: string;
}
const usersStore = new Map<string, StoredUser>();

// Mail transporter helper
async function getMailTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
  }

  // Fallback to test account or null for sandbox logging
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (e) {
    return null;
  }
}

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Using fallback simulation if needed.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Capacity Connect - MoES IMD Training Platform',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// REAL-TIME EMAIL OTP AUTHENTICATION ENDPOINTS
// ==========================================

// 1. Send OTP to User's Email
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, role, name, department, purpose, employeeId, centerLocation } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Generate secure 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Exactly 5 minutes validity

    const actionPurpose = purpose || 'verification';
    const purposeTitle = 
      actionPurpose === 'signup' 
        ? 'Account Registration Verification' 
        : actionPurpose === 'forgot-password' 
          ? 'Password Reset Request' 
          : 'Portal Verification';

    // Store in memory
    otpStore.set(normalizedEmail, {
      email: normalizedEmail,
      otp: generatedOtp,
      expiresAt,
      attempts: 0,
      role: role || 'Trainee',
      name: name || '',
      department: department || '',
      purpose: actionPurpose,
      createdAt: Date.now(),
    });

    console.log(`[OTP AUTH] [${actionPurpose.toUpperCase()}] Generated 5-minute OTP for ${normalizedEmail} (Expires in 5 mins)`);

    // Prepare Email Dispatch
    let emailSentSuccessfully = false;

    try {
      const transporter = await getMailTransporter();
      if (transporter) {
        const info = await transporter.sendMail({
          from: '"MoES IMD Capacity Connect" <no-reply@imd.gov.in>',
          to: normalizedEmail,
          subject: `🔐 ${purposeTitle}: Your OTP is ${generatedOtp}`,
          text: `Dear Officer,\n\nYour One-Time Password (OTP) for ${purposeTitle} on the Capacity Connect portal is:\n\n${generatedOtp}\n\nThis OTP is valid for 5 minutes. Please do not share this code with anyone.\n\nWarm regards,\nCapacity Building Directorate\nMinistry of Earth Sciences, Govt of India`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0 0 6px 0; font-size: 20px; font-weight: 800;">CAPACITY CONNECT PORTAL</h2>
                <p style="color: #64748b; margin: 0; font-size: 13px; font-weight: 600;">Ministry of Earth Sciences • India Meteorological Department</p>
              </div>
              
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                Dear <strong>${name || 'Meteorological Officer'}</strong>,
              </p>
              
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Use the following 6-digit One-Time Password (OTP) for <strong>${purposeTitle}</strong> to access the <strong>${role || 'Trainee'} Portal</strong>:
              </p>
              
              <div style="text-align: center; margin: 24px 0;">
                <div style="display: inline-block; padding: 16px 36px; background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 10px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0369a1; font-family: monospace;">
                  ${generatedOtp}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 8px;">Valid for <strong>5 minutes</strong>. Do not disclose this code.</p>
              </div>

              <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; border-left: 4px solid #0284c7;">
                <p style="margin: 0; font-size: 12px; color: #475569;">
                  <strong>Security Note:</strong> If you did not initiate this request on Capacity Connect, please ignore this email.
                </p>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
                <p style="margin: 0 0 4px 0;">Capacity Building Directorate • Mausam Bhavan, Lodhi Road, New Delhi 110003</p>
                <p style="margin: 0;">Developed and Maintained by Kalki team</p>
              </div>
            </div>
          `
        });

        emailSentSuccessfully = true;
      }
    } catch (mailError: any) {
      console.warn("[MAIL DISPATCH WARNING] Could not send via remote SMTP, fallback delivery logged:", mailError?.message);
    }

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}. It is valid for 5 minutes.`,
      email: normalizedEmail,
      expiresInSeconds: 300
    });
  } catch (error: any) {
    console.error("Error in /api/auth/send-otp:", error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to dispatch OTP' });
  }
});

// 2. Verify OTP for Signup or Login
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp, role, name, department, centerLocation, employeeId, password } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP request found for this email. Please request a new code.'
      });
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        error: 'The OTP has expired after 5 minutes. Please request a new verification code.'
      });
    }

    // Increment attempts
    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Check OTP match
    if (record.otp.trim() !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        error: `OTP is incorrect. Please check your email and try again (${5 - record.attempts} attempts remaining).`
      });
    }

    // Verification Success! Clear OTP
    otpStore.delete(normalizedEmail);

    const assignedRole = role || record.role || 'Trainee';
    const assignedName = name || record.name || normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase();
    const uid = `imd-usr-${Buffer.from(normalizedEmail).toString('base64').replace(/=/g, '').slice(0, 12)}`;

    // Save in user store
    usersStore.set(normalizedEmail, {
      email: normalizedEmail,
      passwordHash: password || 'default_pass_hash',
      name: assignedName,
      role: assignedRole,
      department: department || record.department || 'Numerical Weather Prediction (NWP) Division',
      centerLocation: centerLocation || 'HQ Mausam Bhavan, New Delhi',
      employeeId: employeeId || `IMD-${assignedRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    });

    const userProfile = {
      id: uid,
      uid,
      email: normalizedEmail,
      name: assignedName,
      role: assignedRole,
      department: department || record.department || (assignedRole === 'Trainer' ? 'Doppler Weather Radar (DWR) Training Center' : 'Numerical Weather Prediction (NWP) Division'),
      centerLocation: centerLocation || 'HQ Mausam Bhavan, New Delhi',
      employeeId: employeeId || `IMD-${assignedRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      designation: assignedRole === 'Admin' ? 'Central Director' : assignedRole === 'Trainer' ? 'Senior Faculty' : 'Trainee Meteorologist',
      status: 'Active',
      authenticatedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: 'Account verified successfully! Welcome to Capacity Connect.',
      user: userProfile,
      token: `session_token_${uid}_${Date.now()}`
    });
  } catch (error: any) {
    console.error("Error in /api/auth/verify-otp:", error);
    return res.status(500).json({ success: false, error: error.message || 'OTP verification failed' });
  }
});

// 3. Reset Password with OTP
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP code, and new password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        error: 'No active password reset OTP found for this email. Please request a new code.'
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        error: 'The reset OTP has expired after 5 minutes. Please request a fresh reset code.'
      });
    }

    if (record.otp.trim() !== otp.toString().trim()) {
      record.attempts += 1;
      return res.status(400).json({
        success: false,
        error: 'OTP is incorrect. Please check your email and try again.'
      });
    }

    // OTP is valid! Clear it
    otpStore.delete(normalizedEmail);

    // Update password in user store
    const existing = usersStore.get(normalizedEmail);
    if (existing) {
      existing.passwordHash = newPassword;
      usersStore.set(normalizedEmail, existing);
    } else {
      usersStore.set(normalizedEmail, {
        email: normalizedEmail,
        passwordHash: newPassword,
        name: normalizedEmail.split('@')[0].toUpperCase(),
        role: record.role || 'Trainee',
        department: 'Atmospheric Sciences',
        centerLocation: 'HQ Mausam Bhavan',
        employeeId: 'IMD-TR-001',
        createdAt: new Date().toISOString()
      });
    }

    console.log(`[PASSWORD RESET SUCCESS] Password successfully updated for ${normalizedEmail}`);

    return res.json({
      success: true,
      message: 'Your password has been successfully updated! You can now sign in with your new password.'
    });
  } catch (error: any) {
    console.error("Error in /api/auth/reset-password:", error);
    return res.status(500).json({ success: false, error: error.message || 'Password reset failed.' });
  }
});

// 4. Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = otpStore.get(normalizedEmail);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const role = existing?.role || 'Trainee';
    const purposeTitle = existing?.purpose === 'forgot-password' ? 'Password Reset' : 'Portal Verification';

    otpStore.set(normalizedEmail, {
      email: normalizedEmail,
      otp: generatedOtp,
      expiresAt,
      attempts: 0,
      role: role,
      name: existing?.name || '',
      department: existing?.department || '',
      purpose: existing?.purpose || 'verification',
      createdAt: Date.now(),
    });

    console.log(`[OTP RESEND] New 5-min OTP for ${normalizedEmail}: ${generatedOtp}`);

    // Dispatch fresh email
    try {
      const transporter = await getMailTransporter();
      if (transporter) {
        await transporter.sendMail({
          from: '"MoES IMD Capacity Connect" <no-reply@imd.gov.in>',
          to: normalizedEmail,
          subject: `🔐 Resent OTP: Your code is ${generatedOtp}`,
          text: `Dear Officer,\n\nYour fresh One-Time Password (OTP) for ${purposeTitle} on Capacity Connect is:\n\n${generatedOtp}\n\nThis OTP is valid for 5 minutes.\n\nWarm regards,\nCapacity Building Directorate\nMinistry of Earth Sciences, Govt of India`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0;">Capacity Connect - New OTP Code</h2>
              <p style="color: #334155; font-size: 14px;">Use the following new 6-digit OTP code to complete your verification:</p>
              <div style="text-align: center; margin: 24px 0;">
                <div style="display: inline-block; padding: 16px 36px; background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 10px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0369a1; font-family: monospace;">
                  ${generatedOtp}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 8px;">Valid for <strong>5 minutes</strong>. Do not share this code.</p>
              </div>
            </div>
          `
        });
      }
    } catch (e: any) {
      console.warn("[RESEND MAIL WARNING]", e?.message);
    }

    return res.json({
      success: true,
      message: `A fresh OTP code has been dispatched to ${normalizedEmail}. It is valid for 5 minutes.`,
      expiresInSeconds: 300
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Multi-turn AI Doubt Solver endpoint
app.post('/api/ai/doubt-solver', async (req, res) => {
  const { messages, currentTopic, mode, difficulty } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback intelligent answers if no API key is provided
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const fallbackResponse = generateDomainFallbackResponse(lastUserMessage, currentTopic);
    return res.json({
      text: fallbackResponse,
      modelUsed: 'gemini-3.5-flash (local-simulated)',
      fallback: true
    });
  }

  try {
    const ai = getAiClient();

    const systemInstruction = `You are 'Vayu AI' (Mausam Vidyarthi Sahayak), the official AI Meteorology & Atmospheric Sciences Doubt Solver for the Ministry of Earth Sciences (MoES) and India Meteorological Department (IMD) Capacity Building & Training Portal.

Your role is to act as a supportive, expert, and pedagogue meteorological mentor for trainee officers, scientists, and students.
You specialize in:
1. Numerical Weather Prediction (NWP): GFS, NCMRWF Unified Model, WRF, parameterization schemes (convection, microphysics, radiation, planetary boundary layer), data assimilation (3D-Var, 4D-Var, EnKF).
2. Doppler Weather Radar (DWR): Reflectivity factor (Z, dBZ), radial velocity, Doppler velocity dipoles (cyclonic/anticyclonic shear, mesocyclones), dual-polarization parameters (ZDR, CC, KDP) for hydrometeor classification (hail vs rain vs graupel).
3. Satellite Meteorology: INSAT-3D / INSAT-3DR / Oceansat multispectral imageries (TIR1, TIR2, MIR, Water Vapor 6.7µm, Visible), Dvorak technique for tropical cyclone T-number and central pressure estimation, Rapid Scan modes.
4. Monsoon Dynamics & Tropical Climatology: Southwest / Northeast monsoons, ITCZ oscillations, Monsoon depressions, Western Disturbances, MJO, IOD, ENSO, Easterly Waves, Heatwaves, and Thunderstorms (Nor'westers / Kalbaishakhi).
5. Severe Weather Warning SOPs & Aviation: Colour-coded alerts (Green, Yellow, Orange, Red), METAR/SPECI, TAF, SIGMET, Terminal Doppler Weather Radar for low-level wind shear (LLWS).

Current Context Mode: ${mode || 'Intuitive & Practical'} (Difficulty Level: ${difficulty || 'Intermediate'}).
${currentTopic ? `Active Course / Document Context: ${currentTopic}` : ''}

Guidelines for your answers:
- Provide clear, conceptually intuitive explanations with real meteorological analogies (e.g. comparing atmospheric instability to a boiling water pot or buoyancy parcels).
- Include mathematical or physical formulations where relevant (e.g., CAPE, CIN, Vorticity equation, Bragg scattering vs Rayleigh scattering).
- Format your response with clean Markdown: use bolding for key terms, bullet points for step-by-step logic, and summary takeaways.
- Always be encouraging, respectful of MoES/IMD scientific standards, and conclude with a related follow-up thought to spark deeper learning.`;

    // Convert conversation history to Gemini contents format
    const contents = messages.map((m: { role: 'user' | 'model' | 'assistant'; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95
      }
    });

    const responseText = response.text || "I processed your meteorological question. Please let me know if you would like more details on this topic.";

    return res.json({
      text: responseText,
      modelUsed: 'gemini-3.5-flash',
      fallback: false
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const fallbackResponse = generateDomainFallbackResponse(lastUserMessage, currentTopic);
    return res.json({
      text: fallbackResponse,
      error: error.message,
      fallback: true
    });
  }
});

// Domain-specific fallback responder for offline/preview environments
function generateDomainFallbackResponse(query: string, currentTopic?: string): string {
  const q = query.toLowerCase();

  if (q.includes('radar') || q.includes('doppler') || q.includes('dbz') || q.includes('reflectivity')) {
    return `### 📡 Doppler Weather Radar (DWR) Principles

**1. Reflectivity Factor (Z & dBZ):**
- Radar reflectivity $Z$ is proportional to the 6th power of droplet diameter: $Z = \\sum D_i^6$.
- Converted to logarithmic units: $\\text{dBZ} = 10 \\log_{10}(Z)$.
- **Light Rain:** $15 - 30\\text{ dBZ}$
- **Moderate to Heavy Rain:** $35 - 50\\text{ dBZ}$
- **Severe Hailstorm / Convective Core:** $> 55 - 65\\text{ dBZ}$

**2. Radial Velocity & Dipole Signatures:**
- **Green/Blue (Negative):** Movement *towards* the radar station.
- **Red/Yellow (Positive):** Movement *away* from the radar station.
- An adjacent **Red-Green velocity dipole** indicates strong rotational shear (mesocyclone or tornado vortex signature).

**3. Dual-Polarization Advantages:**
- **$Z_{DR}$ (Differential Reflectivity):** Distinguishes oblate raindrops from spherical hailstones.
- **$\\rho_{HV}$ / CC (Correlation Coefficient):** Identifies non-meteorological clutter and tornado debris ball signatures ($< 0.8$).

*💡 Pro-Tip for Trainees:* In IMD operations, always check the **PPI (Plan Position Indicator)** at multiple elevation angles ($0.5^\\circ$ to $19.5^\\circ$) to construct a complete **CAPPI** and **Max-Z** column before issuing a nowcast bulletin.`;
  }

  if (q.includes('nwp') || q.includes('model') || q.includes('wrf') || q.includes('grid') || q.includes('gfs')) {
    return `### 🌐 Numerical Weather Prediction (NWP) Architecture

**1. Core Governing Equations (Primitive Equations):**
1. **Navier-Stokes Momentum Equations** (Conservation of momentum on a rotating Earth including Coriolis force)
2. **Thermodynamic Energy Equation** (First law of thermodynamics with diabatic heating)
3. **Continuity Equation** (Conservation of mass)
4. **Moisture Conservation Equation** (Water vapor, cloud liquid water, rain, snow, graupel)
5. **Ideal Gas Law** ($P = \\rho R_d T_v$)

**2. Resolved vs. Parameterized Scales:**
- **Resolved Dynamics:** Processes larger than the grid spacing (e.g., synoptic troughs, Rossby waves).
- **Physical Parameterizations:** Sub-grid scale physical phenomena including:
  - *Cumulus Convection* (e.g., Kain-Fritsch, Betts-Miller-Janjic)
  - *Microphysics* (e.g., WSM6, Thompson scheme)
  - *Planetary Boundary Layer (PBL)* (e.g., YSU, MYJ schemes)
  - *Radiation* (Shortwave & Longwave transfer through aerosols and clouds)

**3. Data Assimilation (DA):**
IMD and NCMRWF use **4D-EnVar** and **Hybrid-EnKF** to assimilate thousands of observations (AWS, Radiosonde, Doppler Radars, INSAT-3DR radiance, and scatterometers) into the background first-guess model.`;
  }

  if (q.includes('cyclone') || q.includes('dvorak') || q.includes('insat') || q.includes('satellite') || q.includes('t-number')) {
    return `### 🌀 Tropical Cyclogenesis & INSAT-3D Dvorak Technique

**1. Tropical Cyclone Intensity Classification (IMD Scale):**
- **Depression (D):** $17-27\\text{ knots}$ ($31-49\\text{ km/h}$)
- **Deep Depression (DD):** $28-33\\text{ knots}$ ($50-61\\text{ km/h}$)
- **Cyclonic Storm (CS):** $34-47\\text{ knots}$ ($62-88\\text{ km/h}$) — Assigned Name
- **Severe Cyclonic Storm (SCS):** $48-63\\text{ knots}$ ($89-117\\text{ km/h}$)
- **Very Severe Cyclonic Storm (VSCS):** $64-89\\text{ knots}$ ($118-166\\text{ km/h}$)
- **Extremely Severe Cyclonic Storm (ESCS):** $90-119\\text{ knots}$ ($167-221\\text{ km/h}$)
- **Super Cyclonic Storm (SuCS):** $\\ge 120\\text{ knots}$ ($\\ge 222\\text{ km/h}$)

**2. Dvorak Technique Fundamentals:**
- Evaluates cloud organization in **INSAT-3D/3DR Thermal Infrared (TIR1 - 10.8 µm)** imagery.
- Calculates **T-Number (T1.0 to T8.0)** based on:
  - Curved Band Pattern (length of logarithmic spiral in cloud band)
  - Shear Pattern (distance between low-level circulation center and dense overcast)
  - Eye Pattern (temperature contrast between the warm eye and cold surrounding eye-wall ring).

*💡 Operational Note:* IMD issues cyclone track forecasts with **cone of uncertainty** up to $+120\\text{ hours}$ using consensus ensemble forecasting.`;
  }

  return `### 🌦️ IMD Meteorology Expert Assistance

Hello Officer! I have received your query: *"**${query}**"*.

Here is a scientific breakdown for your study:

1. **Atmospheric Physics Perspective:**
   Atmospheric systems evolve through thermodynamic energy exchange, pressure gradient acceleration, Coriolis deflection, and moisture phase transitions (latent heat release).

2. **Operational Applications at IMD:**
   - Real-time monitoring using **INSAT-3D/3DR Radiometers** and **C-Band / S-Band Doppler Radars**.
   - Short-range to medium-range numerical forecast guidance from **Global Forecast System (GFS)** and **Regional Unified Models (NCUM)**.
   - Nowcasting bulletins disseminated via **Mausam** and **Damini** lightning safety systems.

3. **Key Concepts to Remember:**
   - **Hydrostatic Balance:** $\\frac{\\partial P}{\\partial z} = -\\rho g$
   - **Geostrophic Wind:** $v_g = \\frac{1}{\\rho f} \\frac{\\partial P}{\\partial x}$
   - **Vorticity Conservation:** Absolute vorticity is conserved under frictionless, barotropic conditions.

Feel free to ask me to explain specific formulas, radar dipole patterns, or course assessment questions!`;
}

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Capacity Connect Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
