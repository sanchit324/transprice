import { Location } from '../types';

/**
 * Calculate the transportation price based on start location, destination location,
 * distance, and weight.
 * 
 * This is a simplified placeholder calculation that will be replaced with an ML model.
 * Prices are in Indian Rupees (INR)
 */
export const calculatePrice = (
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