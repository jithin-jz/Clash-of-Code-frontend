import React from "react";
import { ArrowLeft, Play } from "lucide-react";

const HeaderBar = ({
  title,
  navigate,
  isPyodideReady,
  isRunning,
  runCode,
  stopCode,
}) => {
  return (
    <div className="h-14 bg-[#0a1220]/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-3 sm:px-4 shrink-0 z-20 relative overflow-hidden">
      {/* Left: Navigation & Title */}
      <div className="flex items-center gap-2 sm:gap-4 relative z-10 min-w-0">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-white/15 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00af9b] shrink-0"></span>
              <span className="truncate">{title}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3 relative z-10 shrink-0">
        {/* Status Indicator - smaller on mobile */}
        <div className="flex items-center p-1 sm:p-1.5">
          <div
            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-none ${isPyodideReady
              ? "bg-[#00af9b] shadow-[#00af9b]/50"
              : "bg-[#ffa116] animate-pulse"
              }`}
          />
        </div>

        <div className="w-px h-3 sm:h-4 bg-white/10 mx-0.5 sm:mx-1" />

        {isRunning ? (
          <button
            type="button"
            onClick={stopCode}
            className="h-9 sm:h-10 px-3 sm:px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-xl transition-all flex items-center"
          >
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-400 mr-1.5 sm:mr-2 animate-pulse" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={runCode}
            disabled={!isPyodideReady}
            className={`
                h-9 sm:h-10 px-3 sm:px-5 relative overflow-hidden group rounded-xl
                ${isPyodideReady
                ? "bg-[#10b981] text-white hover:bg-[#059669] border border-[#34d399]/40 shadow-lg shadow-[#10b981]/25"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/10"
              }
                text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all flex items-center
              `}
          >
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <Play
                size={8}
                className="sm:w-2.5 sm:h-2.5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                strokeWidth={3}
              />
              <span>Run</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(HeaderBar);
