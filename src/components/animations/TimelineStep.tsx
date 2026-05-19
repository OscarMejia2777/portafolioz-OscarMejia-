import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TimelineStepProps {
  children: ReactNode;
  side?: 'left' | 'right';
  fullBleed?: boolean;
}

export const TimelineStep = ({ children, side = 'left', fullBleed = false }: TimelineStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ x: 0 }} // Hard reset for any transform
      className={`w-full flex justify-center ${side === 'left' ? 'lg:justify-start lg:pl-12' : 'lg:justify-end lg:pr-12'} mb-12 lg:mb-20 relative ${fullBleed ? 'px-0' : 'px-4 sm:px-6 lg:px-0'}`}
    >
      {/* Content wrapper */}
      <div className={`
        w-full lg:w-[85%]
        lg:bg-white/[0.01] lg:backdrop-blur-[2px] 
        ${fullBleed ? 'p-0' : 'p-4 sm:p-8'} 
        lg:p-12 lg:rounded-3xl
      `}>
        {children}
      </div>
    </motion.div>
  );
};
