import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoopModule } from './modules/scoop/scoop.module';
import { RedditModule } from './modules/reddit/reddit.module';
import { GeminiModule } from './modules/gemini/gemini.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScoopModule,
    RedditModule,
    GeminiModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
