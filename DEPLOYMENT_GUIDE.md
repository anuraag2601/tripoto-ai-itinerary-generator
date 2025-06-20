# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying your Tripoto AI Itinerary Generator to GitHub and various hosting platforms.

## 📋 Pre-Deployment Checklist

✅ **Code is Ready**
- Project is properly configured
- API keys are in `.env.example` (not `.env`)
- `.gitignore` is configured
- Documentation is complete
- All sensitive data removed

✅ **Testing Done**
- App runs locally with `npm run dev`
- Build works with `npm run build`
- Mock data functions properly
- All features work as expected

## 🐙 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"** or **"+"** → **"New repository"**
3. Repository settings:
   - **Name**: `tripoto-ai-itinerary-generator`
   - **Description**: `AI-powered travel itinerary generator with React, TypeScript, and Anthropic Claude integration`
   - **Visibility**: Public (recommended for portfolio/demo)
   - **Initialize**: Leave unchecked (we already have files)

### Step 2: Connect and Push

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/tripoto-ai-itinerary-generator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Configure Repository

1. **Add Topics** (in GitHub repository settings):
   - `react`
   - `typescript`
   - `ai`
   - `travel`
   - `itinerary`
   - `anthropic`
   - `tailwindcss`
   - `vite`

2. **Set Repository Description**:
   ```
   🧳 AI-powered travel itinerary generator with React + TypeScript. Features intelligent mock data, PDF export, responsive design, and ready for API integration.
   ```

3. **Configure GitHub Pages** (Optional):
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / docs (after building)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables** (in Vercel dashboard):
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`

4. **Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Update DNS settings

### Option 2: Netlify

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
   - OR connect GitHub repository in Netlify dashboard

3. **Configure Build Settings**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables**:
   - Add in Netlify dashboard under Site settings → Environment variables

### Option 3: GitHub Pages (Static Only)

1. **Install gh-pages**:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Add deploy script** to `frontend/package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Repository Settings → Pages
   - Source: Deploy from branch `gh-pages`

### Option 4: Docker Deployment

1. **Build Docker image**:
   ```bash
   docker build -t tripoto-ai .
   ```

2. **Run locally**:
   ```bash
   docker run -p 3000:80 tripoto-ai
   ```

3. **Deploy to cloud**:
   - **AWS ECS**: Push to ECR and deploy
   - **Google Cloud Run**: `gcloud run deploy`
   - **Azure Container Instances**: Use Azure CLI
   - **DigitalOcean App Platform**: Connect GitHub repo

### Option 5: Traditional Hosting

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload `dist` folder** to your hosting provider:
   - cPanel file manager
   - FTP/SFTP
   - SSH and rsync

3. **Configure web server**:
   - Ensure SPA routing works (all routes → index.html)
   - Enable gzip compression
   - Set proper cache headers

## 🔧 Environment Configuration

### Production Environment Variables

Create these in your hosting platform:

```env
# Required for AI features (optional - works with mock data)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional enhancements
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_ANALYTICS_ID=your_analytics_id_here

# Production settings
VITE_ENVIRONMENT=production
VITE_DEBUG=false
VITE_LOG_LEVEL=error

# Feature toggles
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MAP_INTEGRATION=true
VITE_ENABLE_PDF_DOWNLOAD=true
VITE_ENABLE_SHARING=true
```

### Security Considerations

- ✅ **Never commit API keys** to repository
- ✅ **Use environment variables** for sensitive data
- ✅ **Enable HTTPS** on production
- ✅ **Set proper CORS** headers if using APIs
- ✅ **Use CSP headers** for XSS protection

## 📊 Monitoring & Analytics

### Basic Monitoring

1. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com/) (free)
   - [Pingdom](https://www.pingdom.com/)

2. **Performance Monitoring**:
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

3. **Error Tracking**:
   - [Sentry](https://sentry.io/) (free tier)
   - LogRocket for session replay

### Analytics Setup

1. **Google Analytics 4**:
   ```typescript
   // Add to index.html or implement in React
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

2. **Privacy-friendly alternatives**:
   - Plausible Analytics
   - Simple Analytics
   - Fathom Analytics

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install and Build
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: frontend
```

## 🎯 Post-Deployment

### 1. Test Everything

- [ ] **Functionality**: All features work correctly
- [ ] **Performance**: Page loads quickly
- [ ] **Mobile**: Responsive design works
- [ ] **SEO**: Meta tags and Open Graph work
- [ ] **PWA**: Service worker functions (if enabled)

### 2. Configure Custom Domain (Optional)

1. **Purchase domain** from registrar
2. **Update DNS settings**:
   - Add CNAME record pointing to hosting platform
   - Configure SSL certificate

### 3. Set Up Monitoring

1. **Add to Google Search Console**
2. **Submit sitemap** (if applicable)
3. **Configure error tracking**
4. **Set up uptime monitoring**

### 4. Share Your Work

1. **Update README** with live demo link
2. **Add to portfolio** website
3. **Share on social media**
4. **Write a blog post** about the project

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Restart development server after changes
   - Check hosting platform environment variable settings

3. **Routing Issues**:
   - Configure web server for SPA routing
   - Check `vite.config.ts` base URL setting
   - Ensure all routes redirect to index.html

4. **API Issues**:
   - CORS problems: Use backend proxy or serverless functions
   - API key issues: Verify environment variables
   - Mock data: Ensure it's working as fallback

### Getting Help

- 📖 **Documentation**: Check README.md
- 🐛 **Issues**: Create GitHub issue
- 💬 **Discussions**: Use GitHub Discussions
- 📧 **Contact**: Reach out to maintainers

---

**🎉 Congratulations!** Your Tripoto AI Itinerary Generator is now live and ready to help people plan amazing trips!

*Remember to keep your API keys secure and monitor your usage to avoid unexpected charges.* 