import React from "react";
import Header from "./Header";
import StatsCard from "./StatsCard";
import MembershipChart from "./MembershipChart";
import ActiveMembersChart from "./ActiveMembersChart";

const Dashboard: React.FC = () => {
  const statsData = [
    { title: "Total Members", value: "250", change: "+10%" },
    { title: "Active Members", value: "200", change: "+5%" },
    { title: "Revenue This Month", value: "$15,000", change: "+8%" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Overview of your gym&apos;s performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MembershipChart />
            </div>
            <div>
              <ActiveMembersChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
