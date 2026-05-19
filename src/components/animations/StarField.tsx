import { useEffect, useRef } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDir: number;
  color: string;
  hasGlow: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface StarFieldProps {
  scrollVelocity: MotionValue<number>;
}

export const StarField = ({ scrollVelocity }: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  
  // Local velocity storage for the animation loop
  const currentVelocity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 3000);
      const starColors = ['#fff', '#fff', '#fff', '#dfe9ff', '#fff3e0', '#ffebee']; // White, blue-white, warm-white
      
      starsRef.current = Array.from({ length: count }, () => {
        const sizeBase = Math.random();
        // Many tiny stars, few medium stars
        const size = sizeBase > 0.9 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.8 + 0.1;
        
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          opacity: Math.random() * 0.6 + 0.1,
          twinkleSpeed: Math.random() * 0.01 + 0.003,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          hasGlow: Math.random() > 0.95 && size > 1.0
        };
      });
    };

    const spawnMeteor = () => {
      const scrollSpeed = Math.abs(currentVelocity.current);
      if (Math.random() > 0.96 || scrollSpeed > 0.03) {
        if (meteorsRef.current.length < 12) {
          meteorsRef.current.push({
            x: Math.random() * canvas.width,
            y: -50,
            length: Math.random() * 100 + 50,
            speed: (scrollSpeed * 800) + Math.random() * 10 + 5,
            opacity: 1
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      currentVelocity.current = scrollVelocity.get();

      // Render Static Stars
      starsRef.current.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity > 0.7 || star.opacity < 0.1) star.twinkleDir *= -1;

        if (star.hasGlow) {
          const glowGrade = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glowGrade.addColorStop(0, star.color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#fff', 'rgba(255,255,255'));
          glowGrade.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrade;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Move stars slightly based on scroll for parallax effect
        star.y -= currentVelocity.current * 80 * (star.size / 2);
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      // Render Meteors (Star Rain)
      spawnMeteor();
      meteorsRef.current = meteorsRef.current.filter(m => {
        m.y += m.speed;
        m.opacity -= 0.015;
        
        if (m.opacity <= 0 || m.y > canvas.height + m.length) return false;

        const gradient = ctx.createLinearGradient(m.x, m.y, m.x, m.y - m.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity * 0.8})`);
        gradient.addColorStop(0.2, `rgba(167, 139, 250, ${m.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x, m.y - m.length);
        ctx.stroke();
        
        return true;
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, [scrollVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};
