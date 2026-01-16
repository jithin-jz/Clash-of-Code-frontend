import React from 'react';

const StatsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-[#121212] rounded-3xl p-6 border border-white/5 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#FFD700]/10 flex flex-col items-center text-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[#FFD700] mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                    </div>
                    
                    <h3 className="text-3xl font-black text-white mb-1 tracking-tight group-hover:text-[#FFD700] transition-colors">
                        {stat.value}
                    </h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
