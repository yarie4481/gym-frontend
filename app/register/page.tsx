"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import axios from "axios";
import { basUrl } from "../basUrl";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User fields - only the specified ones
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");

  // Handle registration
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${basUrl}auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        date_of_birth: dob,
        status: "Active",
        user_type: "Admin",
      });

      // Redirect to login after successful registration
      router.push("/auth");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen w-full flex items-center justify-center p-6">
      {/* Enhanced Form Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-2xl flex flex-col">
        {/* Left Image */}
        <div className="hidden md:flex md:h-48 bg-gray-200">
          <img
            src="/gym-1.jpg"
            alt="Gym equipment"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center w-full p-8 space-y-6">
          {/* Header with enhanced styling */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4 mx-auto">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Admin Account
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Join our fitness community today
            </p>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
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

          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 px-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 border border-transparent rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {loading ? (
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
                Creating Account...
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
                Create Admin Account
              </>
            )}
          </button>

          {/* Link to login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/auth"
              className="text-cyan-600 hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
