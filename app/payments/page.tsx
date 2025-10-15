// components/PaymentTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

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
  Memberships: any;
  Bookings: any;
  Attendance: any;
  Payments: any;
}

interface Payment {
  ID: string;
  MemberID: string;
  AmountCents: number;
  Currency: string;
  Method: string;
  Status: string;
  Reference: string;
  CreatedAt: string;
  UpdatedAt: string;
  Member: Member;
}

const PaymentTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching payments from API...");
        const response = await fetch(`${basUrl}api/payments`, {
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

        const paymentsData: Payment[] = await response.json();
        console.log("Payments data received:", paymentsData);

        if (!Array.isArray(paymentsData)) {
          throw new Error("Invalid data format received from API");
        }

        setPayments(paymentsData);
      } catch (err) {
        console.error("Error fetching payments:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load payments. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search term and active tab
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.MemberID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.Method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.Currency.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status based on active tab
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Completed")
      return matchesSearch && payment.Status === "completed";
    if (activeTab === "Pending")
      return matchesSearch && payment.Status === "pending";
    if (activeTab === "Failed")
      return matchesSearch && payment.Status === "failed";

    return matchesSearch;
  });

  // Format amount for display
  const formatAmount = (amountCents: number, currency: string) => {
    const amount = (amountCents / 100).toFixed(2);
    return `${currency} ${amount}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit_card":
        return "bg-blue-100 text-blue-800";
      case "cash":
        return "bg-green-100 text-green-800";
      case "bank_transfer":
        return "bg-purple-100 text-purple-800";
      case "mobile_payment":
        return "bg-cyan-100 text-cyan-800";
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

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">
            Error Loading Payments
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
        <h1 className="text-2xl font-bold text-gray-900">Payment Records</h1>
        <p className="text-gray-600 mt-1">
          {filteredPayments.length} payment
          {filteredPayments.length !== 1 ? "s" : ""} found
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
            placeholder="Search payments by reference, member ID, or method..."
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
            All Payments
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
            onClick={() => setActiveTab("Pending")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Pending"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("Failed")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Failed"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Failed
          </button>
          <a href="payments/add-payments">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <span className="material-symbols-outlined">add</span>
              Add Payment
            </button>
          </a>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No payments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : "No payment records available"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.Reference}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {payment.ID.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Member ID: {payment.MemberID.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.Member?.first_name &&
                          payment.Member?.last_name
                            ? `${payment.Member.first_name} ${payment.Member.last_name}`
                            : "Member not found"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.Member?.User?.email || "No email"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {payment.Member?.User?.phone_number || "No phone"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">
                          {formatAmount(payment.AmountCents, payment.Currency)}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getMethodColor(
                              payment.Method
                            )}`}
                          >
                            {formatMethod(payment.Method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                            payment.Status
                          )}`}
                        >
                          {payment.Status.charAt(0).toUpperCase() +
                            payment.Status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.CreatedAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Updated: {formatDate(payment.UpdatedAt)}
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
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Completed:{" "}
                    {payments.filter((p) => p.Status === "completed").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Pending:{" "}
                    {payments.filter((p) => p.Status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">
                    Failed:{" "}
                    {payments.filter((p) => p.Status === "failed").length}
                  </span>
                </div>
                <div className="flex items-center ml-auto">
                  <span className="text-gray-900 font-medium">
                    Total: {payments.length} payments
                  </span>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredPayments.length}</span>{" "}
                  of <span className="font-medium">{payments.length}</span>{" "}
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

export default PaymentTable;
