"use client";

import Dashboard1 from "@/components/Dashboard1";
import ProtectedRoute from "@/components/ProtectedRoute";

function DashboardContent() {
  return <Dashboard1 />;
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
