import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';

export interface GeminiAnalysisRequest {
  data: any[];
  query: string;
  model?: string;
  prompt?: string;
}

export interface GeminiGenerateRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
}

@Controller('api/gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('analyze')
  async analyzeData(@Body() request: GeminiAnalysisRequest) {
    try {
      if (!request.data || !request.query) {
        throw new HttpException(
          'Data and query parameters are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.geminiService.analyze(
        request.data,
        request.query,
        request.model || 'gemini-1.5-flash',
        request.prompt,
      );

      return {
        success: true,
        analysis: result,
        query: request.query,
        model: request.model || 'gemini-1.5-flash',
        dataCount: request.data.length,
      };
    } catch (error) {
      throw new HttpException(
        `Gemini analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate')
  async generateContent(@Body() request: GeminiGenerateRequest) {
    try {
      if (!request.prompt) {
        throw new HttpException(
          'Prompt parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.geminiService.generateContent(
        request.prompt,
        request.model || 'gemini-1.5-flash',
        request.maxTokens || 1000,
      );

      return {
        success: true,
        content: result,
        model: request.model || 'gemini-1.5-flash',
        prompt: request.prompt,
      };
    } catch (error) {
      throw new HttpException(
        `Gemini generation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Gemini AI API',
    };
  }

  @Get('models')
  async getAvailableModels() {
    return {
      success: true,
      models: [
        {
          name: 'gemini-1.5-flash',
          description: 'Fast and efficient model for most tasks',
          maxTokens: 8192,
        },
        {
          name: 'gemini-pro',
          description: 'High-quality model for complex tasks',
          maxTokens: 30720,
        },
        {
          name: 'gemini-1.5-pro',
          description: 'Latest high-performance model',
          maxTokens: 2048000,
        },
      ],
    };
  }
}
