// components/ClassSessionTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

interface Gym {
  ID: string;
  Name: string;
  Address: string;
  Phone: string;
  Timezone: string;
  OpeningHours: any;
  Settings: any;
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

interface ClassSession {
  ID: string;
  ClassID: string;
  StartsAt: string;
  EndsAt: string;
  Capacity: number;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  Class: Class;
  Bookings: any;
  Attendance: any;
}

const ClassSessionTable: React.FC = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Fetch class sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching class sessions from API...");
        const response = await fetch(`${basUrl}classsession/`, {
          method: "GET",
          credentials: "include", // Important for cookies/sessions

          headers: {
            "Content-Type": "application/json",
          },
        });

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

        const sessionsData: ClassSession[] = await response.json();
        console.log("Class sessions data received:", sessionsData);

        if (!Array.isArray(sessionsData)) {
          throw new Error("Invalid data format received from API");
        }

        setSessions(sessionsData);
      } catch (err) {
        console.error("Error fetching class sessions:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load class sessions. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filter sessions based on search term and active tab
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.Class?.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.Class?.Trainer?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.Class?.Trainer?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.Class?.Gym?.Name?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      session.Status.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status based on active tab
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Scheduled")
      return matchesSearch && session.Status === "scheduled";
    if (activeTab === "Completed")
      return matchesSearch && session.Status === "completed";
    if (activeTab === "Cancelled")
      return matchesSearch && session.Status === "cancelled";
    if (activeTab === "Ongoing")
      return matchesSearch && session.Status === "ongoing";

    return matchesSearch;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-cyan-100 text-cyan-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate duration in minutes
  const calculateDuration = (startsAt: string, endsAt: string) => {
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.round(duration);
  };

  // Check if session is upcoming
  const isUpcoming = (startsAt: string) => {
    return new Date(startsAt) > new Date();
  };

  // Get capacity percentage
  const getCapacityPercentage = (session: ClassSession) => {
    // This would normally come from bookings data
    // For now, we'll show a placeholder
    return 0;
  };

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading class sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">
            Error Loading Class Sessions
          </div>
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
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
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
        <h1 className="text-2xl font-bold text-gray-900">Class Sessions</h1>
        <p className="text-gray-600 mt-1">
          {filteredSessions.length} session
          {filteredSessions.length !== 1 ? "s" : ""} found
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
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            placeholder="Search sessions by class, trainer, or gym..."
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
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setActiveTab("Scheduled")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Scheduled"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab("Ongoing")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Ongoing"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab("Completed")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Completed"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("Cancelled")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Cancelled"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Cancelled
          </button>
          <a href="class-session/add-class-session">
            <button className="flex items-center gap-2 ml-160 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <span className="material-symbols-outlined">add</span>
              Add Session
            </button>
          </a>
        </div>
      </div>

      {/* Class Sessions Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredSessions.length === 0 ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No class sessions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No class sessions scheduled"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class & Session Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trainer & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <tr key={session.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {session.Class?.Title || "Unknown Class"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {session.Class?.Description || "No description"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Session ID: {session.ID.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(session.StartsAt)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(session.StartsAt)} -{" "}
                          {formatTime(session.EndsAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {calculateDuration(session.StartsAt, session.EndsAt)}{" "}
                          minutes
                        </div>
                        {isUpcoming(session.StartsAt) && (
                          <div className="text-xs text-cyan-600 font-medium mt-1">
                            ⏰ Upcoming
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {session.Class?.Trainer?.first_name &&
                          session.Class?.Trainer?.last_name
                            ? `${session.Class.Trainer.first_name} ${session.Class.Trainer.last_name}`
                            : "Unknown Trainer"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.Class?.Gym?.Name || "Unknown Gym"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {session.Class?.Gym?.Address || "No address"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-semibold">
                            {session.Capacity}
                          </span>{" "}
                          spots
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${getCapacityPercentage(session)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getCapacityPercentage(session)}% booked
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                            session.Status
                          )}`}
                        >
                          {session.Status.charAt(0).toUpperCase() +
                            session.Status.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(session.CreatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Scheduled:{" "}
                    {sessions.filter((s) => s.Status === "scheduled").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Ongoing:{" "}
                    {sessions.filter((s) => s.Status === "ongoing").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Completed:{" "}
                    {sessions.filter((s) => s.Status === "completed").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Cancelled:{" "}
                    {sessions.filter((s) => s.Status === "cancelled").length}
                  </span>
                </div>
                <div className="flex items-center ml-auto">
                  <span className="text-gray-900 font-medium">
                    Total: {sessions.length} sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredSessions.length}</span>{" "}
                  of <span className="font-medium">{sessions.length}</span>{" "}
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

export default ClassSessionTable;
