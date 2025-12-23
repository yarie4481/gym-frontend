// components/GymTable.tsx
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

const GymTable: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${basUrl}gymx`, {
          method: "GET",
          credentials: "include", // Important for cookies/sessions
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const gymsData: Gym[] = await response.json();
        setGyms(gymsData);
      } catch (err) {
        console.error("Error fetching gyms:", err);
        setError("Failed to load gyms. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGyms();
  }, []);

  // Filter gyms based on search term
  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.Phone.includes(searchTerm);

    return matchesSearch;
  });

  // Format opening hours for display
  const formatOpeningHours = (openingHours: OpeningHours) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const today = new Date()
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase();

    const todayHours = openingHours[today];
    if (todayHours) {
      return `Today: ${todayHours.open} - ${todayHours.close}`;
    }

    // If no hours for today, show first available day
    for (const day of days) {
      if (openingHours[day]) {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        return `${dayName}: ${openingHours[day].open} - ${openingHours[day].close}`;
      }
    }

    return "No hours available";
  };

  // Format features for display
  const formatFeatures = (features: string[]) => {
    if (features.length === 0) return "No features";
    if (features.length <= 2) return features.join(", ");
    return `${features.slice(0, 2).join(", ")} +${features.length - 2} more`;
  };

  // Get status based on current time and opening hours
  const getGymStatus = (openingHours: OpeningHours) => {
    const today = new Date()
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase();
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get HH:MM format

    const todayHours = openingHours[today];

    if (!todayHours) {
      return { status: "Closed", color: "bg-red-100 text-red-800" };
    }

    if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
      return { status: "Open", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "Closed", color: "bg-red-100 text-red-800" };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gyms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
        <h1 className="text-2xl font-bold text-gray-900">Gym Locations</h1>
        <p className="text-gray-600 mt-1">
          {filteredGyms.length} location{filteredGyms.length !== 1 ? "s" : ""}{" "}
          found
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
            placeholder="Search gyms by name, address, or phone..."
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
            All Locations
          </button>
          <button
            onClick={() => setActiveTab("Open")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Open"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Currently Open
          </button>
          <button
            onClick={() => setActiveTab("Closed")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Closed"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Currently Closed
          </button>
          <a href="/gym/add-gym">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
              <span className="material-symbols-outlined">Add</span>
              Gym
            </button>
          </a>
        </div>
      </div>

      {/* Gyms Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredGyms.length === 0 ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No gyms found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No gym locations available"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gym Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opening Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Features & Capacity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGyms.map((gym) => {
                    const statusInfo = getGymStatus(gym.OpeningHours);

                    return (
                      <tr key={gym.ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {gym.Name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {gym.Address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {gym.Phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {gym.Timezone} Timezone
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.color}`}
                          >
                            {statusInfo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatOpeningHours(gym.OpeningHours)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Click to view all hours
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {formatFeatures(gym.Settings.features)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Capacity: {gym.Settings.max_capacity} people
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
                  <span className="font-medium">{filteredGyms.length}</span> of{" "}
                  <span className="font-medium">{gyms.length}</span> results
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

export default GymTable;
