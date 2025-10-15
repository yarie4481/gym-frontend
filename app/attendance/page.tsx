// components/AttendanceTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string | null;
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

interface Member {
  ID: string;
  first_name: string;
  last_name: string;
  UserID: string;
  Dob: string;
  Gender: string;
  EmergencyContact: {
    name: string;
    phone: string;
  };
  Notes: string;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Memberships: any;
  Bookings: any;
  Attendance: any;
  Payments: any;
}

interface Attendance {
  ID: string;
  SessionID: string;
  MemberID: string;
  CheckinMethod: string;
  CheckedInAt: string;
  CreatedAt: string;
  Session: ClassSession;
  Member: Member;
}

const AttendanceTable: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Fetch attendance records from API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching attendance records from API...");
        const response = await fetch(`${basUrl}attendance/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const attendanceData: Attendance[] = await response.json();
        console.log("Attendance data received:", attendanceData);

        if (!Array.isArray(attendanceData)) {
          throw new Error("Invalid data format received from API");
        }

        setAttendance(attendanceData);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load attendance records.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Filter attendance based on search term and active tab
  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.Member?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.Member?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.Session?.Class?.Title?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      record.CheckinMethod.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by method based on active tab
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "QR")
      return matchesSearch && record.CheckinMethod === "qr";
    if (activeTab === "Manual")
      return matchesSearch && record.CheckinMethod === "manual";
    if (activeTab === "Card")
      return matchesSearch && record.CheckinMethod === "card";

    return matchesSearch;
  });

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "qr":
        return "bg-cyan-100 text-cyan-800";
      case "manual":
        return "bg-blue-100 text-blue-800";
      case "card":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format method name
  const formatMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate session duration
  const calculateDuration = (startsAt: string, endsAt: string) => {
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.round(duration);
  };

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">
            Error Loading Attendance
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-1">
          {filteredAttendance.length} attendance record
          {filteredAttendance.length !== 1 ? "s" : ""} found
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
            placeholder="Search by member name, class, or method..."
          />
        </div>
      </div>

      {/* Method Tabs */}
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
            All Methods
          </button>
          <button
            onClick={() => setActiveTab("QR")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "QR"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setActiveTab("Manual")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Manual"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab("Card")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Card"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Card
          </button>
          <a href="/attendance/add-attendance">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Take Attendance
            </button>
          </a>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border border-cyan-100 shadow-xl overflow-hidden">
        {filteredAttendance.length === 0 ? (
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No attendance records found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No attendance records available"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-cyan-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">
                      Member Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">
                      Session Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">
                      Check-in Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">
                      Time & Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttendance.map((record) => (
                    <tr
                      key={record.ID}
                      className="hover:bg-cyan-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.Member?.first_name} {record.Member?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.Member?.User?.email || "No email"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Member ID: {record.MemberID.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-400">
                          Gender: {record.Member?.Gender || "Not specified"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.Session?.Class?.Title || "Unknown Class"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {record.Session
                            ? formatTime(record.Session.StartsAt)
                            : "N/A"}{" "}
                          -{" "}
                          {record.Session
                            ? formatTime(record.Session.EndsAt)
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.Session
                            ? formatDate(record.Session.StartsAt)
                            : "No session date"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Session ID: {record.SessionID.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Duration:{" "}
                          {record.Session
                            ? calculateDuration(
                                record.Session.StartsAt,
                                record.Session.EndsAt
                              )
                            : "N/A"}{" "}
                          min
                        </div>
                        <div className="text-sm text-gray-600">
                          Status:{" "}
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              record.Session?.Status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : record.Session?.Status === "ongoing"
                                ? "bg-cyan-100 text-cyan-800"
                                : record.Session?.Status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record.Session?.Status || "Unknown"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Capacity: {record.Session?.Capacity || "N/A"} people
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(record.CheckedInAt)}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getMethodColor(
                              record.CheckinMethod
                            )}`}
                          >
                            {formatMethod(record.CheckinMethod)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Recorded: {formatDate(record.CreatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-cyan-50 px-6 py-4 border-t border-cyan-100">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    QR Code:{" "}
                    {attendance.filter((a) => a.CheckinMethod === "qr").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Manual:{" "}
                    {
                      attendance.filter((a) => a.CheckinMethod === "manual")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Card:{" "}
                    {
                      attendance.filter((a) => a.CheckinMethod === "card")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center ml-auto">
                  <span className="text-cyan-700 font-medium">
                    Total: {attendance.length} check-ins
                  </span>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {filteredAttendance.length}
                  </span>{" "}
                  of <span className="font-medium">{attendance.length}</span>{" "}
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

export default AttendanceTable;
