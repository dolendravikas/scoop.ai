import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ScoopService } from './scoop.service';

export interface ScoopRequest {
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange?: string;
  keywords?: string;
  limit?: number;
  sort?: string;
}

@Controller('api/scoop')
export class ScoopController {
  constructor(private readonly scoopService: ScoopService) {}

  @Post()
  async processScoopRequest(@Body() request: ScoopRequest) {
    try {
      if (!request.query) {
        throw new HttpException(
          'Query parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!request.platforms || request.platforms.length === 0) {
        throw new HttpException(
          'At least one platform must be specified',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!request.aiModel) {
        throw new HttpException(
          'AI model must be specified',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.scoopService.processRequest(request);
    } catch (error) {
      throw new HttpException(
        `Scoop processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('platforms')
  async getAvailablePlatforms() {
    return {
      success: true,
      platforms: [
        {
          name: 'reddit',
          description: 'Reddit social media platform',
          supported: true,
          endpoints: ['search', 'subreddit'],
        },
        {
          name: 'twitter',
          description: 'Twitter/X social media platform',
          supported: false,
          note: 'Coming soon',
        },
        {
          name: 'linkedin',
          description: 'LinkedIn professional network',
          supported: false,
          note: 'Coming soon',
        },
        {
          name: 'quora',
          description: 'Quora Q&A platform',
          supported: false,
          note: 'Coming soon',
        },
      ],
    };
  }

  @Get('ai-models')
  async getAvailableAIModels() {
    return {
      success: true,
      models: [
        {
          name: 'gemini-1.5-flash',
          description: 'Fast and efficient model for most tasks',
          supported: true,
          maxTokens: 8192,
        },
        {
          name: 'gemini-pro',
          description: 'High-quality model for complex tasks',
          supported: true,
          maxTokens: 30720,
        },
        {
          name: 'gemini-1.5-pro',
          description: 'Latest high-performance model',
          supported: true,
          maxTokens: 2048000,
        },
      ],
    };
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Scoop AI Main Service',
    };
  }
}
