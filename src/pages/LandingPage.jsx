import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center px-5 py-10 sm:min-h-[calc(100vh-8rem)] sm:px-8 sm:py-14">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Clash of Code
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Clash of Code helps you master Python through focused coding rounds,
            instant feedback, and a measurable progression path.
          </p>

          <div className="mt-9 flex items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100"
            >
              Start Learning
              <ArrowRight size={16} />
            </button>
          </div>
        </Motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
