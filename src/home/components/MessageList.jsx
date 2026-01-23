import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const MessageList = ({ 
    user, 
    messages, 
    setChatOpen, 
    messagesEndRef 
}) => {
    
    if (!user) {
        return (
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
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-linear-to-b from-transparent to-black/30 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-10 text-sm">
                    No messages yet. Be the first!
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col gap-2 group ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Link 
                            to={`/profile/${msg.username}`}
                            onClick={() => setChatOpen(false)}
                            className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-[#FFD700] transition-colors"
                        >
                            {msg.username === user?.username ? (
                                user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt={msg.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-bold">
                                        {msg.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )
                            ) : (
                                msg.avatar_url ? (
                                    <img src={msg.avatar_url} alt={msg.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-bold">
                                        {msg.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )
                            )}
                        </Link>
                        <div className={`flex flex-col gap-1 max-w-[85%] ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2">
                                <Link 
                                    to={`/profile/${msg.username}`}
                                    onClick={() => setChatOpen(false)}
                                    className={`${msg.username === user?.username ? 'text-[#FFD700]' : 'text-blue-400'} font-bold text-xs tracking-wide hover:underline cursor-pointer`}
                                >
                                    {msg.username}
                                </Link>
                                {msg.timestamp && (
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <div className={`
                                rounded-2xl text-sm leading-relaxed shadow-sm transition-colors
                                ${msg.username === user?.username 
                                    ? 'bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] rounded-tr-sm p-3' 
                                    : 'bg-[#1a1a1a] border border-white/5 text-gray-300 rounded-tl-sm group-hover:bg-[#222] p-3'
                                }
                            `}>
                                {msg.message}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default memo(MessageList);
