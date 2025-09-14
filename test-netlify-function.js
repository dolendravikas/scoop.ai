// Test script for Netlify Function
const axios = require('axios');

console.log('🧪 Testing Netlify Function locally...');

async function testNetlifyFunction() {
    try {
        // Test the function locally
        const response = await axios.post('http://localhost:8888/.netlify/functions/scoop', {
            query: 'recent AI trends',
            platforms: ['reddit'],
            aiModel: 'gemini-pro',
            timeRange: 'week',
            keywords: ''
        });
        
        console.log('✅ Netlify Function working!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Netlify Function test failed');
        console.log('Error:', error.message);
        console.log('\n💡 To test locally:');
        console.log('1. Install Netlify CLI: npm install -g netlify-cli');
        console.log('2. Run: netlify dev');
        console.log('3. Test at: http://localhost:8888/.netlify/functions/scoop');
    }
}

testNetlifyFunction();
