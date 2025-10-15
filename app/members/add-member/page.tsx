// components/AddMemberForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import React, { useState, useEffect } from "react";

interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  date_of_birth: string;
  plan_id: string;
  join_date: string;
  membership_start: string;
  membership_end: string;
  fitness_goals: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  user_type: string;
}

interface Plan {
  ID: string;
  Title: string;
  Description: string;
  PriceCents: number;
  BillingCycle: string;
  NumSessions: number | null;
  Access: string;
  CreatedAt: string;
  UpdatedAt: string;
  Memberships: any;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  member?: any;
}

const AddMemberForm: React.FC = () => {
  const [formData, setFormData] = useState<MemberFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
    plan_id: "",
    join_date: new Date().toISOString().split("T")[0],
    membership_start: "",
    membership_end: "",
    fitness_goals: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    status: "Active",
    user_type: "Member",
  });

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user type is Member
  const isMemberUser = formData.user_type === "Member";

  // Fetch plans from API on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch(`${basUrl}api/plans`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const plansData: Plan[] = await response.json();
        setPlans(plansData);

        // Auto-select the first plan if available and user type is Member
        if (plansData.length > 0 && formData.user_type === "Member") {
          setFormData((prev) => ({
            ...prev,
            plan_id: plansData[0].ID,
          }));
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load membership plans. Please try again.");
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // If user_type is changing, handle membership fields accordingly
    if (name === "user_type") {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: value,
        };

        // If changing to non-Member, clear membership-specific fields
        if (value !== "Member") {
          newFormData.plan_id = "";
          newFormData.join_date = "";
          newFormData.membership_start = "";
          newFormData.membership_end = "";
          newFormData.fitness_goals = "";
          newFormData.emergency_contact_name = "";
          newFormData.emergency_contact_phone = "";
        } else {
          // If changing to Member, set default values
          newFormData.join_date = new Date().toISOString().split("T")[0];
          newFormData.status = "Active";
          // Auto-select first plan if available
          if (plans.length > 0 && !newFormData.plan_id) {
            newFormData.plan_id = plans[0].ID;
          }
        }

        return newFormData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that a plan is selected if user type is Member
    if (isMemberUser && !formData.plan_id) {
      setError("Please select a membership plan");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data for API - only include membership fields if user is Member
      const apiData = {
        ...formData,
        date_of_birth: formData.date_of_birth || null,
        // Only format and include membership fields if user is Member
        ...(isMemberUser && {
          plan_id: formData.plan_id,
          join_date: formData.join_date
            ? `${formData.join_date}T00:00:00Z`
            : null,
          membership_start: formData.membership_start
            ? `${formData.membership_start}T00:00:00Z`
            : null,
          membership_end: formData.membership_end
            ? `${formData.membership_end}T00:00:00Z`
            : null,
          fitness_goals: formData.fitness_goals || null,
          emergency_contact_name: formData.emergency_contact_name || null,
          emergency_contact_phone: formData.emergency_contact_phone || null,
        }),
        // Clear membership fields if user is not Member
        ...(!isMemberUser && {
          plan_id: null,
          join_date: null,
          membership_start: null,
          membership_end: null,
          fitness_goals: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
        }),
      };

      console.log("Sending data to API:", apiData);

      const response = await fetch(`${basUrl}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      if (result.success) {
        setSuccess(true);
        alert("User added successfully!");

        // Reset form after successful submission
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          date_of_birth: "",
          plan_id: isMemberUser && plans.length > 0 ? plans[0].ID : "",
          join_date: isMemberUser ? new Date().toISOString().split("T")[0] : "",
          membership_start: "",
          membership_end: "",
          fitness_goals: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          status: "Active",
          user_type: "Member",
        });
      } else {
        throw new Error(result.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      date_of_birth: "",
      plan_id: isMemberUser && plans.length > 0 ? plans[0].ID : "",
      join_date: isMemberUser ? new Date().toISOString().split("T")[0] : "",
      membership_start: "",
      membership_end: "",
      fitness_goals: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      status: "Active",
      user_type: "Member",
    });
    setError(null);
    setSuccess(false);
  };

  // Helper function to format price for display
  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Add New User
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Create a new member, trainer, or admin account
        </p>

        {/* Status Indicators */}
        <div className="flex justify-center gap-4 mt-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.user_type === "Member"
                ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Member
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.user_type === "Trainer"
                ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Trainer
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.user_type === "Admin"
                ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Admin
          </div>
        </div>
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
                User added successfully!
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
            User Registration Form
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Fill in the details below to create a new account
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    maxLength={50}
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    maxLength={50}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={100}
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter password"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    maxLength={15}
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="date_of_birth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="user_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Type *
                  </label>
                  <select
                    id="user_type"
                    name="user_type"
                    required
                    value={formData.user_type}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="Member">Member</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status *
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Membership Information Section - Only show for Member user type */}
            {isMemberUser && (
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Membership Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="plan_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Membership Plan *
                    </label>
                    {isLoadingPlans ? (
                      <div className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 bg-gray-100 flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-cyan-500"
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
                        Loading plans...
                      </div>
                    ) : plans.length === 0 ? (
                      <div className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm text-red-500 bg-red-50">
                        No plans available. Please contact administrator.
                      </div>
                    ) : (
                      <select
                        id="plan_id"
                        name="plan_id"
                        required
                        value={formData.plan_id}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {plans.map((plan) => (
                          <option key={plan.ID} value={plan.ID}>
                            {plan.Title} - {formatPrice(plan.PriceCents)}
                            {plan.BillingCycle && ` (${plan.BillingCycle})`}
                          </option>
                        ))}
                      </select>
                    )}
                    {plans.length > 0 && formData.plan_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        {
                          plans.find((p) => p.ID === formData.plan_id)
                            ?.Description
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="join_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Join Date *
                    </label>
                    <input
                      type="date"
                      id="join_date"
                      name="join_date"
                      required
                      value={formData.join_date}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="membership_start"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Membership Start Date
                    </label>
                    <input
                      type="date"
                      id="membership_start"
                      name="membership_start"
                      value={formData.membership_start}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="membership_end"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Membership End Date
                    </label>
                    <input
                      type="date"
                      id="membership_end"
                      name="membership_end"
                      value={formData.membership_end}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Section - Only show for Member user type */}
            {isMemberUser && (
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fitness_goals"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fitness Goals
                    </label>
                    <textarea
                      id="fitness_goals"
                      name="fitness_goals"
                      rows={4}
                      value={formData.fitness_goals}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Describe fitness goals, preferences, and any specific requirements..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="emergency_contact_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergency_contact_name"
                        name="emergency_contact_name"
                        maxLength={100}
                        value={formData.emergency_contact_name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter emergency contact name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="emergency_contact_phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="emergency_contact_phone"
                        name="emergency_contact_phone"
                        maxLength={15}
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter emergency contact phone"
                      />
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
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (isMemberUser && (isLoadingPlans || plans.length === 0))
                }
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
                    Adding {formData.user_type}...
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
                    Add {formData.user_type}
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

export default AddMemberForm;
