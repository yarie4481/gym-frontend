import { NextResponse } from "next/server";
import { clearAuthTokens } from "@/lib/server-auth";

export async function POST() {
  try {
    await clearAuthTokens();

    return NextResponse.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
