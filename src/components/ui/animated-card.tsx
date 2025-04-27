import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  spotlightColor?: string;
  isLight?: boolean;
}

export const AnimatedCard = ({
  children,
  className,
  containerClassName,
  spotlightColor = "rgba(79, 70, 229, 0.15)", // default indigo color
  isLight = true,
}: AnimatedCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsFocused(true);
    setOpacity(0.15);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl transition-all duration-300",
        containerClassName
      )}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent)`,
        }}
      />
      
      {/* Card with subtle animation */}
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative z-10 overflow-hidden rounded-xl border shadow-md",
          isLight 
            ? "border-neutral-200 bg-white" 
            : "border-slate-700 bg-slate-800",
          isFocused && "shadow-lg",
          className
        )}
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}; 