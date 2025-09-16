import { Injectable } from '@nestjs/common';
import { RedditService } from '../reddit/reddit.service';
import { GeminiService } from '../gemini/gemini.service';

export interface ScoopRequest {
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange?: string;
  keywords?: string;
  limit?: number;
  sort?: string;
}

@Injectable()
export class ScoopService {
  constructor(
    private readonly redditService: RedditService,
    private readonly geminiService: GeminiService,
  ) {}

  async processRequest(request: ScoopRequest) {
    try {
      console.log('Processing Scoop request:', request);

      // Collect data from selected platforms
      let allData = [];
      const platformResults = {};

      if (request.platforms.includes('reddit')) {
        try {
          const redditData = await this.redditService.getData(
            request.query,
            request.timeRange || 'week',
            request.limit || 10,
            request.sort || 'relevance',
          );
          allData = allData.concat(redditData);
          platformResults['reddit'] = {
            success: true,
            count: redditData.length,
            data: redditData,
          };
        } catch (error) {
          console.error('Reddit data collection failed:', error.message);
          platformResults['reddit'] = {
            success: false,
            error: error.message,
            count: 0,
            data: [],
          };
        }
      }

      // Add other platform services here
      // if (request.platforms.includes('twitter')) { ... }
      // if (request.platforms.includes('linkedin')) { ... }
      // if (request.platforms.includes('quora')) { ... }

      // Process with AI
      let analysis = '';
      let aiResult = { success: false, error: null as string | null };

      try {
        if (request.aiModel.startsWith('gemini')) {
          analysis = await this.geminiService.analyze(
            allData,
            request.query,
            request.aiModel,
          );
          aiResult = { success: true, error: null };
        } else {
          analysis = 'AI model not supported in this deployment';
          aiResult = { success: false, error: 'Unsupported AI model' };
        }
      } catch (error) {
        console.error('AI analysis failed:', error.message);
        analysis = 'Error processing with AI: ' + error.message;
        aiResult = { success: false, error: error.message };
      }

      return {
        success: true,
        query: request.query,
        platforms: request.platforms,
        aiModel: request.aiModel,
        timeRange: request.timeRange || 'week',
        keywords: request.keywords,
        limit: request.limit || 10,
        sort: request.sort || 'relevance',
        dataCount: allData.length,
        platformResults,
        aiResult,
        rawData: allData,
        analysis: analysis,
        timestamp: new Date().toISOString(),
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
        limit: request.limit,
        sort: request.sort,
        dataCount: 0,
        platformResults: {},
        aiResult: { success: false, error: error.message },
        rawData: [],
        analysis: 'Error processing request',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getSupportedPlatforms() {
    return [
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
    ];
  }

  async getSupportedAIModels() {
    return [
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
    ];
  }
}
