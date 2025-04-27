import React from 'react';
import PriceCalculatorForm from './components/PriceCalculatorForm';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import { motion } from 'framer-motion';
import { GridBackground, WaveBackground } from './components/ui/background';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <WaveBackground />
        <GridBackground 
          containerClassName="absolute inset-0 opacity-30"
          dotSpacing={32}
          dotSize={2}
          dotColor="#e2e8f0"
          dotActiveColor="#818cf8"
        />
      </div>

      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8 z-10 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">Transport Price Calculator</h1>
            <p className="text-indigo-700">
              Calculate transportation costs based on location, distance, and cargo weight using our ML model.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PriceCalculatorForm />
          </motion.div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
}

export default App;