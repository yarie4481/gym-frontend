"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "@/app/contexts/AuthContext";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setDropdownOpen(false);
  };

  const confirmLogout = async (confirm: boolean) => {
    setShowLogoutConfirm(false);
    if (confirm) {
      try {
        await logout();
        router.push("/auth");
        router.refresh(); // Refresh to update any server components
      } catch (error) {
        console.error("Logout error:", error);
        // Fallback redirect even if API call fails
        router.push("/auth");
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-3 backdrop-blur-sm">
      {/* Search Input */}
      <div className="relative w-full max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="text-gray-400"
            fill="currentColor"
            height="20"
            viewBox="0 0 256 256"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
          </svg>
        </div>
        <input
          className="w-full rounded-lg border-0 bg-gray-200/70 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500"
          placeholder="Search"
          type="text"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Icon */}
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-200/50 hover:text-gray-700">
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
          </svg>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-cyan-700 hover:bg-cyan-100 transition"
          >
            <div
              className="h-8 w-8 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgGQDJM4qPbg0fAFW6yAx7dX95DuetHpC0Mxr5oALb77hwsMt3em0I_d-EEqc2ni1bCTxHXxQlKJ7Va8cyn-xVvQVzf0rOTdtwwDJhVXYNItby6hK-DYrGSoNIR5PCKoT6evgeS760Zr-e3Ua_5L57IayHxAZkkwA9DzrLeY97d6TSresNDzgrtCBJVxVB21tldSX9jjxRfe_G62qI56fgDFuBd8zCcC1u5Zw8TnTPJI10SzbDYgcpIZenil2IExoAhkhObUrbqF3O")',
              }}
            ></div>
            <span className="text-sm font-medium max-w-24 truncate">
              {user?.name || user?.email || "User"}
            </span>
            <FaChevronDown size={14} className="text-cyan-600" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-cyan-100 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/change-password");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="rounded-lg bg-white p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmLogout(true)}
                className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition font-medium"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => confirmLogout(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
