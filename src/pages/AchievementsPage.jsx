import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Users, 
  Calendar, 
  Star, 
  Lock, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { achievementsApi } from "../services/achievementsApi";
import { SkeletonGenericPage } from "../common/SkeletonPrimitives";
import { toast } from "sonner";

/**
 * AchievementsPage — A dedicated landing page for users to see all possible trophies
 * and instructions on how to earn them.
 */
const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await achievementsApi.getAllAchievements();
        setAchievements(data);
      } catch (err) {
        toast.error("Failed to load achievements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = [
    { id: "all", label: "All Hall", icon: Trophy },
    { id: "challenge", label: "Coding", icon: Target },
    { id: "social", label: "Community", icon: Users },
    { id: "streak", label: "Consistency", icon: Calendar },
    { id: "special", label: "Special", icon: Star },
  ];

  const filtered = activeCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  if (loading) return <SkeletonGenericPage />;

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <section className="mx-auto max-w-7xl text-center mb-16 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6"
        >
          <Trophy className="h-4 w-4" />
          <span>Champion's Hall</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6"
        >
          Forge Your <span className="text-primary italic">Legacy</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-zinc-400"
        >
          Unlock rare trophies and earn bonus XP by mastering the art of code, 
          maintaining consistency, and building the community.
        </motion.p>
      </section>

      {/* Category Filter */}
      <div className="mx-auto max-w-7xl mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 ${
                activeCategory === cat.id 
                ? "bg-primary border-primary text-black font-bold shadow-lg shadow-primary/20" 
                : "bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20 hover:bg-zinc-800"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="mx-auto max-w-7xl">
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 hover:border-primary/40 transition-colors"
              >
                {/* Glow Effect */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-zinc-800 border border-white/5 ${achievement.is_unlocked ? 'text-primary' : 'text-zinc-500 opacity-50'}`}>
                    {/* Placeholder for Dynamic Icon - will need a mapper for names to components */}
                    <Trophy className="h-8 w-8" />
                  </div>
                  
                  {achievement.is_unlocked ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <Lock className="h-4 w-4 text-zinc-700" />
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${achievement.is_unlocked ? 'text-white' : 'text-zinc-500'}`}>
                  {achievement.title}
                </h3>
                
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm font-bold text-white">+{achievement.xp_reward} <span className="text-zinc-500 font-normal">XP</span></span>
                  </div>
                  
                  {!achievement.is_unlocked && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      Incomplete
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg italic">No achievements found in this category.</p>
          </div>
        )}
      </div>

      {/* Reward Cycle Hint */}
      <section className="mx-auto max-w-4xl mt-32 mb-16">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Daily Check-In Rewards</h2>
              <p className="text-zinc-400 mb-6">
                Consistency pays off. Complete your daily check-in streak to unlock exclusive 
                milestone trophies and multipliers.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 text-primary font-bold hover:text-white transition-colors"
              >
                <span>Track your streak</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AchievementsPage;
