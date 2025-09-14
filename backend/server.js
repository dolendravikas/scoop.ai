require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Keys (in production, use environment variables)
const API_KEYS = {
    openai: process.env.OPENAI_API_KEY || 'your-openai-key',
    anthropic: process.env.ANTHROPIC_API_KEY || 'your-anthropic-key',
    google: process.env.GOOGLE_API_KEY || 'your-google-key',
    twitter: process.env.TWITTER_BEARER_TOKEN || 'your-twitter-token',
    reddit: {
        clientId: process.env.REDDIT_CLIENT_ID || 'your-reddit-client-id',
        clientSecret: process.env.REDDIT_CLIENT_SECRET || 'your-reddit-secret'
    }
};

// Initialize AI clients
const openai = new OpenAI({ apiKey: API_KEYS.openai });
const anthropic = new Anthropic({ apiKey: API_KEYS.anthropic });
const genAI = new GoogleGenerativeAI(API_KEYS.google);

// Social Media Data Scraping Functions
async function scrapeTwitter(query, timeRange) {
    try {
        // Using Twitter API v2
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
            headers: {
                'Authorization': `Bearer ${API_KEYS.twitter}`,
                'Content-Type': 'application/json'
            },
            params: {
                query: query,
                max_results: 50,
                'tweet.fields': 'created_at,public_metrics,author_id',
                'user.fields': 'username,name,verified'
            }
        });
        
        return response.data.data?.map(tweet => ({
            platform: 'twitter',
            content: tweet.text,
            author: tweet.author_id,
            created_at: tweet.created_at,
            metrics: tweet.public_metrics,
            url: `https://twitter.com/i/web/status/${tweet.id}`
        })) || [];
    } catch (error) {
        console.error('Twitter API Error:', error.message);
        return [];
    }
}

async function scrapeReddit(query, timeRange) {
    try {
        // Get Reddit access token
        const authResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${API_KEYS.reddit.clientId}:${API_KEYS.reddit.clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const token = authResponse.data.access_token;
        
        // Search Reddit
        const response = await axios.get(`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=relevance&t=${timeRange}&limit=50`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'ScoopAI/1.0'
            }
        });
        
        return response.data.data.children.map(post => ({
            platform: 'reddit',
            content: post.data.title + ' ' + post.data.selftext,
            author: post.data.author,
            subreddit: post.data.subreddit,
            created_at: new Date(post.data.created_utc * 1000).toISOString(),
            score: post.data.score,
            url: `https://reddit.com${post.data.permalink}`
        }));
    } catch (error) {
        console.error('Reddit API Error:', error.message);
        return [];
    }
}

async function scrapeLinkedIn(query, timeRange) {
    try {
        // LinkedIn API requires special approval, using web scraping as fallback
        // This is a simplified version - in production, use official LinkedIn API
        const response = await axios.get(`https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScoopAI/1.0)'
            }
        });
        
        // Parse LinkedIn content (simplified)
        return [{
            platform: 'linkedin',
            content: `LinkedIn search results for: ${query}`,
            author: 'LinkedIn',
            created_at: new Date().toISOString(),
            url: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`
        }];
    } catch (error) {
        console.error('LinkedIn API Error:', error.message);
        return [];
    }
}

async function scrapeQuora(query, timeRange) {
    try {
        // Quora doesn't have a public API, using web scraping
        const response = await axios.get(`https://www.quora.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScoopAI/1.0)'
            }
        });
        
        return [{
            platform: 'quora',
            content: `Quora search results for: ${query}`,
            author: 'Quora',
            created_at: new Date().toISOString(),
            url: `https://www.quora.com/search?q=${encodeURIComponent(query)}`
        }];
    } catch (error) {
        console.error('Quora API Error:', error.message);
        return [];
    }
}

// AI Model Processing Functions
async function processWithGPT4(data, query) {
    try {
        const prompt = `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
        
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.7
        });
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error('GPT-4 Error:', error.message);
        return 'Error processing with GPT-4';
    }
}

async function processWithClaude(data, query) {
    try {
        const prompt = `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
        
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        });
        
        return response.content[0].text;
    } catch (error) {
        console.error('Claude Error:', error.message);
        return 'Error processing with Claude';
    }
}

async function processWithGemini(data, query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return response.text();
    } catch (error) {
        console.error('Gemini Error:', error.message);
        // Try with different model names
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent(prompt);
            const response2 = await result2.response;
            return response2.text();
        } catch (error2) {
            console.error('Gemini Error 2:', error2.message);
            return 'Error processing with Gemini: ' + error.message;
        }
    }
}

// Main API endpoint
app.post('/api/scoop', async (req, res) => {
    try {
        const { query, platforms, aiModel, timeRange, keywords } = req.body;
        
        console.log('Processing request:', { query, platforms, aiModel, timeRange, keywords });
        
        // Collect data from selected platforms
        let allData = [];
        
        if (platforms.includes('twitter')) {
            const twitterData = await scrapeTwitter(query, timeRange);
            allData = allData.concat(twitterData);
        }
        
        if (platforms.includes('reddit')) {
            const redditData = await scrapeReddit(query, timeRange);
            allData = allData.concat(redditData);
        }
        
        if (platforms.includes('linkedin')) {
            const linkedinData = await scrapeLinkedIn(query, timeRange);
            allData = allData.concat(linkedinData);
        }
        
        if (platforms.includes('quora')) {
            const quoraData = await scrapeQuora(query, timeRange);
            allData = allData.concat(quoraData);
        }
        
        // Filter by keywords if provided
        if (keywords && keywords.length > 0) {
            allData = allData.filter(item => 
                keywords.some(keyword => 
                    item.content.toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
        
        // Process with selected AI model
        let analysis = '';
        switch (aiModel) {
            case 'gpt-4':
                analysis = await processWithGPT4(allData, query);
                break;
            case 'gpt-3.5-turbo':
                analysis = await processWithGPT4(allData, query); // Using GPT-4 for now
                break;
            case 'claude-3':
                analysis = await processWithClaude(allData, query);
                break;
            case 'gemini-pro':
                analysis = await processWithGemini(allData, query);
                break;
            default:
                analysis = 'Invalid AI model selected';
        }
        
        res.json({
            success: true,
            query,
            platforms,
            aiModel,
            timeRange,
            keywords,
            dataCount: allData.length,
            rawData: allData,
            analysis
        });
        
    } catch (error) {
        console.error('Scoop API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Scoop API server running on port ${PORT}`);
});
