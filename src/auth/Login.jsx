import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Mail, Github, Chrome } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const {
    loading,
    isOAuthLoading,
    isOtpLoading,
    error,
    otpCooldownUntil,
    email,
    otp,
    showOtpInput,
    setEmail,
    setOtp,
    setShowOtpInput,
    openOAuthPopup,
    requestOtp,
    verifyOtp,
    handleOAuthMessage,
    isAuthenticated,
    isInitialized,
    user,
  } = useAuthStore();
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

  const getRedirectPath = (userData) => {
    if (userData?.is_staff || userData?.is_superuser) {
      return "/admin/dashboard";
    }
    return "/";
  };

  useEffect(() => {
    const updateCooldown = () => {
      const remaining = Math.max(0, Math.ceil((otpCooldownUntil - Date.now()) / 1000));
      setOtpCooldownSeconds(remaining);
    };

    updateCooldown();
    const id = setInterval(updateCooldown, 1000);
    return () => clearInterval(id);
  }, [otpCooldownUntil]);

  useEffect(() => {
    const handleMessage = (event) => handleOAuthMessage(event);
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleOAuthMessage]);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    navigate(getRedirectPath(user), { replace: true });
  }, [isInitialized, isAuthenticated, user, navigate]);

  const handleOAuthClick = async (provider) => {
    await openOAuthPopup(provider);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Email Required", {
        description: "Please enter your email address to continue.",
      });
    }

    const success = await requestOtp(email.trim());
    if (success) {
      setShowOtpInput(true);
      toast.success("OTP Sent", {
        description: "Please check your inbox for the verification code.",
      });
    } else {
      const latestError = useAuthStore.getState().error;
      toast.error("Failed to send OTP", {
        description: latestError || error || "Please check your connection and try again.",
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      return toast.error("OTP Required", {
        description: "Please enter the 6-digit code sent to your email.",
      });
    }

    const success = await verifyOtp(email.trim(), otp.trim());
    if (success) {
      toast.success("Welcome Back!", {
        description: "You have been successfully logged in.",
      });
      const currentUser = useAuthStore.getState().user;
      navigate(getRedirectPath(currentUser), { replace: true });
    } else {
      const latestError = useAuthStore.getState().error;
      toast.error("Invalid OTP", {
        description:
          latestError || error || "The code you entered is incorrect. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-white flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[#060a11]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#060a11_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

      {/* Decorative Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Simplified Branding Header */}
        <div className="text-center mb-8">
          <Motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-[0.2em] text-white uppercase"
          >
            Clash of Code
          </Motion.h1>
        </div>

        {/* Main Auth Card */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 pb-10 rounded-[2.5rem] border border-white/10 bg-[#0f1b2e]/60 backdrop-blur-3xl shadow-[0_32px_80px_-15px_rgba(0,0,0,0.5)]"
        >
          <AnimatePresence mode="wait">
            {!showOtpInput ? (
              <Motion.form
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isOtpLoading || otpCooldownSeconds > 0}
                  className="w-full h-14 bg-white text-black font-bold text-base rounded-2xl hover:bg-slate-50 transition-all transform active:scale-95 disabled:opacity-50 shadow-[0_15px_30px_-10px_rgba(255,255,255,0.2)]"
                >
                  {isOtpLoading
                    ? "Sending..."
                    : otpCooldownSeconds > 0
                      ? `Retry in ${otpCooldownSeconds}s`
                      : "Send Verification Code"}
                </button>
              </Motion.form>
            ) : (
              <Motion.form
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-slate-400">Code sent to <span className="text-white">{email}</span></p>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      setShowOtpInput(false);
                    }}
                    className="mt-1 text-xs text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Change Email
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="000 000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-center text-2xl font-bold tracking-[0.3em] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-800"
                  required
                />

                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="w-full h-14 bg-blue-600 text-white font-bold text-base rounded-2xl hover:bg-blue-500 transition-all transform active:scale-95 disabled:opacity-50 shadow-[0_15px_30px_-10px_rgba(37,99,235,0.3)]"
                >
                  {isOtpLoading ? "Verifying..." : "Verify & Continue"}
                </button>
              </Motion.form>
            )}
          </AnimatePresence>

          {/* Restored Social Auth */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-x-0 h-px bg-white/[0.05]"></div>
            <span className="relative z-10 bg-[#0f1b2e] px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Or connect with
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthClick("github")}
              disabled={loading || isOAuthLoading}
              className="group h-14 flex items-center justify-center gap-3 bg-white/[0.03] text-white rounded-2xl font-bold border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Github size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              <span>GitHub</span>
            </button>

            <button
              onClick={() => handleOAuthClick("google")}
              disabled={loading || isOAuthLoading}
              className="group h-14 flex items-center justify-center gap-3 bg-white/[0.03] text-white rounded-2xl font-bold border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Chrome size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              <span>Google</span>
            </button>
          </div>
        </Motion.div>

        {/* Re-added Minimal Footer Links */}
        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} Clash of Code
        </p>
      </div>
    </div>
  );
};

export default Login;
