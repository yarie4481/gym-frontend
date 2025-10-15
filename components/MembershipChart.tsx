import React from "react";

const MembershipChart: React.FC = () => {
  return (
    <div className="rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Membership Growth
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 6 Months
          </p>
        </div>
        <p className="text-lg font-bold text-primary">+15%</p>
      </div>
      <div className="mt-6 h-64">
        <svg
          fill="none"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 500 250"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 250 L0 216 C35.71 216 35.71 42 71.42 42 C107.13 42 107.13 82 142.84 82 C178.55 82 178.55 186 214.26 186 C249.97 186 249.97 66 285.68 66 C321.39 66 321.39 202 357.1 202 C392.81 202 392.81 122 428.52 122 C464.23 122 464.23 250 500 250 L0 250 Z"
            fill="url(#chartGradient)"
          ></path>
          <path
            className="text-primary"
            d="M0 216 C35.71 216 35.71 42 71.42 42 C107.13 42 107.13 82 142.84 82 C178.55 82 178.55 186 214.26 186 C249.97 186 249.97 66 285.68 66 C321.39 66 321.39 202 357.1 202 C392.81 202 392.81 122 428.52 122 C464.23 122 464.23 250 500 250"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          ></path>
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="chartGradient"
              x1="250"
              x2="250"
              y1="0"
              y2="250"
            >
              <stop
                className="text-primary"
                stopColor="currentColor"
                stopOpacity="0.3"
              ></stop>
              <stop
                className="text-primary"
                offset="1"
                stopColor="currentColor"
                stopOpacity="0"
              ></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
};

export default MembershipChart;
