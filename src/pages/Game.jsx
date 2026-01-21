import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, Gamepad2, Trophy, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import useAuthStore from '../stores/useAuthStore';

const Game = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const sections = [
        {
            id: 'campaign',
            title: 'Campaign Levels',
            description: 'Embark on a journey through challenging coding puzzles.',
            icon: <Map className="w-12 h-12 text-[#FFD700]" />,
            color: 'from-orange-500/20 to-red-500/20',
            borderColor: 'group-hover:border-orange-500/50',
            action: 'Continue Journey',
            locked: false,
            onClick: () => {
                const currentLevel = Math.floor((user?.profile?.xp || 0) / 1000) + 1;
                navigate(`/level/${currentLevel}`);
            },
        },
        {
            id: 'arcade',
            title: 'Arcade Mode',
            description: 'Quick matches and mini-games to test your reflexes.',
            icon: <Gamepad2 className="w-12 h-12 text-cyan-400" />,
            color: 'from-cyan-500/20 to-blue-500/20',
            borderColor: 'group-hover:border-cyan-500/50',
            action: 'Play Arcade',
            locked: true,
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
                    backgroundSize: '40px 40px' 
                }} 
            />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate('/')}
                        className="rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                            PLAY MODES
                        </h1>
                        <p className="text-gray-500 font-medium">Choose your challenge</p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-[#121212] rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-white/5 ${section.borderColor}`}
                        >
                            {/* Inner Content */}
                            <div className={`h-full bg-[#121212] rounded-[22px] p-8 relative overflow-hidden`}>
                                {/* Gradient Blob */}
                                <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full bg-linear-to-br ${section.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-6 p-4 bg-[#1a1a1a] w-fit rounded-2xl border border-white/5 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                                        {section.icon}
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                                        {section.title}
                                    </h2>
                                    
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        {section.description}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <Button 
                                            className={`w-full py-6 text-lg font-bold tracking-wide ${
                                                section.locked 
                                                ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed hover:bg-[#1a1a1a]' 
                                                : 'bg-white text-black hover:bg-gray-200'
                                            }`}
                                            disabled={section.locked}
                                            onClick={section.onClick}
                                        >
                                            {section.locked ? (
                                                <div className="flex items-center gap-2">
                                                    <Lock size={18} />
                                                    <span>COMING SOON</span>
                                                </div>
                                            ) : (
                                                section.action
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Coming Soon Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative bg-[#121212] rounded-3xl p-8 border border-white/5 border-dashed flex flex-col items-center justify-center text-center gap-4 min-h-[400px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-600">
                            <Trophy size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-500">More Modes Coming</h3>
                        <p className="text-gray-600 max-w-[200px]">Stay tuned for competitive rankings and special events.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Game;
