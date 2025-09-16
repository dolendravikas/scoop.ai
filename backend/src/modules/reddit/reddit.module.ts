import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedditController } from './reddit.controller';
import { RedditService } from './reddit.service';

@Module({
  imports: [HttpModule],
  controllers: [RedditController],
  providers: [RedditService],
  exports: [RedditService],
})
export class RedditModule {}
