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
      platforms: body?.platforms || ["reddit", "twitter"],
      aiModel: body?.aiModel || "gemini-pro",
      timeRange: body?.timeRange || "week",
      keywords: body?.keywords || "",
      dataCount: 5,
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
          platform: "twitter",
          content:
            "Mock Twitter post about the search query. This is sample data for testing purposes. #test #mock",
          author: "mock_user",
          author_name: "Mock User",
          author_verified: false,
          created_at: new Date().toISOString(),
          like_count: 15,
          retweet_count: 3,
          reply_count: 2,
          url: "https://twitter.com/mock_user/status/mock1",
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
          platform: "twitter",
          content:
            "Another mock Twitter post with insights about the search topic. Great discussion happening here!",
          author: "tech_expert",
          author_name: "Tech Expert",
          author_verified: true,
          created_at: new Date().toISOString(),
          like_count: 42,
          retweet_count: 8,
          reply_count: 5,
          url: "https://twitter.com/tech_expert/status/mock2",
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
      analysis: `Based on the search results from Reddit and Twitter, here's what I found about "${
        body?.query || "your query"
      }":\n\n1. The topic appears to be actively discussed across multiple platforms:\n   - Reddit: r/test, r/technology, and r/programming communities\n   - Twitter: Various users including verified accounts discussing the topic\n\n2. Key insights from the community:\n   - Reddit: Users showing interest with engagement scores ranging from 10-25 upvotes\n   - Twitter: Strong engagement with likes (15-42), retweets (3-8), and replies (2-5)\n   - The discussion spans across different communities, indicating broad relevance\n   - Recent posts suggest this is a trending topic\n\n3. Platform-specific observations:\n   - Reddit provides more detailed, long-form discussions\n   - Twitter shows real-time reactions and quick insights\n   - Both platforms indicate positive community sentiment\n\nNote: This is mock data for demonstration purposes. The backend API is not currently available.`,
      error: "Backend API not available. Showing mock data for demonstration.",
    };

    return NextResponse.json(mockData);
  }
}
