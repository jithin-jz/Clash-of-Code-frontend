import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../stores/useAuthStore';
import { 
    Home, Code, FlaskConical, Database, Zap, Wrench, Castle, GraduationCap, 
    Landmark, Factory, Building2, Crown, MessageCircle, Trophy, ShoppingCart, 
    Star, Settings, Volume2, Music, User, LogOut, Calendar, Play, Lock, Gift, 
    Snowflake, MapPin, MessageSquare, ChevronLeft,
    Terminal, Box, Binary, Keyboard, GitGraph, Repeat, List, FunctionSquare, 
    Book, Package, FileText, LayoutTemplate, AlertTriangle, BoxSelect, Rocket,
    Braces
} from 'lucide-react';
import Loader from '../components/Loader';

// 3D Button Component with enhanced effects
const Button3D = ({ children, className = "", style = {}, onClick, variant = "wood", ...props }) => {
    const baseStyles = {
        wood: {
            background: 'linear-gradient(180deg, #7c6a5a 0%, #5c4a3a 20%, #4d3d30 80%, #3d3228 100%)',
            border: '3px solid #a08060',
            boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 6px 0 #2a2218,
                0 8px 4px rgba(0,0,0,0.3),
                0 12px 16px rgba(0,0,0,0.4)
            `,
        },
        orange: {
            background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 30%, #b45309 70%, #92400e 100%)',
            border: '3px solid #fcd34d',
            boxShadow: `
                inset 0 2px 6px rgba(255,255,255,0.4),
                inset 0 -3px 6px rgba(0,0,0,0.3),
                0 6px 0 #78350f,
                0 8px 4px rgba(0,0,0,0.3),
                0 14px 20px rgba(180,83,9,0.4)
            `,
        },
        green: {
            background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 30%, #16a34a 70%, #15803d 100%)',
            border: '4px solid #86efac',
            boxShadow: `
                inset 0 3px 8px rgba(255,255,255,0.4),
                inset 0 -4px 8px rgba(0,0,0,0.3),
                0 8px 0 #166534,
                0 10px 6px rgba(0,0,0,0.3),
                0 16px 24px rgba(22,163,74,0.5)
            `,
        },
    };

    return (
        <motion.button
            className={`relative rounded-2xl transition-all ${className}`}
            style={{ ...baseStyles[variant], ...style }}
            whileHover={{ 
                y: -2,
                boxShadow: variant === 'green' 
                    ? 'inset 0 3px 8px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.3), 0 10px 0 #166534, 0 12px 8px rgba(0,0,0,0.4), 0 20px 32px rgba(22,163,74,0.6)'
                    : variant === 'orange'
                    ? 'inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.3), 0 8px 0 #78350f, 0 10px 6px rgba(0,0,0,0.4), 0 18px 28px rgba(180,83,9,0.5)'
                    : 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 8px 0 #2a2218, 0 10px 6px rgba(0,0,0,0.4), 0 16px 24px rgba(0,0,0,0.5)'
            }}
            whileTap={{ 
                y: 4,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 0 #2a2218, 0 3px 2px rgba(0,0,0,0.2)'
            }}
            onClick={onClick}
            {...props}
        >
            {/* Glossy shine overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/20 to-transparent rounded-t-xl pointer-events-none" />
            {children}
        </motion.button>
    );
};

// 3D Level Button
const LevelButton3D = ({ level, isCurrentLevel, onClick }) => {
    const baseStyle = level.unlocked ? {
        background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 30%, #d97706 60%, #b45309 100%)',
        border: '4px solid #fcd34d',
        boxShadow: `
            inset 0 3px 8px rgba(255,255,255,0.5),
            inset 0 -4px 8px rgba(0,0,0,0.3),
            0 6px 0 #92400e,
            0 8px 6px rgba(0,0,0,0.4),
            0 12px 20px rgba(180,83,9,0.4)
        `,
    } : {
        background: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 30%, #64748b 60%, #475569 100%)',
        border: '4px solid #cbd5e1',
        boxShadow: `
            inset 0 2px 6px rgba(255,255,255,0.3),
            inset 0 -3px 6px rgba(0,0,0,0.2),
            0 5px 0 #374151,
            0 7px 4px rgba(0,0,0,0.3),
            0 10px 16px rgba(0,0,0,0.3)
        `,
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={!level.unlocked}
            className={`relative flex flex-col items-center ${level.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            whileHover={level.unlocked ? { scale: 1.1, y: -4 } : {}}
            whileTap={level.unlocked ? { scale: 0.95, y: 2 } : {}}
        >
            {/* Level circle */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${isCurrentLevel ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''}`}
                style={baseStyle}>

                {/* Glossy shine */}
                <div className="absolute top-1 left-2 right-2 h-5 bg-linear-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none" />

                {level.unlocked ? (
                    <span className="text-white drop-shadow-lg">{level.icon}</span>
                ) : (
                    <>
                        {/* Ice overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-cyan-300/40 to-blue-400/30" />
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg drop-shadow text-white/80">
                            <Snowflake size={16} />
                        </span>
                        <span className="text-white/70 relative z-10 drop-shadow">
                            {level.hasGift ? <Gift size={28} className="text-red-500" /> : <Lock size={28} className="text-slate-600" />}
                        </span>
                    </>
                )}

                {isCurrentLevel && (
                    <motion.div
                        className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <MapPin size={32} fill="currentColor" />
                    </motion.div>
                )}
            </div>

            {/* Label with 3D effect */}
            <div className="mt-2 px-3 py-1 rounded-lg text-center"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}>
                <p className="text-white text-xs font-bold drop-shadow">{level.name}</p>
                <p className="text-yellow-400 text-[10px] font-semibold">Level {level.id}</p>
            </div>

            {/* Stars */}
            {level.unlocked && level.stars > 0 && (
                <div className="flex mt-1 gap-0.5">
                    {[1, 2, 3].map((star) => (
                        <motion.span
                            key={star}
                            transition={{ delay: star * 0.1 }}
                        >
                            <Star
                                size={12}
                                className={`${star <= level.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 fill-gray-600'}`}
                            />
                        </motion.span>
                    ))}
                </div>
            )}
        </motion.button>
    );
};

const pathPositions = [
    { x: 75, y: 90 }, { x: 55, y: 82 }, { x: 30, y: 78 }, { x: 20, y: 68 },
    { x: 35, y: 58 }, { x: 55, y: 52 }, { x: 70, y: 44 }, { x: 50, y: 36 },
    { x: 25, y: 30 }, { x: 40, y: 22 }, { x: 65, y: 18 }, { x: 80, y: 12 },
    { x: 55, y: 8 }, { x: 30, y: 5 }, { x: 50, y: 2 },
];

// Tips for the loader are now in global Loader component
const UserHome = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [isChatOpen, setChatOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const scrollRef = useRef(null);

    // Loader State
    const [isLoading, setIsLoading] = useState(true);

    // Simulate Loading logic
    useEffect(() => {
        if (!isLoading) return;

        // Finish loading
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 3 seconds total load time

        return () => {
            clearTimeout(timeout);
        };
    }, [isLoading]);

    // Scroll to bottom on mount (start of path)
    useEffect(() => {
        if (!isLoading && scrollRef.current) {
             // Small timeout to ensure DOM is ready after loading screen
            setTimeout(() => {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 100);
        }
    }, [isLoading]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleLevelClick = (level) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (level.unlocked) {
            setSelectedLevel(level);
        }
    };

    // Python Learning Path Levels
    const levels = [
        { id: 1, name: 'Hello Python', icon: <Terminal size={32} />, stars: 0, unlocked: true },
        { id: 2, name: 'Variables', icon: <Box size={32} />, stars: 0, unlocked: false },
        { id: 3, name: 'Data Types', icon: <Binary size={32} />, stars: 0, unlocked: false },
        { id: 4, name: 'Input', icon: <Keyboard size={32} />, stars: 0, unlocked: false },
        { id: 5, name: 'Conditionals', icon: <GitGraph size={32} />, stars: 0, unlocked: false },
        { id: 6, name: 'Loops', icon: <Repeat size={32} />, stars: 0, unlocked: false },
        { id: 7, name: 'Lists', icon: <List size={32} />, stars: 0, unlocked: false },
        { id: 8, name: 'Functions', icon: <FunctionSquare size={32} />, stars: 0, unlocked: false },
        { id: 9, name: 'Dictionaries', icon: <Book size={32} />, stars: 0, unlocked: false },
        { id: 10, name: 'Modules', icon: <Package size={32} />, stars: 0, unlocked: false },
        { id: 11, name: 'File I/O', icon: <FileText size={32} />, stars: 0, unlocked: false },
        { id: 12, name: 'Classes', icon: <LayoutTemplate size={32} />, stars: 0, unlocked: false },
        { id: 13, name: 'Error Handling', icon: <AlertTriangle size={32} />, stars: 0, unlocked: false },
        { id: 14, name: 'Virtual Env', icon: <BoxSelect size={32} />, stars: 0, unlocked: false },
        { id: 15, name: 'Final Project', icon: <Rocket size={32} />, stars: 0, unlocked: false, hasGift: true },
    ];

    const getPosition = (index) => pathPositions[index] || { x: 50, y: 50 };

    // Static decorations to ensure fixed layout
    const decorations = [
        // Left side forest
        { src: '/assets/oak-tree.png', x: 5, y: 5, size: '100px', zIndex: 'z-20' },
        { src: '/assets/bush.png', x: 12, y: 15, size: '45px', zIndex: 'z-10' },
        { src: '/assets/pine-tree.png', x: 8, y: 25, size: '110px', zIndex: 'z-20' },
        { src: '/assets/mushrooms.png', x: 15, y: 35, size: '30px', zIndex: 'z-10', pulse: true },
        { src: '/assets/rock-large.png', x: 5, y: 45, size: '40px', zIndex: 'z-0' },
        { src: '/assets/oak-tree.png', x: 10, y: 55, size: '95px', zIndex: 'z-20' },
        { src: '/assets/bush.png', x: 4, y: 65, size: '50px', zIndex: 'z-10' },
        { src: '/assets/pine-tree.png', x: 8, y: 75, size: '115px', zIndex: 'z-20' },
        { src: '/assets/rock-large.png', x: 14, y: 85, size: '35px', zIndex: 'z-0' },
        { src: '/assets/mushrooms.png', x: 6, y: 92, size: '28px', zIndex: 'z-10' },

        // Right side forest
        { src: '/assets/pine-tree.png', x: 85, y: 8, size: '105px', zIndex: 'z-20' },
        { src: '/assets/rock-large.png', x: 92, y: 18, size: '42px', zIndex: 'z-0' },
        { src: '/assets/oak-tree.png', x: 88, y: 28, size: '90px', zIndex: 'z-20' },
        { src: '/assets/bush.png', x: 82, y: 38, size: '48px', zIndex: 'z-10' },
        { src: '/assets/pine-tree.png', x: 90, y: 48, size: '120px', zIndex: 'z-20' },
        { src: '/assets/mushrooms.png', x: 84, y: 58, size: '32px', zIndex: 'z-10', pulse: true },
        { src: '/assets/oak-tree.png', x: 92, y: 68, size: '98px', zIndex: 'z-20' },
        { src: '/assets/rock-large.png', x: 86, y: 78, size: '38px', zIndex: 'z-0' },
        { src: '/assets/bush.png', x: 94, y: 88, size: '44px', zIndex: 'z-10' },

        // Scattered inner details (avoiding center path roughly)
        { src: '/assets/bush.png', x: 25, y: 10, size: '40px', zIndex: 'z-10' },
        { src: '/assets/rock-large.png', x: 65, y: 22, size: '30px', zIndex: 'z-0' },
        { src: '/assets/mushrooms.png', x: 30, y: 40, size: '25px', zIndex: 'z-10' },
        { src: '/assets/bush.png', x: 70, y: 52, size: '42px', zIndex: 'z-10' },
        { src: '/assets/rock-large.png', x: 22, y: 70, size: '36px', zIndex: 'z-0' },
        { src: '/assets/mushrooms.png', x: 60, y: 82, size: '26px', zIndex: 'z-10', pulse: true },
        { src: '/assets/bush.png', x: 40, y: 95, size: '45px', zIndex: 'z-10' },
    ];

    return (
        <div className="h-screen relative select-none overflow-hidden"
            style={{ 
                backgroundColor: '#3d8a24'
            }}>
            
            {/* ===== LOADING SCREEN ===== */}
            <Loader isLoading={isLoading} />

            {/* Darker Vignette Overlay for depth */}

            {/* Darker Vignette Overlay for depth */}
            <div className="absolute inset-0 pointer-events-none" 
                style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} 
            />


            
            {/* ===== FLOATING UI - LEFT TOP (Profile & Ranks) ===== */}
            <motion.div 
                className="fixed left-4 top-4 z-30 flex flex-col gap-2"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <Link to={user ? "/profile" : "/login"}>
                    <Button3D className="flex items-center gap-3 px-3 py-2 w-full">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border-3 border-yellow-500"
                                style={{ 
                                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.4)'
                                }}>
                                {user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>
                            {user && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-white"
                                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                                    5
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-yellow-400 font-bold text-sm drop-shadow">{user ? "Level 5" : "Guest"}</p>
                            <p className="text-white font-bold text-sm drop-shadow">{user?.username || 'Tap to Login'}</p>
                            {user && <p className="text-white/60 text-xs">Next: 6</p>}
                        </div>
                    </Button3D>
                </Link>

            </motion.div>

            {/* ===== LEFT - Sliding Chat Drawer (Only for Auth Users) ===== */}
            <motion.div 
                className="fixed top-0 left-0 h-full z-50 pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: isChatOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                style={{ width: '320px' }} 
            >
                {/* Drawer Panel */}
                <div className="w-full h-full bg-[#333] border-r-4 border-[#1a1a1a] flex flex-col pointer-events-auto relative shadow-2xl">
                    {/* Header */}
                    <div className="h-16 bg-[#2a2a2a] border-b border-[#444] flex items-center justify-between px-4">
                        <span className="text-white font-bold text-lg drop-shadow-md">Global Chat</span>
                        <div className="text-green-400 text-xs font-bold bg-green-900/50 px-2 py-1 rounded">Online: 1,240</div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#222]">
                        {!user ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
                                <Lock size={48} className="text-yellow-500 mb-4" />
                                <p className="text-white font-bold mb-2">Chat Locked</p>
                                <p className="text-white/60 text-sm mb-4">Login to join the conversation!</p>
                                <Link to="/login" className="bg-green-600 px-4 py-2 rounded font-bold text-white">Login</Link>
                            </div>
                        ) : (
                            <>
                                {/* Mock Messages for Users */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-yellow-500 font-bold text-xs">SuperCell_Fan</span>
                                    <div className="bg-[#444] text-white p-2 rounded-r-lg rounded-bl-lg text-sm border-l-4 border-yellow-500">
                                        Anyone want to join my clan? We war 24/7! ⚔️
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-blue-400 font-bold text-xs">NightWitch</span>
                                    <div className="bg-[#444] text-white p-2 rounded-r-lg rounded-bl-lg text-sm border-l-4 border-blue-400">
                                        Need donations pls! dragon 🐉
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-[#2a2a2a] border-t border-[#444]">
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                placeholder={user ? "Type a message..." : "Login to chat..."}
                                disabled={!user}
                                className="flex-1 bg-[#1a1a1a] border border-[#444] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                            />
                            <button disabled={!user} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded font-bold border-b-4 border-green-800 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                                Send
                            </button>
                        </div>
                    </div>
                
                    {/* Toggle Tab (Absolute positioned to right of drawer) */}
                    <motion.button
                        onClick={() => setChatOpen(!isChatOpen)}
                        className="absolute top-1/2 -right-12 -mt-8 w-12 h-16 bg-orange-500 border-y-2 border-r-2 border-black rounded-r-xl flex items-center justify-center shadow-lg pointer-events-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                           background: 'linear-gradient(180deg, #f97316 0%, #c2410c 100%)',
                           boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 4px 0 8px rgba(0,0,0,0.4)'
                        }}
                    >
                         {isChatOpen ? (
                             <ChevronLeft className="text-white drop-shadow-md" size={32} strokeWidth={3} />
                         ) : (
                             <MessageSquare className="text-white drop-shadow-md" size={28} strokeWidth={3} />
                         )}
                    </motion.button>
                </div>
            </motion.div>



            {/* ===== LEFT BOTTOM - Shop ===== */}
            <motion.div 
                className="fixed left-4 bottom-4 z-30"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, delay: 0.3 }}
            >
                <Button3D variant="orange" className="px-8 py-5 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                        <span className="text-white drop-shadow-lg"><ShoppingCart size={28} /></span>
                        <span className="text-white font-black text-2xl drop-shadow-lg" style={{ textShadow: '2px 2px 0 #92400e' }}>SHOP</span>
                    </div>
                    <p className="text-white/80 text-sm font-bold">New Offers</p>
                </Button3D>
            </motion.div>

            {/* ===== RIGHT SIDE FLOATING UI ===== */}
            <div className="fixed right-4 top-4 z-30 flex flex-col gap-4 items-end">
                {/* XP Bar */}
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                >
                    <Button3D className="flex items-center gap-3 px-4 py-3">
                        <span className="text-yellow-400 filter drop-shadow-md"><Star fill="currentColor" size={24} /></span>
                        <div>
                            <p className="text-white/70 text-xs mb-1">Total XP</p>
                            <div className="w-24 h-3 bg-black/40 rounded-full overflow-hidden"
                                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}>
                                <motion.div 
                                    className="h-full bg-linear-to-r from-purple-400 to-purple-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    style={{ boxShadow: '0 0 8px #a855f7' }}
                                />
                            </div>
                        </div>
                        <span className="text-white text-xs font-bold">1,500</span>
                    </Button3D>
                </motion.div>

                {/* Settings */}
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, delay: 0.1 }}
                    className="relative" // Relative for dropdown positioning
                >
                    <Button3D onClick={() => setSettingsOpen(!settingsOpen)} className="p-4">
                        <motion.span 
                            className="text-white block"
                            animate={{ rotate: settingsOpen ? 90 : 0 }}
                        >
                            <Settings size={28} />
                        </motion.span>
                    </Button3D>
                    <AnimatePresence>
                        {settingsOpen && (
                            <motion.div 
                                className="absolute right-full top-0 mr-2 w-40 rounded-2xl overflow-hidden z-40" // Moved to left of button
                                style={{ 
                                    background: 'linear-gradient(180deg, #5c4a3a 0%, #3d3228 100%)',
                                    border: '3px solid #8B7355',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                                }}
                                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                            >
                                <button className="w-full px-4 py-3 text-white text-sm hover:bg-white/10 flex items-center gap-3 transition-colors">
                                    <Volume2 size={18} /> Sound
                                </button>
                                <button className="w-full px-4 py-3 text-white text-sm hover:bg-white/10 flex items-center gap-3 transition-colors">
                                    <Music size={18} /> Music
                                </button>
                                {user ? (
                                    <>
                                        <Link to="/profile" className="w-full px-4 py-3 text-white text-sm hover:bg-white/10 flex items-center gap-3 transition-colors">
                                            <User size={18} /> Profile
                                        </Link>
                                        <button onClick={handleLogout} className="w-full px-4 py-3 text-red-400 text-sm hover:bg-red-500/20 flex items-center gap-3 transition-colors">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="w-full px-4 py-3 text-green-400 text-sm hover:bg-green-500/20 flex items-center gap-3 transition-colors">
                                        <User size={18} /> Login
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Daily Reward */}
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, delay: 0.2 }}
                >
                    <Button3D className="p-4 relative">
                        <span className="text-white"><Calendar size={28} /></span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"
                            style={{ boxShadow: '0 0 8px #ef4444' }}></div>
                    </Button3D>
                </motion.div>

                {/* Ranks */}
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, delay: 0.25 }}
                >
                    <Button3D className="p-4 flex items-center justify-center">
                        <span className="text-yellow-400 filter drop-shadow-md"><Trophy size={28} /></span>
                    </Button3D>
                </motion.div>
            </div>

            {/* ===== RIGHT BOTTOM - Play Button ===== */}
            <motion.div 
                className="fixed right-4 bottom-4 z-30"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, delay: 0.3 }}
            >
                <Button3D variant="green" className="px-8 py-5">
                    <div className="flex items-center gap-2 justify-center">
                        <Play size={28} fill="currentColor" className="text-white" />
                        <p className="text-white font-black text-2xl drop-shadow-lg" style={{ textShadow: '2px 2px 0 #15803d' }}>PLAY</p>
                    </div>
                    <p className="text-white/80 text-sm font-bold text-center">Level 5</p>
                </Button3D>
            </motion.div>

            {/* ===== SCROLLABLE LEVEL MAP ===== */}
            <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden no-scrollbar">
                <div className="relative w-full" style={{ 
                    height: '1200px',
                    backgroundImage: 'url(/assets/clean-turf-fixed.png)',
                    backgroundSize: '400px', 
                    backgroundRepeat: 'repeat',
                }}>
                    
                    {/* Background Decorations (Scroll with map) */}
                    <div>
                        {decorations.map((deco, i) => (
                            <motion.img 
                                key={`deco-${i}`}
                                src={deco.src}
                                alt="decoration"
                                className={`absolute drop-shadow-lg ${deco.zIndex}`}
                                style={{ 
                                    left: `${deco.x}%`, 
                                    top: `${deco.y}%`,
                                    width: deco.size,
                                    opacity: deco.opacity,
                                    filter: deco.brightness ? `brightness(${deco.brightness})` : 'none'
                                }}
                                animate={deco.animate}
                                transition={deco.transition}
                            />
                        ))}
                    </div>
                    
                    {/* Sky & Clouds */}
                    <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, transparent 100%)' }}>
                        {/* Animated clouds */}
                        <motion.div 
                            className="absolute top-[30px] w-24 h-12 bg-white/80 rounded-full"
                            style={{ filter: 'blur(2px)' }}
                            animate={{ x: ['5%', '15%', '5%'] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div 
                            className="absolute top-[50px] w-16 h-8 bg-white/70 rounded-full"
                            style={{ filter: 'blur(1px)' }}
                            animate={{ x: ['80%', '70%', '80%'] }}
                            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        />
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
                        <motion.span 
                            key={i} 
                            className="absolute text-white/60 pointer-events-none drop-shadow"
                            style={pos}
                            animate={{ y: [0, 10, 0], rotate: [0, 180, 360] }}
                            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Snowflake size={20} />
                        </motion.span>
                    ))}

                    {/* Path line with glow */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <path 
                            d={`M ${getPosition(0).x} ${getPosition(0).y} ${levels.slice(1).map((_, i) => `L ${getPosition(i + 1).x} ${getPosition(i + 1).y}`).join(' ')}`}
                            stroke="#6b5a4a"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                        />
                    </svg>

                    {/* Level Nodes */}
                    {levels.map((level, index) => {
                        const pos = getPosition(index);
                        const isCurrentLevel = level.unlocked && !levels[index + 1]?.unlocked;

                        return (
                            <motion.div 
                                key={level.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05, type: 'spring' }}
                            >
                                <LevelButton3D 
                                    level={level}
                                    isCurrentLevel={isCurrentLevel}
                                    onClick={() => handleLevelClick(level)}
                                />
                            </motion.div>
                        );
                    })}


                </div>
            </div>

            {/* Level Modal with 3D effect */}
            <AnimatePresence>
                {selectedLevel && (
                    <motion.div 
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedLevel(null)}
                    >
                        <motion.div 
                            className="w-80 rounded-3xl overflow-hidden"
                            style={{ 
                                background: 'linear-gradient(180deg, #6b5a4a 0%, #5c4a3a 30%, #3d3228 100%)',
                                border: '5px solid #a08060',
                                boxShadow: `
                                    inset 0 2px 8px rgba(255,255,255,0.2),
                                    0 10px 0 #2a2218,
                                    0 12px 8px rgba(0,0,0,0.4),
                                    0 20px 40px rgba(0,0,0,0.6)
                                `
                            }}
                            initial={{ scale: 0.8, y: 50, rotateX: -15 }}
                            animate={{ scale: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.8, y: 50, rotateX: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-4 text-center"
                                style={{ 
                                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
                                }}>
                                <p className="text-yellow-300 font-black text-2xl drop-shadow-lg">Level {selectedLevel.id}</p>
                                <p className="text-white/80 font-semibold">{selectedLevel.name}</p>
                            </div>
                            
                            <div className="p-6 text-center">
                                {/* Level icon */}
                                <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center relative"
                                    style={{ 
                                        background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 30%, #d97706 70%, #b45309 100%)',
                                        border: '4px solid #fcd34d',
                                        boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.3), 0 6px 0 #92400e, 0 8px 12px rgba(0,0,0,0.4)'
                                    }}>
                                    <div className="absolute top-1 left-2 right-2 h-6 bg-linear-to-b from-white/40 to-transparent rounded-t-xl" />
                                    <span className="text-white drop-shadow-lg">{selectedLevel.icon && React.cloneElement(selectedLevel.icon, { size: 48 })}</span>
                                </div>
                                
                                {/* Stars */}
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3].map((star) => (
                                        <motion.span 
                                            key={star} 
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: star * 0.15 }}
                                        >
                                            <Star 
                                                size={32} 
                                                className={`${star <= selectedLevel.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 fill-gray-600'}`} 
                                            />
                                        </motion.span>
                                    ))}
                                </div>
                                
                                {/* Play button */}
                                <Button3D variant="green" className="w-full py-4">
                                     <div className="flex items-center gap-2 justify-center">
                                        <Play size={24} fill="currentColor" className="text-white" />
                                        <span className="text-white font-black text-xl drop-shadow-lg">PLAY</span>
                                    </div>
                                </Button3D>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserHome;
