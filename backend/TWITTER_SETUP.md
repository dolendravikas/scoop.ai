# Twitter API Setup Guide

This guide explains how to set up Twitter API integration for the Scoop AI backend.

## Prerequisites

1. A Twitter Developer Account
2. A Twitter App with API access
3. Bearer Token for authentication

## Getting Twitter API Access

1. **Apply for Twitter Developer Account**
   - Go to [developer.twitter.com](https://developer.twitter.com)
   - Apply for a developer account
   - Wait for approval (can take a few days)

2. **Create a Twitter App**
   - Once approved, create a new app in the Twitter Developer Portal
   - Note down your App ID and App Secret

3. **Generate Bearer Token**
   - In your app settings, go to "Keys and Tokens"
   - Generate a Bearer Token
   - Copy the Bearer Token (you'll need this for the backend)

## Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

## API Endpoints

The Twitter integration provides the following endpoints:

### Search Tweets

- **POST** `/api/twitter/search`
- **GET** `/api/twitter/search?q=query&maxResults=10&sortOrder=relevancy`

### Get User Tweets

- **POST** `/api/twitter/user`
- **GET** `/api/twitter/user?username=username&maxResults=10`

### Health Check

- **GET** `/api/twitter/health`

## Usage Examples

### Search for tweets about "AI"

```bash
curl -X POST http://localhost:3001/api/twitter/search \
  -H "Content-Type: application/json" \
  -d '{"query": "AI", "maxResults": 10, "sortOrder": "relevancy"}'
```

### Get tweets from a specific user

```bash
curl -X GET "http://localhost:3001/api/twitter/user?username=elonmusk&maxResults=5"
```

## Integration with Scoop Service

The Twitter service is automatically integrated with the main Scoop service. When you include "twitter" in the platforms array, it will fetch data from Twitter alongside other platforms.

Example request to Scoop service:

```json
{
  "query": "artificial intelligence",
  "platforms": ["reddit", "twitter"],
  "aiModel": "gemini-1.5-flash",
  "timeRange": "week",
  "limit": 10
}
```

## Rate Limits

Twitter API has rate limits:

- Recent search: 300 requests per 15-minute window
- User tweets: 300 requests per 15-minute window

The service handles rate limit errors gracefully and will return appropriate error messages.

## Data Structure

Twitter posts returned by the API include:

- `platform`: "twitter"
- `id`: Tweet ID
- `content`: Tweet text
- `author`: Username
- `author_name`: Display name
- `author_verified`: Verification status
- `created_at`: Creation timestamp
- `like_count`: Number of likes
- `retweet_count`: Number of retweets
- `reply_count`: Number of replies
- `quote_count`: Number of quote tweets
- `url`: Direct link to the tweet
- `entities`: Hashtags, mentions, URLs
- `context_annotations`: Topic annotations

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if your Bearer Token is correct
   - Ensure your Twitter app has the necessary permissions

2. **403 Forbidden**
   - Your app might not have access to the Twitter API v2
   - Check your app's permissions in the Twitter Developer Portal

3. **429 Too Many Requests**
   - You've hit the rate limit
   - Wait for the rate limit window to reset

4. **No results returned**
   - Check if your search query is valid
   - Try different search terms
   - Ensure your app has access to recent tweets

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=true
```

This will log detailed information about API requests and responses.

## Security Notes

- Never commit your Bearer Token to version control
- Use environment variables for all sensitive credentials
- Regularly rotate your API keys
- Monitor your API usage in the Twitter Developer Portal



