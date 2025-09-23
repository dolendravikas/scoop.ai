import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedditService } from './reddit.service';

export interface RedditSearchRequest {
  query: string;
  timeRange?: string;
  limit?: number;
  sort?: 'relevance' | 'hot' | 'top' | 'new';
}

@Controller('api/reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  @Post('search')
  async searchReddit(@Body() request: RedditSearchRequest) {
    try {
      if (!request.query) {
        throw new HttpException(
          'Query parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.redditService.getData(
        request.query,
        request.timeRange || 'week',
        request.limit || 10,
        request.sort || 'relevance',
      );

      return {
        success: true,
        data: result,
        count: result.length,
        query: request.query,
        timeRange: request.timeRange || 'week',
        sort: request.sort || 'relevance',
      };
    } catch (error) {
      throw new HttpException(
        `Reddit search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchRedditGet(
    @Query('q') query: string,
    @Query('timeRange') timeRange?: string,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ) {
    try {
      if (!query) {
        throw new HttpException(
          'Query parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.redditService.getData(
        query,
        timeRange || 'week',
        limit || 10,
        sort || 'relevance',
      );

      return {
        success: true,
        data: result,
        count: result.length,
        query,
        timeRange: timeRange || 'week',
        sort: sort || 'relevance',
      };
    } catch (error) {
      throw new HttpException(
        `Reddit search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Reddit API',
    };
  }
}
