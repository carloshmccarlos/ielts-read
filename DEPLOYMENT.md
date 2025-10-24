# Deployment Guide

## Pre-Deployment Checklist

### 1. Update Dependencies
Before deploying, ensure all Prisma packages are on the same version:

```bash
npm install @prisma/adapter-neon@6.8.2 @prisma/client@6.8.2 prisma@6.8.2 --save-exact
```

### 2. Regenerate Prisma Client
```bash
npx prisma generate
```

### 3. Environment Variables
Ensure these are set in Vercel:

**Required:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random secret key for authentication
- `BETTER_AUTH_URL` - Your production URL (e.g., https://ielts-read.vercel.app)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RESEND_API_KEY` - Resend API key for emails
- `GEMINI_API_KEY` - Google Gemini API key

**Optional:**
- `NEXT_PUBLIC_BASE_URL` - Your production URL
- `GOOGLE_SITE_VERIFICATION` - Google Search Console verification
- `CLOUDFLARE_R2_ACCESS_KEY_ID` - For image storage (if using R2)
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` - For image storage (if using R2)

### 4. Build Configuration

**Vercel Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x or higher

### 5. Database Setup

Before first deployment:
```bash
# Push schema to database
npx prisma db push

# Seed data (optional)
npm run prisma:seed
npm run prisma:seed:words
```

## Troubleshooting

### Prisma Adapter Type Errors

If you see errors like "Type 'PrismaNeon' is not assignable to type 'SqlDriverAdapterFactory'":

**Solution 1: Ensure version alignment**
```bash
npm install @prisma/adapter-neon@6.8.2 @prisma/client@6.8.2 prisma@6.8.2 --save-exact
npx prisma generate
```

**Solution 2: Clear cache and reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### OAuth Timeout Issues

If Google OAuth times out:
1. Verify `BETTER_AUTH_URL` matches your production domain
2. Check Google OAuth redirect URIs include: `https://your-domain.com/api/auth/callback/google`
3. Ensure firewall/network allows connections to `oauth2.googleapis.com`

### Build Failures

If build fails on Vercel:
1. Check build logs for specific errors
2. Verify all environment variables are set
3. Ensure `DATABASE_URL` is accessible from Vercel
4. Try deploying from a clean branch

## Performance Optimization

### After Deployment

1. **Monitor Core Web Vitals**
   - Check Vercel Analytics dashboard
   - Monitor LCP, FID, CLS metrics

2. **Test Performance**
   ```bash
   npm run perf:audit
   ```

3. **Analyze Bundle Size**
   ```bash
   npm run build:analyze
   ```

4. **Check SEO**
   - Submit sitemap to Google Search Console: `https://your-domain.com/sitemap.xml`
   - Verify robots.txt: `https://your-domain.com/robots.txt`
   - Test structured data: Google Rich Results Test

## Post-Deployment

### 1. Verify Functionality
- [ ] Homepage loads correctly
- [ ] Articles display properly
- [ ] Authentication works (Google OAuth, Email)
- [ ] User profile and collections work
- [ ] Admin panel accessible (if admin user)

### 2. Monitor Performance
- [ ] Check Vercel Analytics
- [ ] Monitor database query performance
- [ ] Review error logs

### 3. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Verify site ownership
- [ ] Monitor search performance

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Deployment Commands
```bash
# Deploy to production
git push origin main

# Create preview deployment
git push origin feature-branch
```

## Rollback

If deployment fails:
1. Go to Vercel dashboard
2. Select previous successful deployment
3. Click "Promote to Production"

## Support

For issues:
1. Check Vercel build logs
2. Review error messages
3. Verify environment variables
4. Check database connectivity
