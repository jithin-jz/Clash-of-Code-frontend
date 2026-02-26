import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { Trophy, Crown, Medal, Users, X, Gem, ArrowRight } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { SkeletonBase } from "../../common/SkeletonPrimitives";
import api from "../../services/api";
import useAuthStore from "../../stores/useAuthStore";

const LeaderboardDrawer = ({ isLeaderboardOpen, setLeaderboardOpen }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (isLeaderboardOpen) {
      const fetchLeaderboard = async () => {
        setLoading(true);
        try {
          const response = await api.get("/challenges/leaderboard/");
          setUsers(response.data.slice(0, 20));
        } catch (error) {
          console.error("Failed to fetch leaderboard:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLeaderboard();
    }
  }, [isLeaderboardOpen]);

  const getRankStyles = (index) => {
    switch (index) {
      case 0: return { icon: <Crown size={16} />, color: "text-[#ffa116]", bg: "bg-[#ffa116]/10", border: "border-[#ffa116]/20", label: "Grandmaster" };
      case 1: return { icon: <Medal size={16} />, color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/20", label: "Master" };
      case 2: return { icon: <Medal size={16} />, color: "text-[#cd7f32]", bg: "bg-[#cd7f32]/10", border: "border-[#cd7f32]/20", label: "Elite" };
      default: return { icon: null, color: "text-slate-500", bg: "bg-white/[0.03]", border: "border-white/[0.05]", label: null };
    }
  };

  return (
    <AnimatePresence>
      {isLeaderboardOpen && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLeaderboardOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
          />
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 sm:top-0 h-full z-[60] w-full sm:w-[420px] bg-[#03070c] shadow-2xl flex flex-col border-l border-white/[0.08]"
          >
            {/* Glossy Header */}
            <header className="relative shrink-0 h-14 bg-[#0a0f18]/95 backdrop-blur-2xl flex items-center justify-between px-6 border-b border-white/[0.08]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent/30 to-transparent" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                   <Trophy size={18} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest text-white uppercase font-sans">
                    Hall of Fame
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users size={10} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      Global Standings
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLeaderboardOpen(false)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </header>

            {/* List Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-transparent">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Trophy size={48} className="text-slate-800 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No legends yet</p>
                </div>
              ) : (
                users.map((rankUser, index) => {
                  const isMe = currentUser?.username === rankUser.username;
                  const styles = getRankStyles(index);
                  
                  return (
                    <Motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={rankUser.username}
                    >
                      <Link
                        to={`/profile/${rankUser.username}`}
                        onClick={() => setLeaderboardOpen(false)}
                        className={`group relative flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 border ${
                          isMe 
                            ? "bg-primary/10 border-primary/30 shadow-[0_8px_25px_rgba(0,175,155,0.1)] scale-[1.02] z-10" 
                            : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
                        }`}
                      >
                        {/* Rank Circle */}
                        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border ${styles.bg} ${styles.border} ${styles.color}`}>
                          {styles.icon || `#${index + 1}`}
                        </div>

                        {/* Avatar */}
                        <div className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-500">
                          {rankUser.avatar ? (
                            <img
                              src={rankUser.avatar.startsWith("http") ? rankUser.avatar : `${import.meta.env.VITE_API_URL.replace("/api", "")}${rankUser.avatar}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-black text-white">
                              {rankUser.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-white"}`}>
                              {isMe ? "YOU" : rankUser.username}
                            </span>
                            {styles.label && (
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${styles.bg} ${styles.color} hidden sm:block`}>
                                {styles.label}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <Gem size={10} className="text-accent" />
                              <span className="text-[11px] font-black text-accent">{rankUser.xp?.toLocaleString()}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                              {rankUser.completed_levels} Levels
                            </span>
                          </div>
                        </div>

                        {/* Action Icon */}
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-primary transition-colors duration-300" />

                        {isMe && <div className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none" />}
                      </Link>
                    </Motion.div>
                  );
                })
              )}
            </main>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(LeaderboardDrawer);
