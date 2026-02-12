import React from "react";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const HeaderBar = ({
  title,
  navigate,
  isPyodideReady,
  isRunning,
  runCode,
  stopCode,
}) => {
  return (
    <div className="h-14 border-b border-white/5 bg-[#09090b] flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left: Navigation & Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg h-8 w-8 transition-all duration-200"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white tracking-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isPyodideReady ? "bg-emerald-500" : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            {isPyodideReady ? "Ready" : "Initializing..."}
          </span>
        </motion.div>

        <div className="w-px h-6 bg-white/10 mx-2" />

        {isRunning ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button
              onClick={stopCode}
              variant="destructive"
              className="h-9 px-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
            >
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Stop
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: isPyodideReady ? 1.05 : 1 }}
            whileTap={{ scale: isPyodideReady ? 0.95 : 1 }}
          >
            <motion.button
              onClick={runCode}
              disabled={!isPyodideReady}
              className={`
                relative overflow-hidden h-9 px-5 
                ${
                  isPyodideReady
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/40"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }
                text-white text-sm font-medium rounded-lg 
                transition-all duration-300
                flex items-center gap-2
                active:shadow-emerald-900/50
              `}
              whileHover={
                isPyodideReady
                  ? {
                      boxShadow:
                        "0 20px 25px -5px rgb(16 185 129 / 0.3), 0 10px 10px -5px rgb(16 185 129 / 0.2)",
                    }
                  : {}
              }
            >
              {/* Ripple effect on hover */}
              {isPyodideReady && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileHover={{
                    scale: 2,
                    opacity: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  }}
                />
              )}

              {/* Shimmer effect */}
              {isPyodideReady && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear",
                  }}
                />
              )}

              <motion.div
                animate={
                  isPyodideReady
                    ? {
                        rotate: [0, 360],
                      }
                    : {}
                }
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Play size={16} fill="currentColor" className="relative z-10" />
              </motion.div>
              <span className="relative z-10">Run</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default React.memo(HeaderBar);
