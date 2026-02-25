# ReserveX Troubleshooting Guide

Quick solutions to common issues.

## 🔴 "Failed to load cuisines" or API Connection Errors

### Problem
You see errors like:
- "Failed to load cuisines: Error: An error occurred"
- "Cannot connect to server"
- "Network Error"

### Cause
The frontend cannot connect to your backend API at `https://reservex.vercel.app/v1`

### Solutions

#### Solution 1: Verify Backend is Running

**Check if your backend is accessible:**

```bash
# Test from command line
curl https://reservex.vercel.app/v1/restaurants

# Or test in browser
# Open: https://reservex.vercel.app/v1/restaurants
```

If this fails, your backend is not running or not accessible.

**Action:** Deploy or start your backend server.

#### Solution 2: Update API URL

If your backend is at a different URL, update `/src/app/services/api.ts`:

```typescript
// Change this line:
export const API_BASE_URL = 'https://reservex.vercel.app/v1';

// To your actual backend URL:
export const API_BASE_URL = 'http://localhost:5000/v1';  // For local
// OR
export const API_BASE_URL = 'https://your-backend.com/v1';  // For production
```

#### Solution 3: Fix CORS Issues

If the backend is running but requests fail, it's likely a CORS issue.

**Backend CORS Configuration (Express example):**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://your-frontend-url.vercel.app'  // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

#### Solution 4: Use Fallback Data (Current Behavior)

**Good news:** The app already handles this gracefully!

When the backend is unavailable:
- Cuisines fallback to default list
- Error messages are clear
- App continues to function where possible

**Current fallback behavior:**
- ✅ Cuisines load from fallback data
- ✅ Error shown in console (not as toast)
- ✅ Backend status indicator shows connection state

## 🔴 "401 Unauthorized" Errors

### Problem
API returns 401 errors after login

### Solutions

1. **Check token is saved:**
   ```javascript
   // In browser console:
   localStorage.getItem('reservex_auth_token')
   ```

2. **Backend should accept Bearer token:**
   ```javascript
   // Backend middleware
   const token = req.headers.authorization?.replace('Bearer ', '');
   ```

3. **Token might be expired - Login again**

## 🔴 Build Errors

### Problem
`pnpm build` fails

### Solutions

```bash
# Clear everything and reinstall
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm build

# Check TypeScript errors
npx tsc --noEmit

# Check for unused imports
```

## 🔴 Page Refresh Shows 404

### Problem
Deployed app shows 404 on page refresh

### Solutions

**For Vercel:**
Already configured in `vercel.json` ✅

**For Netlify:**
Already configured in `netlify.toml` ✅

**For Apache:**
Add to `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🔴 Images Not Loading

### Problem
Restaurant images show broken

### Solutions

1. **Check image URLs in backend data**
   - Should be absolute URLs: `https://...`
   - Test URLs in browser

2. **Update image URLs if needed**

## 🟡 Slow API Responses

### Solutions

1. **Check backend location**
   - Use same region as frontend for best performance

2. **Add loading states** (Already implemented ✅)

3. **Optimize backend queries**
   - Add database indexes
   - Cache frequent queries

## 🟢 Backend Status Indicator

The app now shows a backend status indicator in the bottom-right corner:

- 🟢 **Green (Online)**: Backend connected, all features work
- 🟡 **Yellow (Checking)**: Checking connection...
- 🔴 **Red (Offline)**: Cannot connect to backend

**To retry connection:** Click "Retry Connection" button

## 📝 Debugging Checklist

When something doesn't work:

1. **Check Browser Console** (F12)
   - Look for red errors
   - Note the error message

2. **Check Network Tab**
   - See which API calls failed
   - Check request/response

3. **Verify Backend**
   ```bash
   curl https://your-backend-url.com/v1/restaurants
   ```

4. **Check API URL**
   - Open `/src/app/services/api.ts`
   - Verify `API_BASE_URL` is correct

5. **Test Authentication**
   ```javascript
   // In console after login:
   localStorage.getItem('reservex_auth_token')
   localStorage.getItem('reservex_current_user')
   ```

## 🛠️ Quick Fixes

### Clear Everything and Start Fresh

```bash
# Clear browser storage
# In browser console:
localStorage.clear()
sessionStorage.clear()

# Clear node modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install

# Run dev server
pnpm dev
```

### Check All Services

```bash
# Test backend
curl https://reservex.vercel.app/v1/restaurants

# Test login
curl -X POST https://reservex.vercel.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"customer123"}'
```

## 🆘 Still Having Issues?

### 1. Enable Detailed Logging

Add to `/src/app/services/api.ts`:

```typescript
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Request data:', config.data);
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);
```

### 2. Check Backend Logs

Look at your backend server logs for errors.

### 3. Test Individual Endpoints

Use Postman or curl to test each endpoint:

```bash
# Get all restaurants
curl https://reservex.vercel.app/v1/restaurants

# Get cuisines
curl https://reservex.vercel.app/v1/restaurants/cuisines

# Get single restaurant
curl https://reservex.vercel.app/v1/restaurants/rest-1
```

## ✅ Everything Working?

Once fixed, you should see:
- ✅ Backend status shows "Connected"
- ✅ Restaurants load on homepage
- ✅ Cuisines filter works
- ✅ No console errors
- ✅ Login/register works
- ✅ Bookings can be created

## 📚 More Help

- See `README.md` for overview
- See `TUTORIAL.md` for deployment guide
- See `API_TESTING_GUIDE.md` for API testing
- See `DEPLOYMENT_CHECKLIST.md` before deploying

---

**Most Common Issue:** Backend URL is wrong or backend is not running.

**Quick Check:** Open https://reservex.vercel.app/v1/restaurants in your browser. Should return JSON data.

If you see "Cannot GET /v1/restaurants", your backend needs to be deployed or the URL is incorrect.
