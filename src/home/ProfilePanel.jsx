import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';

const ProfilePanel = ({ user }) => {
    return (
        <motion.div 
            className="fixed left-6 top-6 z-30"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <Link to={user ? "/profile" : "/login"}>
                <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-4 hover:border-[#FFD700]/30 transition-all hover:bg-[#1a1a1a] shadow-2xl group">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-[#FFD700] transition-colors relative z-10">
                            {user?.profile?.avatar_url ? (
                                <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-zinc-800 to-black flex items-center justify-center text-white/50">
                                    <User size={20} />
                                </div>
                            )}
                        </div>

                    </div>
                    
                    <div className="pr-2">
                        <div className="flex items-center gap-1.5">
                            <p className="text-white font-bold text-sm tracking-wide group-hover:text-[#FFD700] transition-colors">
                                {user?.username || 'Guest'}
                            </p>
                            {user && <Shield size={12} className="text-[#FFD700] fill-[#FFD700]/20" />}
                        </div>
                        {!user && (
                            <p className="text-white/40 text-xs font-medium">
                                Tap to Login
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProfilePanel;
