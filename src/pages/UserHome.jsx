import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../stores/useAuthStore';

const UserHome = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const scrollRef = useRef(null);

    // Scroll to bottom (first levels) on page load
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Levels with names
    const levels = [
        { id: 1, name: 'Start', icon: '🏠', stars: 3, unlocked: true },
        { id: 2, name: 'Python', icon: '🐍', stars: 3, unlocked: true },
        { id: 3, name: 'Code Lab', icon: '🔬', stars: 2, unlocked: true },
        { id: 4, name: 'Data Cave', icon: '💾', stars: 1, unlocked: true },
        { id: 5, name: 'Algorithm', icon: '⚡', stars: 0, unlocked: true },
        { id: 6, name: 'Repair', icon: '🔧', stars: 0, unlocked: false, hasGift: true },
        { id: 7, name: 'Fortress', icon: '🏰', stars: 0, unlocked: false },
        { id: 8, name: 'Academy', icon: '🎓', stars: 0, unlocked: false },
        { id: 9, name: 'Tower', icon: '🗼', stars: 0, unlocked: false, hasGift: true },
        { id: 10, name: 'Temple', icon: '⛩️', stars: 0, unlocked: false },
        { id: 11, name: 'Factory', icon: '🏭', stars: 0, unlocked: false },
        { id: 12, name: 'Castle', icon: '🏯', stars: 0, unlocked: false, hasGift: true },
        { id: 13, name: 'Labs', icon: '🧪', stars: 0, unlocked: false },
        { id: 14, name: 'HQ', icon: '🏢', stars: 0, unlocked: false },
        { id: 15, name: 'Final', icon: '👑', stars: 0, unlocked: false, hasGift: true },
    ];

    // Winding path positions
    const getPosition = (index) => {
        const positions = [
            { x: 75, y: 90 }, { x: 55, y: 82 }, { x: 30, y: 78 }, { x: 20, y: 68 },
            { x: 35, y: 58 }, { x: 55, y: 52 }, { x: 70, y: 44 }, { x: 50, y: 36 },
            { x: 25, y: 30 }, { x: 40, y: 22 }, { x: 65, y: 18 }, { x: 80, y: 12 },
            { x: 55, y: 8 }, { x: 30, y: 5 }, { x: 50, y: 2 },
        ];
        return positions[index] || { x: 50, y: 50 };
    };

    return (
        <div className="h-screen relative select-none overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #5daa4a 30%, #3d8a24 50%, #2d6a18 100%)' }}>
            
            {/* ===== FLOATING UI - LEFT TOP (Profile) ===== */}
            <div className="fixed left-3 top-3 z-30">
                <Link to="/profile">
                    <div className="flex items-center gap-2 p-2 rounded-xl"
                        style={{ 
                            background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)',
                            border: '3px solid #8B7355',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                        }}>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-yellow-500">
                                {user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-orange-400 flex items-center justify-center text-lg font-bold text-white">
                                        {user?.username?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white">5</div>
                        </div>
                        <div>
                            <p className="text-white font-bold text-xs">Level 5</p>
                            <p className="text-yellow-400 text-xs font-bold">{user?.username || 'Chief'}</p>
                            <p className="text-white/50 text-[9px]">Next Level: 6</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* ===== LEFT - Chat Button ===== */}
            <div className="fixed left-3 top-24 z-30">
                <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <span className="text-lg">💬</span>
                    <span className="text-white font-bold text-xs">Chat</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
            </div>

            {/* ===== LEFT - Leaderboard ===== */}
            <div className="fixed left-3 top-40 z-30">
                <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <span className="text-lg">🏆</span>
                    <span className="text-white font-bold text-xs">Ranks</span>
                </button>
            </div>

            {/* ===== LEFT BOTTOM - Shop ===== */}
            <div className="fixed left-3 bottom-4 z-30">
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)', border: '3px solid #fbbf24', boxShadow: '0 4px 0 #92400e, 0 6px 12px rgba(0,0,0,0.3)' }}>
                    <span className="text-xl">🛒</span>
                    <span className="text-white font-black text-sm">Shop</span>
                </button>
            </div>

            {/* ===== RIGHT TOP - XP Bar ===== */}
            <div className="fixed right-3 top-3 z-30">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <span className="text-white/70 text-[10px]">Total XP</span>
                    <div className="w-20 h-2.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <span className="bg-purple-600 text-white text-[9px] px-1 rounded font-bold">XP</span>
                    <span className="text-white text-[10px]">1,500</span>
                </div>
            </div>

            {/* ===== RIGHT - Settings ===== */}
            <div className="fixed right-3 top-16 z-30">
                <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-3 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <span className="text-xl">⚙️</span>
                </button>
                <AnimatePresence>
                    {settingsOpen && (
                        <motion.div className="absolute right-0 top-14 w-36 rounded-xl overflow-hidden z-40"
                            style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355' }}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <button className="w-full px-3 py-2.5 text-white text-sm hover:bg-white/10 flex items-center gap-2"><span>🔊</span> Sound</button>
                            <button className="w-full px-3 py-2.5 text-white text-sm hover:bg-white/10 flex items-center gap-2"><span>🎵</span> Music</button>
                            <Link to="/profile" className="w-full px-3 py-2.5 text-white text-sm hover:bg-white/10 flex items-center gap-2"><span>👤</span> Profile</Link>
                            <button onClick={handleLogout} className="w-full px-3 py-2.5 text-red-400 text-sm hover:bg-red-500/20 flex items-center gap-2"><span>🚪</span> Logout</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ===== RIGHT - Daily Reward ===== */}
            <div className="fixed right-3 top-36 z-30">
                <button className="p-3 rounded-xl relative"
                    style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '3px solid #8B7355', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                    <span className="text-xl">📅</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
            </div>

            {/* ===== RIGHT BOTTOM - Play Button ===== */}
            <div className="fixed right-3 bottom-4 z-30">
                <button className="px-6 py-4 rounded-xl"
                    style={{ background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', border: '4px solid #4ade80', boxShadow: '0 5px 0 #15803d, 0 8px 16px rgba(0,0,0,0.3)' }}>
                    <p className="text-white font-black text-xl" style={{ textShadow: '2px 2px 0 #15803d' }}>PLAY</p>
                    <p className="text-white/80 text-xs font-bold">Level 5</p>
                </button>
            </div>

            {/* ===== SCROLLABLE LEVEL MAP ===== */}
            <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden">
                <div className="relative w-full" style={{ height: '1200px' }}>
                    
                    {/* Sky & Clouds */}
                    <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, transparent 100%)' }}>
                        <div className="absolute top-[30px] left-[8%] w-20 h-10 bg-white/80 rounded-full" />
                        <div className="absolute top-[50px] left-[15%] w-12 h-6 bg-white/60 rounded-full" />
                        <div className="absolute top-[25px] right-[12%] w-24 h-12 bg-white/80 rounded-full" />
                        <div className="absolute top-[45px] right-[20%] w-14 h-7 bg-white/60 rounded-full" />
                    </div>

                    {/* Snow overlay for locked area */}
                    <div className="absolute top-0 left-0 right-0 h-[55%] pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, rgba(226,232,240,0.5) 0%, rgba(148,163,184,0.3) 50%, transparent 100%)' }} />
                    
                    {/* Snowflakes */}
                    {[
                        { left: '15%', top: '10%' }, { left: '30%', top: '8%' }, { left: '50%', top: '12%' },
                        { left: '70%', top: '6%' }, { left: '85%', top: '15%' }, { left: '25%', top: '22%' },
                        { left: '60%', top: '20%' }, { left: '45%', top: '30%' }, { left: '80%', top: '28%' },
                        { left: '20%', top: '38%' }, { left: '65%', top: '35%' },
                    ].map((pos, i) => (
                        <span key={i} className="absolute text-white/50 pointer-events-none text-sm" style={pos}>❄️</span>
                    ))}

                    {/* Path line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                            d={`M ${getPosition(0).x} ${getPosition(0).y} ${levels.slice(1).map((_, i) => `L ${getPosition(i + 1).x} ${getPosition(i + 1).y}`).join(' ')}`}
                            stroke="#8B7355"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                        />
                    </svg>

                    {/* Level Nodes */}
                    {levels.map((level, index) => {
                        const pos = getPosition(index);
                        const isCurrentLevel = level.unlocked && !levels[index + 1]?.unlocked;

                        return (
                            <div key={level.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                                
                                <button
                                    onClick={() => level.unlocked && setSelectedLevel(level)}
                                    disabled={!level.unlocked}
                                    className={`relative flex flex-col items-center transition-transform ${level.unlocked ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed'}`}
                                >
                                    {/* Level button */}
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center relative ${isCurrentLevel ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''}`}
                                        style={{
                                            background: level.unlocked 
                                                ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
                                                : 'linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
                                            border: level.unlocked ? '3px solid #fcd34d' : '3px solid #cbd5e1',
                                            boxShadow: level.unlocked 
                                                ? '0 4px 0 #92400e, 0 6px 12px rgba(0,0,0,0.3)'
                                                : '0 4px 0 #374151, 0 6px 12px rgba(0,0,0,0.3)',
                                        }}>
                                        
                                        {level.unlocked ? (
                                            <span className="text-2xl">{level.icon}</span>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 rounded-xl bg-cyan-200/40" />
                                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">❄️</span>
                                                <span className="text-xl relative z-10">{level.hasGift ? '🎁' : '🔒'}</span>
                                            </>
                                        )}

                                        {isCurrentLevel && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-xl">👆</div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="mt-1 px-2 py-0.5 rounded bg-black/60 text-center">
                                        <p className="text-white text-[10px] font-bold">{level.name}</p>
                                        <p className="text-yellow-400 text-[9px]">Level {level.id}</p>
                                    </div>

                                    {/* Stars */}
                                    {level.unlocked && level.stars > 0 && (
                                        <div className="flex mt-0.5">
                                            {[1, 2, 3].map((star) => (
                                                <span key={star} className={`text-[10px] ${star <= level.stars ? 'text-yellow-400' : 'text-gray-500'}`}>⭐</span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    {/* Decorations */}
                    <div className="absolute left-[5%] top-[70%] text-3xl opacity-70">🌲</div>
                    <div className="absolute right-[8%] top-[65%] text-2xl opacity-70">🌳</div>
                    <div className="absolute left-[8%] top-[45%] text-2xl opacity-50">🌲</div>
                    <div className="absolute right-[5%] top-[35%] text-2xl opacity-40">🌲</div>
                    <div className="absolute left-[12%] top-[85%] text-2xl opacity-70">🌳</div>

                    <div className="absolute left-[45%] top-[75%] text-2xl">📦</div>
                    <div className="absolute right-[30%] top-[55%] text-xl opacity-70">📦</div>


                </div>
            </div>

            {/* Level Modal */}
            <AnimatePresence>
                {selectedLevel && (
                    <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedLevel(null)}>
                        <motion.div className="w-72 rounded-2xl overflow-hidden"
                            style={{ background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)', border: '4px solid #8B7355', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}>
                            
                            <div className="p-3 text-center" style={{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}>
                                <p className="text-yellow-300 font-black text-xl">Level {selectedLevel.id}</p>
                                <p className="text-white/80 text-sm">{selectedLevel.name}</p>
                            </div>
                            
                            <div className="p-5 text-center">
                                <div className="w-20 h-20 rounded-xl mx-auto mb-3 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', border: '3px solid #fcd34d', boxShadow: '0 4px 0 #92400e' }}>
                                    <span className="text-4xl">{selectedLevel.icon}</span>
                                </div>
                                
                                <div className="flex justify-center gap-1 mb-4">
                                    {[1, 2, 3].map((star) => (
                                        <span key={star} className={`text-2xl ${star <= selectedLevel.stars ? 'text-yellow-400' : 'text-gray-500'}`}>⭐</span>
                                    ))}
                                </div>
                                
                                <button className="w-full py-3 rounded-xl font-black text-lg text-white"
                                    style={{ background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', boxShadow: '0 4px 0 #15803d' }}>
                                    ▶ PLAY
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserHome;
