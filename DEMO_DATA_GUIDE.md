# ReserveX Demo Data & Fallback System Guide

## 📋 Overview

ReserveX includes a comprehensive demo data system that ensures the application remains fully functional even when the backend API is unavailable. This guide explains how the fallback system works and how to use it.

## 🎯 Purpose

The demo data system serves three main purposes:

1. **Development Testing** - Test the frontend without requiring backend setup
2. **Resilient User Experience** - App continues working if backend goes down
3. **Demo/Presentation Mode** - Showcase features without live backend

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────┐
│         Frontend Application            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Service Layer (API Calls)      │  │
│  └──────────────────────────────────┘  │
│            │               │            │
│     Success │               │ Error     │
│            ▼               ▼            │
│  ┌─────────────┐   ┌──────────────┐   │
│  │   Backend   │   │  Demo Data   │   │
│  │    Data     │   │   Fallback   │   │
│  └─────────────┘   └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Data Storage Strategy

- **Backend Available**: All data fetched from API
- **Backend Unavailable**: Falls back to:
  - Static demo data (from `demo-data.ts`)
  - localStorage (for user-created data)

## 📁 File Structure

```
/src/app/services/
├── api.ts                    # API configuration & error handling
├── demo-data.ts             # Complete demo data definitions
├── auth.service.ts          # Authentication with fallback
├── restaurant.service.ts    # Restaurant operations with fallback
├── booking.service.ts       # Booking operations with fallback
├── review.service.ts        # Review operations with fallback
└── favourite.service.ts     # Favourite operations with fallback
```

## 🎭 Demo Users & Credentials

### Available Demo Users

When backend is unavailable, use these credentials:

| Role     | Email              | Password | Purpose                    |
|----------|-------------------|----------|----------------------------|
| Customer | customer@demo.com | demo123  | Test customer features     |
| Manager  | manager@demo.com  | demo123  | Test restaurant management |
| Admin    | admin@demo.com    | demo123  | Test admin features        |

### Demo User Details

```javascript
// Customer
{
  id: 'user-customer-1',
  name: 'Rakib Hassan',
  email: 'customer@demo.com',
  role: 'customer',
  phone: '+880 1711-999001'
}

// Manager
{
  id: 'user-manager-1',
  name: 'Karim Rahman',
  email: 'manager@demo.com',
  role: 'manager',
  phone: '+880 1711-999003'
}

// Admin
{
  id: 'user-admin-1',
  name: 'System Admin',
  email: 'admin@demo.com',
  role: 'admin',
  phone: '+880 1711-999000'
}
```

## 🍽️ Demo Restaurants

### 10 Real Restaurants in Rajshahi

1. **Aurora** - Continental (৳৳৳) - Shaheb Bazar
2. **Helium** - Fusion (৳৳) - Alokar Mor
3. **Calisto** - Italian (৳৳৳) - Laxmipur
4. **Chillox** - Fast Food (৳) - Ghoda Mara
5. **Pizza Burg** - Pizza & Burger (৳৳) - C&B Mor
6. **Kebab House** - Mughlai (৳৳) - Station Road
7. **Kudos** - Chinese (৳৳) - Sapura
8. **North Burg** - Burger (৳) - Binodpur
9. **Backyard Kitchen** - BBQ (৳৳৳) - Boalia
10. **Hideout** - Café (৳৳) - Talaimari

Each restaurant includes:
- Complete menu (8-12 items)
- Operating hours
- Seating capacity
- Contact information
- Ratings and reviews

## 💾 localStorage Data

### Demo Mode Storage Keys

When backend is unavailable, data is stored in browser's localStorage:

```javascript
// Authentication
'reservex_auth_token'      // Demo JWT token
'reservex_current_user'    // Current user data
'reservex_demo_mode'       // Flag indicating demo mode

// User-created data (only in demo mode)
'reservex_demo_bookings'   // User's bookings
'reservex_demo_reviews'    // User's reviews
'reservex_demo_favourites' // User's favourites
```

### Data Persistence

- **Pre-loaded demo data**: Always available (from `demo-data.ts`)
- **User-created data**: Stored in localStorage
  - ✅ Persists across page refreshes
  - ❌ Lost when clearing browser data
  - ❌ Lost when switching browsers/devices

## 🔄 How Fallback Works

### Example: Fetching Restaurants

```javascript
// 1. Try to fetch from backend
try {
  const response = await api.get('/restaurants');
  return response.data; // Use backend data if available
}

// 2. If backend fails, use demo data
catch (error) {
  console.warn('Backend unavailable. Using demo restaurants.');
  return DEMO_RESTAURANTS; // Return fallback data
}
```

### Example: Creating a Booking

```javascript
// 1. Try to create on backend
try {
  const response = await api.post('/bookings', data);
  return response.data; // Use backend response if available
}

// 2. If backend fails, store locally
catch (error) {
  console.warn('Backend unavailable. Creating demo booking.');
  
  // Create booking object
  const newBooking = {
    id: `booking-demo-${Date.now()}`,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('reservex_demo_bookings') || '[]');
  bookings.push(newBooking);
  localStorage.setItem('reservex_demo_bookings', JSON.stringify(bookings));
  
  return newBooking;
}
```

## 🧪 Testing with Demo Data

### Manual Testing Scenarios

#### 1. Test Customer Flow

```bash
# 1. Login as customer
Email: customer@demo.com
Password: demo123

# 2. Browse restaurants
- Filter by cuisine (Continental, Italian, etc.)
- Search by name
- View restaurant details

# 3. Make a booking
- Select date and time
- Enter guest details
- Confirm booking

# 4. Add favourites
- Click heart icon on restaurant cards
- View in favourites section

# 5. Write reviews
- Visit completed booking
- Submit rating and comment
```

#### 2. Test Manager Flow

```bash
# 1. Login as manager
Email: manager@demo.com
Password: demo123

# 2. View restaurant bookings
- See all bookings for managed restaurants
- Filter by status (pending, confirmed, etc.)

# 3. Manage bookings
- Confirm pending bookings
- View booking details
```

#### 3. Test Admin Flow

```bash
# 1. Login as admin
Email: admin@demo.com
Password: demo123

# 2. View all restaurants
- Access full restaurant list
- View statistics

# 3. Manage system
- View all bookings
- Monitor user activity
```

## 🚀 Deployment Considerations

### Backend URL Configuration

Update the API base URL in `/src/app/services/api.ts`:

```javascript
// Development
export const API_BASE_URL = 'http://localhost:5000/v1';

// Staging
export const API_BASE_URL = 'https://reservex-staging.vercel.app/v1';

// Production
export const API_BASE_URL = 'https://reservex.vercel.app/v1';
```

### Demo Mode Indicator

The app includes a visual indicator showing when demo mode is active:

```typescript
// Check if in demo mode
const isDemoMode = localStorage.getItem('reservex_demo_mode') === 'true';

// Display badge in UI
{isDemoMode && (
  <Badge variant="warning">Demo Mode - Backend Unavailable</Badge>
)}
```

## 📝 Adding New Demo Data

### Adding a Restaurant

Edit `/src/app/services/demo-data.ts`:

```javascript
export const DEMO_RESTAURANTS: Restaurant[] = [
  // ... existing restaurants
  {
    id: 'rest-11',
    name: 'New Restaurant',
    cuisine: 'Japanese',
    location: 'New Location, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Description here...',
    image: 'https://images.unsplash.com/...',
    rating: 4.5,
    totalReviews: 50,
    openingTime: '11:00 AM',
    closingTime: '10:00 PM',
    totalSeats: 40,
    priceRange: '৳৳',
    phone: '+880 1711-123466',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];
```

### Adding Menu Items

```javascript
export const DEMO_MENU_ITEMS: MenuItem[] = [
  // ... existing items
  {
    id: 'menu-11-1',
    restaurantId: 'rest-11', // Match restaurant ID
    name: 'Sushi Roll',
    description: 'Fresh salmon sushi roll',
    price: 850,
    category: 'Main Course',
    image: 'https://images.unsplash.com/...',
    available: true
  }
];
```

### Adding a Cuisine Type

```javascript
export const DEMO_CUISINES = [
  // ... existing cuisines
  'Japanese', // Add new cuisine
];
```

## 🔧 Troubleshooting

### Issue: Demo mode not activating

**Solution**: Check browser console for errors. Ensure:
- `demo-data.ts` is properly imported
- Service files have try-catch blocks
- localStorage is enabled in browser

### Issue: Created data not persisting

**Solution**: 
- Check if localStorage has space (5MB limit)
- Verify localStorage keys match service code
- Clear browser cache if corrupted

### Issue: Backend status always showing "unavailable"

**Solution**:
- Check `API_BASE_URL` in `api.ts`
- Verify backend server is running
- Check network tab in browser DevTools
- Ensure CORS is configured on backend

## 📊 Demo Data Statistics

### Pre-loaded Data Counts

- **Users**: 4 (1 admin, 1 manager, 2 customers)
- **Restaurants**: 10 (all in Rajshahi)
- **Menu Items**: 40+ items across all restaurants
- **Bookings**: 5 sample bookings (various statuses)
- **Reviews**: 5 sample reviews
- **Favourites**: 4 sample favourites

### Data Relationships

```
Users (4)
  ├─> Bookings (5)
  ├─> Reviews (5)
  └─> Favourites (4)

Restaurants (10)
  ├─> Menu Items (40+)
  ├─> Bookings (5)
  └─> Reviews (5)
```

## 🎓 Best Practices

### For Developers

1. **Always handle API errors gracefully**
   ```javascript
   try {
     return await api.get('/endpoint');
   } catch (error) {
     console.warn('Using fallback data');
     return FALLBACK_DATA;
   }
   ```

2. **Log fallback usage**
   ```javascript
   console.warn('Backend unavailable. Using demo data.');
   ```

3. **Maintain data consistency**
   - Ensure demo data matches backend structure
   - Update demo data when API changes
   - Test both modes regularly

4. **Document data dependencies**
   - Comment all fallback logic
   - Explain data relationships
   - Note any limitations

### For Testers

1. **Test both modes**
   - With backend connected
   - With backend disconnected (offline mode)

2. **Verify data persistence**
   - Create data in demo mode
   - Refresh page
   - Check if data persists

3. **Test edge cases**
   - Empty results
   - Large datasets
   - Invalid inputs

## 📚 Additional Resources

- [API Documentation](./API_TESTING_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Tutorial](./TUTORIAL.md)
- [Deployment Guide](./DEPLOYMENT_CHECKLIST.md)

## 🤝 Contributing

When adding new features:

1. Update service files with fallback logic
2. Add corresponding demo data
3. Update this guide
4. Test both backend and demo modes
5. Document any new localStorage keys

---

**Last Updated**: February 19, 2026
**Version**: 2.0.0
**Maintained by**: ReserveX Development Team
