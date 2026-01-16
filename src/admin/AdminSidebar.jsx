import React from 'react';
import { BarChart2, Users, Settings, LogOut, ChevronRight, Shield, Crown } from 'lucide-react';

const AdminSidebar = ({ user, activeTab, setActiveTab, handleLogout }) => {
    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
        { id: 'users', label: 'Users', icon: <Users size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-80 h-full bg-[#050505] border-r border-white/5 flex flex-col p-6 shrink-0 relative z-20">
            {/* Identity Card */}
            <div className="w-full bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-[20px] bg-[#1a1a1a] p-1 border-2 border-white/5 shadow-inner">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center">
                             {user?.profile?.avatar_url ? (
                                <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-[#FFD700]">{user?.username?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                     <div className="absolute -bottom-2 -right-2 bg-[#121212] p-1 rounded-xl">
                        <div className="bg-[#FFD700] w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                            <Crown size={16} className="text-black fill-black" />
                        </div>
                    </div>
                </div>
                
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    {user?.username}
                    <Shield size={14} className="text-[#FFD700] fill-[#FFD700]/20" />
                </h2>
                <p className="text-[#FFD700] text-xs font-bold tracking-wider uppercase opacity-80">Grand Warden</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {sidebarItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group border ${
                            activeTab === item.id 
                                ? 'bg-[#121212] border-white/5 text-white shadow-lg' 
                                : 'bg-transparent border-transparent text-gray-500 hover:bg-[#121212] hover:text-gray-300 hover:border-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-colors ${
                                activeTab === item.id ? 'bg-[#FFD700] text-black' : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                                {item.icon}
                            </div>
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </div>
                        {activeTab === item.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]"></div>
                        )}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all font-bold text-sm bg-red-500/5 hover:shadow-lg hover:shadow-red-500/20 group border border-red-500/10 hover:border-red-500"
                >
                    <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-white/20 transition-colors text-red-500 group-hover:text-white">
                        <LogOut size={18} />
                    </div>
                    <span>Leave Realm</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
