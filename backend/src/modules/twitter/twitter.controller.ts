import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TwitterService } from "./twitter.service";

export interface TwitterSearchRequest {
  query: string;
  maxResults?: number;
  sortOrder?: "relevancy" | "recency";
}

export interface TwitterUserRequest {
  username: string;
  maxResults?: number;
}

@Controller("api/twitter")
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post("search")
  async searchTwitter(@Body() request: TwitterSearchRequest) {
    try {
      if (!request.query) {
        throw new HttpException(
          "Query parameter is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.twitterService.getData(
        request.query,
        request.maxResults || 10,
        request.sortOrder || "relevancy"
      );

      return {
        success: true,
        data: result,
        count: result.length,
        query: request.query,
        maxResults: request.maxResults || 10,
        sortOrder: request.sortOrder || "relevancy",
      };
    } catch (error) {
      throw new HttpException(
        `Twitter search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("search")
  async searchTwitterGet(
    @Query("q") query: string,
    @Query("maxResults") maxResults?: number,
    @Query("sortOrder") sortOrder?: string
  ) {
    try {
      if (!query) {
        throw new HttpException(
          "Query parameter is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.twitterService.getData(
        query,
        maxResults || 10,
        sortOrder || "relevancy"
      );

      return {
        success: true,
        data: result,
        count: result.length,
        query,
        maxResults: maxResults || 10,
        sortOrder: sortOrder || "relevancy",
      };
    } catch (error) {
      throw new HttpException(
        `Twitter search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("user")
  async getUserTweets(@Body() request: TwitterUserRequest) {
    try {
      if (!request.username) {
        throw new HttpException(
          "Username parameter is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.twitterService.getUserTweets(
        request.username,
        request.maxResults || 10
      );

      return {
        success: true,
        data: result,
        count: result.length,
        username: request.username,
        maxResults: request.maxResults || 10,
      };
    } catch (error) {
      throw new HttpException(
        `Twitter user tweets failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("user")
  async getUserTweetsGet(
    @Query("username") username: string,
    @Query("maxResults") maxResults?: number
  ) {
    try {
      if (!username) {
        throw new HttpException(
          "Username parameter is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.twitterService.getUserTweets(
        username,
        maxResults || 10
      );

      return {
        success: true,
        data: result,
        count: result.length,
        username,
        maxResults: maxResults || 10,
      };
    } catch (error) {
      throw new HttpException(
        `Twitter user tweets failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("health")
  async healthCheck() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Twitter API",
    };
  }
}



