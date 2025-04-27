import React from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function AnimatedButton({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  icon,
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-blue-800 text-white hover:bg-blue-900 shadow-md",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-950 shadow-md",
    outline: "bg-transparent border border-neutral-300 text-neutral-800 hover:bg-neutral-50"
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-lg",
    md: "text-base px-4 py-2 rounded-lg",
    lg: "text-lg px-5 py-2.5 rounded-xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
} 