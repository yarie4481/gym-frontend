// components/FitnessLayout.tsx
import React from "react";
import FitnessSidebar from "@/components/FitnessSidebar";
import FitnessHeader from "@/components/FitnessHeader";

interface FitnessLayoutProps {
  children: React.ReactNode;
}

const FitnessLayout: React.FC<FitnessLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-auto min-h-screen w-full bg-background-light font-display text-gray-800 dark:bg-background-dark dark:text-gray-200">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <FitnessSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        <FitnessHeader />
        <main className="overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default FitnessLayout;
