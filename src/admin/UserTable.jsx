import React from 'react';
import Loader from '../common/Loader';
import { Users, RefreshCw, Gavel, Unlock, ExternalLink } from 'lucide-react';

const UserTable = ({ userList, tableLoading, currentUser, handleBlockToggle, fetchUsers }) => {
    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Users className="text-[#ffd700]" size={24} /> 
                    <span>Realm Inhabitants</span>
                </h2>
                <button 
                    onClick={fetchUsers} 
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white hover:text-[#ffd700] text-sm font-bold rounded-xl border border-white/5 transition-all flex items-center gap-2 group"
                >
                    <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Refresh</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <table className="w-full relative border-separate border-spacing-0">
                    <thead className="bg-[#151515] sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="text-left text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 border-b border-white/5 bg-[#151515]">Warrior</th>
                            <th className="text-left text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 border-b border-white/5 bg-[#151515]">Rank</th>
                            <th className="text-left text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 border-b border-white/5 bg-[#151515]">Status</th>
                            <th className="text-right text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 border-b border-white/5 bg-[#151515]">Command</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tableLoading ? (
                            <tr><td colSpan="4" className="text-center py-20"><Loader isLoading={true}/></td></tr>
                        ) : userList.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-20 text-gray-500 font-medium">No inhabitants found.</td></tr>
                        ) : (
                            userList.map((usr, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[14px] bg-[#1a1a1a] p-1 border border-white/5 group-hover:border-[#FFD700]/30 transition-colors">
                                                <div className="w-full h-full rounded-[10px] overflow-hidden flex items-center justify-center bg-[#111] text-[#ffd700] font-bold">
                                                    {usr.profile?.avatar_url ? (
                                                        <img src={usr.profile.avatar_url} className="w-full h-full object-cover" alt={usr.username}/>
                                                    ) : (
                                                        usr.username[0].toUpperCase()
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm group-hover:text-[#ffd700] transition-colors">{usr.username}</p>
                                                <p className="text-gray-600 text-xs font-mono">{usr.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex gap-2">
                                            {usr.is_superuser && (
                                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wide flex items-center gap-1.5">
                                                    Leader
                                                </span>
                                            )}
                                            {!usr.is_staff && !usr.is_superuser && (
                                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gray-500/10 text-gray-500 border border-gray-500/20 uppercase tracking-wide flex items-center gap-1.5">
                                                    Member
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                                            usr.is_active 
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                            {usr.is_active ? 'Active' : 'Banned'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a 
                                                href={`/profile/${usr.username}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#FFD700] border border-white/5 transition-all group/view"
                                                title="View Profile"
                                            >
                                                <ExternalLink size={14} className="group-hover/view:scale-110 transition-transform"/>
                                            </a>
                                            <button 
                                                onClick={() => handleBlockToggle(usr.username)}
                                                disabled={currentUser.username === usr.username} 
                                                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all border flex items-center gap-2 ${
                                                    currentUser.username === usr.username 
                                                        ? 'opacity-30 cursor-not-allowed bg-transparent border-white/5 text-gray-600'
                                                        : usr.is_active 
                                                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/50' 
                                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/50'
                                                }`}
                                            >
                                                {usr.is_active ? <Gavel size={14}/> : <Unlock size={14}/>}
                                                <span>{usr.is_active ? 'Ban' : 'Unban'}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
