'use client'
import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface HoverGradientMenuItem {
  icon?: React.ReactNode;
  label?: string;
  href?: string;
  onClick?: () => void;
  component?: React.ReactNode;
  gradient?: string;
  iconColor?: string;
}

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export default function HoverGradientNavBar({ menuItems }: { menuItems: HoverGradientMenuItem[] }): React.JSX.Element {
  return (
    <div className="relative z-50 flex justify-center w-full mb-6">
      <motion.nav
        className="w-full md:w-fit mx-auto px-2 md:px-4 py-2 md:py-3 rounded-none md:rounded-3xl 
        bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-lg 
        border border-zinc-200/80 dark:border-[#27272a]/80 
        shadow-lg md:shadow-xl relative overflow-x-auto no-scrollbar"
        initial="initial"
        whileHover="hover"
      >
        <ul className="flex items-center justify-start sm:justify-around md:justify-center gap-1 md:gap-3 relative z-10 min-w-max px-2 sm:px-0">
          {menuItems.map((item, idx) => (
            <motion.li key={item.label || idx} className="relative flex-1 md:flex-none">
              {item.component ? (
                 <div className="flex items-center justify-center px-2 py-1.5 md:px-4 md:py-2">
                     {item.component}
                 </div>
              ) : (
                  <motion.div
                    className="block rounded-xl md:rounded-2xl overflow-visible group relative"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    {/* Per-item glow */}
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none rounded-xl md:rounded-2xl"
                      variants={glowVariants}
                      style={{
                        background: item.gradient,
                        opacity: 0,
                      }}
                    />
                    {/* Front-facing */}
                    <motion.button
                      onClick={item.onClick}
                      className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 
                      px-2 py-1.5 md:px-4 md:py-2 relative z-10 
                      bg-transparent text-zinc-600 dark:text-zinc-300 
                      group-hover:text-zinc-900 dark:group-hover:text-white 
                      transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm cursor-pointer"
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom"
                      }}
                    >
                      <span className={`transition-colors duration-300 ${item.iconColor}`}>
                        {item.icon}
                      </span>
                      {item.label && <span className="hidden md:inline font-medium">{item.label}</span>}
                    </motion.button>
                    {/* Back-facing */}
                    <motion.button
                      onClick={item.onClick}
                      className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 
                      px-2 py-1.5 md:px-4 md:py-2 absolute inset-0 z-10 
                      bg-transparent text-zinc-600 dark:text-zinc-300 
                      group-hover:text-zinc-900 dark:group-hover:text-white 
                      transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm cursor-pointer"
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        transform: "rotateX(90deg)"
                      }}
                    >
                      <span className={`transition-colors duration-300 ${item.iconColor}`}>
                        {item.icon}
                      </span>
                      {item.label && <span className="hidden md:inline font-medium">{item.label}</span>}
                    </motion.button>
                  </motion.div>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </div>
  );
}
