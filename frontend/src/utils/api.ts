/**
 * API Utility Functions
 * Centralized API calling functions with configuration
 */

import { getApiUrl, isDebugMode } from "@/config/app.config";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ScoopRequest {
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange?: string;
  keywords?: string;
  limit?: number;
  sort?: string;
}

export interface ScoopResponse {
  success: boolean;
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange: string;
  keywords: string;
  dataCount: number;
  rawData: any[];
  analysis: string;
  timestamp: string;
  error?: string;
}

/**
 * Make a POST request to the Scoop API
 */
export const searchScoop = async (
  request: ScoopRequest
): Promise<ScoopResponse> => {
  const url = getApiUrl("scoop");

  if (isDebugMode()) {
    console.log("Making Scoop API request to:", url);
    console.log("Request payload:", request);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (isDebugMode()) {
      console.log("Scoop API response:", data);
    }

    return data;
  } catch (error) {
    if (isDebugMode()) {
      console.error("Scoop API error:", error);
    }
    throw error;
  }
};

/**
 * Check backend health
 */
export const checkBackendHealth = async (): Promise<ApiResponse> => {
  const url = getApiUrl("health");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get available platforms
 */
export const getAvailablePlatforms = async (): Promise<ApiResponse> => {
  const url = getApiUrl("platforms");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Platforms request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get available AI models
 */
export const getAvailableAIModels = async (): Promise<ApiResponse> => {
  const url = getApiUrl("aiModels");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`AI models request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
