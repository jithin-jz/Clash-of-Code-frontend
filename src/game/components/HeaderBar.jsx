import React from "react";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
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
          className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg h-8 w-8"
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
          <div
            className={`w-2 h-2 rounded-full ${
              isPyodideReady ? "bg-emerald-500" : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            {isPyodideReady ? "Ready" : "Initializing..."}
          </span>
        </div>

        <div className="w-px h-6 bg-white/10 mx-2" />

        {isRunning ? (
          <Button
            onClick={stopCode}
            variant="destructive"
            className="h-8 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 text-xs font-medium rounded-lg transition-all"
          >
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={runCode}
            className="h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
          >
            <Play size={14} fill="currentColor" />
            Run
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(HeaderBar);
