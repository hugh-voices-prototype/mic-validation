import React from 'react';
import { Mic } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 md:py-6 px-4 lg:px-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg mr-3">
            <Mic size={20} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">AudioQuality</h1>
        </div>
        <p className="text-center md:text-left text-gray-400 mt-2 text-sm md:text-base max-w-xl">
          Record, analyze, and improve your audio quality with professional insights
        </p>
      </div>
    </header>
  );
};

export default Header;