import { NextRequest, NextResponse } from "next/server";
import { setAuthTokens } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Call your backend authentication API
    const response = await fetch("http://localhost:8787/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || "Login failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const { access_token, refresh_token, user } = data;

    // Set HTTP-only cookies
    await setAuthTokens(access_token, refresh_token);

    // Return user data (without tokens) to client
    return NextResponse.json({
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
