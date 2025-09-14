import { Injectable } from '@nestjs/common';
import { RedditService } from '../services/reddit.service';
import { GeminiService } from '../services/gemini.service';

export interface ScoopRequest {
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange?: string;
  keywords?: string;
}

@Injectable()
export class ScoopService {
  constructor(
    private readonly redditService: RedditService,
    private readonly geminiService: GeminiService,
  ) {}

  async processRequest(request: ScoopRequest) {
    try {
      console.log('Processing request:', request);

      // Collect data from selected platforms
      let allData = [];

      if (request.platforms.includes('reddit')) {
        const redditData = await this.redditService.getData(request.query, request.timeRange);
        allData = allData.concat(redditData);
      }

      // Add other platform services here
      // if (request.platforms.includes('twitter')) { ... }
      // if (request.platforms.includes('linkedin')) { ... }
      // if (request.platforms.includes('quora')) { ... }

      // Process with AI
      let analysis = '';
      if (request.aiModel === 'gemini-pro') {
        analysis = await this.geminiService.analyze(allData, request.query);
      } else {
        analysis = 'AI model not supported in this deployment';
      }

      return {
        success: true,
        query: request.query,
        platforms: request.platforms,
        aiModel: request.aiModel,
        timeRange: request.timeRange,
        keywords: request.keywords,
        dataCount: allData.length,
        rawData: allData,
        analysis: analysis,
      };
    } catch (error) {
      console.error('ScoopService Error:', error);
      return {
        success: false,
        error: error.message,
        query: request.query,
        platforms: request.platforms,
        aiModel: request.aiModel,
        timeRange: request.timeRange,
        keywords: request.keywords,
        dataCount: 0,
        rawData: [],
        analysis: 'Error processing request',
      };
    }
  }
}
