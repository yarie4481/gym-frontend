// components/ClassTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface Settings {
  features: string[];
  max_capacity: number;
}

interface Gym {
  ID: string;
  Name: string;
  Address: string;
  Phone: string;
  Timezone: string;
  OpeningHours: OpeningHours;
  Settings: Settings;
  CreatedAt: string;
  UpdatedAt: string;
  Classes: any;
  InventoryItems: any;
}

interface Trainer {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  membership_type: string;
  join_date: string;
  membership_start: string | null;
  membership_end: string | null;
  fitness_goals: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  user_type: string;
  profile_picture_url: string;
  created_at: string;
  updated_at: string;
  Gender: string;
  Member: any;
}

interface Class {
  ID: string;
  GymID: string;
  Title: string;
  Description: string;
  TrainerID: string;
  Capacity: number;
  RecurringRule: string | null;
  DurationMinutes: number;
  CreatedAt: string;
  UpdatedAt: string;
  Gym: Gym;
  Trainer: Trainer;
  Sessions: any;
}

const ClassTable: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching classes from API...");
        const response = await fetch(`${basUrl}class`, {
          method: "GET",
          credentials: "include", // Important for cookies/sessions
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Response:", response);

        // Check if response exists and is ok
        if (!response) {
          throw new Error("No response received from server");
        }

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} ${response.statusText}`
          );
        }

        const classesData: Class[] = await response.json();
        console.log("Classes data received:", classesData);

        if (!Array.isArray(classesData)) {
          throw new Error("Invalid data format received from API");
        }

        setClasses(classesData);
      } catch (err) {
        console.error("Error fetching classes:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load classes. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Filter classes based on search term and active tab
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.Trainer.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classItem.Trainer.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classItem.Gym.Name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
    }
    return `${minutes}m`;
  };

  // Get status color based on capacity
  const getCapacityStatus = (classItem: Class) => {
    // This is a simplified status - you might want to calculate based on actual bookings
    const capacityPercentage = 0; // You can calculate this based on actual bookings

    if (capacityPercentage >= 90) {
      return "bg-red-100 text-red-800";
    } else if (capacityPercentage >= 70) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  // Get capacity status text
  const getCapacityStatusText = (classItem: Class) => {
    // This is a simplified status - you might want to calculate based on actual bookings
    const capacityPercentage = 0; // You can calculate this based on actual bookings

    if (capacityPercentage >= 90) {
      return "Almost Full";
    } else if (capacityPercentage >= 70) {
      return "Filling Up";
    } else {
      return "Available";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">Error Loading Classes</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>Possible issues:</p>
            <ul className="list-disc list-inside text-left">
              <li>API server is not running</li>
              <li>Network connection issue</li>
              <li>Invalid API endpoint</li>
              <li>CORS policy blocking the request</li>
            </ul>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background-light min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fitness Classes</h1>
        <p className="text-gray-600 mt-1">
          {filteredClasses.length} class
          {filteredClasses.length !== 1 ? "es" : ""} found
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50"
            placeholder="Search classes by title, description, trainer, or gym..."
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("All")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "All"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Classes
          </button>
          <button
            onClick={() => setActiveTab("Yoga")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Yoga"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Yoga
          </button>
          <button
            onClick={() => setActiveTab("Cardio")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Cardio"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Cardio
          </button>
          <button
            onClick={() => setActiveTab("Strength")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Strength"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Strength
          </button>
          <a href="/classes/add-class">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
              <span className="material-symbols-outlined"></span>
              Add Class
            </button>
          </a>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No classes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No classes available"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trainer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity & Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClasses.map((classItem) => {
                    const capacityStatus = getCapacityStatus(classItem);
                    const capacityStatusText = getCapacityStatusText(classItem);

                    return (
                      <tr key={classItem.ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {classItem.Title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {classItem.Description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Created: {formatDate(classItem.CreatedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {classItem.Trainer.first_name}{" "}
                            {classItem.Trainer.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {classItem.Trainer.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {classItem.Trainer.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {classItem.Gym.Name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {classItem.Gym.Address}
                          </div>
                          <div className="text-xs text-gray-400">
                            {classItem.Gym.Phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">
                              {classItem.Capacity}
                            </span>{" "}
                            people
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(classItem.DurationMinutes)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {classItem.RecurringRule ? "Recurring" : "One-time"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${capacityStatus}`}
                          >
                            {capacityStatusText}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {classItem.Capacity} spots total
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredClasses.length}</span>{" "}
                  of <span className="font-medium">{classes.length}</span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassTable;
