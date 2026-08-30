import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, CloudSun, Shield, Sparkles, Activity } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  statusText?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete,
  statusText = 'Verifying Officer Credentials & Satellite Links...'
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation over 1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          {/* Outer Pulsing Aura */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut" 
            }}
            className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-3xl blur-xl opacity-40"
          />

          {/* Main Logo Emblem Card */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 shadow-2xl flex items-center justify-center backdrop-blur-md">
            {/* Inner Glowing Badge */}
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-400 rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
              {/* Shimmer light effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />

              <div className="relative z-10 flex flex-col items-center">
                <GraduationCap className="text-white drop-shadow-md" size={42} />
                <div className="flex items-center gap-1 mt-1">
                  <CloudSun size={14} className="text-amber-200" />
                  <span className="text-[9px] font-extrabold tracking-widest text-white/90 uppercase">
                    IMD • MoES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Orbit Dot Animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute -inset-3 rounded-full pointer-events-none"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf] absolute top-0 left-1/2 -translate-x-1/2"></div>
          </motion.div>
        </motion.div>

        {/* Brand Name Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-2 mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Ministry of Earth Sciences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            CAPACITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">CONNECT</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            India Meteorological Department (IMD) Unified Capacity Building & Training Portal
          </p>
        </motion.div>

        {/* Progress Bar & Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full space-y-3 px-4"
        >
          {/* Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status message */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-teal-400 animate-pulse" />
              {statusText}
            </span>
            <span className="text-slate-300 font-bold">{progress}%</span>
          </div>
        </motion.div>

        {/* Skip button for rapid interaction */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onComplete}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 px-3 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          Skip to Portal →
        </motion.button>
      </div>

      {/* Footer National Badge */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <Shield size={12} className="text-blue-400" />
        <span>Smart India Hackathon • MoES Capacity Building Wing</span>
      </div>
    </div>
  );
};
