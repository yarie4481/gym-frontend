import React from "react";

interface Activity {
  member: string;
  class: string;
  trainer: string;
  date: string;
  status: "Completed" | "Scheduled";
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-background-dark">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              scope="col"
            >
              Member
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              scope="col"
            >
              Class
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              scope="col"
            >
              Trainer
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              scope="col"
            >
              Date
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              scope="col"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-background-dark">
          {activities.map((activity, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {activity.member}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {activity.class}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {activity.trainer}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {activity.date}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
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
  );
};

export default RecentActivity;
