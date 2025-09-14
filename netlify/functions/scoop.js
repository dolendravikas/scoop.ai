const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI models
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Reddit API functions
async function getRedditData(query, timeRange) {
    try {
        // Get Reddit access token
        const authString = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
        const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'ScoopAI/1.0 by scoopai'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Search Reddit
        const searchResponse = await axios.get(`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=relevance&limit=10&t=${timeRange || 'week'}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'ScoopAI/1.0 by scoopai'
            }
        });

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
        return [];
    }
}

// Quora web scraping
async function getQuoraData(query) {
    try {
        // For now, return mock data since web scraping is complex in serverless
        return [{
            platform: 'quora',
            content: `Quora search results for: ${query}`,
            author: 'Quora',
            created_at: new Date().toISOString(),
            url: `https://www.quora.com/search?q=${encodeURIComponent(query)}`
        }];
    } catch (error) {
        console.error('Quora Error:', error.message);
        return [];
    }
}

// LinkedIn web scraping
async function getLinkedInData(query) {
    try {
        // For now, return mock data since web scraping is complex in serverless
        return [{
            platform: 'linkedin',
            content: `LinkedIn search results for: ${query}`,
            author: 'LinkedIn',
            created_at: new Date().toISOString(),
            url: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`
        }];
    } catch (error) {
        console.error('LinkedIn Error:', error.message);
        return [];
    }
}

// AI Processing
async function processWithGemini(data, query) {
    try {
        // Debug: Check if API key is available
        const apiKey = process.env.GOOGLE_API_KEY;
        console.log('Google API Key available:', apiKey ? 'Yes' : 'No');
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        
        if (!apiKey) {
            return 'Error: Google API key not found in environment variables';
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return response.text();
    } catch (error) {
        console.error('Gemini Error:', error.message);
        return 'Error processing with Gemini: ' + error.message;
    }
}

// Main Netlify function
exports.handler = async (event, context) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { query, platforms, aiModel, timeRange, keywords } = JSON.parse(event.body);

        console.log('Processing request:', { query, platforms, aiModel, timeRange, keywords });
        
        // Debug: Check environment variables
        console.log('Environment variables available:');
        console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Set' : 'Not set');
        console.log('REDDIT_CLIENT_ID:', process.env.REDDIT_CLIENT_ID ? 'Set' : 'Not set');
        console.log('REDDIT_CLIENT_SECRET:', process.env.REDDIT_CLIENT_SECRET ? 'Set' : 'Not set');

        // Collect data from selected platforms
        let allData = [];

        if (platforms.includes('reddit')) {
            const redditData = await getRedditData(query, timeRange);
            allData = allData.concat(redditData);
        }

        if (platforms.includes('quora')) {
            const quoraData = await getQuoraData(query);
            allData = allData.concat(quoraData);
        }

        if (platforms.includes('linkedin')) {
            const linkedinData = await getLinkedInData(query);
            allData = allData.concat(linkedinData);
        }

        // Process with AI
        let analysis = '';
        if (aiModel === 'gemini-pro') {
            analysis = await processWithGemini(allData, query);
        } else {
            analysis = 'AI model not supported in this deployment';
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                query: query,
                platforms: platforms,
                aiModel: aiModel,
                timeRange: timeRange,
                keywords: keywords,
                dataCount: allData.length,
                rawData: allData,
                analysis: analysis
            })
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
