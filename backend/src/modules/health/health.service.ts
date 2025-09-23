import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  async getHealthStatus() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Scoop AI Backend',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  async getDetailedHealthStatus() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Scoop AI Backend',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      dependencies: {
        reddit: this.checkRedditConfig(),
        gemini: this.checkGeminiConfig(),
      },
    };
  }

  async getReadinessStatus() {
    const redditConfig = this.checkRedditConfig();
    const geminiConfig = this.checkGeminiConfig();

    const isReady = redditConfig.configured && geminiConfig.configured;

    return {
      status: isReady ? 'READY' : 'NOT_READY',
      timestamp: new Date().toISOString(),
      checks: {
        reddit: redditConfig,
        gemini: geminiConfig,
      },
    };
  }

  async getLivenessStatus() {
    return {
      status: 'ALIVE',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private checkRedditConfig() {
    const clientId = this.configService.get<string>('REDDIT_CLIENT_ID');
    const clientSecret = this.configService.get<string>('REDDIT_CLIENT_SECRET');

    return {
      configured: !!(clientId && clientSecret),
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    };
  }

  private checkGeminiConfig() {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    return {
      configured: !!apiKey,
      hasApiKey: !!apiKey,
    };
  }
}
