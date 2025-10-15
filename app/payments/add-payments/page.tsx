// components/AddPaymentForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import React, { useState, useEffect } from "react";

interface Member {
  ID: string;
  first_name: string;
  last_name: string;
  UserID: string;
  Dob: string | null;
  Gender: string;
  EmergencyContact: any;
  Notes: string;
  CreatedAt: string;
  UpdatedAt: string;
  User: {
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
  };
}

interface PaymentFormData {
  member_id: string;
  amount_cents: number;
  currency: string;
  method: string;
  status: string;
  reference: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  payment?: any;
}

const AddPaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    member_id: "",
    amount_cents: 0,
    currency: "Birr",
    method: "credit_card",
    status: "pending",
    reference: "",
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Currency options
  const currencyOptions = ["Birr", "USD", "EUR", "GBP"];

  // Payment method options
  const methodOptions = [
    { value: "credit_card", label: "Credit Card" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "mobile_payment", label: "Mobile Payment" },
  ];

  // Status options
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

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

        // Auto-select the first member if available
        if (membersData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            member_id: membersData[0].ID,
          }));
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Please try again.");
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount_cents") {
      setFormData((prev) => ({
        ...prev,
        [name]: Math.round(parseFloat(value) * 100) || 0,
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

  const generateReference = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `txn-${timestamp}-${random}`;
  };

  const handleGenerateReference = () => {
    setFormData((prev) => ({
      ...prev,
      reference: generateReference(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.member_id || !formData.amount_cents || !formData.reference) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.amount_cents <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending data to API:", formData);

      const response = await fetch(`${basUrl}api/payments`, {
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
        alert("Payment added successfully!");

        // Reset form after successful submission
        setFormData({
          member_id: members.length > 0 ? members[0].ID : "",
          amount_cents: 0,
          currency: "Birr",
          method: "credit_card",
          status: "pending",
          reference: "",
        });
      } else {
        throw new Error(result.message || "Failed to add payment");
      }
    } catch (err) {
      console.error("Error adding payment:", err);
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
      member_id: members.length > 0 ? members[0].ID : "",
      amount_cents: 0,
      currency: "Birr",
      method: "credit_card",
      status: "pending",
      reference: "",
    });
    setError(null);
    setSuccess(false);
  };

  // Format amount for display
  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  // Get selected member
  const selectedMember = members.find((m) => m.ID === formData.member_id);

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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Add New Payment
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Record a new payment transaction for a member
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
                Payment recorded successfully!
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
            Payment Registration Form
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Fill in the payment details below
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Payment Information Section */}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="member_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Member *
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
                      {members.map((member) => (
                        <option key={member.ID} value={member.ID}>
                          {member.first_name} {member.last_name} -{" "}
                          {member.User?.email}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="amount_cents"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount_cents"
                      name="amount_cents"
                      required
                      min="0"
                      step="0.01"
                      value={formatAmount(formData.amount_cents)}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">
                        {formData.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    value={formData.currency}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="method"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method *
                  </label>
                  <select
                    id="method"
                    name="method"
                    required
                    value={formData.method}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {methodOptions.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Status *
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

                <div className="space-y-2">
                  <label
                    htmlFor="reference"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reference Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      required
                      value={formData.reference}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter reference number"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateReference}
                      disabled={isLoading}
                      className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Unique identifier for this payment transaction
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Preview Section */}
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
                  Payment Preview
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
                    <span className="font-medium text-gray-700">Amount:</span>
                    <p className="text-lg font-bold text-gray-900">
                      {formData.currency} {formatAmount(formData.amount_cents)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Reference:
                    </span>
                    <p className="text-gray-600 font-mono">
                      {formData.reference || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">
                      Payment Method:
                    </span>
                    <p className="text-gray-600">
                      {methodOptions.find((m) => m.value === formData.method)
                        ?.label || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        formData.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : formData.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.status.charAt(0).toUpperCase() +
                        formData.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Currency:</span>
                    <p className="text-gray-600">{formData.currency}</p>
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
                disabled={isLoading || isLoadingMembers || members.length === 0}
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
                    Processing Payment...
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
                    Record Payment
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

export default AddPaymentForm;
