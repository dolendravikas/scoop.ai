const http = require('http');

// Test function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test endpoints
async function testEndpoints() {
  console.log('🧪 Testing Scoop AI Backend Endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      path: '/api/health',
      method: 'GET',
    },
    {
      name: 'Detailed Health Check',
      path: '/api/health/detailed',
      method: 'GET',
    },
    {
      name: 'Reddit Health Check',
      path: '/api/reddit/health',
      method: 'GET',
    },
    {
      name: 'Gemini Health Check',
      path: '/api/gemini/health',
      method: 'GET',
    },
    {
      name: 'Scoop Health Check',
      path: '/api/scoop/health',
      method: 'GET',
    },
    {
      name: 'Available Platforms',
      path: '/api/scoop/platforms',
      method: 'GET',
    },
    {
      name: 'Available AI Models',
      path: '/api/scoop/ai-models',
      method: 'GET',
    },
    {
      name: 'Gemini Models',
      path: '/api/gemini/models',
      method: 'GET',
    },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const result = await makeRequest(test.path, test.method);
      console.log(`✅ Status: ${result.status}`);
      console.log(`📄 Response:`, JSON.stringify(result.data, null, 2));
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log('---\n');
    }
  }

  // Test POST endpoints
  console.log('Testing POST endpoints...\n');

  const postTests = [
    {
      name: 'Reddit Search (POST)',
      path: '/api/reddit/search',
      method: 'POST',
      data: {
        query: 'javascript',
        timeRange: 'week',
        limit: 5,
      },
    },
    {
      name: 'Gemini Generate (POST)',
      path: '/api/gemini/generate',
      method: 'POST',
      data: {
        prompt: 'Hello, how are you?',
        model: 'gemini-1.5-flash',
      },
    },
    {
      name: 'Scoop Main Request (POST)',
      path: '/api/scoop',
      method: 'POST',
      data: {
        query: 'artificial intelligence',
        platforms: ['reddit'],
        aiModel: 'gemini-1.5-flash',
        timeRange: 'week',
        limit: 5,
      },
    },
  ];

  for (const test of postTests) {
    try {
      console.log(`Testing: ${test.name}`);
      const result = await makeRequest(test.path, test.method, test.data);
      console.log(`✅ Status: ${result.status}`);
      console.log(`📄 Response:`, JSON.stringify(result.data, null, 2));
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log('---\n');
    }
  }
}

// Run tests
testEndpoints().catch(console.error);
