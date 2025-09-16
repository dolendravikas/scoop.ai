/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_BACKEND_URL_PROD: process.env.NEXT_PUBLIC_BACKEND_URL_PROD,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
    NEXT_PUBLIC_MOCK_DATA_ENABLED: process.env.NEXT_PUBLIC_MOCK_DATA_ENABLED,
  },

  // API rewrites for development
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    if (isDevelopment) {
      return [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },

  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

module.exports = nextConfig;
