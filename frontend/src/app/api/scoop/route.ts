import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For development, proxy to local backend
    const isDevelopment = process.env.NODE_ENV === 'development';
    const backendUrl = isDevelopment 
      ? 'http://localhost:3001/api/scoop'
      : process.env.BACKEND_URL || 'https://your-backend-url.railway.app/api/scoop';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to mock data
    const mockData = {
      success: true,
      query: body.query || 'test query',
      platforms: body.platforms || ['reddit'],
      aiModel: body.aiModel || 'gemini-pro',
      timeRange: body.timeRange || 'week',
      keywords: body.keywords || '',
      dataCount: 3,
      rawData: [
        {
          platform: 'reddit',
          content: 'Mock Reddit post about the search query. This is sample data for testing purposes.',
          author: 'mock_user',
          subreddit: 'test',
          created_at: new Date().toISOString(),
          score: 10,
          url: 'https://reddit.com/r/test/comments/mock'
        }
      ],
      analysis: 'This is a mock AI analysis. The backend API is not available, so this is fallback data for testing purposes.',
      error: 'Backend API not available. Showing mock data.'
    };
    
    return NextResponse.json(mockData);
  }
}
