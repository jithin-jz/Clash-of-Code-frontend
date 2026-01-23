import React from 'react';

const HomeSkeleton = () => {
    return (
        <div className="h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Texture */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
                    backgroundSize: '40px 40px' 
                }} 
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

            {/* Top Bar Skeleton */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-white/10"></div>
                <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 rounded bg-white/10"></div>
                    <div className="w-24 h-3 rounded bg-white/5"></div>
                </div>
            </div>

            {/* Right Side UI Skeleton */}
            <div className="absolute top-6 right-6 z-50 flex flex-col gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-white/10"></div>
                <div className="w-12 h-12 rounded-full bg-white/10"></div>
                <div className="w-12 h-12 rounded-full bg-white/10"></div>
            </div>

            {/* Play Button Skeleton */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-pulse">
                <div className="w-64 h-20 rounded-full bg-white/10"></div>
            </div>

            {/* Map Nodes Skeleton (Scattered) */}
            <div className="absolute inset-0 z-0">
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-16 h-16 rounded-full bg-white/5 animate-pulse"
                        style={{
                            top: `${20 + (i * 12) % 60}%`,
                            left: `${10 + (i * 17) % 80}%`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HomeSkeleton;
