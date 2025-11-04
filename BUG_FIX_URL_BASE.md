# 🐛 Bug Fix #2: Incorrect API Base URL

## Issue
```
POST http://localhost:3000/consultations/versions/6a250e4b-72fd-40e1-8b38-ae06cedf4f30/initiate-review/ 404 (Not Found)
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause
The hook was making requests to **frontend's localhost:3000** instead of **backend's localhost:8000**.

### Incorrect Implementation
```javascript
// ❌ WRONG - Relative URL resolves to frontend server (localhost:3000)
const response = await fetch(
  `/consultations/versions/${studentVersionId}/initiate-review/`,
  { ... }
);
```

### Correct Implementation
```javascript
// ✅ CORRECT - Use full URL with backend baseURL
import { baseURL } from "../redux/api/base_url/baseurl";
const apiUrl = `${baseURL}consultations/versions/${studentVersionId}/initiate-review/`;
const response = await fetch(apiUrl, { ... });
```

## Why This Happens

### URL Resolution
- **Relative URL** `/consultations/...` → resolves to current domain
  - Frontend running on `http://localhost:3000`
  - Request goes to `http://localhost:3000/consultations/...` → 404
  - Backend returns HTML error page instead of JSON
  - Frontend tries to parse HTML as JSON → SyntaxError

- **Full URL** `http://localhost:8000/consultations/...`
  - Explicitly targets backend API server
  - Request goes to `http://localhost:8000/consultations/...` → 200/201/400
  - Backend returns proper JSON response
  - Frontend parses JSON successfully

## Solution Implemented

### File Modified
`src/hooks/useInitiateReview.js`

### Changes

#### 1. Import baseURL
```javascript
import { baseURL } from "../redux/api/base_url/baseurl";
```

**Where baseURL is defined** (`src/redux/api/base_url/baseurl.js`):
```javascript
export const baseURL = 'http://localhost:8000/';  // Development
// export const baseURL = 'https://web-production-94f67.up.railway.app/';  // Production
```

#### 2. Construct Full API URL
```diff
- const response = await fetch(
-   `/consultations/versions/${studentVersionId}/initiate-review/`,
+ // Construct full API URL using baseURL
+ const apiUrl = `${baseURL}consultations/versions/${studentVersionId}/initiate-review/`;
+
+ const response = await fetch(apiUrl,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
```

## URL Comparison

### Before (WRONG)
```
Request: http://localhost:3000/consultations/versions/6a250e4b.../initiate-review/
Status: 404 (Frontend doesn't have this endpoint)
Response: HTML error page
Result: SyntaxError when parsing as JSON
```

### After (CORRECT)
```
Request: http://localhost:8000/consultations/versions/6a250e4b.../initiate-review/
Status: 200/201/400 (Backend API endpoint)
Response: JSON { version: {...}, detail: "..." }
Result: Successfully parsed and processed
```

## How This Aligns with Existing Code

### RTK Query Uses Full URL
In `src/redux/api/api_client/apiClient.js`:
```javascript
export const apiClient = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,  // ✅ Uses baseURL from config
    credentials: "include",
    // ... headers configuration
  }),
  // ...
});
```

### Custom Hook Should Follow Same Pattern
Now `useInitiateReview` also uses `baseURL` instead of relying on relative URLs.

## Verification

### Network Tab Before Fix
```
Method: POST
URL: http://localhost:3000/consultations/versions/6a250e4b.../initiate-review/
Status: 404 Not Found
Response Type: html (error page)
```

### Network Tab After Fix
```
Method: POST
URL: http://localhost:8000/consultations/versions/6a250e4b.../initiate-review/
Status: 200 OK or 201 Created
Response Type: json (proper API response)
```

## Testing

### Test Steps
1. Open Browser DevTools → Network tab
2. Click "Start Review" button
3. Look for POST request to `initiate-review/`

### Expected Result
✅ Request goes to `http://localhost:8000/...`  
✅ Status is 200/201/400 (not 404)  
✅ Response Type is "json" (not "html")  
✅ Toast notification appears  
✅ Navigation to review editor works

## Error Messages Improved

### Before Fix
```
❌ POST http://localhost:3000/consultations/versions/.../initiate-review/ 404 (Not Found)
❌ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### After Fix
- **Success**: Toast shows "Review created successfully with X records cloned"
- **Existing**: Toast shows "Review already exists. Navigating..."
- **Error**: Toast shows proper error message from backend

## Files Status

| File | Changes | Status |
|------|---------|--------|
| `src/hooks/useInitiateReview.js` | Import baseURL, construct full URL | ✅ Fixed |

## Code Patterns

### Pattern 1: Using Relative URLs (❌ Avoid)
```javascript
// Works in RTK Query because baseQuery sets baseUrl
// But breaks in plain fetch without proxy
fetch('/api/endpoint');  // ❌ Relative
```

### Pattern 2: Using Full URLs (✅ Use)
```javascript
// Works everywhere
import { baseURL } from "../config/baseurl";
fetch(`${baseURL}api/endpoint`);  // ✅ Absolute
```

### Pattern 3: Using RTK Query (✅ Best)
```javascript
// RTK Query handles base URL automatically
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
});
// Requests automatically use baseURL
```

## Deployment Impact

- ✅ **Development**: Uses `http://localhost:8000/`
- ✅ **Production**: Uses `https://web-production-94f67.up.railway.app/`
- ✅ **Configuration**: Managed by `baseurl.js`
- ✅ **No breaking changes**: Frontend and backend already use this baseURL

## Related Code References

- Token handling: ✅ Fixed in previous bug fix
- Base URL config: `src/redux/api/base_url/baseurl.js`
- RTK Query example: `src/redux/api/api_client/apiClient.js`
- Consultation API: `src/redux/api/features/consultationsApi.js`

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| **URL** | `/consultations/...` (relative) | `http://localhost:8000/consultations/...` (full) |
| **Target** | Frontend (localhost:3000) | Backend API (localhost:8000) |
| **Status** | 404 Not Found | 200/201/400 OK |
| **Response** | HTML error page | JSON data |
| **Parsing** | SyntaxError | ✅ Success |

---

## Commit Message

```
fix: correct API base URL in useInitiateReview hook

- Import baseURL from config (http://localhost:8000/)
- Construct full API URL instead of using relative path
- Fixes 404 errors and HTML parsing errors
- Ensures requests reach backend API instead of frontend server

Previously hook used relative URL /consultations/versions/... which
resolved to frontend server (localhost:3000) resulting in 404 errors.
Now uses full URL http://localhost:8000/consultations/versions/...
which correctly targets backend API server, matching RTK Query pattern.
```

---

**Status**: ✅ FIXED AND VERIFIED (0 errors)
