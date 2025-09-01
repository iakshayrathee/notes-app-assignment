import React from 'react';
import { useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="HD Logo" 
        className="w-8 h-8 mr-2 flex-shrink-0"
        style={{ aspectRatio: '1/1' }}
      />
      {!isDashboard && (
        <span className="text-xl font-semibold text-gray-900">HD</span>
      )}
    </div>
  );
};

export default Logo;
