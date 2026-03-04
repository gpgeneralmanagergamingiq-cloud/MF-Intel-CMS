# Deployment Update Guide - Property Management Feature

## Issue: Published App Not Showing Updates

When you make code changes, the published/deployed application needs to be rebuilt and redeployed to reflect those changes.

## Quick Fix Steps

### Option 1: Force Browser Refresh (Try This First)
1. Open your published app at `GamingIq.net/Casino`
2. **Hard Refresh** to clear cache:
   - **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac**: Press `Cmd + Shift + R`
3. Or **Clear Browser Cache**:
   - Press `F12` to open DevTools
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

### Option 2: Rebuild and Redeploy
If the hard refresh doesn't work, you need to rebuild:

1. **Build the application:**
   ```bash
   npm run build
   ```
   
2. **Deploy the new build to your server:**
   - Upload the contents of the `dist/` folder to your hosting
   - Replace the existing files in the `/Casino/` directory

### Option 3: Check for Errors

1. **Open Browser Console** (Press F12)
2. **Look for errors** in the Console tab
3. **Check Network tab** to see if API calls are failing
4. **Look for these specific calls:**
   - `GET /make-server-68939c29/properties` - Should return property list
   - `POST /make-server-68939c29/initialize/Property 1` - Should initialize users

## What Changed

### Backend (Supabase Server)
✅ Added 4 new property management endpoints
- The Supabase Edge Function should auto-deploy
- No manual action needed for backend

### Frontend (React App)
✅ Updated Login component to load properties dynamically
✅ Added PropertyManagement component
✅ Updated Setup tab to include property management
- **This requires rebuilding and redeploying the frontend**

## Testing the Update

### 1. Test Locally First
```bash
npm run dev
```
- Open http://localhost:5173
- Login should work WITHOUT property selector (only 1 property by default)
- Go to Setup tab → Scroll down to see "Property Management"
- Add a second property
- Log out and log back in
- Property selector should NOW appear on login screen

### 2. Check API Endpoints
Open browser console and test:
```javascript
// Test if properties endpoint works
fetch('https://wyfqvbzdawpimomfvlmh.supabase.co/functions/v1/make-server-68939c29/properties', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
})
.then(r => r.json())
.then(console.log)
```

### 3. Verify Server Logs
- Go to Supabase Dashboard
- Navigate to Edge Functions → Logs
- Check for any errors when calling `/properties` endpoint

## Common Issues

### Issue: "Failed to load properties"
**Cause**: Backend not deployed or API endpoint error
**Fix**: 
- Check Supabase Edge Function is running
- Verify the endpoint URL is correct
- Check server logs for errors

### Issue: Login shows old property dropdown
**Cause**: Browser cache showing old code
**Fix**: 
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache completely
- Try incognito/private browsing mode

### Issue: Property Management section not visible
**Cause**: Frontend not rebuilt/deployed
**Fix**:
- Run `npm run build`
- Upload new `dist/` folder to server
- Ensure PropertyManagement.tsx is included in build

## Verification Checklist

✅ Server endpoints responding (check with Postman/curl)
✅ Frontend rebuilt with `npm run build`
✅ New files uploaded to hosting server
✅ Browser cache cleared
✅ Console shows no errors
✅ Network tab shows successful API calls

## Contact Support

If issues persist:
1. Share browser console errors
2. Share Supabase Edge Function logs
3. Verify which hosting platform you're using
4. Confirm the deployment method (cPanel, FTP, etc.)
