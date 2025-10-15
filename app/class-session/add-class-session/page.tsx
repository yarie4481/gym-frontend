// components/AddClassSessionForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import React, { useState, useEffect } from "react";

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
  Gym: any;
  Trainer: any;
  Sessions: any;
}

interface ClassSessionFormData {
  class_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  status: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  session?: any;
}

const AddClassSessionForm: React.FC = () => {
  const [formData, setFormData] = useState<ClassSessionFormData>({
    class_id: "",
    starts_at: "",
    ends_at: "",
    capacity: 20,
    status: "scheduled",
  });

  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Status options
  const statusOptions = [
    { value: "scheduled", label: "Scheduled" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const response = await fetch(`${basUrl}class`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const classesData: Class[] = await response.json();
        setClasses(classesData);

        // Auto-select the first class if available
        if (classesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            class_id: classesData[0].ID,
          }));
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "capacity") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleDateTimeChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime || !duration) return "";

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString().slice(0, 16);
  };

  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find((c) => c.ID === classId);
    if (selectedClass && formData.starts_at) {
      setFormData((prev) => ({
        ...prev,
        class_id: classId,
        capacity: selectedClass.Capacity,
        ends_at: calculateEndTime(
          formData.starts_at,
          selectedClass.DurationMinutes
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        class_id: classId,
        capacity: selectedClass?.Capacity || 20,
      }));
    }
  };

  const handleStartTimeChange = (startTime: string) => {
    const selectedClass = classes.find((c) => c.ID === formData.class_id);
    if (selectedClass) {
      setFormData((prev) => ({
        ...prev,
        starts_at: startTime,
        ends_at: calculateEndTime(startTime, selectedClass.DurationMinutes),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        starts_at: startTime,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.class_id || !formData.starts_at || !formData.ends_at) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.capacity <= 0) {
      setError("Please enter a valid capacity");
      return;
    }

    if (new Date(formData.starts_at) >= new Date(formData.ends_at)) {
      setError("End time must be after start time");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending data to API:", formData);

      const response = await fetch(`${basUrl}classsession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      if (result.success) {
        setSuccess(true);
        alert("Class session added successfully!");

        // Reset form after successful submission
        setFormData({
          class_id: classes.length > 0 ? classes[0].ID : "",
          starts_at: "",
          ends_at: "",
          capacity: 20,
          status: "scheduled",
        });
      } else {
        throw new Error(result.message || "Failed to add class session");
      }
    } catch (err) {
      console.error("Error adding class session:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      class_id: classes.length > 0 ? classes[0].ID : "",
      starts_at: "",
      ends_at: "",
      capacity: 20,
      status: "scheduled",
    });
    setError(null);
    setSuccess(false);
  };

  // Get selected class
  const selectedClass = classes.find((c) => c.ID === formData.class_id);

  // Format date for display
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "Not set";
    return new Date(dateTime).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-background-light min-h-screen">
      {/* Header with enhanced styling */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
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
        </div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Add Class Session
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Schedule a new session for an existing class
        </p>
      </div>

      {/* Enhanced Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-green-800">Success!</h3>
              <p className="text-sm text-green-700 mt-1">
                Class session scheduled successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Form Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Class Session Form
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Schedule a new session for your fitness class
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Class Selection Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Class Selection
                </h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="class_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Class *
                  </label>
                  {isLoadingClasses ? (
                    <div className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 bg-gray-100 flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading classes...
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm text-red-500 bg-red-50">
                      No classes available. Please add classes first.
                    </div>
                  ) : (
                    <select
                      id="class_id"
                      name="class_id"
                      required
                      value={formData.class_id}
                      onChange={(e) => handleClassChange(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {classes.map((classItem) => (
                        <option key={classItem.ID} value={classItem.ID}>
                          {classItem.Title} - {classItem.DurationMinutes}min -{" "}
                          {classItem.Trainer?.first_name}{" "}
                          {classItem.Trainer?.last_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedClass && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Selected Class Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Title:
                        </span>
                        <p className="text-gray-600">{selectedClass.Title}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Duration:
                        </span>
                        <p className="text-gray-600">
                          {selectedClass.DurationMinutes} minutes
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Trainer:
                        </span>
                        <p className="text-gray-600">
                          {selectedClass.Trainer?.first_name}{" "}
                          {selectedClass.Trainer?.last_name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Class Capacity:
                        </span>
                        <p className="text-gray-600">
                          {selectedClass.Capacity} people
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Details Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Session Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="starts_at"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="starts_at"
                    name="starts_at"
                    required
                    value={formData.starts_at}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ends_at"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="ends_at"
                    name="ends_at"
                    required
                    value={formData.ends_at}
                    onChange={(e) =>
                      handleDateTimeChange("ends_at", e.target.value)
                    }
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                    min="1"
                    max={selectedClass?.Capacity || 50}
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter session capacity"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {selectedClass?.Capacity || 50} people (based on
                    class capacity)
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Session Preview Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Session Preview
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Class:</span>
                    <p className="text-gray-600">
                      {selectedClass?.Title || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Start Time:
                    </span>
                    <p className="text-gray-600">
                      {formatDateTime(formData.starts_at)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Time:</span>
                    <p className="text-gray-600">
                      {formatDateTime(formData.ends_at)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Capacity:</span>
                    <p className="text-gray-600">{formData.capacity} people</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        formData.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : formData.status === "ongoing"
                          ? "bg-cyan-100 text-cyan-800"
                          : formData.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.status.charAt(0).toUpperCase() +
                        formData.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-600">
                      {formData.starts_at && formData.ends_at
                        ? `${Math.round(
                            (new Date(formData.ends_at).getTime() -
                              new Date(formData.starts_at).getTime()) /
                              (1000 * 60)
                          )} minutes`
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isLoadingClasses || classes.length === 0}
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 border border-transparent rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Scheduling Session...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Schedule Session
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClassSessionForm;
