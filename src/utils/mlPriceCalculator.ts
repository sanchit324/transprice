import { Location } from '../types';

/**
 * Interface for the ML model response
 */
interface ModelResponse {
  price: number;
}

/**
 * Calculate transportation price using the ML model
 * The model takes source, destination, distance, weight, and location factors as inputs
 * 
 * @param startLocation - Source location
 * @param destLocation - Destination location
 * @param distance - Distance in kilometers
 * @param weight - Weight in tonnes
 * @returns Promise containing the calculated price
 */
export const calculatePriceWithML = async (
  startLocation: Location,
  destLocation: Location,
  distance: number,
  weight: number
): Promise<number> => {
  try {
    // Prepare the input data for the model
    const modelInput = {
      source: startLocation.id,
      destination: destLocation.id,
      distance,
      weight,
      sourceFactor: startLocation.costFactor,
      destFactor: destLocation.costFactor
    };
    
    // Call the API endpoint that will run the ML model
    const response = await fetch('/api/predict-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelInput),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get prediction from ML model');
    }
    
    const result: ModelResponse = await response.json();
    
    // Convert from cr to INR for display (1 cr = 10,000,000 INR)
    // This step might be optional depending on your application's needs
    const priceInInr = result.price * 10000000;
    
    // Round to nearest rupee
    return Math.round(priceInInr);
  } catch (error) {
    console.error('Error calculating price with ML model:', error);
    
    // Fallback to the original formula if ML model fails
    return fallbackPriceCalculation(startLocation, destLocation, distance, weight);
  }
};

/**
 * Fallback calculation using the original formula
 * Used when the ML prediction fails
 */
const fallbackPriceCalculation = (
  startLocation: Location,
  destLocation: Location,
  distance: number,
  weight: number
): number => {
  // Base rate per km (in INR)
  const baseRatePerKm = 50;
  
  // Additional rate based on weight (per tonne per km)
  const weightRatePerTonneKm = 10;
  
  // Location factors
  const startLocationFactor = startLocation.costFactor;
  const destLocationFactor = destLocation.costFactor;
  
  // Calculate base cost
  const baseCost = distance * baseRatePerKm;
  
  // Calculate weight-based cost
  const weightCost = distance * weight * weightRatePerTonneKm;
  
  // Apply location factors
  const locationAdjustment = (startLocationFactor + destLocationFactor) / 2;
  
  // Calculate total cost
  let totalCost = (baseCost + weightCost) * locationAdjustment;
  
  // Add a small random variation to simulate real-world pricing
  const randomVariation = 0.95 + Math.random() * 0.1; // Random between 0.95 and 1.05
  totalCost *= randomVariation;
  
  // Round to nearest rupee
  return Math.round(totalCost);
}; 