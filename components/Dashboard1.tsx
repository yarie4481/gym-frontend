// components/Dashboard.tsx
import React from "react";

interface Activity {
  member: string;
  class: string;
  trainer: string;
  date: string;
  status: "Completed" | "Scheduled";
}

const DashboardPage: React.FC = () => {
  const quickStats = [
    { label: "Active Members", value: "250" },
    { label: "Total Trainers", value: "15" },
    { label: "Today's Classes", value: "8" },
    { label: "Monthly Revenue", value: "$12,500" },
  ];

  const recentActivities: Activity[] = [
    {
      member: "Emily Carter",
      class: "Yoga Basics",
      trainer: "Mark Johnson",
      date: "2024-07-26",
      status: "Completed",
    },
    {
      member: "David Lee",
      class: "Strength Training",
      trainer: "Jessica Brown",
      date: "2024-07-25",
      status: "Scheduled",
    },
    {
      member: "Olivia Green",
      class: "Pilates",
      trainer: "Michael Davis",
      date: "2024-07-24",
      status: "Completed",
    },
    {
      member: "Ethan White",
      class: "Cardio Blast",
      trainer: "Sarah Miller",
      date: "2024-07-23",
      status: "Completed",
    },
    {
      member: "Sophia Clark",
      class: "Crossfit",
      trainer: "Robert Wilson",
      date: "2024-07-22",
      status: "Completed",
    },
  ];

  const getStatusStyles = (status: "Completed" | "Scheduled") => {
    return status === "Completed"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Hero Section */}
      <div
        className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-8 text-white shadow-lg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA96LF1EIFg1pby-LdMZy4ruozQwSKlUf8iAGeFoSQ4ky4_TChc9uBAJ4QxOBYLQVv9mqT01O-1zrCQxfZOKPm_-8ubl12ElZXPkMkcd1u1xkz6C2O6V1v0iPPXAUyfxoJ3a9aM5yRISqcJUZ2WaEzIvtWx0BQBxFgQKG4HDolEUIvOsm6w17NQDfQtoQhW5XnZXqraUprXRj3NBkiKGGnL0pYtHnjyR9AbNNHwO8JV8HM8HNCCwQD7cXmvgWw9x2uKfdE06-_unvFB")`,
        }}
      >
        <div className="z-10">
          <h1 className="text-4xl font-bold">Welcome back, Sarah!</h1>
          <p className="mt-2 max-w-lg text-lg">
            Stay motivated and track your progress towards your fitness goals.
          </p>
          <div className="mt-6">
            <div className="mb-1 flex justify-between">
              <span className="text-base font-medium text-white">
                Weekly Goal
              </span>
              <span className="text-sm font-medium text-white">75%</span>
            </div>
            <div className="w-full rounded-full bg-gray-300/50">
              <div
                className="h-2.5 rounded-full bg-cyan-500"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-all"
            >
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-xl bg-white p-4 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Trainer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black">
                      {activity.member}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-black">
                      {activity.class}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-black">
                      {activity.trainer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-black">
                      {activity.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusStyles(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
