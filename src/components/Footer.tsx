import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 text-center text-indigo-700">
      <div className="flex items-center justify-center gap-2">
        <span>Made with</span>
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        <span>by Sanchit</span>
      </div>
    </footer>
  );
};

export default Footer; 