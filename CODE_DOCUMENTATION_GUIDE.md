# ReserveX Code Documentation Guide

## 📚 Overview

This guide explains the comprehensive code documentation system used throughout ReserveX. Every service file includes detailed inline comments to help developers understand and modify the code.

## 🎯 Documentation Philosophy

### Principles
1. **Explain WHY, not just WHAT** - Comments explain the reasoning behind code decisions
2. **Highlight Changeables** - Mark configuration options and customizable values
3. **Document Fallbacks** - Explain what happens when backend fails
4. **Show Examples** - Provide usage examples in comments
5. **Maintain Consistency** - Use standardized comment formats

## 📝 Comment Styles Used

### 1. File Headers (═══)
```typescript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE/SECTION TITLE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Description of the file or section purpose
 * Key features and responsibilities
 * 
 * CHANGEABLE SETTINGS: List of modifiable configurations
 * IMPORTANT NOTES: Critical information
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
```

**Usage**: Start of files and major sections

### 2. Section Dividers (─────)
```typescript
/**
 * ─────────────────────────────────────────────────────────────────────────
 * SUBSECTION TITLE
 * ─────────────────────────────────────────────────────────────────────────
 * Brief description of what this section does
 */
```

**Usage**: Functions, classes, or logical groupings

### 3. Inline Documentation
```typescript
// Single-line explanation of the next line of code
const value = something(); // Explanation of what this returns

/**
 * Multi-line explanation when needed
 * - Point 1
 * - Point 2
 */
```

**Usage**: Complex logic or important details

### 4. Changeable Markers
```typescript
// CHANGEABLE: This value can be modified for different environments
export const API_BASE_URL = 'https://reservex.vercel.app/v1';

// CHANGEABLE: Adjust timeout duration if backend is slow
timeout: 30000, // 30 seconds
```

**Usage**: Configuration values that developers might need to modify

### 5. Important Warnings
```typescript
// IMPORTANT: Never do X because Y
// WARNING: This will cause Z if not careful
// NOTE: Remember to check ABC before using
```

**Usage**: Critical information that prevents bugs

## 🗂️ Documentation by File Type

### API Configuration Files

**File**: `/src/app/services/api.ts`

**Documentation Includes**:
- ✅ Base URL configuration with environment examples
- ✅ Timeout settings explanation
- ✅ Request interceptor logic
- ✅ Response interceptor and error handling
- ✅ localStorage key documentation
- ✅ Error handling flow diagrams in comments

**Example**:
```typescript
/**
 * Base URL for the ReserveX backend API
 * 
 * IMPORTANT: Update this URL when deploying to different environments
 * - Development: http://localhost:5000/v1
 * - Production: https://reservex.vercel.app/v1
 * - Staging: https://reservex-staging.vercel.app/v1
 */
export const API_BASE_URL = 'https://reservex.vercel.app/v1';
```

### Service Layer Files

**Files**: 
- `/src/app/services/auth.service.ts`
- `/src/app/services/restaurant.service.ts`
- `/src/app/services/booking.service.ts`
- `/src/app/services/review.service.ts`
- `/src/app/services/favourite.service.ts`

**Documentation Includes**:
- ✅ Service purpose and responsibilities
- ✅ Fallback behavior explanation
- ✅ Method descriptions with parameters
- ✅ Return type explanations
- ✅ Error handling strategy
- ✅ Demo mode logic
- ✅ localStorage key documentation

**Example**:
```typescript
/**
 * ─────────────────────────────────────────────────────────────────────────
 * GET ALL RESTAURANTS (with optional filters)
 * ─────────────────────────────────────────────────────────────────────────
 * Fetches a list of restaurants from the backend with optional filters
 * 
 * FALLBACK: Returns demo restaurants if API fails
 * 
 * @param filters - Optional filters (search, cuisine, city, etc.)
 * @returns Promise<Restaurant[]> - Array of restaurant objects
 */
async getAllRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
  try {
    // Backend request...
  } catch (error) {
    // Fallback logic with detailed comments...
  }
}
```

### Demo Data File

**File**: `/src/app/services/demo-data.ts`

**Documentation Includes**:
- ✅ Purpose of demo data system
- ✅ Data structure explanations
- ✅ Field-by-field documentation
- ✅ Relationship diagrams
- ✅ Usage instructions
- ✅ Maintenance guidelines

**Example**:
```typescript
/**
 * Restaurant Interface
 * Represents a complete restaurant entity with all its properties
 */
export interface Restaurant {
  id: string;                    // Unique identifier
  name: string;                  // Restaurant name
  cuisine: string;               // Type of cuisine (e.g., Italian, Chinese)
  // ... more fields with inline comments
}
```

### Component Files

**Files**: Components like BackendStatus, layouts, etc.

**Documentation Includes**:
- ✅ Component purpose
- ✅ Props documentation
- ✅ State management explanation
- ✅ Effect dependencies
- ✅ Changeable UI values (timeouts, positions, etc.)
- ✅ Accessibility considerations

**Example**:
```typescript
/**
 * BackendStatus Component
 * 
 * Displays real-time backend connection status
 * Automatically checks on mount and allows manual retry
 * 
 * CHANGEABLE:
 * - Auto-hide timeout (currently 3 seconds)
 * - Position (currently bottom-right)
 */
export function BackendStatus() {
  // Detailed state and logic comments...
}
```

## 🎨 Documentation Patterns

### Pattern 1: Try-Catch with Fallback

```typescript
async functionName(): Promise<ReturnType> {
  try {
    // ───────────────────────────────────────────────────────────────────
    // BACKEND REQUEST: What this does and why
    // ───────────────────────────────────────────────────────────────────
    const response = await api.get('/endpoint');
    return response.data;
    
  } catch (error) {
    // ───────────────────────────────────────────────────────────────────
    // FALLBACK BEHAVIOR: What happens when backend fails
    // ───────────────────────────────────────────────────────────────────
    console.warn('Backend unavailable. Using demo data.');
    return DEMO_DATA;
  }
}
```

### Pattern 2: Configuration Objects

```typescript
// Create axios instance with default configuration
// This instance will be used for all API calls throughout the application
// 
// CHANGEABLE SETTINGS:
// - baseURL: The root URL for all API requests
// - timeout: Maximum time (in milliseconds) to wait for a response
// - headers: Default headers sent with every request
export const api = axios.create({
  baseURL: API_BASE_URL,        // All requests prefixed with this URL
  headers: {
    'Content-Type': 'application/json', // Send JSON by default
  },
  timeout: 30000, // 30 seconds - increase if backend is slow
});
```

### Pattern 3: Complex Logic Breakdown

```typescript
// Apply filters if provided
if (filters) {
  // Filter by search query (matches restaurant name)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    restaurants = restaurants.filter(r => 
      r.name.toLowerCase().includes(searchLower) ||      // Match name
      r.description.toLowerCase().includes(searchLower) || // Match description
      r.cuisine.toLowerCase().includes(searchLower)       // Match cuisine
    );
  }
  
  // Filter by cuisine type
  if (filters.cuisine && filters.cuisine !== 'All') {
    restaurants = restaurants.filter(r => r.cuisine === filters.cuisine);
  }
  
  // More filters...
}
```

### Pattern 4: Data Structure Documentation

```typescript
/**
 * Booking Interface
 * Represents a restaurant reservation
 */
export interface Booking {
  id: string;                    // Unique booking identifier
  restaurantId: string;          // ID of the restaurant
  userId: string;                // ID of the user who made the booking
  date: string;                  // Reservation date (YYYY-MM-DD format)
  timeSlot: string;              // Reserved time slot (e.g., "7:00 PM")
  seats: number;                 // Number of seats reserved
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';  // Booking status
  // ... more fields
}
```

## 📍 Finding Changeable Settings

### Quick Reference: Where to Find Changeables

| What to Change | File Location | Variable/Constant |
|----------------|---------------|-------------------|
| Backend URL | `/src/app/services/api.ts` | `API_BASE_URL` |
| Request Timeout | `/src/app/services/api.ts` | `timeout` in axios config |
| Auth Token Key | `/src/app/services/api.ts` | `'reservex_auth_token'` |
| User Data Key | `/src/app/services/api.ts` | `'reservex_current_user'` |
| Demo Mode Key | `/src/app/services/auth.service.ts` | `'reservex_demo_mode'` |
| Auto-hide Timeout | `/src/app/components/BackendStatus.tsx` | `setTimeout` duration |
| Health Check Endpoint | `/src/app/services/api.ts` | `/health` endpoint |

### Search Tips

Use these search patterns to find changeable settings:

```bash
# Search for changeable markers
grep -r "CHANGEABLE" src/

# Search for configuration constants
grep -r "export const.*URL" src/

# Search for localStorage keys
grep -r "localStorage" src/

# Search for timeout settings
grep -r "timeout" src/
```

## 🧪 Understanding Error Flows

### Error Handling Documentation

Every error is documented with:
1. **What caused it** - The trigger condition
2. **What happens** - The fallback behavior
3. **User impact** - How it affects the user experience

**Example**:
```typescript
if (error.response?.status === 401) {
  // 401 means the token is invalid or expired
  
  // Clear all authentication data from localStorage
  localStorage.removeItem('reservex_auth_token'); // Remove JWT token
  localStorage.removeItem('reservex_current_user'); // Remove user data
  
  // Redirect user to login page
  window.location.href = '/auth';
  
  console.warn('Session expired. Redirecting to login...');
}
```

## 🔧 Modifying Code Safely

### Step-by-Step Guide

1. **Find the relevant file** using project structure docs
2. **Read file header** to understand purpose
3. **Locate CHANGEABLE markers** for configuration
4. **Read surrounding comments** for context
5. **Test changes** in development first
6. **Check fallback behavior** if modifying services

### Example: Changing API Timeout

```typescript
// BEFORE
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
});

// AFTER (for slow backend)
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds - increased for slow backend
});
```

## 📋 Documentation Checklist

When adding new code, ensure:

- [ ] File has header comment explaining purpose
- [ ] All public methods have description comments
- [ ] Complex logic is broken down with inline comments
- [ ] Changeables are marked with CHANGEABLE
- [ ] Fallback behavior is documented
- [ ] Error cases are explained
- [ ] Examples are provided where helpful
- [ ] Related files are cross-referenced
- [ ] localStorage keys are documented
- [ ] Constants have inline explanations

## 🎓 Best Practices

### DO ✅

- Explain WHY, not just WHAT
- Mark all configurable values
- Document error handling
- Provide usage examples
- Use consistent formatting
- Keep comments up-to-date

### DON'T ❌

- State the obvious (`// increment i` for `i++`)
- Leave commented-out code
- Use unclear abbreviations
- Write essays (be concise)
- Forget to update comments when code changes

## 🔍 Understanding the Fallback System

### Documentation Highlights Fallback Logic

Every service method documents:

```typescript
/**
 * METHOD_NAME
 * 
 * BACKEND BEHAVIOR: What happens with backend
 * FALLBACK BEHAVIOR: What happens without backend
 * 
 * @param - Parameter descriptions
 * @returns - Return value description
 */
```

### Fallback Flow Diagram (in comments)

```
┌─────────────────────────────────────────┐
│   Try to fetch from backend API        │
├─────────────────────────────────────────┤
│         │               │               │
│  Success│               │Error          │
│         ▼               ▼               │
│  ┌───────────┐   ┌──────────────┐     │
│  │  Return   │   │ Return Demo  │     │
│  │  Backend  │   │    Data      │     │
│  │   Data    │   │  (Fallback)  │     │
│  └───────────┘   └──────────────┘     │
└─────────────────────────────────────────┘
```

## 📚 Additional Resources

- **[DEMO_DATA_GUIDE.md](./DEMO_DATA_GUIDE.md)** - Demo data system details
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - API integration guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues

## 🤝 Contributing Documentation

When adding features:

1. Follow existing comment patterns
2. Document all changeables
3. Explain fallback behavior
4. Add examples
5. Update this guide if needed

---

**Last Updated**: February 19, 2026
**Documentation Standard**: v2.0
**Maintained by**: ReserveX Development Team
