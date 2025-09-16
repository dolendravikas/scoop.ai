/**
 * Application Configuration
 * Centralized configuration for the Scoop AI application
 */

export interface AppConfig {
  // Backend Configuration
  backend: {
    baseUrl: string;
    endpoints: {
      scoop: string;
      health: string;
      platforms: string;
      aiModels: string;
    };
  };

  // Application Info
  app: {
    name: string;
    description: string;
    version: string;
  };

  // Feature Flags
  features: {
    debugMode: boolean;
    mockDataEnabled: boolean;
    analytics: boolean;
    errorReporting: boolean;
  };

  // Default Values
  defaults: {
    aiModel: string;
    platforms: string[];
    timeRange: string;
  };

  // UI Configuration
  ui: {
    maxSearchResults: number;
    defaultLimit: number;
    animationDuration: number;
  };
}

/**
 * Get the complete application configuration
 */
export const getAppConfig = (): AppConfig => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    backend: {
      baseUrl: isDevelopment
        ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        : process.env.NEXT_PUBLIC_BACKEND_URL_PROD ||
          "https://scoop-ai-backend-production.up.railway.app",
      endpoints: {
        scoop: process.env.NEXT_PUBLIC_API_SCOOP_ENDPOINT || "/api/scoop",
        health:
          process.env.NEXT_PUBLIC_API_HEALTH_ENDPOINT || "/api/scoop/health",
        platforms:
          process.env.NEXT_PUBLIC_API_PLATFORMS_ENDPOINT ||
          "/api/scoop/platforms",
        aiModels:
          process.env.NEXT_PUBLIC_API_AI_MODELS_ENDPOINT ||
          "/api/scoop/ai-models",
      },
    },

    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || "Scoop AI",
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
        "AI-Powered Social Media Intelligence",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    },

    features: {
      debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
      mockDataEnabled: process.env.NEXT_PUBLIC_MOCK_DATA_ENABLED === "true",
      analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
      errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
    },

    defaults: {
      aiModel: process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || "gemini-1.5-flash",
      platforms: (process.env.NEXT_PUBLIC_DEFAULT_PLATFORMS || "reddit").split(
        ","
      ),
      timeRange: process.env.NEXT_PUBLIC_DEFAULT_TIME_RANGE || "week",
    },

    ui: {
      maxSearchResults: 50,
      defaultLimit: 10,
      animationDuration: 200,
    },
  };
};

/**
 * Get backend URL for API calls
 */
export const getBackendUrl = (endpoint: string = ""): string => {
  const config = getAppConfig();
  return `${config.backend.baseUrl}${endpoint}`;
};

/**
 * Get full API endpoint URL
 */
export const getApiUrl = (
  endpoint: keyof AppConfig["backend"]["endpoints"]
): string => {
  const config = getAppConfig();
  return getBackendUrl(config.backend.endpoints[endpoint]);
};

/**
 * Check if we should use mock data
 */
export const shouldUseMockData = (): boolean => {
  const config = getAppConfig();
  return config.features.mockDataEnabled;
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  const config = getAppConfig();
  return config.features.debugMode;
};

// Export the default configuration
export const appConfig = getAppConfig();
