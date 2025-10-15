"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Define routes where layout should be hidden
  const hideLayoutRoutes = ["/auth", "/login", "/chat", "/register"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  // Redirect to auth if not authenticated and trying to access protected routes
  useEffect(() => {
    if (!isLoading && !user && !shouldHideLayout) {
      // User is not authenticated and trying to access protected route
      router.push("/auth");
    }
  }, [user, isLoading, shouldHideLayout, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and trying to access protected route, show loading until redirect
  if (!user && !shouldHideLayout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (shouldHideLayout) {
    return (
      <div className="min-h-screen bg-background-light font-display text-gray-800">
        {children}
      </div>
    );
  }

  // Only show layout if user is authenticated
  return (
    <div className="flex h-screen bg-background-light font-display text-gray-800">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
