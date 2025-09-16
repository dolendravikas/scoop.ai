import { Module } from '@nestjs/common';
import { ScoopController } from './scoop.controller';
import { ScoopService } from './scoop.service';
import { RedditModule } from '../reddit/reddit.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [RedditModule, GeminiModule],
  controllers: [ScoopController],
  providers: [ScoopService],
  exports: [ScoopService],
})
export class ScoopModule {}
