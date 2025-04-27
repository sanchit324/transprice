import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-10 inset-x-0 max-w-fit mx-auto border border-transparent dark:border-white/[0.2] rounded-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center flex justify-center space-x-4 dark:bg-black",
            className
          )}
        >
          {navItems.map((navItem, idx) => (
            <a
              key={`nav-item-${idx}`}
              href={navItem.link}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium text-neutral-500 dark:text-neutral-300 transition-all duration-300",
                activeIndex === idx ? "text-neutral-950 dark:text-neutral-50" : ""
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {navItem.icon && navItem.icon}
                <span>{navItem.name}</span>
              </span>
              
              {activeIndex === idx && (
                <motion.div
                  layoutId="navbar-active-item"
                  className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              )}
            </a>
          ))}

          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            <span>Get in touch</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 