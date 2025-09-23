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

  async getData(
    query: string,
    timeRange: string = 'week',
    limit: number = 10,
    sort: string = 'relevance',
  ) {
    try {
      console.log(
        `Reddit API: Searching for "${query}" with timeRange: ${timeRange}, limit: ${limit}, sort: ${sort}`,
      );

      // Get Reddit access token
      const clientId = this.configService.get<string>('REDDIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'REDDIT_CLIENT_SECRET',
      );

      if (!clientId || !clientSecret) {
        console.warn(
          'Reddit credentials not configured - returning empty results',
        );
        return [];
      }

      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );

      const tokenResponse = await firstValueFrom(
        this.httpService.post(
          'https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'ScoopAI/1.0 by scoopai',
            },
          },
        ),
      );

      const accessToken = (tokenResponse as any).data.access_token;

      // Search Reddit
      const searchUrl = `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=${sort}&limit=${limit}&t=${timeRange}`;
      console.log(`Reddit API: Making request to ${searchUrl}`);

      const searchResponse = await firstValueFrom(
        this.httpService.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'ScoopAI/1.0 by scoopai',
          },
        }),
      );

      const posts = (searchResponse as any).data.data.children.map((post) => ({
        platform: 'reddit',
        id: post.data.id,
        title: post.data.title,
        content: post.data.selftext || post.data.title,
        author: post.data.author,
        subreddit: post.data.subreddit,
        created_at: new Date(post.data.created_utc * 1000).toISOString(),
        score: post.data.score,
        upvote_ratio: post.data.upvote_ratio,
        num_comments: post.data.num_comments,
        url: `https://reddit.com${post.data.permalink}`,
        thumbnail: post.data.thumbnail,
        is_video: post.data.is_video,
        over_18: post.data.over_18,
      }));

      console.log(`Reddit API: Found ${posts.length} posts`);
      return posts;
    } catch (error) {
      console.error('Reddit API Error:', error.message);
      if (error.response) {
        console.error('Reddit API Response:', error.response.data);
      }
      throw new HttpException(
        `Reddit API error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSubredditPosts(
    subreddit: string,
    limit: number = 10,
    sort: string = 'hot',
  ) {
    try {
      console.log(`Reddit API: Getting posts from r/${subreddit}`);

      const clientId = this.configService.get<string>('REDDIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'REDDIT_CLIENT_SECRET',
      );

      if (!clientId || !clientSecret) {
        console.warn(
          'Reddit credentials not configured - returning empty results',
        );
        return [];
      }

      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );

      const tokenResponse = await firstValueFrom(
        this.httpService.post(
          'https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'ScoopAI/1.0 by scoopai',
            },
          },
        ),
      );

      const accessToken = (tokenResponse as any).data.access_token;

      const subredditUrl = `https://oauth.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;
      console.log(`Reddit API: Making request to ${subredditUrl}`);

      const subredditResponse = await firstValueFrom(
        this.httpService.get(subredditUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'ScoopAI/1.0 by scoopai',
          },
        }),
      );

      const posts = (subredditResponse as any).data.data.children.map(
        (post) => ({
          platform: 'reddit',
          id: post.data.id,
          title: post.data.title,
          content: post.data.selftext || post.data.title,
          author: post.data.author,
          subreddit: post.data.subreddit,
          created_at: new Date(post.data.created_utc * 1000).toISOString(),
          score: post.data.score,
          upvote_ratio: post.data.upvote_ratio,
          num_comments: post.data.num_comments,
          url: `https://reddit.com${post.data.permalink}`,
          thumbnail: post.data.thumbnail,
          is_video: post.data.is_video,
          over_18: post.data.over_18,
        }),
      );

      console.log(
        `Reddit API: Found ${posts.length} posts from r/${subreddit}`,
      );
      return posts;
    } catch (error) {
      console.error('Reddit Subreddit API Error:', error.message);
      if (error.response) {
        console.error('Reddit API Response:', error.response.data);
      }
      throw new HttpException(
        `Reddit subreddit API error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
