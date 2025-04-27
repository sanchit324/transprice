import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  title?: string;
}

export const ModalDialog = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  title,
}: ModalDialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20, 
      transition: { 
        duration: 0.2 
      } 
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={cn(
              "relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden",
              className
            )}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                {title && (
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            <div className="overflow-auto max-h-[calc(90vh-4rem)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 