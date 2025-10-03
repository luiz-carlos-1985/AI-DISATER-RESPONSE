# Deployment Guide

## Overview

This guide covers deployment options for the EmergencyAI Disaster Response Coordination System, including local development, production builds, and cloud deployment strategies.

## Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher (or yarn 1.22+)
- Git for version control

## Local Development

### Setup
```bash
# Clone repository
git clone <repository-url>
cd ai-disaster-response

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Server
- **URL**: http://localhost:4004
- **Hot Reload**: Enabled
- **Environment**: Development mode with debugging

### Environment Variables
Create `.env.local` for local development:
```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:4004
NEXT_PUBLIC_VERSION=1.0.0
```

## Production Build

### Build Process
```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Build Optimization
- **Bundle Analysis**: Use `npm run analyze` to inspect bundle size
- **Static Generation**: Pages are statically generated where possible
- **Code Splitting**: Automatic code splitting for optimal loading
- **Asset Optimization**: Images and assets are optimized

### Build Output
```
.next/
├── static/           # Static assets
├── server/           # Server-side code
└── cache/            # Build cache
```

## Cloud Deployment Options

### 1. Vercel (Recommended)

**Automatic Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration (vercel.json):**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 2. Netlify

**Build Settings:**
- **Build Command**: `npm run build && npm run export`
- **Publish Directory**: `out`
- **Node Version**: 18

**netlify.toml:**
```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS Amplify

**Build Specification (amplify.yml):**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 4004
ENV PORT 4004

CMD ["node", "server.js"]
```

**Docker Compose (docker-compose.yml):**
```yaml
version: '3.8'
services:
  emergency-ai:
    build: .
    ports:
      - "4004:4004"
    environment:
      - NODE_ENV=production
      - PORT=4004
    restart: unless-stopped
```

### 5. Traditional VPS/Server

**Using PM2:**
```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "emergency-ai" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Configuration

### Production Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_VERSION=1.0.0
PORT=4004
```

### Security Headers
Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Caching Strategy
- **Static Assets**: Long-term caching (1 year)
- **API Routes**: Short-term caching (5 minutes)
- **Pages**: ISR (Incremental Static Regeneration)

### CDN Configuration
- Enable CDN for static assets
- Configure proper cache headers
- Use image optimization services

## Monitoring & Logging

### Application Monitoring
```javascript
// Add to _app.tsx
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Error tracking
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      // Send to monitoring service
    })

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0]
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart)
      })
    }
  }, [])

  return <Component {...pageProps} />
}
```

### Health Check Endpoint
Create `pages/api/health.js`:
```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0'
  })
}
```

## SSL/HTTPS Configuration

### Let's Encrypt (Certbot)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL
1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"

## Backup & Recovery

### Data Backup
Since the application uses localStorage:
- Implement export/import functionality
- Regular data exports for users
- Consider server-side backup for critical data

### Application Backup
```bash
# Backup application files
tar -czf emergency-ai-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  .
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Port Conflicts**
   ```bash
   # Find process using port
   lsof -i :4004
   # Kill process
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### Performance Issues
- Check bundle size with analyzer
- Optimize images and assets
- Enable compression (gzip/brotli)
- Use CDN for static assets

### Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] Environment variables secured
- [ ] Access logs monitored
- [ ] Regular security audits

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple instances
- Session management (if needed)

### Vertical Scaling
- Increase server resources
- Optimize application performance
- Database optimization (if applicable)

### CDN Integration
- Static asset delivery
- Global edge locations
- Reduced server load