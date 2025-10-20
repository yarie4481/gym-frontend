"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import PublicRoute from "@/components/PublicRoute";
import { useAuth } from "../contexts/AuthContext";
import { basUrl } from "../basUrl";

function LoginPageContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${basUrl}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const { user } = data;

      // Update auth context (this will handle session storage)
      login(user);

      // Redirect to dashboard
      router.push("/");
      router.refresh(); // Refresh to update any server components
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="bg-background-light min-h-screen w-full flex items-center justify-center p-6">
      {/* Your existing login form JSX */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
        {/* Left Image */}
        <div className="hidden md:flex md:w-1/2 bg-gray-200">
          <img
            src="/gym-1.jpg"
            alt="Gym equipment"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8 space-y-6">
          {/* Header with enhanced styling */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4 mx-auto">
              <FaLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Sign in to your account
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

          {/* Login Form Section */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <FaEnvelope className="w-4 h-4 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Sign In</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-cyan-600 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </form>

          {/* Login Button */}
          <button
            onClick={handleLogin}
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
                Signing In...
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </>
            )}
          </button>

          {/* Or Login With */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-2 text-sm text-gray-400">Or login with</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            >
              <FcGoogle size={20} /> Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            >
              <FaFacebook size={20} className="text-blue-600" /> Facebook
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-cyan-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginPageContent />
    </PublicRoute>
  );
}
