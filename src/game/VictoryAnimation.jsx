import React, { useEffect, useRef } from 'react';

const VictoryAnimation = ({ type }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);

    useEffect(() => {
        if (!type || type === 'default') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const createFirework = (x, y, color) => {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                particles.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    color: color || `hsl(${Math.random() * 360}, 100%, 50%)`,
                    size: Math.random() * 3 + 1,
                    isFirework: true
                });
            }
        };

        const loop = () => {
            // Clear with trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.05) {
                createFirework(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height * 0.5,
                    type === 'gold' ? '#FFD700' : undefined
                );
            }

            particles.current.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // Gravity
                p.life -= 0.01;
                p.size *= 0.98;

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    return;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [type]);

    if (!type || type === 'default') return null;

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none z-[60]"
        />
    );
};

export default VictoryAnimation;
