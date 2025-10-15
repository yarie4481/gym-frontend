"use client";

import React from "react";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen items-center justify-center bg-background-light font-display">
        {children}
      </body>
    </html>
  );
}
