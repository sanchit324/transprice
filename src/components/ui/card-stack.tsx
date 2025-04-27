import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  content: React.ReactNode;
};

interface CardStackProps {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  className?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
}

export const CardStack = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
  className = "",
  autoRotate = true,
  rotationInterval = 5000,
}: CardStackProps) => {
  const [cards, setCards] = useState<Card[]>(items);
  const [interval, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoRotate) {
      startRotation();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [items, autoRotate]);

  const startRotation = () => {
    const id = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, rotationInterval);
    
    setIntervalId(id);
  };

  const stopRotation = () => {
    if (interval) {
      clearInterval(interval);
      setIntervalId(null);
    }
  };

  const handleCardClick = (clickedIndex: number) => {
    if (clickedIndex === 0) return; // Already at the top
    
    stopRotation();
    
    // Move the clicked card to the top
    setCards(prevCards => {
      const newArray = [...prevCards];
      const [clickedCard] = newArray.splice(clickedIndex, 1);
      newArray.unshift(clickedCard);
      return newArray;
    });
    
    if (autoRotate) {
      // Restart rotation after a delay
      setTimeout(startRotation, rotationInterval);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            layout
            initial={{ scale: 1 - index * scaleFactor, y: index * -offset, zIndex: cards.length - index }}
            animate={{ 
              scale: 1 - index * scaleFactor, 
              y: index * -offset,
              zIndex: cards.length - index 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              damping: 20,
              mass: 0.8
            }}
            onClick={() => handleCardClick(index)}
            className="absolute dark:bg-black bg-white rounded-2xl p-5 border border-neutral-200 dark:border-white/[0.1] shadow-xl shadow-black/[0.1] dark:shadow-white/[0.05] cursor-pointer"
            style={{ 
              transformOrigin: "top center",
              width: "100%",
              pointerEvents: "auto"
            }}
            whileHover={{ 
              y: index === 0 ? -5 : index * -offset - 5,
              transition: { duration: 0.2 }
            }}
          >
            {card.content}
          </motion.div>
        );
      })}
    </div>
  );
}; 