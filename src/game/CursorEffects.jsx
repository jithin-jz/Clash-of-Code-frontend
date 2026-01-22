import React, { useEffect, useRef } from 'react';

const CursorEffects = ({ effectType }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);

    useEffect(() => {
        if (!effectType) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const createParticle = (x, y) => {
            const count = effectType === 'fire' ? 5 : 2;
            for (let i = 0; i < count; i++) {
                particles.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: effectType === 'fire' ? -Math.random() * 4 : (Math.random() - 0.5) * 4,
                    life: 1,
                    color: effectType === 'fire' 
                        ? `hsl(${Math.random() * 40 + 10}, 100%, 50%)` // Orange/Red
                        : `hsl(${Math.random() * 360}, 100%, 50%)`, // Rainbow
                    size: Math.random() * 4 + 2
                });
            }
        };

        // Listen for typing (simplified: any keydown)
        const handleKeyDown = (e) => {
            // We can't easily get exact cursor position from outside Monaco without passing coords.
            // For now, let's just spawn random or center, OR better:
            // We will trust the parent to pass coordinates or just use mouse for "fun" if we can't hook to cursor.
            // ACTUALLY, in a real editor, we'd hook into monaco.onDidChangeCursorPosition.
            // Since this is a separate component, let's just listen to generic window clicks/keys for demo, 
            // BUT ideally CodeArena should drive this.
        };
        
        // Loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.current.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                p.size *= 0.95;

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

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [effectType]);

    // Expose spawn method
    useEffect(() => {
        window.spawnCursorEffect = (x, y) => {
             const count = effectType === 'fire' ? 8 : 4;
             for (let i = 0; i < count; i++) {
                particles.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: effectType === 'fire' ? -Math.random() * 5 - 2 : (Math.random() - 0.5) * 5,
                    life: 1.0,
                    color: effectType === 'fire' 
                        ? `rgba(255, ${Math.floor(Math.random() * 150)}, 0, 1)` 
                        : `hsl(${Math.random() * 360}, 80%, 60%)`,
                    size: Math.random() * 6 + 2
                });
            }
        };
    }, [effectType]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none z-50"
        />
    );
};

export default CursorEffects;
