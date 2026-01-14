import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, MessageSquare, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const ChatDrawer = ({ isChatOpen, setChatOpen, user }) => {
    const inputRef = useRef(null);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isChatOpen && user && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isChatOpen, user]);

    return (
        <motion.div 
            className="fixed top-0 left-0 h-full z-40 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: isChatOpen ? 0 : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            style={{ width: '360px' }} 
        >
            <div className="w-full h-full bg-[#0a0a0a]/90 backdrop-blur-3xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl relative">
                
                {/* Header */}
                <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#121212]/50">
                    <div>
                        <span className="text-white font-black text-xl tracking-tight block">Global Chat</span>
                        <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest opacity-80">Live Feed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-green-400 text-xs font-bold">1,240</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-linear-to-b from-transparent to-black/30 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {!user ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-6">
                                <Lock size={24} className="text-[#FFD700]" />
                            </div>
                            <p className="text-white font-bold text-lg mb-2">Chat Locked</p>
                            <p className="text-gray-400 text-sm mb-6 max-w-[200px]">Join the community to chat with other players!</p>
                            <Link to="/login" className="px-6 py-3 bg-[#FFD700] hover:bg-[#FDB931] text-black rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20">
                                Login Access
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 group">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#FFD700] font-bold text-xs tracking-wide">SuperCell_Fan</span>
                                    <span className="text-gray-600 text-[10px]">10:42 AM</span>
                                </div>
                                <div className="bg-[#1a1a1a] border border-white/5 text-gray-300 p-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm group-hover:bg-[#222] transition-colors">
                                    Anyone want to join my clan? We war 24/7! ⚔️
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 group">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 font-bold text-xs tracking-wide">StrategyMaster</span>
                                    <span className="text-gray-600 text-[10px]">10:45 AM</span>
                                </div>
                                <div className="bg-[#1a1a1a] border border-white/5 text-gray-300 p-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm group-hover:bg-[#222] transition-colors">
                                    Just unlocked Level 5! The layout is insane 🔥
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#121212]/50 border-t border-white/5 backdrop-blur-md">
                    <div className="flex gap-3">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder={user ? "Type a message..." : "Login to chat..."} 
                            disabled={!user}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 focus:bg-black/60 transition-all disabled:opacity-50 placeholder-gray-600" 
                        />
                        <button 
                            disabled={!user} 
                            className="bg-[#FFD700] hover:bg-[#FDB931] text-black p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <motion.button
                    onClick={() => setChatOpen(!isChatOpen)}
                    className="absolute top-1/2 -right-12 -mt-10 w-12 h-20 bg-[#0a0a0a] border-y border-r border-[#FFD700]/30 rounded-r-2xl flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-[#151515] hover:border-[#FFD700] transition-all group z-50"
                    whileHover={{ x: 4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: 0 }}
                    style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.2))" }}
                >
                    {isChatOpen ? (
                        <ChevronLeft className="text-[#FFD700] drop-shadow-md" size={24} strokeWidth={3} />
                    ) : (
                        <MessageSquare className="text-[#FFD700] drop-shadow-md" size={24} strokeWidth={3} />
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ChatDrawer;
