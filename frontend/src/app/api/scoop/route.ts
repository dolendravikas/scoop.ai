import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, shouldUseMockData, isDebugMode } from "@/config/app.config";

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();

    // Get backend URL from configuration
    const backendUrl = getApiUrl("scoop");

    if (isDebugMode()) {
      console.log("Proxying request to:", backendUrl);
      console.log("Request body:", body);
    }

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (isDebugMode()) {
        console.error("Backend error:", response.status, errorText);
      }
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (isDebugMode()) {
      console.log("Backend response:", data);
    }

    return NextResponse.json(data);
  } catch (error) {
    if (isDebugMode()) {
      console.error("API Error:", error);
    }

    // Fallback to mock data when backend is not available or mock data is enabled
    const mockData = {
      success: true,
      query: body?.query || "test query",
      platforms: body?.platforms || ["reddit"],
      aiModel: body?.aiModel || "gemini-pro",
      timeRange: body?.timeRange || "week",
      keywords: body?.keywords || "",
      dataCount: 3,
      rawData: [
        {
          platform: "reddit",
          content:
            "Mock Reddit post about the search query. This is sample data for testing purposes.",
          author: "mock_user",
          subreddit: "test",
          created_at: new Date().toISOString(),
          score: 10,
          url: "https://reddit.com/r/test/comments/mock",
        },
        {
          platform: "reddit",
          content:
            "Another mock Reddit post with relevant information about the search topic.",
          author: "test_user",
          subreddit: "technology",
          created_at: new Date().toISOString(),
          score: 25,
          url: "https://reddit.com/r/technology/comments/mock2",
        },
        {
          platform: "reddit",
          content:
            "Third mock post providing additional context and insights on the subject.",
          author: "sample_user",
          subreddit: "programming",
          created_at: new Date().toISOString(),
          score: 15,
          url: "https://reddit.com/r/programming/comments/mock3",
        },
      ],
      analysis: `Based on the search results from Reddit, here's what I found about "${
        body?.query || "your query"
      }":\n\n1. The topic appears to be actively discussed across multiple subreddits including r/test, r/technology, and r/programming.\n\n2. Key insights from the community:\n   - Users are showing interest in this topic with engagement scores ranging from 10-25 upvotes\n   - The discussion spans across different communities, indicating broad relevance\n   - Recent posts suggest this is a trending topic\n\n3. Community sentiment appears positive based on the engagement metrics.\n\nNote: This is mock data for demonstration purposes. The backend API is not currently available.`,
      error: "Backend API not available. Showing mock data for demonstration.",
    };

    return NextResponse.json(mockData);
  }
}
