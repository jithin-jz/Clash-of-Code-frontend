import React from 'react';
import { motion } from 'framer-motion';
import LevelButton from '../game/LevelButton';

const LevelMap = ({ 
    levels, 
    handleLevelClick 
}) => {

    return (
        <div 
            className="w-full h-full relative flex items-center justify-center overflow-hidden z-0"
        >
            <div className="relative w-full h-full max-w-[800px] max-h-[800px] aspect-square">
                
                {/* Responsive SVG Container */}
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    viewBox="0 0 100 100"
                >
                    <defs>
                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBbf24" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#B45309" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    
                    {/* Road Border */}
                    <path 
                        d={`M ${levels[0].position.x} ${levels[0].position.y} ${levels.slice(1).map(l => `L ${l.position.x} ${l.position.y}`).join(' ')}`}
                        stroke="rgba(255, 215, 0, 0.3)" 
                        strokeWidth="1.2" 
                        fill="none" 
                        strokeLinecap="square" 
                        strokeLinejoin="miter" 
                    />

                    {/* Road Surface */}
                    <path 
                        d={`M ${levels[0].position.x} ${levels[0].position.y} ${levels.slice(1).map(l => `L ${l.position.x} ${l.position.y}`).join(' ')}`}
                        stroke="#0f0f0f" 
                        strokeWidth="0.8" 
                        fill="none" 
                        strokeLinecap="square" 
                        strokeLinejoin="miter" 
                    />

                    {/* Road Center Line (Dashed) */}
                    <path 
                        d={`M ${levels[0].position.x} ${levels[0].position.y} ${levels.slice(1).map(l => `L ${l.position.x} ${l.position.y}`).join(' ')}`}
                        stroke="rgba(255, 255, 255, 0.15)" 
                        strokeWidth="0.1" 
                        strokeDasharray="0.5 0.5"
                        fill="none" 
                        strokeLinecap="square" 
                        strokeLinejoin="miter" 
                    />
                </svg>

                {/* Level Nodes */}
                {levels.map((level, index) => {
                    const isCurrentLevel = level.unlocked && !levels[index + 1]?.unlocked;
                    const isCenter = index === levels.length - 1;
                    
                    return (
                        <motion.div 
                            key={level.id} 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" 
                            style={{ 
                                left: `${level.position.x}%`, 
                                top: `${level.position.y}%` 
                            }}
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            transition={{ delay: index * 0.02, type: 'spring', stiffness: 200 }}
                        >
                            <div className="relative group">
                                {/* Center Certificate Glow */}
                                {isCenter && (
                                    <div className="absolute inset-0 bg-yellow-500/50 rounded-full blur-3xl animate-pulse w-24 h-24 -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
                                )}

                                {/* Pulse Effect for Current Level */}
                                {isCurrentLevel && !isCenter && (
                                    <div className="absolute inset-0 bg-[#FFD700]/30 rounded-lg blur-lg animate-pulse"></div>
                                )}
                                
                                <LevelButton level={level} isCurrentLevel={isCurrentLevel} onClick={() => handleLevelClick(level)} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelMap;
