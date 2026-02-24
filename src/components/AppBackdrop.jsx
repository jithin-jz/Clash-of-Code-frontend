import React from "react";

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
  backgroundSize: "52px 52px",
};

const AppBackdrop = () => {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none bg-[#0a0f18]" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={GRID_STYLE}
      />
      <div className="absolute top-0 left-[8%] w-[32rem] h-[32rem] rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-8rem] right-[10%] w-[28rem] h-[28rem] rounded-full bg-[#0ea5e9]/10 blur-3xl pointer-events-none" />
    </>
  );
};

export default AppBackdrop;
