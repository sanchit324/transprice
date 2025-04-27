import React, { useState } from 'react';
import { MapPin, ChevronDown, X, Search } from 'lucide-react';
import { Location } from '../types';
import { locations, isValidLocationPair } from '../data/locations';

interface LocationSelectorProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  error?: string;
  otherLocation?: Location | null;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  value, 
  onChange, 
  error,
  otherLocation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations
    .filter(location => {
      if (!otherLocation) return true;
      return isValidLocationPair(location.id, otherLocation.id);
    })
    .filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelect = (location: Location) => {
    onChange(location);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-lg cursor-pointer bg-white hover:border-blue-400 transition-colors`}
      >
        {value ? (
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="h-5 w-5 text-blue-700" />
            <div className="truncate">
              <div className="font-medium">{value.name} ({value.id})</div>
              <div className="text-xs text-slate-500">{value.region}</div>
            </div>
            <button 
              onClick={clearSelection}
              className="ml-auto p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        ) : (
          <span className="text-slate-500 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select location
          </span>
        )}
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, region, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <div className="py-3 px-4 text-sm text-slate-500">No locations found</div>
            ) : (
              filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="py-2 px-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleSelect(location)}
                >
                  <div className="font-medium">{location.name} ({location.id})</div>
                  <div className="text-xs text-slate-500">{location.region}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;