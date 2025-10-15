// components/TakeAttendanceForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import React, { useState, useEffect, useRef } from "react";

interface Member {
  ID: string;
  first_name: string;
  last_name: string;
  UserID: string;
  User: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

interface ClassSession {
  ID: string;
  ClassID: string;
  StartsAt: string;
  EndsAt: string;
  Class: {
    ID: string;
    Title: string;
    Trainer: {
      first_name: string;
      last_name: string;
    };
  };
}

interface AttendanceFormData {
  member_id: string;
  session_id: string;
  method: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  attendance?: any;
}

const TakeAttendanceForm: React.FC = () => {
  const [formData, setFormData] = useState<AttendanceFormData>({
    member_id: "",
    session_id: "",
    method: "manual",
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedMemberId, setScannedMemberId] = useState<string>("");

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoadingMembers(true);
        const response = await fetch(`${basUrl}members`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const membersData: Member[] = await response.json();
        setMembers(membersData);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Please try again.");
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  // Fetch class sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true);
        const response = await fetch(`${basUrl}classsession/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sessionsData: ClassSession[] = await response.json();
        setSessions(sessionsData);

        // Auto-select the first session if available
        if (sessionsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            session_id: sessionsData[0].ID,
          }));
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load class sessions. Please try again.");
      } finally {
        setIsLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleMethodChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      method,
    }));

    if (method === "qr") {
      setQrScannerActive(true);
      startQRScanner();
    } else {
      setQrScannerActive(false);
      stopQRScanner();
    }
  };

  const startQRScanner = () => {
    // This is a placeholder for QR scanner implementation
    // In a real app, you would use a library like html5-qrcode or quaggaJS
    console.log("Starting QR scanner...");

    // Simulate QR scanning for demo purposes
    setTimeout(() => {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      if (randomMember) {
        setScannedMemberId(randomMember.ID);
        setFormData((prev) => ({
          ...prev,
          member_id: randomMember.ID,
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    }, 2000);
  };

  const stopQRScanner = () => {
    console.log("Stopping QR scanner...");
    // Clean up QR scanner resources
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.member_id || !formData.session_id) {
      setError("Please select both member and session");
      return;
    }

    await submitAttendance();
  };

  const submitAttendance = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending attendance data to API:", formData);

      const response = await fetch(`${basUrl}api/attendance`, {
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

        // Reset form for manual entry
        if (formData.method === "manual") {
          setFormData((prev) => ({
            ...prev,
            member_id: "",
          }));
        }

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.message || "Failed to record attendance");
      }
    } catch (err) {
      console.error("Error recording attendance:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      member_id: "",
      session_id: sessions.length > 0 ? sessions[0].ID : "",
      method: "manual",
    });
    setError(null);
    setSuccess(false);
    setQrScannerActive(false);
    setScannedMemberId("");
  };

  // Get selected member
  const selectedMember = members.find((m) => m.ID === formData.member_id);
  const selectedSession = sessions.find((s) => s.ID === formData.session_id);

  // Format date for display
  const formatDateTime = (dateTime: string) => {
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
      {/* Header */}
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Take Attendance
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Record member attendance for class sessions
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
                Attendance recorded successfully for{" "}
                {selectedMember?.first_name} {selectedMember?.last_name}!
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
            Attendance Form
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Choose your preferred attendance method
          </p>
        </div>

        <div className="p-6">
          {/* Method Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance Method
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleMethodChange("manual")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.method === "manual"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-300 bg-white hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      formData.method === "manual"
                        ? "border-cyan-500 bg-cyan-500"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.method === "manual" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Manual Entry
                    </div>
                    <div className="text-sm text-gray-500">
                      Select member from list
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleMethodChange("qr")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.method === "qr"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-300 bg-white hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      formData.method === "qr"
                        ? "border-cyan-500 bg-cyan-500"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.method === "qr" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      QR Code Scan
                    </div>
                    <div className="text-sm text-gray-500">
                      Scan member QR code
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Session Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
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
                Session Selection
              </h2>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="session_id"
                className="block text-sm font-medium text-gray-700"
              >
                Select Class Session *
              </label>
              {isLoadingSessions ? (
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
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm text-red-500 bg-red-50">
                  No class sessions available. Please schedule sessions first.
                </div>
              ) : (
                <select
                  id="session_id"
                  name="session_id"
                  required
                  value={formData.session_id}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {sessions.map((session) => (
                    <option key={session.ID} value={session.ID}>
                      {session.Class?.Title} -{" "}
                      {formatDateTime(session.StartsAt)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Manual Entry Form */}
          {formData.method === "manual" && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Manual Member Selection
                </h2>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="member_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Member *
                </label>
                {isLoadingMembers ? (
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
                    Loading members...
                  </div>
                ) : members.length === 0 ? (
                  <div className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm text-red-500 bg-red-50">
                    No members available. Please add members first.
                  </div>
                ) : (
                  <select
                    id="member_id"
                    name="member_id"
                    required
                    value={formData.member_id}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a member...</option>
                    {members.map((member) => (
                      <option key={member.ID} value={member.ID}>
                        {member.first_name} {member.last_name} -{" "}
                        {member.User?.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Manual Submit Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={
                    isLoading || !formData.member_id || !formData.session_id
                  }
                  className="w-full px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 border border-transparent rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
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
                      Recording Attendance...
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Record Manual Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* QR Scanner Section */}
          {formData.method === "qr" && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  QR Code Scanner
                </h2>
              </div>

              <div className="text-center">
                <div className="bg-black rounded-lg p-8 mb-4 mx-auto max-w-md">
                  <div className="text-white text-sm mb-4">QR Scanner View</div>
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <div className="text-cyan-400 text-lg mb-2">
                      🎥 Camera Feed
                    </div>
                    <div className="text-gray-400 text-sm">
                      {scannedMemberId
                        ? "Member scanned successfully!"
                        : "Point camera at member's QR code"}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  {scannedMemberId
                    ? `Scanned: ${selectedMember?.first_name} ${selectedMember?.last_name}`
                    : "Waiting for QR code scan..."}
                </div>

                <button
                  type="button"
                  onClick={startQRScanner}
                  disabled={isLoading || !!scannedMemberId}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {scannedMemberId ? "Scan Complete" : "Start Scanner"}
                </button>
              </div>
            </div>
          )}

          {/* Attendance Preview */}
          {(formData.member_id || scannedMemberId) && (
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
                  Attendance Preview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Member:</span>
                    <p className="text-gray-600">
                      {selectedMember
                        ? `${selectedMember.first_name} ${selectedMember.last_name}`
                        : "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">
                      {selectedMember?.User?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Method:</span>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        formData.method === "qr"
                          ? "bg-cyan-100 text-cyan-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {formData.method === "qr" ? "QR Code" : "Manual Entry"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Class:</span>
                    <p className="text-gray-600">
                      {selectedSession?.Class?.Title || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Session Time:
                    </span>
                    <p className="text-gray-600">
                      {selectedSession
                        ? formatDateTime(selectedSession.StartsAt)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trainer:</span>
                    <p className="text-gray-600">
                      {selectedSession?.Class?.Trainer?.first_name}{" "}
                      {selectedSession?.Class?.Trainer?.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendanceForm;
