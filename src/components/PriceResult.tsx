import React from 'react';
import { Location } from '../types';
import { Truck, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { motion } from 'framer-motion';
import { AnimatedCard } from './ui/animated-card';

interface PriceResultProps {
  startLocation: Location;
  destLocation: Location;
  distance: number;
  weight: number;
  price: number;
  isMLPrediction?: boolean;
}

const PriceResult: React.FC<PriceResultProps> = ({
  startLocation,
  destLocation,
  distance,
  weight,
  price,
  isMLPrediction = false
}) => {
  // Calculate price in crores for display purposes
  const priceInCrores = (price / 10000000).toFixed(4);
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header with route information */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-1">Route</p>
            <div className="flex items-center">
              <span className="text-lg font-medium text-slate-800">{startLocation.name}</span>
              <ArrowRight className="mx-2 h-4 w-4 text-indigo-400" />
              <span className="text-lg font-medium text-slate-800">{destLocation.name}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price card */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Price Prediction
              </h3>
              {isMLPrediction && (
                <div className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  ML Powered
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2
                }}
                className="text-center"
              >
                <p className="text-sm text-slate-500 mb-2">Total Price</p>
                <div className="flex items-center justify-center text-3xl font-bold text-indigo-700 mb-1">
                  <IndianRupee className="h-6 w-6 mr-2" />
                  {formatCurrency(price)}
                </div>
                <p className="text-xs text-slate-500">
                  ({priceInCrores} Crore)
                </p>
              </motion.div>
            </div>
          </AnimatedCard>
        </motion.div>
        
        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedCard>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Shipment Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Distance</p>
                <p className="font-medium text-slate-700">{distance} km</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">Weight</p>
                <p className="font-medium text-slate-700">{weight} tonnes</p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
};

export default PriceResult;