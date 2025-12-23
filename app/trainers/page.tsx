// components/TrainerTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

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

interface TrainersResponse {
  count: number;
  trainers: Trainer[];
}

const TrainerTable: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching trainers from API...");
        const response = await fetch(`${basUrl}auth/trainer`, {
          method: "GET",
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

        const trainersData: TrainersResponse = await response.json();
        console.log("Trainers data received:", trainersData);

        if (!trainersData.trainers || !Array.isArray(trainersData.trainers)) {
          throw new Error("Invalid data format received from API");
        }

        setTrainers(trainersData.trainers);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load trainers. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Filter trainers based on search term and active tab
  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.phone_number.includes(searchTerm);

    // Filter by status based on active tab
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Active")
      return matchesSearch && trainer.status === "Active";
    if (activeTab === "Inactive")
      return matchesSearch && trainer.status === "Inactive";
    if (activeTab === "Pending")
      return matchesSearch && trainer.status === "Pending";

    return matchesSearch;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString.includes("0001-01-01")) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth || dateOfBirth.includes("0001-01-01")) return "N/A";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get user type color
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "Trainer":
        return "bg-cyan-100 text-cyan-800";
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Member":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <p className="mt-4 text-gray-600">Loading trainers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">
            Error Loading Trainers
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
        <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
        <p className="text-gray-600 mt-1">
          {filteredTrainers.length} trainer
          {filteredTrainers.length !== 1 ? "s" : ""} found
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
            placeholder="Search trainers by name, email, or phone..."
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
            All Trainers
          </button>
          <button
            onClick={() => setActiveTab("Active")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Active"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("Inactive")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Inactive"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Pending"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <a href="trainers/add-trainers">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <span className="material-symbols-outlined">Add</span>
              Trainer
            </button>
          </a>
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredTrainers.length === 0 ? (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No trainers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No trainers available"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trainer Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {trainer.first_name} {trainer.last_name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {trainer.user_id.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Joined: {formatDate(trainer.join_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {trainer.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trainer.phone_number || "No phone"}
                        </div>
                        <div className="text-xs text-gray-400">
                          Updated: {formatDate(trainer.updated_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Age: {calculateAge(trainer.date_of_birth)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Gender: {trainer.Gender || "Not specified"}
                        </div>
                        <div className="text-xs text-gray-400">
                          DOB: {formatDate(trainer.date_of_birth)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                              trainer.status
                            )}`}
                          >
                            {trainer.status}
                          </span>
                          <div>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getUserTypeColor(
                                trainer.user_type
                              )}`}
                            >
                              {trainer.user_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {trainer.membership_type || "No membership"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Start: {formatDate(trainer.membership_start || "N/A")}
                        </div>
                        <div className="text-sm text-gray-500">
                          End: {formatDate(trainer.membership_end || "N/A")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredTrainers.length}</span>{" "}
                  of <span className="font-medium">{trainers.length}</span>{" "}
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

export default TrainerTable;
