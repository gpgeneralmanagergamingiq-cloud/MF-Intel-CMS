# Public Folder

This folder contains static assets that will be copied directly to the `dist/` folder during the build process.

## Files in this folder:

### `.htaccess`
- **Purpose:** Configuration file for Apache web servers (used by cPanel hosting)
- **What it does:**
  - Enables React Router to work properly (prevents 404 errors on page refresh)
  - Enables GZIP compression for faster loading
  - Sets browser caching rules for better performance
  - Adds security headers
- **Automatically included:** When you run `npm run build`, this file will be copied to `dist/.htaccess`

## Important Notes:

- Everything in this `public/` folder gets copied to `dist/` during build
- Do NOT put source code here
- Only put files that need to be served as-is (like .htaccess, robots.txt, favicon.ico, etc.)
- The `.htaccess` file is already configured for deployment to `/Casino/` path
- If you deploy to a different path, edit the `.htaccess` file and change `RewriteBase /Casino/` to your path

## For cPanel Deployment:

1. Run `npm run build`
2. The `.htaccess` file will automatically be in your `dist/` folder
3. Upload all files from `dist/` to your cPanel hosting
4. No manual .htaccess creation needed! ✅
