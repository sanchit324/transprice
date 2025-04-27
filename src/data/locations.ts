import { Location } from '../types';

// Railway station locations with their codes
export const locations: Location[] = [
  { id: 'KYN', name: 'Kalyan', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'NGSM', name: 'Nagasamudram', region: 'Andhra Pradesh', costFactor: 1.1 },
  { id: 'DHI', name: 'Delhi', region: 'Delhi', costFactor: 1.4 },
  { id: 'JL', name: 'Jalandhar', region: 'Punjab', costFactor: 1.15 },
  { id: 'KNW', name: 'Kanpur', region: 'Uttar Pradesh', costFactor: 1.2 },
  { id: 'NGN', name: 'Nagina', region: 'Uttar Pradesh', costFactor: 1.1 },
  { id: 'NK', name: 'Nasik', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'ANG', name: 'Angul', region: 'Odisha', costFactor: 1.1 },
  { id: 'BAP', name: 'Baripada', region: 'Odisha', costFactor: 1.1 },
  { id: 'ET', name: 'Etawah', region: 'Uttar Pradesh', costFactor: 1.15 },
  { id: 'DDE', name: 'Daudpur', region: 'Bihar', costFactor: 1.1 },
  { id: 'ST', name: 'Satna', region: 'Madhya Pradesh', costFactor: 1.15 },
  { id: 'BRCY', name: 'Vadodara', region: 'Gujarat', costFactor: 1.25 },
  { id: 'SJP', name: 'Shahjahanpur', region: 'Uttar Pradesh', costFactor: 1.15 },
  { id: 'BAU', name: 'Balurghat', region: 'West Bengal', costFactor: 1.1 },
  { id: 'BD', name: 'Baddi', region: 'Himachal Pradesh', costFactor: 1.2 },
  { id: 'KMN', name: 'Kumarganj', region: 'West Bengal', costFactor: 1.1 },
  { id: 'BZU', name: 'Bazpur', region: 'Uttarakhand', costFactor: 1.2 },
  { id: 'MJY', name: 'Majhola', region: 'Uttar Pradesh', costFactor: 1.1 },
  { id: 'WRS', name: 'Warisaliganj', region: 'Bihar', costFactor: 1.1 },
  { id: 'SBGG', name: 'Sabarmati', region: 'Gujarat', costFactor: 1.25 },
  { id: 'ANDI', name: 'Anand', region: 'Gujarat', costFactor: 1.2 },
  { id: 'GZB', name: 'Ghaziabad', region: 'Uttar Pradesh', costFactor: 1.3 },
  { id: 'MTDI', name: 'Moti Daman', region: 'Daman & Diu', costFactor: 1.15 },
  { id: 'SVW', name: 'Sivakasi', region: 'Tamil Nadu', costFactor: 1.1 },
  { id: 'BTC', name: 'Bhatinda', region: 'Punjab', costFactor: 1.15 },
  { id: 'MFR', name: 'Muzaffarpur', region: 'Bihar', costFactor: 1.15 },
  { id: 'KPFP', name: 'Kapurthala', region: 'Punjab', costFactor: 1.15 },
  { id: 'NSZ', name: 'Nashik Road', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'AN', name: 'Anand Nagar', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'BIRD', name: 'Birdwal', region: 'Rajasthan', costFactor: 1.15 },
  { id: 'LONI', name: 'Lonikand', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'MRJ', name: 'Miraj', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'TAPG', name: 'Tapang', region: 'Odisha', costFactor: 1.1 },
  { id: 'TPND', name: 'Tirupati North', region: 'Andhra Pradesh', costFactor: 1.15 },
  { id: 'AWB', name: 'Aurangabad', region: 'Maharashtra', costFactor: 1.2 },
  { id: 'BPTG', name: 'Bhupalpally', region: 'Telangana', costFactor: 1.15 },
  { id: 'FUT', name: 'Fatehpur', region: 'Uttar Pradesh', costFactor: 1.15 },
  { id: 'MPIB', name: 'Mughalpura', region: 'Punjab', costFactor: 1.15 },
  { id: 'SAI', name: 'Sai Nagar', region: 'Maharashtra', costFactor: 1.2 },
  // ... [Additional stations would be added here following the same pattern]
];

// Since we're allowing all stations to connect with each other,
// we don't need the location pair validation anymore
export const isValidLocationPair = (startId: string, destId: string): boolean => {
  // Any pair is valid as long as they're different stations
  return startId !== destId;
};