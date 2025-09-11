# Scoop App Deployment Guide

## Current Issue
Your Netlify deployment is showing the old version because it's not connected to your Git repository or not pulling the latest changes.

## Solutions

### Option 1: Connect to GitHub (Recommended)

1. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it "scoop"
   - Make it public
   - Don't initialize with README (we already have files)

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/scoop.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect Netlify to GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and authorize
   - Select your `scoop` repository
   - Netlify will auto-deploy

### Option 2: Manual Deploy

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir .
   ```

### Option 3: Drag & Drop Deploy

1. **Zip your files**:
   - Select all files in your scoop folder
   - Create a zip file

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your zip file to the deploy area

## Current Files Status

✅ **Working locally**: All features work on localhost:8000
❌ **Not working on Netlify**: Old version deployed

## Files to Deploy

Make sure these files are included in your deployment:
- `index.html` (updated with script-simple.js)
- `script-simple.js` (working JavaScript)
- `styles.css` (all styles)
- `netlify.toml` (deployment config)
- `favicon.ico`

## Quick Fix

If you want to quickly update your current Netlify site:

1. Go to your Netlify dashboard
2. Find your site
3. Go to "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"
5. Or drag and drop the updated files

## Verification

After deployment, check:
- [ ] Search box works
- [ ] Filter icons open panels
- [ ] Sidebar buttons open modals
- [ ] Voice button responds
- [ ] Space key works in text input

## Support

If you need help with any of these steps, let me know which option you'd prefer to use!
