
import React from 'react';

interface RobotProps {
  size: number;
}

const Robot: React.FC<RobotProps> = ({ size }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="drop-shadow-md transition-transform duration-200"
    >
      <g transform="translate(10, 10) scale(0.8)">
        {/* Head */}
        <rect x="20" y="20" width="60" height="50" rx="10" fill="#3B82F6" stroke="#1E40AF" strokeWidth="4" />
        {/* Eyes */}
        <circle cx="40" cy="45" r="8" fill="white" />
        <circle cx="40" cy="45" r="4" fill="#1E40AF" />
        <circle cx="60" cy="45" r="8" fill="white" />
        <circle cx="60" cy="45" r="4" fill="#1E40AF" />
        {/* Antennas */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#1E40AF" strokeWidth="4" />
        <circle cx="50" cy="5" r="5" fill="#EF4444" />
        {/* Mouth */}
        <rect x="40" y="60" width="20" height="4" rx="2" fill="#1E40AF" />
        {/* Body Connector */}
        <rect x="40" y="70" width="20" height="10" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default Robot;
