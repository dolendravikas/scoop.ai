#!/usr/bin/env node

// Test script to verify API keys are working
const axios = require('axios');
require('dotenv').config();

console.log('🧪 Testing Scoop AI APIs...\n');

// Test Google Gemini
async function testGemini() {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent("Hello, this is a test message.");
        const response = await result.response;
        
        console.log('✅ Google Gemini: Working');
        console.log('   Response:', response.text().substring(0, 50) + '...');
    } catch (error) {
        console.log('❌ Google Gemini: Failed');
        console.log('   Error:', error.message);
    }
}

// Test Reddit API
async function testReddit() {
    try {
        // Get access token
        const authResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const token = authResponse.data.access_token;
        
        // Test API call
        const response = await axios.get('https://oauth.reddit.com/r/programming/hot?limit=1', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'ScoopAI/1.0'
            }
        });
        
        console.log('✅ Reddit API: Working');
        console.log('   Found', response.data.data.children.length, 'posts');
    } catch (error) {
        console.log('❌ Reddit API: Failed');
        console.log('   Error:', error.message);
    }
}

// Test Twitter API
async function testTwitter() {
    try {
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent?query=AI&max_results=1', {
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Twitter API: Working');
        console.log('   Found', response.data.data?.length || 0, 'tweets');
    } catch (error) {
        console.log('❌ Twitter API: Failed');
        console.log('   Error:', error.message);
    }
}

// Test OpenAI API
async function testOpenAI() {
    try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello, this is a test." }],
            max_tokens: 10
        });
        
        console.log('✅ OpenAI API: Working');
        console.log('   Response:', response.choices[0].message.content);
    } catch (error) {
        console.log('❌ OpenAI API: Failed');
        console.log('   Error:', error.message);
    }
}

// Test Anthropic API
async function testAnthropic() {
    try {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 10,
            messages: [{ role: "user", content: "Hello, this is a test." }]
        });
        
        console.log('✅ Anthropic API: Working');
        console.log('   Response:', response.content[0].text);
    } catch (error) {
        console.log('❌ Anthropic API: Failed');
        console.log('   Error:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🔍 Checking API keys...\n');
    
    // Check which keys are available
    const keys = {
        'Google Gemini': !!process.env.GOOGLE_API_KEY,
        'Reddit': !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET),
        'Twitter': !!process.env.TWITTER_BEARER_TOKEN,
        'OpenAI': !!process.env.OPENAI_API_KEY,
        'Anthropic': !!process.env.ANTHROPIC_API_KEY
    };
    
    console.log('📋 Available API Keys:');
    Object.entries(keys).forEach(([name, available]) => {
        console.log(`   ${available ? '✅' : '❌'} ${name}`);
    });
    
    console.log('\n🧪 Testing APIs...\n');
    
    // Test available APIs
    if (keys['Google Gemini']) await testGemini();
    if (keys['Reddit']) await testReddit();
    if (keys['Twitter']) await testTwitter();
    if (keys['OpenAI']) await testOpenAI();
    if (keys['Anthropic']) await testAnthropic();
    
    console.log('\n🎉 API testing complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Fix any failed APIs by checking your keys');
    console.log('   2. Start the backend: cd backend && npm start');
    console.log('   3. Start the frontend: python3 -m http.server 8080');
    console.log('   4. Test the full app at http://localhost:8080');
}

runTests().catch(console.error);
