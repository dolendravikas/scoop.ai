import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoopController } from './scoop/scoop.controller';
import { ScoopService } from './scoop/scoop.service';
import { RedditService } from './services/reddit.service';
import { GeminiService } from './services/gemini.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController, ScoopController],
  providers: [AppService, ScoopService, RedditService, GeminiService],
})
export class AppModule {}
