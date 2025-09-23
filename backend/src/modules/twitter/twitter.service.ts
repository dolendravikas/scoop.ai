import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getData(
    query: string,
    maxResults: number = 10,
    sortOrder: string = "relevancy"
  ) {
    try {
      console.log(
        `Twitter API: Searching for "${query}" with maxResults: ${maxResults}, sortOrder: ${sortOrder}`
      );

      // Get Twitter API credentials
      const bearerToken = this.configService.get<string>(
        "TWITTER_BEARER_TOKEN"
      );

      if (!bearerToken) {
        console.warn(
          "Twitter credentials not configured - returning empty results"
        );
        return [];
      }

      // Search Twitter using the X API v2
      const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&sort_order=${sortOrder}&tweet.fields=created_at,author_id,public_metrics,context_annotations,entities&user.fields=username,name,verified&expansions=author_id`;

      console.log(`Twitter API: Making request to ${searchUrl}`);

      const searchResponse = await firstValueFrom(
        this.httpService.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      const responseData = (searchResponse as any).data;
      const tweets = responseData.data || [];
      const users = responseData.includes?.users || [];

      // Create a map of users for quick lookup
      const userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });

      const posts = tweets.map((tweet) => {
        const author = userMap[tweet.author_id];
        return {
          platform: "twitter",
          id: tweet.id,
          content: tweet.text,
          author: author ? author.username : "unknown",
          author_name: author ? author.name : "Unknown User",
          author_verified: author ? author.verified : false,
          created_at: tweet.created_at,
          retweet_count: tweet.public_metrics?.retweet_count || 0,
          like_count: tweet.public_metrics?.like_count || 0,
          reply_count: tweet.public_metrics?.reply_count || 0,
          quote_count: tweet.public_metrics?.quote_count || 0,
          url: `https://twitter.com/${author?.username || "unknown"}/status/${tweet.id}`,
          entities: tweet.entities,
          context_annotations: tweet.context_annotations,
        };
      });

      console.log(`Twitter API: Found ${posts.length} tweets`);
      return posts;
    } catch (error) {
      console.error("Twitter API Error:", error.message);
      if (error.response) {
        console.error("Twitter API Response:", error.response.data);
      }
      throw new HttpException(
        `Twitter API error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserTweets(username: string, maxResults: number = 10) {
    try {
      console.log(`Twitter API: Getting tweets from @${username}`);

      const bearerToken = this.configService.get<string>(
        "TWITTER_BEARER_TOKEN"
      );

      if (!bearerToken) {
        console.warn(
          "Twitter credentials not configured - returning empty results"
        );
        return [];
      }

      // First, get the user ID from username
      const userUrl = `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,username,name,verified`;

      const userResponse = await firstValueFrom(
        this.httpService.get(userUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      const userData = (userResponse as any).data.data;
      if (!userData) {
        throw new Error(`User @${username} not found`);
      }

      // Get user's tweets
      const tweetsUrl = `https://api.twitter.com/2/users/${userData.id}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics,context_annotations,entities&expansions=author_id`;

      console.log(`Twitter API: Making request to ${tweetsUrl}`);

      const tweetsResponse = await firstValueFrom(
        this.httpService.get(tweetsUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      const responseData = (tweetsResponse as any).data;
      const tweets = responseData.data || [];

      const posts = tweets.map((tweet) => ({
        platform: "twitter",
        id: tweet.id,
        content: tweet.text,
        author: userData.username,
        author_name: userData.name,
        author_verified: userData.verified,
        created_at: tweet.created_at,
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        like_count: tweet.public_metrics?.like_count || 0,
        reply_count: tweet.public_metrics?.reply_count || 0,
        quote_count: tweet.public_metrics?.quote_count || 0,
        url: `https://twitter.com/${userData.username}/status/${tweet.id}`,
        entities: tweet.entities,
        context_annotations: tweet.context_annotations,
      }));

      console.log(
        `Twitter API: Found ${posts.length} tweets from @${username}`
      );
      return posts;
    } catch (error) {
      console.error("Twitter User API Error:", error.message);
      if (error.response) {
        console.error("Twitter API Response:", error.response.data);
      }
      throw new HttpException(
        `Twitter user API error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}



