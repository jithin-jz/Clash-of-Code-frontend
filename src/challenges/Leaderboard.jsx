import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Crown, Trophy, Medal, Star, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { cn } from '../lib/utils';
import useAuthStore from '../stores/useAuthStore';
import { Button } from '../components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/challenges/leaderboard/');
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankDisplay = (index) => {
        switch (index) {
            case 0: return <div className="flex items-center gap-1"><Crown className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> <span className="font-bold text-yellow-500">1st</span></div>;
            case 1: return <div className="flex items-center gap-1"><Medal className="w-5 h-5 text-gray-400 fill-gray-400/20" /> <span className="font-bold text-gray-400">2nd</span></div>;
            case 2: return <div className="flex items-center gap-1"><Medal className="w-5 h-5 text-amber-700 fill-amber-700/20" /> <span className="font-bold text-amber-700">3rd</span></div>;
            default: return <span className="text-gray-500 font-mono pl-7">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
             {/* Header */}
             <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => navigate('/')}
                        className="h-10 w-10 border-white/10 bg-black hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            Global Leaderboard
                        </h1>
                        <p className="text-sm text-gray-400">Top commanders ranked by completed challenges</p>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="max-w-5xl mx-auto rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5 bg-white/5">
                            <TableHead className="w-[100px] text-gray-400 font-medium">Rank</TableHead>
                            <TableHead className="text-gray-400 font-medium">User</TableHead>
                            <TableHead className="text-gray-400 font-medium">Status</TableHead>
                            <TableHead className="text-right text-gray-400 font-medium">Levels</TableHead>
                            <TableHead className="text-right text-gray-400 font-medium">Total XP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="border-white/5">
                                    <TableCell><div className="h-4 w-8 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
                                            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </TableCell>
                                    <TableCell><div className="h-2 w-2 rounded-full bg-white/5 animate-pulse" /></TableCell>
                                    <TableCell className="text-right"><div className="h-4 w-8 bg-white/5 rounded ml-auto animate-pulse" /></TableCell>
                                    <TableCell className="text-right"><div className="h-4 w-12 bg-white/5 rounded ml-auto animate-pulse" /></TableCell>
                                </TableRow>
                            ))
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-gray-500">
                                    No ranked players yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((rankUser, index) => {
                                const isMe = currentUser?.username === rankUser.username;
                                return (
                                    <TableRow 
                                        key={rankUser.username} 
                                        onClick={() => navigate(`/profile/${rankUser.username}`)}
                                        className={cn(
                                            "border-white/5 transition-colors cursor-pointer",
                                            isMe ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/5"
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            {getRankDisplay(index)}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                 <Avatar className="h-8 w-8 border border-white/10">
                                                    <AvatarImage src={`http://localhost:8000${rankUser.avatar}`} />
                                                    <AvatarFallback className="bg-[#1a1a1a] text-[10px] text-gray-400">
                                                        {rankUser.username[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-sm font-medium", isMe ? "text-primary" : "text-white")}>
                                                            {rankUser.username}
                                                        </span>
                                                        {isMe && <Badge variant="outline" className="text-[10px] h-4 px-1 border-primary/30 text-primary">YOU</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-xs text-gray-400">Online</span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell className="text-right">
                                            <div className="font-mono text-sm text-gray-300">
                                                {rankUser.completed_levels}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                             <div className="font-mono text-sm text-amber-500 font-medium">
                                                {rankUser.xp.toLocaleString()}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Leaderboard;
