import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const landingHighlights = [
  { label: "Skill Tracks", value: "12+" },
  { label: "Hands-on Rounds", value: "150+" },
  { label: "Progress Signals", value: "Real-time" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative text-slate-100">
      <section className="app-page-width flex min-h-[calc(100vh-9rem)] items-center px-5 py-10 sm:min-h-[calc(100vh-8rem)] sm:px-8 sm:py-14">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="app-panel mx-auto w-full max-w-4xl p-7 text-center sm:p-10 lg:p-12"
        >
          <p className="app-title text-[0.68rem] font-semibold text-cyan-300/90 sm:text-xs">
            Industrial Learning Interface
          </p>

          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Clash of Code
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Clash of Code helps you master Python through focused coding rounds,
            instant feedback, and a measurable progression path.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {landingHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-400/20 bg-slate-900/55 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1.5 text-lg font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex items-center justify-center">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm"
            >
              Start Learning
              <ArrowRight size={16} />
            </Button>
          </div>
        </Motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
