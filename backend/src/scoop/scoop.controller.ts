import { Controller, Post, Body, Get } from '@nestjs/common';
import { ScoopService } from './scoop.service';

export interface ScoopRequest {
  query: string;
  platforms: string[];
  aiModel: string;
  timeRange?: string;
  keywords?: string;
}

@Controller('api/scoop')
export class ScoopController {
  constructor(private readonly scoopService: ScoopService) {}

  @Post()
  async processScoopRequest(@Body() request: ScoopRequest) {
    return this.scoopService.processRequest(request);
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Scoop AI Backend'
    };
  }
}
