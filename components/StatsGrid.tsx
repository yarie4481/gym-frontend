import React from "react";

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-background-dark">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-green-500 dark:text-white">
        {value}
      </p>
    </div>
  );
};

const StatsGrid: React.FC = () => {
  const stats = [
    { title: "Active Members", value: "250" },
    { title: "Total Trainers", value: "15" },
    { title: "Today's Classes", value: "8" },
    { title: "Monthly Revenue", value: "$12,500" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

export default StatsGrid;
