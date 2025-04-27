import React from 'react';
import { Truck } from 'lucide-react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-800" />
            <span className="text-xl font-bold text-blue-900">TransPrice</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;