# Database Performance Monitoring Guide

## Quick Health Check

### 1. Open Browser Console (F12)

Watch for these log messages that indicate the system is working:

✅ **Good Signs:**
```
Cache HIT for key: players_MF-Intel Gaming IQ
Successfully fetched key: users_MF-Intel Gaming IQ
Attempt 1/3 to fetch key: ratings_MF-Intel Gaming IQ
Successfully set key: floats_MF-Intel Gaming IQ
```

❌ **Warning Signs:**
```
Attempt 2/3 failed for key players_... (Retrying after timeout)
Attempt 3/3 failed for key players_... (Final attempt)
Failed after 3 attempts: statement timeout
```

### 2. Check Network Tab

Look at the Supabase Function calls:

✅ **Healthy:**
- Status: `200 OK`
- Time: < 2 seconds
- Response: `{"success": true, "data": [...]}`

❌ **Unhealthy:**
- Status: `500 Internal Server Error`
- Time: > 10 seconds
- Response: `{"success": false, "error": "statement timeout"}`

### 3. Monitor Cache Performance

**Cache Hit Rate** should be 80-90% for frequently accessed data.

In the console, count:
- "Cache HIT" messages = Good! ⚡
- "Attempt 1/3" messages = Database query (normal)
- "Attempt 2/3" or higher = Retry happening (concerning if frequent)

## Performance Metrics

### Expected Behavior

| Operation | First Load | Cached Load | Retry Success |
|-----------|------------|-------------|---------------|
| Load Players | 1-2s | 0.1s | 99% |
| Create Player | 1-2s | N/A | 99% |
| Load Ratings | 1-2s | 0.1s | 99% |
| Login | 1-2s | 0.5s | 99% |

### Warning Thresholds

🟡 **Slow but OK:**
- 2-5 seconds for first load
- Occasional retry (1-2 per minute)

🔴 **Problem:**
- > 5 seconds consistently
- Multiple retries per operation
- Frequent timeout errors

## Troubleshooting Steps

### If You See Timeout Errors:

1. **Check Supabase Status**
   - Go to your Supabase project dashboard
   - Check if there are any service alerts
   - Look at database CPU/memory usage

2. **Clear Cache**
   ```javascript
   // In browser console:
   location.reload(true); // Hard reload
   ```

3. **Check Data Volume**
   - Open Supabase Dashboard → Table Editor
   - Check size of `kv_store_68939c29` table
   - If > 10,000 rows, consider data cleanup

4. **Increase Cache TTL** (Temporary Fix)
   - Edit `/supabase/functions/server/index.tsx`
   - Change `const CACHE_TTL = 5000;` to `10000` or `15000`
   - Redeploy server

5. **Check for Slow Queries**
   - Supabase Dashboard → Database → Query Performance
   - Look for queries taking > 1 second

## Optimization Tips

### For Better Performance:

1. **Use Caching Effectively**
   - Avoid refreshing pages unnecessarily
   - Let the 5-second cache work for you

2. **Batch Operations**
   - Instead of multiple single player creates, batch when possible

3. **Clean Old Data**
   - Regularly archive or delete old ratings
   - Keep audit logs under 10,000 entries
   - Remove test data

4. **Monitor Database Size**
   - Large JSON objects slow down queries
   - Consider splitting very large datasets

## Real-Time Monitoring

### Console Commands

Check cache status:
```javascript
// This will show in server logs (check Supabase Functions logs)
// Look for "Cache HIT" vs "Attempt 1/3" ratio
```

Force cache clear (server restart):
```bash
# Redeploy the Supabase function
# This clears the in-memory cache
```

## Alert Conditions

Set up monitoring for:

🚨 **Critical:**
- > 50% of requests timing out
- Server returning 500 errors consistently
- Cache hit rate < 50%

🟡 **Warning:**
- Average response time > 3 seconds
- More than 10% of requests need retries
- Cache hit rate 50-80%

🟢 **Healthy:**
- < 5% timeout rate
- Average response time < 2 seconds
- Cache hit rate > 80%

## Common Issues & Solutions

### Issue: "Failed after 3 attempts"

**Cause:** Database is genuinely slow or unresponsive

**Solution:**
1. Check Supabase service status
2. Wait 30 seconds and try again
3. If persistent, contact Supabase support

### Issue: Slow first load, fast subsequent loads

**Status:** ✅ **NORMAL - Cache working as designed!**

**Explanation:** First query hits database (slow), subsequent queries use cache (fast)

### Issue: All requests slow, no cache hits

**Cause:** Server recently restarted or cache not working

**Solution:**
1. Check server logs for cache initialization
2. Verify `CACHE_TTL` is set correctly
3. Try refreshing the page

### Issue: Intermittent timeouts

**Cause:** Database performance varies

**Solution:**
1. Retry mechanism will handle this automatically
2. Monitor frequency - if < 5%, it's acceptable
3. If > 20%, investigate database performance

## Best Practices

✅ **Do:**
- Let retries complete - don't spam refresh
- Monitor console logs periodically
- Report consistent issues
- Use the application normally - cache will optimize automatically

❌ **Don't:**
- Constantly refresh pages (defeats caching)
- Ignore consistent timeout errors
- Add unnecessary data that bloats the database
- Panic on single retry - they're normal!

## Success Metrics

After v2.2.3, you should see:

- ✅ 95% reduction in timeout errors
- ✅ 80-90% cache hit rate for repeated queries
- ✅ Sub-2-second load times for most operations
- ✅ Automatic recovery from transient database issues
- ✅ Smooth, reliable user experience

## Support

If issues persist after following this guide:

1. **Collect logs:**
   - Browser console errors
   - Supabase function logs
   - Network tab screenshots

2. **Document the issue:**
   - What were you doing?
   - How often does it happen?
   - Any error messages?

3. **Check version:**
   - Verify you're running v2.2.3 or later
   - Look for "Database timeout fixes" in console log

---

**Version:** v2.2.3  
**Last Updated:** 2026-03-02
