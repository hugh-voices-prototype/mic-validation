import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-4 lg:px-0">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} AudioQuality. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;