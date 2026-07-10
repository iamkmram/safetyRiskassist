import React from "react";

export interface MetricsCardProps {
  title: string;
  value: string | number;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default MetricsCard;
