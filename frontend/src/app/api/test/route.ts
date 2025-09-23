import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, isDebugMode } from "@/config/app.config";

export async function GET(request: NextRequest) {
  try {
    // Test backend connection using configuration
    const backendUrl = getApiUrl("health");

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        backend: "connected",
        data: data,
      });
    } else {
      return NextResponse.json({
        success: false,
        backend: "error",
        status: response.status,
        error: "Backend not responding",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      backend: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
