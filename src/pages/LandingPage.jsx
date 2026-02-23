import React, { useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Code2,
    Zap,
    ShieldCheck,
    Play,
    Github,
    Twitter,
    Linkedin
} from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: Add scroll transition logic if needed later
    }, []);

    const features = [
        {
            icon: <Zap className="text-amber-400" size={20} />,
            title: "Gamified Learning",
            desc: "RPG-style progression. Earn XP, level up, and unlock achievements as you code."
        },
        {
            icon: <Code2 className="text-blue-400" size={20} />,
            title: "Python Mastery",
            desc: "60 unique challenges from basic syntax to advanced Object-Oriented Programming."
        },
        {
            icon: <ShieldCheck className="text-emerald-400" size={20} />,
            title: "AI-Powered Guidance",
            desc: "Get intelligent hints and real-time feedback when you're stuck in the arena."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0f18] text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">The Arena is Open</span>
                </Motion.div>

                <Motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-8"
                >
                    Clash of Code
                    <span className="block mt-2 bg-gradient-to-r from-blue-400 via-[#a78bfa] to-purple-500 bg-clip-text text-transparent">
                        Master the Python Arena
                    </span>
                </Motion.h1>

                <Motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12"
                >
                    Level up your logic through 60 increasingly difficult challenges.
                    Conquer the track, earn your certificate, and become a Python master.
                </Motion.p>

                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                >
                    <button
                        onClick={() => navigate("/login")}
                        className="group h-14 px-10 rounded-2xl bg-white text-[#0f172a] font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
                    >
                        Join the Arena
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => {
                            const el = document.getElementById('features');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="h-14 px-10 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold text-lg hover:bg-white/[0.08] transition-all duration-300"
                    >
                        Explore Tracks
                    </button>
                </Motion.div>

                {/* Hero Image / Mockup Placeholder */}
                <Motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mt-24 w-full max-w-5xl aspect-video rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden relative group shadow-2xl shadow-blue-500/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-slate-500 flex flex-col items-center gap-4">
                            <Play size={48} className="text-blue-500/20" />
                            <span className="text-sm font-medium tracking-widest uppercase opacity-20">Code Arena Preview</span>
                        </div>
                    </div>
                </Motion.div>
            </section>

            {/* Stats row */}
            <section className="relative z-10 border-y border-white/[0.05] bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { val: "60", label: "Challenges" },
                        { val: "6", label: "Mastery Tracks" },
                        { val: "10k+", label: "XP to Earn" },
                        { val: "1", label: "Global Certificate" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-6">Built for the next generation<br />of developers</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">Master complex concepts through interaction, not just reading documentation.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Section Teaser */}
            <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent to-blue-600/[0.03]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-8">Visual Progression Journey</h2>
                        <div className="space-y-6">
                            {[
                                "Basic syntax and logic modules",
                                "Complex data structure arenas",
                                "Object-oriented design patterns",
                                "The Standard Library gauntlet"
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                                        {i + 1}
                                    </div>
                                    <span className="text-slate-300 font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="mt-12 h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-2"
                        >
                            Start Your Path
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="flex-1 w-full aspect-square rounded-[40px] border border-white/10 bg-white/[0.02] p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
                        {/* Decorative map elements */}
                        <div className="w-full h-full flex flex-col gap-6 justify-center">
                            {[0.6, 1, 0.4].map((op, i) => (
                                <div key={i} className="h-24 w-full rounded-2xl bg-white/[0.03] border border-white/5 flex items-center px-6 gap-4" style={{ opacity: op }}>
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/20" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-32 bg-white/10 rounded-full" />
                                        <div className="h-2 w-24 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 pt-20 pb-10 px-6 border-t border-white/[0.05]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tighter mb-2">CLASH OF CODE</h2>
                        <p className="text-slate-500 text-sm">Elevating the way the world learns to code.</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto text-center border-t border-white/5 pt-10">
                    <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Clash of Code. Built for masters.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
