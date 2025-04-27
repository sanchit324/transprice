import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Truck, Search } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const demoLocations: Location[] = [
  { id: 'KYN', name: 'Kalyan', lat: 19.2403, lng: 73.1305 },
  { id: 'DHI', name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { id: 'BOM', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { id: 'BLR', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'HYD', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'CCU', name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { id: 'MAA', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { id: 'NGSM', name: 'Nagasaki', lat: 32.7503, lng: 129.8779 },
];

interface WorldMapProps {
  className?: string;
  selectedLocations?: string[];
  onLocationSelect?: (location: Location) => void;
  isInteractive?: boolean;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  className = '',
  selectedLocations = [],
  onLocationSelect,
  isInteractive = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(demoLocations);

  // Update map dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const { width, height } = mapRef.current.getBoundingClientRect();
        setMapDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Filter locations based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(demoLocations);
      return;
    }

    const filtered = demoLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm]);

  // Convert lat/lng to x/y coordinates on the map
  const getCoordinates = (lat: number, lng: number) => {
    // Simple Mercator projection (not perfect but good enough for demo)
    const x = (lng + 180) * (mapDimensions.width / 360);
    const y = (90 - lat) * (mapDimensions.height / 180);
    return { x, y };
  };

  // Handle location click
  const handleLocationClick = (location: Location) => {
    if (onLocationSelect && isInteractive) {
      onLocationSelect(location);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white ${className}`}>
      {/* Map header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center">
          <Map className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold text-slate-800">Transport Network</h3>
        </div>
        
        {isInteractive && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations..."
              className="pl-8 py-1 pr-3 text-sm border border-slate-200 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Map container */}
      <div 
        ref={mapRef}
        className="relative w-full h-64 bg-blue-50 overflow-hidden"
      >
        {/* Map background - simplified world map outline */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1000 500" 
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 opacity-30"
        >
          <path 
            d="M171,336.5c-15.5-7.9-27.7-23.1-27-42.3c0.7-19.2,0.7-38.4,0-57.7c-0.5-14.7,6.8-24.8,14.6-39.1
            c7.8-14.3,4.2-25.4,1.4-38.8c-2.8-13.5-5.7-27.3-4.5-40.8c1.2-13.5,10.8-27,16.7-40.5c5.9-13.5,14.6-28.4,29.9-37.2
            c15.3-8.8,30.6-17.6,46-26.5c15.3-8.8,36.9-14.2,54.3-10.1c17.4,4.1,34.9,8.1,52.3,12.2c17.4,4.1,35.1,10.4,50.1,22.5
            c15,12.1,29.1,21.6,40.3,34.2c11.1,12.6,20.1,29.5,28.5,45.4c8.4,15.9,10.9,32.6,21.1,45.4c10.2,12.7,28.3,24.5,41.8,36.5
            c13.6,12,24.3,25.8,35.8,38.6c11.5,12.9,22.1,23.6,37.4,30.3c15.3,6.7,30.5,13.5,45.8,20.2c15.3,6.7,33.7,14.7,50.8,18.5
            c17.1,3.8,36.5,1.3,52.1,1.8c15.6,0.6,24.3,1.9,37.7,6.4c13.4,4.5,31.3,12.3,45.2,14.5c13.9,2.2,35,1.5,50.1-1.3
            c15.1-2.8,22.5-8.5,33.9-17.7c11.4-9.1,24.5-23.8,36-32.1c11.5-8.3,18.7-13.3,29.2-16.7c10.5-3.4,24.4-7.9,35.2-8.5
            c10.8-0.6,21.7-1.2,32.5-1.8c10.8-0.6,22.5-1.8,32.2-6.1c9.7-4.3,17.9-8.6,25.5-17.6c7.6-9,16.5-26.2,20.7-38.1
            c4.2-11.9,5.4-20.4,5.3-29.4c-0.1-9-1.6-18-3.1-27c-1.6-9-4.5-21.5,0.8-30.6c5.3-9.1,13.3-18.3,23.4-22.2
            c10.1-3.9,20.1-7.9,30.2-11.8c10.1-3.9,22.8-8.9,32.2-9.3c9.4-0.4,15.6,2.1,23.3,8.4c7.7,6.3,16.4,17.9,21.3,27.2
            c4.9,9.3,3.9,15.4,7.1,25.3c3.2,9.9,7.3,20.5,15.6,27.7c8.3,7.2,20.8,11,31.4,16.7c10.6,5.7,22.3,14.1,29.7,21.8
            c7.4,7.7,6.3,14.6,9.6,21.7c3.3,7.1,4.3,12.5,9.4,18.9c5.1,6.4,14.1,12.9,20.9,19.9c6.8,7,11,16.5,16,24.5
            c5,8,9.9,16.1,14.9,24.1c5,8,8.9,17.2,13.8,25.2c4.9,8,13.5,14.8,18.4,22.9c4.9,8.1,5.4,15.8,7.7,25.4
            c2.3,9.6,7.7,18.1,7.7,31.8c0,13.7-6.5,32.4-10.7,46.1c-4.2,13.7-9.5,22.5-16,33.2c-6.5,10.7-10.9,23.3-20.7,29.1
            c-9.8,5.8-26.1,4.7-38.3,7.3c-12.2,2.6-22.9,9.4-32.2,12.9c-9.3,3.5-15.7,4.6-26.5,2.9c-10.8-1.7-21.5-3.5-32.3-5.2
            c-10.8-1.7-22.2-4.1-33.3-6.4c-11.1-2.3-24.2-1.7-34.4-3.9c-10.2-2.2-16.9-7.9-26.2-9.7c-9.3-1.8-18.5-3.6-27.8-5.4
            c-9.3-1.8-19.7-3.5-29.1-8.1c-9.4-4.6-16.3-11.9-26.5-15.8c-10.2-3.9-22.1-6.9-34-10c-11.9-3.1-26.1-6.8-37.2-10.2
            c-11.1-3.4-20.9-6.7-29.4-12.6c-8.5-5.9-13.9-13.6-21.9-19.3c-8-5.7-14.9-9.4-26.7-11.4c-11.8-2-28.3-3.3-41.7-6.3
            c-13.4-3-25.9-8.7-36.2-16.6c-10.3-7.9-20.6-15.8-30.9-23.7c-10.3-7.9-23.3-16.9-33.9-23.3c-10.6-6.4-20.7-7.9-30.3-13.4
            c-9.6-5.5-23.5-16.2-34.2-23.4c-10.7-7.2-19.3-13.2-27.8-19.4c-8.5-6.2-16.9-12.5-25.4-18.7c-8.5-6.2-18.5-14.2-26.2-21.6
            c-7.7-7.4-9.6-13.3-16.7-19.9c-7.1-6.6-14.2-13.2-21.3-19.8c-7.1-6.6-16.1-12.4-22.9-19.8c-6.8-7.4-12.8-16.9-18.1-26.5
            c-5.3-9.6-4.5-19.3-10.1-28.2c-5.6-8.9-18.5-18.1-27.2-23.4c-8.7-5.3-17.5-10.6-26.2-15.9c-8.7-5.3-15.8-8.9-24.3-13.7
            c-8.5-4.8-22.6-10.8-34.8-12.8"
            fill="none" 
            stroke="#4F46E5" 
            strokeWidth="0.7" 
          />
        </svg>

        {/* Locations */}
        {filteredLocations.map((location) => {
          const isSelected = selectedLocations.includes(location.id);
          const isHovered = hoveredLocation === location.id;
          const coords = getCoordinates(location.lat, location.lng);
          
          return (
            <div 
              key={location.id}
              style={{ 
                left: `${coords.x}px`, 
                top: `${coords.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute"
              onClick={() => handleLocationClick(location)}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: isSelected 
                    ? '#4F46E5' 
                    : isHovered 
                      ? '#818CF8' 
                      : '#CBD5E1'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  isInteractive ? 'hover:scale-150' : ''
                } transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-indigo-200' : ''
                }`}
              />
              
              {(isHovered || isSelected) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 transform translate-y-full whitespace-nowrap"
                >
                  <div className="bg-white px-2 py-1 rounded-md shadow-md text-xs">
                    <div className="font-semibold text-slate-800">{location.name}</div>
                    <div className="text-slate-500 text-xs">{location.id}</div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Routes between selected locations if more than one location is selected */}
        {selectedLocations.length > 1 && selectedLocations.map((locId, index) => {
          if (index === selectedLocations.length - 1) return null;
          
          const startLoc = demoLocations.find(loc => loc.id === locId);
          const endLoc = demoLocations.find(loc => loc.id === selectedLocations[index + 1]);
          
          if (!startLoc || !endLoc) return null;
          
          const startCoords = getCoordinates(startLoc.lat, startLoc.lng);
          const endCoords = getCoordinates(endLoc.lat, endLoc.lng);
          
          return (
            <svg
              key={`route-${index}`}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                x1={startCoords.x}
                y1={startCoords.y}
                x2={endCoords.x}
                y2={endCoords.y}
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="5,5"
                strokeLinecap="round"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.8 }}
                cx={(startCoords.x + endCoords.x) / 2}
                cy={(startCoords.y + endCoords.y) / 2}
                r="4"
                fill="#FFF"
                stroke="#4F46E5"
                strokeWidth="1"
              />
              <motion.foreignObject
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 1 }}
                x={(startCoords.x + endCoords.x) / 2 - 8}
                y={(startCoords.y + endCoords.y) / 2 - 8}
                width="16"
                height="16"
              >
                <Truck className="w-4 h-4 text-indigo-600" />
              </motion.foreignObject>
            </svg>
          );
        })}
      </div>

      {/* Map footer with information */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
        {selectedLocations.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            <span>Selected: </span>
            {selectedLocations.map((locId, index) => {
              const location = demoLocations.find(loc => loc.id === locId);
              return location ? (
                <React.Fragment key={locId}>
                  <span className="font-medium text-slate-700">{location.name}</span>
                  {index < selectedLocations.length - 1 && (
                    <span className="mx-1">→</span>
                  )}
                </React.Fragment>
              ) : null;
            })}
          </div>
        ) : (
          <span>{isInteractive ? "Click on locations to select them" : "Map View"}</span>
        )}
      </div>
    </div>
  );
}; 