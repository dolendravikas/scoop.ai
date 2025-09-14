const axios = require('axios');
require('dotenv').config();

console.log('🧪 Testing Scoop AI APIs...\n');

// Check which keys are available
const keys = {
    'Reddit': !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET),
    'OpenAI': !!process.env.OPENAI_API_KEY,
    'Google Gemini': !!process.env.GOOGLE_API_KEY
};

console.log('📋 Available API Keys:');
Object.entries(keys).forEach(([name, available]) => {
    console.log(`   ${available ? '✅' : '❌'} ${name}`);
});

// Test Reddit API
async function testReddit() {
    try {
        console.log('\n🧪 Testing Reddit API...');
        
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
        console.log('✅ Reddit Auth: Success');
        
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

// Test OpenAI API
async function testOpenAI() {
    try {
        console.log('\n🧪 Testing OpenAI API...');
        
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Write a haiku about AI' }],
            max_tokens: 50
        });
        
        console.log('✅ OpenAI API: Working');
        console.log('   Response:', response.choices[0].message.content);
    } catch (error) {
        console.log('❌ OpenAI API: Failed');
        console.log('   Error:', error.message);
    }
}

// Run tests
async function runTests() {
    if (keys['Reddit']) {
        await testReddit();
    }
    
    if (keys['OpenAI']) {
        await testOpenAI();
    }
    
    console.log('\n🎉 API testing complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Fix any failed APIs by checking your keys');
    console.log('   2. Start the backend: npm start');
    console.log('   3. Start the frontend: python3 -m http.server 8080');
    console.log('   4. Test the full app at http://localhost:8080');
}

runTests().catch(console.error);
