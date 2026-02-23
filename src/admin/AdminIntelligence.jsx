import React, { useMemo } from "react";
import {
    Zap,
    Target,
    TrendingUp,
    Users,
    Gem,
    BarChart3,
    Calendar,
    MousePointer2
} from "lucide-react";

const IntelligenceCard = (props) => {
    const { title, value, subtext, icon: Icon, trend, color = "blue" } = props;
    const colorMap = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    };

    const selectedColor = colorMap[color] || colorMap.blue;

    return (
        <div className="p-5 rounded-2xl bg-[#0f1b2e]/70 border border-[#7ea3d9]/20 backdrop-blur-xl group hover:border-[#7ea3d9]/40 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl border ${selectedColor}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <TrendingUp size={10} />
                        {trend}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    {title}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
                        {value}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                        {subtext}
                    </span>
                </div>
            </div>
        </div>
    );
};

const AdminIntelligence = ({ stats, integrity, userList, data }) => {
    // Simple calculated metrics for "Intelligence"
    const intelligenceMetrics = useMemo(() => {
        if (!data) {
            // Fallback to calculation if backend hasn't returned yet
            if (!userList || !integrity) return [];

            const totalUsers = userList.length || integrity.users || 0;
            const activeUsers = userList.filter(u => u.is_active).length;
            const staffCount = userList.filter(u => u.is_staff || u.is_superuser).length;
            const avgGems = totalUsers > 0 ? Math.round((stats?.total_gems || 0) / totalUsers) : 0;
            const engagementScore = totalUsers > 0 ? Math.round((integrity.challenges / totalUsers) * 10) : 0;

            return [
                { title: "User Retention", value: `${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%`, subtext: "System wide", icon: Users, trend: "+2.4%", color: "blue" },
                { title: "Economic Pulse", value: `${stats?.total_gems?.toLocaleString() || 0}`, subtext: `${avgGems} XP / User`, icon: Gem, trend: "+12%", color: "purple" },
                { title: "Intelligence Index", value: `${engagementScore}`, subtext: "E_SCORE / 100", icon: Target, trend: "+5.1%", color: "green" },
                { title: "Admin Overhead", value: `${staffCount}`, subtext: "Supervisors", icon: Zap, color: "orange" }
            ];
        }

        const m = data.metrics;
        return [
            { title: "User Retention", value: `${m.retention_rate}%`, subtext: "System wide", icon: Users, trend: m.retention_rate > 80 ? "+High" : "+Stable", color: "blue" },
            { title: "Economic Pulse", value: `${stats?.total_gems?.toLocaleString() || 0}`, subtext: `${m.avg_gems_per_user} XP / User`, icon: Gem, trend: "+Rising", color: "purple" },
            { title: "Intelligence Index", value: `${m.engagement_score}`, subtext: "E_SCORE / 100", icon: Target, trend: "+Active", color: "green" },
            { title: "Admin Overhead", value: `${m.admin_count}`, subtext: "Supervisors", icon: Zap, color: "orange" }
        ];
    }, [userList, integrity, stats, data]);

    const activityData = useMemo(() => {
        if (data?.activity_distribution) return data.activity_distribution;
        return Array(12).fill(0).map((_, i) => ({
            month: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i],
            value: 40 + (i * 5)
        }));
    }, [data]);

    const recentEvents = useMemo(() => {
        if (data?.recent_events) return data.recent_events;
        return [
            { type: 'login', user: 'jithin', time: '2m ago', color: 'blue' },
            { type: 'solve', user: 'admin', time: '14m ago', color: 'emerald' },
            { type: 'purchase', user: 'kira', time: '1h ago', color: 'purple' },
        ];
    }, [data]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                    System Intelligence
                </h2>
                <p className="text-sm text-slate-500">
                    Real-time cognitive overview and economic metrics.
                </p>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {intelligenceMetrics.map((metric, idx) => (
                    <IntelligenceCard key={idx} {...metric} />
                ))}
            </div>

            {/* Visual Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Distribution */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f1b2e]/70 border border-[#7ea3d9]/20 backdrop-blur-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-slate-400" />
                            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                                Activity Distribution
                            </h3>
                        </div>
                    </div>

                    {/* Dynamic Bar Chart */}
                    <div className="h-48 flex items-end gap-3 px-2">
                        {activityData.map((item, i) => (
                            <div key={i} className="flex-1 group/bar relative">
                                <div
                                    className="w-full bg-blue-500/20 border-t border-x border-blue-500/30 rounded-t-lg transition-all duration-500 group-hover/bar:bg-blue-500/40 relative overflow-hidden"
                                    style={{ height: `${(item.value / 100) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/[0.05] to-transparent pointer-events-none" />
                                </div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-1 border-t border-white/5 pt-3">
                        {activityData.map(d => (
                            <span key={d.month} className="text-[9px] text-slate-500 font-bold">{d.month}</span>
                        ))}
                    </div>
                </div>

                {/* System Health / Real-time Feed */}
                <div className="p-6 rounded-2xl bg-[#0f1b2e]/70 border border-[#7ea3d9]/20 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar size={18} className="text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                            Recent Events
                        </h3>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                        {recentEvents.map((event, i) => (
                            <div key={i} className="flex items-start gap-3 group/item">
                                <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 animate-pulse bg-${event.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-slate-200 font-medium truncate">
                                        <span className="text-slate-500 font-normal">[{event.user}]</span> {event.type}
                                    </span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <MousePointer2 size={12} className="text-emerald-400" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Tracking</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminIntelligence;
