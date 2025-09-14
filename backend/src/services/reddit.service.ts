import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RedditService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getData(query: string, timeRange: string = 'week') {
    try {
      // Get Reddit access token
      const clientId = this.configService.get<string>('REDDIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('REDDIT_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        throw new HttpException('Reddit credentials not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const tokenResponse = await firstValueFrom(
        this.httpService.post('https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'ScoopAI/1.0 by scoopai'
            }
          }
        )
      );

      const accessToken = tokenResponse.data.access_token;

      // Search Reddit
      const searchResponse = await firstValueFrom(
        this.httpService.get(`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=relevance&limit=10&t=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'ScoopAI/1.0 by scoopai'
          }
        })
      );

      return searchResponse.data.data.children.map(post => ({
        platform: 'reddit',
        content: post.data.selftext || post.data.title,
        author: post.data.author,
        subreddit: post.data.subreddit,
        created_at: new Date(post.data.created_utc * 1000).toISOString(),
        score: post.data.score,
        url: `https://reddit.com${post.data.permalink}`
      }));
    } catch (error) {
      console.error('Reddit API Error:', error.message);
      throw new HttpException('Reddit API error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
