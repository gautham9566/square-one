// Dashboard card component for statistics and quick actions
import React from 'react';
import Card from './ui/Card';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  trendDirection = 'up',
  color = 'blue',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trendColors[trendDirection]}`}>
              <span className="mr-1">{trendIcons[trendDirection]}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
