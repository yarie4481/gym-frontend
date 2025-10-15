"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard1 from "./Dashboard1";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light font-display text-gray-800">
      <div className="flex h-full min-h-0 flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Header />

          {/* Dashboard section */}
          <Dashboard1 />

          {/* Page content */}
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
