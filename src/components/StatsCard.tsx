import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className="stats-card card" style={{ '--accent-color': color } as React.CSSProperties}>
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <div className="stats-icon">{icon}</div>
      </div>
      <div className="stats-content">
        <h2 className="stats-value">{value}</h2>
        {trend && (
          <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <span>{trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%</span>
            <span className="trend-label">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
