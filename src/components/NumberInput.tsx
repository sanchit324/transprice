import React from 'react';

interface NumberInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  error?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  placeholder, 
  error 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange('');
    } else {
      const numValue = parseFloat(newValue);
      onChange(numValue);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`block w-full p-3 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default NumberInput;