# Troubleshooting Blank Screen Issues

## Common Issues and Solutions

### 1. Missing Imports
**Problem**: Components fail to render due to missing React or library imports.

**Solution**: Ensure all components have proper imports:
```typescript
import { useState, useEffect } from "react";
import { IconName } from "lucide-react";
```

### 2. Supabase Connection Errors
**Problem**: API calls fail when Supabase is enabled.

**Check**:
- `/src/app/utils/api.ts` - Ensure `USE_SUPABASE = true`
- `/supabase/functions/server/index.tsx` - Server is running
- All API endpoints have corresponding server routes

### 3. PropertyContext Loading
**Problem**: App stuck on loading screen.

**Fix**: PropertyContext must successfully load before rendering children.
- Check that `getProperties()` API call succeeds
- Verify fallback properties are set if API fails

### 4. ErrorBoundary Not Catching Errors
**Problem**: White screen instead of error message.

**Fix**: Ensure ErrorBoundary wraps the entire app in `/src/app/App.tsx`

### 5. Toast Notifications Not Working
**Problem**: Import errors for toast library.

**Fix**: Use `import { toast } from "sonner"` (NOT "react-toastify")
- Ensure `<Toaster />` is rendered in Root component

## Quick Diagnostic Steps

1. **Open Browser Console** - Check for error messages
2. **Check Network Tab** - Verify API calls are successful
3. **Verify Environment**:
   - Supabase URL and keys are set
   - Server is deployed and accessible
4. **Check Component Imports** - All files have proper imports
5. **Verify State Management** - No circular dependencies

## Emergency Fallback

If all else fails, disable Supabase temporarily:
1. Go to `/src/app/utils/api.ts`
2. Set `const USE_SUPABASE = false;`
3. This will use localStorage instead of Supabase

## Version
Current: v2.2.2
Last Updated: 2026-03-02
