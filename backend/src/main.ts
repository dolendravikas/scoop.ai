import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGIN || true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global prefix - removed since controllers already have /api prefix
    // app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);

    logger.log(`🚀 Scoop API server running on port ${port}`);
    logger.log(
      `📊 Health check available at: http://localhost:${port}/api/health`,
    );
    logger.log(
      `🔍 Reddit API available at: http://localhost:${port}/api/reddit`,
    );
    logger.log(
      `🤖 Gemini API available at: http://localhost:${port}/api/gemini`,
    );
    logger.log(
      `🎯 Main Scoop API available at: http://localhost:${port}/api/scoop`,
    );
  } catch (error) {
    logger.error('Failed to start the application:', error);
    process.exit(1);
  }
}

bootstrap();
