import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change }) => {
  return (
    <div className="rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
      <p className="text-sm font-medium text-primary mt-1">{change}</p>
    </div>
  );
};

export default StatsCard;
