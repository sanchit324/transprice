import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import NumberInput from './NumberInput';
import PriceResult from './PriceResult';
import { calculatePriceWithML } from '../utils/mlPriceCalculator';
import { Location } from '../types';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';

const PriceCalculatorForm: React.FC = () => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [destLocation, setDestLocation] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [price, setPrice] = useState<number | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Validate form before submission
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!startLocation) newErrors.startLocation = 'Please select a start location';
    if (!destLocation) newErrors.destLocation = 'Please select a destination';
    if (startLocation && destLocation && startLocation.id === destLocation.id) {
      newErrors.destLocation = 'Destination must be different from start location';
    }
    if (distance === '') newErrors.distance = 'Please enter a distance';
    else if (typeof distance === 'number' && distance <= 0) newErrors.distance = 'Distance must be greater than 0';
    if (weight === '') newErrors.weight = 'Please enter a weight';
    else if (typeof weight === 'number' && weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculationError(null);
    
    if (validateForm()) {
      setIsCalculating(true);
      setFormSubmitted(true);

      try {
        if (typeof distance === 'number' && typeof weight === 'number' && startLocation && destLocation) {
          const calculatedPrice = await calculatePriceWithML(startLocation, destLocation, distance, weight);
          setPrice(calculatedPrice);
        }
      } catch (error) {
        console.error('Error during price calculation:', error);
        setCalculationError('Failed to calculate price. Please try again later.');
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handleReset = () => {
    setStartLocation(null);
    setDestLocation(null);
    setDistance('');
    setWeight('');
    setPrice(null);
    setErrors({});
    setFormSubmitted(false);
    setCalculationError(null);
  };

  return (
    <AnimatedCard 
      className="bg-white shadow-lg border border-slate-100 p-6" 
      isLight={true}
    >
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Enter Transport Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Location
              </label>
              <LocationSelector 
                value={startLocation} 
                onChange={setStartLocation} 
                error={errors.startLocation} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination
              </label>
              <LocationSelector 
                value={destLocation} 
                onChange={setDestLocation} 
                error={errors.destLocation}
                exclude={startLocation ? [startLocation.id] : []}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Distance (km)
              </label>
              <NumberInput
                value={distance}
                onChange={setDistance}
                min={1}
                placeholder="Enter distance"
                error={errors.distance}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weight (tonnes)
              </label>
              <NumberInput
                value={weight}
                onChange={setWeight}
                min={0.1}
                step={0.1}
                placeholder="Enter weight"
                error={errors.weight}
              />
            </div>
          </div>

          {calculationError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {calculationError}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <AnimatedButton
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={isCalculating}
              isLoading={isCalculating}
              icon={!isCalculating ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {isCalculating ? "Calculating with ML Model..." : "Calculate Price"}
            </AnimatedButton>

            <AnimatedButton
              type="button"
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              onClick={handleReset}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </AnimatedButton>
          </div>
        </form>
      </div>

      {formSubmitted && (
        <div className={`mt-8 transition-all overflow-hidden ${price !== null ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {price !== null && startLocation && destLocation && typeof distance === 'number' && typeof weight === 'number' && (
            <PriceResult
              startLocation={startLocation}
              destLocation={destLocation}
              distance={distance}
              weight={weight}
              price={price}
              isMLPrediction={true}
            />
          )}
        </div>
      )}
    </AnimatedCard>
  );
};

export default PriceCalculatorForm;