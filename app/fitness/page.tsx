// pages/dashboard.tsx
import React from "react";
import FitnessLayout from "@/components/FitnessLayout";
import HeroBanner from "@/components/HeroBanner";
import StatsGrid from "@/components/StatsGrid";
import RecentActivity from "@/components/RecentActivity";

const FitnessDashboard: React.FC = () => {
  return (
    <FitnessLayout>
      <div className="p-6">
        <HeroBanner />

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Stats
          </h2>
          <div className="mt-4">
            <StatsGrid />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="mt-4">
            <RecentActivity />
          </div>
        </div>
      </div>
    </FitnessLayout>
  );
};

export default FitnessDashboard;
