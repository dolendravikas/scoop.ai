# 🔑 Complete API Setup Guide for Scoop AI

## 🎯 **Quick Start (FREE Options)**

### **Step 1: Google Gemini (FREE)**
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (looks like: `AIzaSy...`)
5. Add to `backend/.env`:
   ```
   GOOGLE_API_KEY=AIzaSy_your_key_here
   ```

### **Step 2: Reddit API (FREE)**
1. Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Scroll down and click "Create App" or "Create Another App"
3. Fill in:
   - **Name**: Scoop AI
   - **App type**: script
   - **Description**: Social media data aggregation
4. Click "Create app"
5. Note down:
   - **Client ID** (under the app name)
   - **Client Secret** (the "secret" field)
6. Add to `backend/.env`:
   ```
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   ```

### **Step 3: Twitter API (FREE Tier)**
1. Go to [https://developer.twitter.com/](https://developer.twitter.com/)
2. Sign up for a developer account
3. Create a new project/app
4. Go to "Keys and Tokens" tab
5. Generate "Bearer Token"
6. Copy the token (starts with `AAAAAAAAAAAAAAAAAAAAA`)
7. Add to `backend/.env`:
   ```
   TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAA_your_token_here
   ```

### **Step 4: OpenAI (Optional - $5 credit)**
1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up with your email
3. Add a payment method (they give you $5 free credit)
4. Go to "API Keys" section
5. Click "Create new secret key"
6. Copy the key (starts with `sk-`)
7. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```

## 🔧 **Complete .env File**

After getting your keys, your `backend/.env` should look like:

```bash
# AI API Keys
OPENAI_API_KEY=sk-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
GOOGLE_API_KEY=AIzaSy_your_google_key_here

# Social Media API Keys
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAA_your_twitter_token_here
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_client_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 💰 **Cost Breakdown**

### **FREE Setup (Recommended for Testing)**
- **Google Gemini**: 1,500 requests/day FREE
- **Reddit**: 60 requests/min FREE
- **Twitter**: 300 requests/15min FREE
- **Quora**: Web scraping FREE
- **Total Cost**: $0

### **Paid Setup (For Production)**
- **OpenAI GPT-4**: ~$0.03 per 1,000 tokens
- **Anthropic Claude**: ~$0.015 per 1,000 tokens
- **Twitter Pro**: $100/month
- **LinkedIn**: $99/month
- **Total Cost**: ~$200-300/month

## 🚀 **Testing Your Setup**

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend**:
   ```bash
   python3 -m http.server 8080
   ```

3. **Test in browser**: `http://localhost:8080`

4. **Try a search**:
   - Query: "recent AI trends"
   - Select: Reddit, Twitter
   - AI Model: Gemini Pro
   - Click search!

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"API key invalid"**
   - Check the key format
   - Make sure there are no extra spaces
   - Verify the key is active

2. **"Rate limit exceeded"**
   - Wait a few minutes
   - Reduce the number of platforms selected

3. **"CORS error"**
   - Make sure backend is running on port 3001
   - Check browser console for errors

### **Debug Mode:**
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check API keys
cat backend/.env
```

## 📊 **API Limits Summary**

| Service | Free Limit | Paid Limit |
|---------|------------|------------|
| **Google Gemini** | 1,500 requests/day | 1M requests/day |
| **Reddit** | 60 requests/min | 60 requests/min |
| **Twitter** | 300 requests/15min | 10,000 requests/15min |
| **OpenAI** | $5 credit | Pay per token |
| **Anthropic** | $5 credit | Pay per token |

## 🎉 **Success!**

Once you have at least Google Gemini and Reddit set up, you'll have:
- ✅ Real AI analysis
- ✅ Real social media data
- ✅ Professional results
- ✅ $0 cost for testing

**Need help?** Check the console logs for detailed error messages!
