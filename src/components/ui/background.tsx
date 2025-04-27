import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dotClassName?: string;
  dotSize?: number;
  dotSpacing?: number;
  dotColor?: string;
  dotActiveColor?: string;
  animate?: boolean;
}

export const GridBackground = ({
  children,
  className = "",
  containerClassName = "",
  dotClassName = "",
  dotSize = 1,
  dotSpacing = 24,
  dotColor = "#e5e7eb",
  dotActiveColor = "#818cf8",
  animate = true,
}: GridBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = React.useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !animate) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Calculate which dot is closest to the mouse
    const x = Math.floor(mouseX / dotSpacing);
    const y = Math.floor(mouseY / dotSpacing);

    // Only update state if the hovered cell has changed
    if (!hoveredCell || hoveredCell.x !== x || hoveredCell.y !== y) {
      setHoveredCell({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Calculate grid dimensions based on container size
  const [gridDimensions, setGridDimensions] = React.useState({ cols: 0, rows: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;
      setGridDimensions({ cols, rows });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dotSpacing]);

  // Generate grid cells
  const cells = [];
  for (let y = 0; y < gridDimensions.rows; y++) {
    for (let x = 0; x < gridDimensions.cols; x++) {
      const distance = hoveredCell
        ? Math.sqrt(Math.pow(hoveredCell.x - x, 2) + Math.pow(hoveredCell.y - y, 2))
        : null;
      
      const isActive = distance !== null && distance < 3;
      const opacity = isActive ? Math.max(0, 1 - distance / 3) : 0;
      
      cells.push(
        <motion.div
          key={`${x}-${y}`}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: isActive ? 1.5 : 1,
            background: isActive ? dotActiveColor : dotColor,
            opacity: isActive ? opacity * 1 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className={`absolute rounded-full ${dotClassName}`}
          style={{
            width: dotSize,
            height: dotSize,
            left: x * dotSpacing,
            top: y * dotSpacing,
          }}
        />
      );
    }
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <div
        ref={containerRef}
        className={`absolute inset-0 ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {cells}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full min-w-[1000px] opacity-20"
        style={{ top: "50%", transform: "translateY(-60%)" }}
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          d="M0,224L48,186.7C96,149,192,75,288,74.7C384,75,480,149,576,181.3C672,213,768,203,864,170.7C960,139,1056,85,1152,69.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          stroke="#4F46E5"
          strokeWidth="6"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,154.7C840,117,960,75,1080,74.7C1200,75,1320,117,1380,138.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          stroke="#818CF8"
          strokeWidth="4"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,112C672,117,768,171,864,181.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          stroke="#93C5FD"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}; 