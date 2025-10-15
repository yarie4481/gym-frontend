"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48a16,16,0,0,1,21.53,0l80,75.48A16,16,0,0,1,224,115.55Z"></path>
        </svg>
      ),
    },
    {
      id: "members",
      name: "Members",
      path: "/members",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z"></path>
        </svg>
      ),
    },
    {
      id: "gym",
      name: "Gym",
      path: "/gym",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M96,64a8,8,0,0,0-8,8v16H64V72a8,8,0,0,0-16,0V88H32a8,8,0,0,0,0,16H48v48H32a8,8,0,0,0,0,16H48v16a8,8,0,0,0,16,0V168H88v16a8,8,0,0,0,16,0V72A8,8,0,0,0,96,64Z"></path>
        </svg>
      ),
    },
    {
      id: "trainers",
      name: "Trainers",
      path: "/trainers",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8Z"></path>
        </svg>
      ),
    },
    {
      id: "classes",
      name: "Classes",
      path: "/classes",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
        </svg>
      ),
    },

    {
      id: "class-session",
      name: "Class Session",
      path: "/class-session",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z"></path>
        </svg>
      ),
    },
    {
      id: "payments",
      name: "Payments",
      path: "/payments",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Z"></path>
        </svg>
      ),
    },
    {
      id: "attendance",
      name: "Attendance",
      path: "/attendance",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M216,40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM128,144a32,32,0,1,1,32-32A32.036,32.036,0,0,1,128,144Zm-56,0a56,56,0,1,0,56-56A56.063,56.063,0,0,0,72,144Z"></path>
        </svg>
      ),
    },
    {
      id: "reports",
      name: "Reports",
      path: "/reports",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z"></path>
        </svg>
      ),
    },
    {
      id: "settings",
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          fill="currentColor"
          height="22"
          width="22"
          viewBox="0 0 256 256"
          className="text-cyan-500"
        >
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
        </svg>
      ),
    },
  ];

  const helpItem = {
    id: "help",
    name: "Help & Docs",
    path: "/help",
    icon: (
      <svg
        fill="currentColor"
        height="22"
        width="22"
        viewBox="0 0 256 256"
        className="text-cyan-500"
      >
        <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Z"></path>
      </svg>
    ),
  };

  const navigateTo = (path: string) => router.push(path);

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white p-5 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 shadow-sm">
        <div
          className="h-12 w-12 rounded-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBMZdsdFyKpQfqfIvRNBf7yhW3Oyok_YnfdUDdV5DuJlVjnQILAV-o_GiBucPRlJrp6EtvRJJbNDb_rozChB-1Y0i6orGwqlJXXmhjY7Zs-eoP5d-0AZhs1oo85nDohoh2_ZFxPlYN7O7S5xaAYBaI58H1O3e_XsPobuHS1jB-i6qYQwtNDFtFgkGjipDO-vIiQHfLkhz6lpRQPxFK8j1uwZdPJ8RZo-KGZz7GdUbGbHqorN8xyPszkSYOWhKUcOyeAruc2J-jcJJ9")',
          }}
        ></div>
        <h1 className="text-lg font-bold text-black">FitnessPro</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.path)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-cyan-100 text-cyan-700 shadow-sm"
                  : "text-black hover:bg-cyan-50 hover:shadow-sm"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={() => navigateTo(helpItem.path)}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
            pathname === helpItem.path
              ? "bg-cyan-100 text-cyan-700 shadow-sm"
              : "text-black hover:bg-cyan-50 hover:shadow-sm"
          }`}
        >
          {helpItem.icon}
          <span>{helpItem.name}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
