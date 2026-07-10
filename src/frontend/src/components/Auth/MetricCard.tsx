import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
}

/**
 * Simple reusable card for displaying a single KPI.
 */
export const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => (
  <div className="metric-card">
    <h3 className="metric-title">{title}</h3>
    <p className="metric-value">{value}</p>
  </div>
);
