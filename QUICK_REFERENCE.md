# ReserveX Developer Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🎭 Demo Credentials

```
Customer: customer@demo.com / demo123
Manager:  manager@demo.com  / demo123
Admin:    admin@demo.com    / demo123
```

## 📍 Key File Locations

| What | Path |
|------|------|
| API Config | `/src/app/services/api.ts` |
| Demo Data | `/src/app/services/demo-data.ts` |
| Auth Service | `/src/app/services/auth.service.ts` |
| Restaurant Service | `/src/app/services/restaurant.service.ts` |
| Booking Service | `/src/app/services/booking.service.ts` |
| Review Service | `/src/app/services/review.service.ts` |
| Favourite Service | `/src/app/services/favourite.service.ts` |
| Routes | `/src/app/routes.tsx` |
| Main App | `/src/app/App.tsx` |

## ⚙️ Changeable Settings

### Backend URL
```typescript
// File: /src/app/services/api.ts
export const API_BASE_URL = 'https://reservex.vercel.app/v1';
// Change to: 'http://localhost:5000/v1' for local dev
```

### Request Timeout
```typescript
// File: /src/app/services/api.ts
timeout: 30000, // 30 seconds - adjust as needed
```

### localStorage Keys
```typescript
'reservex_auth_token'       // JWT token
'reservex_current_user'     // User data
'reservex_demo_mode'        // Demo mode flag
'reservex_demo_bookings'    // Demo bookings
'reservex_demo_reviews'     // Demo reviews
'reservex_demo_favourites'  // Demo favourites
```

### Auto-hide Timeout (Status Indicator)
```typescript
// File: /src/app/components/BackendStatus.tsx
setTimeout(() => setShowStatus(false), 3000); // 3 seconds
```

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register       Register new user
POST   /auth/login          User login
POST   /auth/logout         User logout
GET    /auth/me             Get current user
PUT    /auth/profile        Update profile
```

### Restaurants
```
GET    /restaurants                  Get all (with filters)
GET    /restaurants/:id              Get details
GET    /restaurants/:id/menu         Get menu
GET    /restaurants/:id/reviews      Get reviews
GET    /restaurants/cuisines         Get cuisines
GET    /restaurants/:id/availability Check seats
```

### Bookings
```
GET    /bookings/my-bookings  Get user bookings
POST   /bookings              Create booking
PUT    /bookings/:id          Update booking
PUT    /bookings/:id/cancel   Cancel booking
```

### Reviews
```
GET    /reviews/my-reviews    Get user reviews
POST   /reviews               Create review
PUT    /reviews/:id           Update review
DELETE /reviews/:id           Delete review
```

### Favourites
```
GET    /favourites/my-favourites  Get user favourites
POST   /favourites/toggle         Toggle favourite
```

## 🎯 Common Tasks

### Change Backend URL
1. Open `/src/app/services/api.ts`
2. Modify `API_BASE_URL`
3. Restart dev server

### Add New Restaurant (Demo)
1. Open `/src/app/services/demo-data.ts`
2. Add to `DEMO_RESTAURANTS` array
3. Add menu items to `DEMO_MENU_ITEMS`
4. Add cuisine to `DEMO_CUISINES`

### Clear Demo Data
```javascript
// In browser console
localStorage.clear();
// Then refresh page
```

### Enable/Disable Demo Mode
```javascript
// Enable
localStorage.setItem('reservex_demo_mode', 'true');

// Disable
localStorage.removeItem('reservex_demo_mode');

// Check
localStorage.getItem('reservex_demo_mode') === 'true'
```

## 🔍 Debug Commands

### Browser Console
```javascript
// Check auth status
localStorage.getItem('reservex_auth_token')

// Get current user
JSON.parse(localStorage.getItem('reservex_current_user'))

// Check demo mode
localStorage.getItem('reservex_demo_mode')

// View demo bookings
JSON.parse(localStorage.getItem('reservex_demo_bookings'))

// Clear all data
localStorage.clear()
```

### Search Code
```bash
# Find all changeables
grep -r "CHANGEABLE" src/

# Find localStorage usage
grep -r "localStorage" src/

# Find all TODOs
grep -r "TODO" src/

# Find specific service
find src/ -name "*service.ts"
```

## 📝 Service Methods Quick Reference

### RestaurantService
```typescript
getAllRestaurants(filters?)     // Get restaurants
getRestaurantById(id)           // Get one restaurant
getRestaurantMenu(id)           // Get menu
searchRestaurants(query)        // Search
getCuisines()                   // Get cuisines
getAvailableSeats(id, date, time) // Check availability
```

### AuthService
```typescript
login(credentials)              // Login user
register(data)                  // Register user
logout()                        // Logout
getCurrentUser()                // Get user info
updateProfile(data)             // Update profile
getStoredUser()                 // Get from localStorage
isAuthenticated()               // Check if logged in
```

### BookingService
```typescript
createBooking(data)             // Create booking
getMyBookings()                 // Get user bookings
getBookingById(id)              // Get one booking
cancelBooking(id)               // Cancel booking
updateBooking(id, data)         // Update booking
```

### ReviewService
```typescript
createReview(data)              // Create review
getRestaurantReviews(id)        // Get restaurant reviews
getMyReviews()                  // Get user reviews
updateReview(id, data)          // Update review
deleteReview(id)                // Delete review
```

### FavouriteService
```typescript
addFavourite(restaurantId)      // Add favourite
removeFavourite(restaurantId)   // Remove favourite
getMyFavourites()               // Get favourites
isFavourite(restaurantId)       // Check if favourited
toggleFavourite(restaurantId)   // Toggle status
```

## 🎨 Common Data Structures

### Restaurant
```typescript
{
  id: string
  name: string
  cuisine: string
  location: string
  rating: number
  totalSeats: number
  priceRange: string  // ৳, ৳৳, or ৳৳৳
  status: 'active' | 'pending' | 'blocked'
}
```

### Booking
```typescript
{
  id: string
  restaurantId: string
  userId: string
  date: string        // YYYY-MM-DD
  timeSlot: string    // "7:00 PM"
  seats: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}
```

### Review
```typescript
{
  id: string
  restaurantId: string
  userId: string
  rating: number      // 1-5
  comment: string
}
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not connecting | Check `API_BASE_URL` in `api.ts` |
| Login fails | Try demo credentials or clear localStorage |
| Page blank | Check console for errors |
| Build fails | Run `rm -rf node_modules && pnpm install` |
| No restaurants showing | Check if backend is running or use demo mode |
| Demo mode not working | Refresh page after enabling flag |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Quick start and overview |
| DEMO_DATA_GUIDE.md | Demo system details |
| CODE_DOCUMENTATION_GUIDE.md | Code structure guide |
| TUTORIAL.md | Complete tutorial |
| TROUBLESHOOTING.md | Problem solutions |
| API_TESTING_GUIDE.md | API integration |
| DEPLOYMENT_CHECKLIST.md | Pre-deployment checks |
| DOCUMENTATION_INDEX.md | All docs overview |

## 🔗 Useful Links

- **Local Dev**: http://localhost:5173
- **Backend API**: https://reservex.vercel.app/v1
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com

## 💡 Pro Tips

1. **Always test in demo mode first** - Verify features work without backend
2. **Read inline comments** - Every service file has detailed explanations
3. **Check BackendStatus component** - Shows if demo mode is active
4. **Use browser DevTools** - Network tab shows API calls
5. **Clear localStorage often** - Prevents cached data issues
6. **Follow CHANGEABLE markers** - Safe settings to modify
7. **Test both modes** - Backend connected + demo mode
8. **Use demo credentials** - Quick testing without setup

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-router": "^7.x",
  "axios": "^1.x",
  "tailwindcss": "^4.x",
  "@mui/material": "^6.x"
}
```

## 🎯 Development Workflow

```
1. Read README.md
   ↓
2. Install dependencies (pnpm install)
   ↓
3. Start dev server (pnpm dev)
   ↓
4. Test with demo credentials
   ↓
5. Read CODE_DOCUMENTATION_GUIDE.md
   ↓
6. Make changes (follow inline comments)
   ↓
7. Test in both modes (backend + demo)
   ↓
8. Build (pnpm build)
   ↓
9. Deploy (follow TUTORIAL.md)
```

## ✅ Pre-Deployment Checklist

- [ ] Update API_BASE_URL to production
- [ ] Test all features
- [ ] Build succeeds
- [ ] No console errors
- [ ] All routes work
- [ ] Authentication works
- [ ] Demo mode works
- [ ] Mobile responsive
- [ ] Performance good
- [ ] Security checked

---

**Keep this card handy for quick reference during development!**

**Version**: 2.0.0 | **Updated**: Feb 19, 2026
