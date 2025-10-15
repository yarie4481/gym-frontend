// components/Members.tsx
"use client";

import React, { useState, useEffect } from "react";
import { basUrl } from "../basUrl";

interface EmergencyContact {
  name: string;
  phone: string;
}

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

interface Membership {
  ID: string;
  MemberID: string;
  PlanID: string;
  StartDate: string;
  EndDate: string;
  Status: string;
  AutoRenew: boolean;
  PaymentMethodID: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  Member: any;
  Plan: Plan;
}

interface Member {
  ID: string;
  first_name: string;
  last_name: string;
  UserID: string;
  Dob: string;
  Gender: string;
  EmergencyContact: EmergencyContact;
  Notes: string;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Memberships: Membership[];
  Bookings: any[];
  Attendance: any[];
  Payments: any[];
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active");

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term and active tab
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    // Filter by status based on active tab
    let matchesTab = true;
    if (activeTab === "Active") {
      matchesTab = member.Memberships.some((m) => m.Status === "active");
    } else if (activeTab === "Expired") {
      matchesTab = member.Memberships.some(
        (m) => m.Status === "expired" || new Date(m.EndDate) < new Date()
      );
    } else if (activeTab === "Pending Payment") {
      // You might need to adjust this based on your payment status logic
      matchesTab = member.Memberships.some((m) => m.Status === "pending");
    }

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatus = (member: Member) => {
    // If no payments array or empty array, consider as not paid
    if (!member.Payments || member.Payments.length === 0) {
      return "Not Paid";
    }

    // Check for any completed payment
    const completedPayment = member.Payments.find(
      (payment) => payment.Status === "completed"
    );
    if (completedPayment) {
      return "Paid";
    }

    // Check for any pending payment
    const pendingPayment = member.Payments.find(
      (payment) => payment.Status === "pending"
    );
    if (pendingPayment) {
      return "Pending";
    }

    // Default to not paid if no relevant payment status found
    return "Not Paid";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Not Paid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCurrentMembership = (member: Member) => {
    // Get the most recent active membership, or the first one if none are active
    const activeMembership = member.Memberships.find(
      (m) => m.Status === "active"
    );
    return activeMembership || member.Memberships[0];
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600 mt-1">
          {filteredMembers.length} member
          {filteredMembers.length !== 1 ? "s" : ""} found
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
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50"
            placeholder="Search members..."
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("Active")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Active"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("Expired")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Expired"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Expired
          </button>
          <button
            onClick={() => setActiveTab("Pending Payment")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "Pending Payment"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Payment
          </button>
          <a href="/members/add-member">
            <button className="flex items-center gap-2 ml-210 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
              <span className="material-symbols-outlined">add</span>
              Add Member
            </button>
          </a>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
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
              No members found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : `No ${activeTab.toLowerCase()} members found`}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start/End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => {
                    const membership = getCurrentMembership(member);
                    const paymentStatus = getPaymentStatus(member);

                    return (
                      <tr key={member.ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.User?.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {membership?.Plan?.Title || "No Plan"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {membership?.Plan?.BillingCycle ||
                              "No billing cycle"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                              membership?.Status || "pending"
                            )}`}
                          >
                            {membership?.Status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {membership
                              ? formatDate(membership.StartDate)
                              : "N/A"}{" "}
                            /{" "}
                            {membership
                              ? formatDate(membership.EndDate)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(
                              paymentStatus
                            )}`}
                          >
                            {paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination - You can implement pagination when your API supports it */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredMembers.length}</span>{" "}
                  of <span className="font-medium">{members.length}</span>{" "}
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

export default Members;
