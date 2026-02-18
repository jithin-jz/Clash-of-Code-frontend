import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "sonner";

const Login = () => {
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
  } = useAuthStore();
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

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

  // Note: Redirection is handled by the PublicOnlyRoute wrapper in App.jsx
  // when isAuthenticated becomes true.

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
      // Navigation handled by router based on auth state
    } else {
      const latestError = useAuthStore.getState().error;
      toast.error("Invalid OTP", {
        description:
          latestError || error || "The code you entered is incorrect. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#ffa116]/30 selection:text-black flex items-center justify-center relative overflow-hidden px-4 py-10 bg-[#0b1119]">
      <div className="absolute inset-0 pointer-events-none bg-[#0b1119]" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-[#101928] via-[#0d141f] to-[#0a0f17]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="absolute top-0 left-[8%] w-[24rem] h-[24rem] rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-8rem] right-[10%] w-[20rem] h-[20rem] rounded-full bg-[#0ea5e9]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[460px] p-6 sm:p-8 rounded-[2rem] border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.35)] animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111d30]/85 p-4 rounded-2xl border border-white/10 mb-6 shadow-sm">
            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3 bg-[#162338] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#ffa116] focus:ring-2 focus:ring-[#ffa116]/20 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isOtpLoading || otpCooldownSeconds > 0}
                  className="w-full h-11 bg-[#ffa116] text-black font-bold text-sm rounded-xl hover:bg-[#ff8f00] transition-colors disabled:opacity-50"
                >
                  {isOtpLoading
                    ? "Sending..."
                    : otpCooldownSeconds > 0
                      ? `Retry in ${otpCooldownSeconds}s`
                      : "Send Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      setShowOtpInput(false);
                    }}
                    className="text-xs text-[#ffa116] hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full h-11 px-3 bg-[#162338] border border-white/15 rounded-xl text-white text-center text-lg tracking-widest focus:outline-none focus:border-[#ffa116] focus:ring-2 focus:ring-[#ffa116]/20 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="w-full h-11 bg-[#ffa116] text-black font-semibold text-sm rounded-xl hover:bg-[#ff8f00] transition-colors disabled:opacity-50"
                >
                  {isOtpLoading ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
            )}
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="absolute inset-x-0 h-px bg-white/10"></div>
            <span className="relative z-10 bg-[#0f1b2e] px-3 text-xs text-slate-400">
              Continue with
            </span>
          </div>

          <button
            onClick={() => handleOAuthClick("github")}
            disabled={loading || isOAuthLoading}
            className="w-full h-12 flex items-center justify-center bg-[#111d30]/85 text-white rounded-2xl font-semibold border border-white/15 hover:border-[#ffa116]/60 active:scale-[0.98] transition-all"
          >
            {isOAuthLoading ? "Opening..." : "GitHub"}
          </button>

          <button
            onClick={() => handleOAuthClick("google")}
            disabled={loading || isOAuthLoading}
            className="w-full h-12 flex items-center justify-center bg-[#111d30]/85 border border-white/15 hover:border-[#ffa116]/60 text-white rounded-2xl font-medium active:scale-[0.98] transition-all"
          >
            {isOAuthLoading ? "Opening..." : "Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
