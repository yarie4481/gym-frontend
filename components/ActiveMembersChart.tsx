import React from "react";

const ActiveMembersChart: React.FC = () => {
  return (
    <div className="rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Active vs. Expired
      </h3>
      <div className="mt-6 flex h-48 w-48 items-center justify-center mx-auto relative">
        <svg className="h-full w-full" viewBox="0 0 36 36">
          <path
            className="stroke-current text-gray-200 dark:text-gray-700"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="4"
          ></path>
          <path
            className="stroke-current text-primary"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
            fill="none"
            strokeDasharray="80, 100"
            strokeLinecap="round"
            strokeWidth="4"
          ></path>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            80%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Active
          </span>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
            Active
          </span>
          <span className="font-medium text-gray-900 dark:text-white">200</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-2 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            Expired
          </span>
          <span className="font-medium text-gray-900 dark:text-white">50</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveMembersChart;
