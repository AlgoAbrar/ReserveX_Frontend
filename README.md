# ReserveX - Restaurant Reservation System

A comprehensive restaurant reservation system for Rajshahi, Bangladesh. Built as a Final Year Project with full backend integration and demo data fallback.

![ReserveX](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80)

##  Quick Start

### Demo Mode (No Backend Required)

The app includes comprehensive demo data and works fully offline:

```bash
# Install and run
pnpm install
pnpm dev
```

**Demo Credentials:**
```
Customer: customer@demo.com / demo123
Manager:  manager@demo.com  / demo123
Admin:    admin@demo.com    / demo123
```

All features work in demo mode with data stored locally!

##  Features

### For Customers
- **Browse Restaurants** - View all 10 restaurants in Rajshahi with detailed information
- **Advanced Search** - Filter by cuisine, price range, and rating
- **Real-time Booking** - Check availability and make reservations instantly
- **Favorites** - Save your favorite restaurants for quick access
- **Reviews** - Read and write reviews for restaurants you've visited
- **Dashboard** - Manage your bookings, favorites, and reviews in one place

### For Restaurant Managers
- **Restaurant Management** - Update restaurant details and menu
- **Booking Management** - View and manage all bookings
- **Menu Control** - Add, edit, or remove menu items
- **Analytics** - View booking statistics and customer insights

### For Admins
- **Platform Overview** - Monitor all restaurants and bookings
- **User Management** - Manage users and their roles
- **Restaurant Approval** - Approve or reject new restaurant registrations

##  Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **UI Components**: Radix UI + Material-UI
- **State Management**: React Context API
- **Backend API**: `https://reservex.vercel.app/v1`

##  Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Modern web browser

##  Installation

### 1. Clone or Download

```bash
# If using Git
git clone <repository-url>
cd reservex

# Or extract downloaded folder
cd reservex
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Configure Backend API

The backend API is already configured in `/src/app/services/api.ts`:

```typescript
export const API_BASE_URL = 'https://reservex.vercel.app/v1';
```

**To change the API URL** (for local development or different backend):

Edit `/src/app/services/api.ts`:

```typescript
// For local development
export const API_BASE_URL = 'http://localhost:5000/v1';

// For production
export const API_BASE_URL = 'https://your-backend-url.com/v1';
```

### 4. Run Development Server

```bash
pnpm dev
```

Open `http://localhost:5173` in your browser.

##  Build for Production

```bash
pnpm build
```

The build output will be in the `dist/` folder.

### Preview Production Build

```bash
pnpm preview
```

##  Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

Or use the Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure:
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
4. Deploy!

### Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

Or use the Netlify Dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Import your repository
3. Configure build settings
4. Deploy!

##  Backend API

### Required Endpoints

Your backend should implement these endpoints:

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile

#### Restaurants
- `GET /restaurants` - Get all restaurants (with filters)
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/:id/menu` - Get restaurant menu
- `GET /restaurants/:id/reviews` - Get restaurant reviews
- `GET /restaurants/cuisines` - Get available cuisines
- `GET /restaurants/:id/availability` - Check seat availability

#### Bookings
- `GET /bookings/my-bookings` - Get user's bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/cancel` - Cancel booking

#### Reviews
- `GET /reviews/my-reviews` - Get user's reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

#### Favourites
- `GET /favourites/my-favourites` - Get user's favourites
- `POST /favourites/toggle` - Toggle favourite status

### Authentication

The app uses JWT token-based authentication:
- Token stored in localStorage as `reservex_auth_token`
- All requests include: `Authorization: Bearer <token>`
- 401 errors redirect to login page

##  Project Structure

```
src/
├── app/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   ├── contexts/         # React Context (Auth, etc.)
│   ├── pages/            # Page components
│   │   ├── customer/     # Customer dashboard pages
│   │   ├── manager/      # Manager dashboard pages
│   │   └── admin/        # Admin dashboard pages
│   ├── services/         # API service layers
│   │   ├── api.ts        # Axios configuration
│   │   ├── auth.service.ts
│   │   ├── restaurant.service.ts
│   │   ├── booking.service.ts
│   │   ├── review.service.ts
│   │   └── favourite.service.ts
│   ├── lib/              # Utilities
│   ├── routes.tsx        # Route configuration
│   └── App.tsx           # Main app component
├── styles/               # Global styles
└── main.tsx             # Entry point
```

##  Key Features Implementation

### 1. Search & Filtering

```typescript
// In Restaurants page
const filters = {
  search: 'Aurora',
  cuisine: 'Continental',
  priceRange: '৳৳৳',
  minRating: 4.5
};

const restaurants = await restaurantService.getAllRestaurants(filters);
```

### 2. Making a Booking

```typescript
await bookingService.createBooking({
  restaurantId: 'rest-1',
  date: '2026-02-20',
  timeSlot: '6:00 PM - 8:00 PM',
  seats: 4,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+880 1711-123456',
  specialRequests: 'Window seat preferred'
});
```

### 3. Adding to Favourites

```typescript
await favouriteService.toggleFavourite(restaurantId);
```

### 4. Writing a Review

```typescript
await reviewService.createReview({
  restaurantId: 'rest-1',
  rating: 5,
  comment: 'Excellent food and service!'
});
```

##  Testing

### Test User Accounts

```
Customer:
Email: customer@test.com
Password: customer123

Manager:
Email: manager@test.com  
Password: manager123

Admin:
Email: admin@reservex.com
Password: admin123
```

##  Full Documentation

- **[DEMO_DATA_GUIDE.md](./DEMO_DATA_GUIDE.md)** - Complete guide to demo data and fallback system
- **[TUTORIAL.md](./TUTORIAL.md)** - Comprehensive deployment and development guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - API testing and integration

##  Demo Data System

ReserveX includes a comprehensive fallback system that works when the backend is unavailable:

### Features
- ✅ 10 complete restaurants with menus (40+ items)
- ✅ 4 demo users (customer, manager, admin)
- ✅ Sample bookings, reviews, and favourites
- ✅ Full CRUD operations in localStorage
- ✅ Automatic backend detection

### Demo Data Includes
```
📊 Pre-loaded Data:
├── 10 Restaurants (Rajshahi, Bangladesh)
├── 40+ Menu Items
├── 5 Sample Bookings
├── 5 Sample Reviews
└── 4 Sample Favourites

💾 localStorage Data (user-created):
├── New Bookings
├── New Reviews
└── New Favourites
```

**See [DEMO_DATA_GUIDE.md](./DEMO_DATA_GUIDE.md) for complete details**

##  License

This is a Junior Year Project for educational purposes.

##  Author

Built for Rajshahi, Bangladesh

##  Acknowledgments

- React Team for React 18
- Vercel for Vite
- Radix UI & Material-UI for components
- Tailwind CSS for styling

---

**Need Help?** Check [TUTORIAL.md](./TUTORIAL.md) for detailed guides!