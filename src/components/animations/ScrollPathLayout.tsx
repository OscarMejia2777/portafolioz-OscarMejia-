import { motion, useScroll, useSpring, useVelocity } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { StarField } from './StarField';

export const ScrollPathLayout = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-bg overflow-hidden">
      <StarField scrollVelocity={scrollVelocity} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-0 py-12">
        {children}
      </div>
    </div>
  );
};
