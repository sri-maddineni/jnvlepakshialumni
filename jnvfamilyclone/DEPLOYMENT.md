# Netlify Deployment Guide

This guide explains how to deploy your JNV Alumni Next.js application to Netlify.

## Prerequisites

1. A Netlify account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Configuration Files

The following files have been created for Netlify deployment:

### 1. `netlify.toml`
- Build configuration
- Node.js version specification
- Netlify Next.js plugin configuration
- Security headers
- Cache headers for static assets

### 2. `next.config.ts`
- Optimized for Netlify deployment
- Image optimization settings

## Environment Variables

Make sure to set up the following environment variables in your Netlify dashboard:

### Required Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your Git provider and repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (or your preferred version)

3. **Set Environment Variables:**
   - Go to Site settings > Environment variables
   - Add all the required environment variables listed above

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy:**
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod --dir=.next
   ```

## Post-Deployment

1. **Custom Domain (Optional):**
   - Go to Site settings > Domain management
   - Add your custom domain

2. **SSL Certificate:**
   - Netlify automatically provides SSL certificates
   - No additional configuration needed

3. **Monitoring:**
   - Check the "Functions" tab for any serverless function logs
   - Monitor build logs for any issues

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that all environment variables are set
   - Verify Node.js version compatibility
   - Check build logs for specific error messages

2. **Routing Issues:**
   - Ensure `_redirects` file is in the `public` directory
   - Verify `netlify.toml` redirects are correct

3. **Environment Variables Not Working:**
   - Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables

### Build Optimization:

- The Netlify Next.js plugin handles routing and server-side rendering
- Static assets are cached for better performance
- Security headers are automatically applied

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify all configuration files are present
3. Ensure environment variables are correctly set
4. Test locally with `npm run build` before deploying 