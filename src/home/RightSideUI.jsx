import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Settings, User, LogOut, Calendar, Trophy, ChevronRight } from 'lucide-react';

const RightSideUI = ({ user, handleLogout, settingsOpen, setSettingsOpen }) => {
    const glassButtonClass = "p-4 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#FFD700]/50 hover:bg-[#1a1a1a] transition-all text-white shadow-lg active:scale-95";

    return (
        <div className="fixed right-6 top-6 z-30 flex flex-col gap-4 items-end">
            
            {/* XP Bar */}
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}>
                <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-full pl-4 pr-6 py-2.5 flex items-center gap-4 shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FFD700] to-orange-500 flex items-center justify-center text-black shadow-lg">
                        <Star fill="currentColor" size={18} />
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">XP Progress</span>
                            <span className="text-white text-xs font-bold">{user?.profile?.xp?.toLocaleString() || 0}</span>
                        </div>
                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-linear-to-r from-[#FFD700] to-orange-500 rounded-full" 
                                initial={{ width: 0 }} 
                                animate={{ width: `${((user?.profile?.xp || 0) % 1000) / 10}%` }} 
                                transition={{ duration: 1, delay: 0.5 }} 
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Settings */}
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20, delay: 0.1 }} className="relative">
                <button onClick={(e) => { e.stopPropagation(); setSettingsOpen(!settingsOpen); }} className={glassButtonClass}>
                    <motion.span className="block" animate={{ rotate: settingsOpen ? 180 : 0 }}>
                        <Settings size={24} />
                    </motion.span>
                </button>
                
                <AnimatePresence>
                    {settingsOpen && (
                        <motion.div 
                            className="absolute right-full top-0 mr-2 w-40 rounded-2xl overflow-hidden z-40 bg-[#121212] border border-white/10 shadow-2xl backdrop-blur-3xl"
                            initial={{ opacity: 0, scale: 0.9, x: 20 }} 
                            animate={{ opacity: 1, scale: 1, x: 0 }} 
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        >
                            <div className="p-1">
                                {/* Menu Items */}
                                <div className="space-y-1">
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="w-full px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white flex items-center justify-between group transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} /> <span className="text-xs font-medium">Profile</span>
                                                </div>
                                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            <button onClick={handleLogout} className="w-full px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors text-xs font-medium">
                                                <LogOut size={14} /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/login" className="w-full px-3 py-2 rounded-xl hover:bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-between group transition-colors">
                                            <div className="flex items-center gap-2">
                                                <User size={14} /> <span className="text-xs font-bold">Login</span>
                                            </div>
                                            <ChevronRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Minor Actions */}
            <div className="flex flex-col gap-4">
                <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20, delay: 0.25 }}>
                    <button className={glassButtonClass}>
                        <Trophy size={24} className="text-[#FFD700]" />
                    </button>
                </motion.div>

                <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20, delay: 0.2 }}>
                    <button className={glassButtonClass + " relative"}>
                        <Calendar size={24} />
                        <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default RightSideUI;
