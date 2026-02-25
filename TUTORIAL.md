# ReserveX - Complete Deployment & Development Tutorial

Welcome to the **ReserveX Restaurant Reservation System** tutorial! This guide will walk you through setting up, developing, and deploying your Final Year Project.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Project Structure](#project-structure)
5. [Backend API Integration](#backend-api-integration)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Building for Production](#building-for-production)
9. [Deployment Options](#deployment-options)
   - [Deploying to Vercel](#deploying-to-vercel)
   - [Deploying to Netlify](#deploying-to-netlify)
   - [Deploying to Custom Server](#deploying-to-custom-server)
10. [Backend Setup (if needed)](#backend-setup)
11. [Testing & Debugging](#testing--debugging)
12. [Common Issues & Solutions](#common-issues--solutions)
13. [Features Guide](#features-guide)

---

## 🎯 Project Overview

**ReserveX** is a comprehensive restaurant reservation system built for Rajshahi, Bangladesh. It features:

- **Three User Roles**: Customers, Restaurant Managers, and Admins
- **10 Real Restaurants** in Rajshahi with complete menus
- **Real-time Seat Availability**
- **Booking Management System**
- **Customer Dashboard** with favorites, reservations, and reviews
- **Restaurant Search & Filtering** by cuisine, price, and rating
- **Review & Rating System**
- **Responsive Design** for all devices

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v4
- Routing: React Router v7
- State Management: React Context API
- HTTP Client: Axios
- UI Components: Radix UI + Material-UI
- Backend: Your API at `https://reservex.vercel.app/v1`

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **pnpm** (recommended) or npm or yarn
   ```bash
   npm install -g pnpm
   ```
3. **Git** - [Download here](https://git-scm.com/)
4. **Code Editor** - VS Code recommended
5. **Modern Browser** - Chrome, Firefox, or Edge

---

## 🚀 Local Development Setup

### Step 1: Download the Project

If you received this as a download from Figma Make:

```bash
# Navigate to your projects directory
cd ~/Projects

# Extract the downloaded zip file or copy the project folder
# The folder should contain: src/, public/, package.json, etc.
```

If you have it in a Git repository:

```bash
git clone <your-repository-url>
cd reservex
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

This will install all required packages including React, Vite, Tailwind CSS, Axios, and all UI components.

### Step 3: Verify Installation

Check that everything installed correctly:

```bash
# Check Node version
node --version  # Should be v18 or higher

# Check pnpm version
pnpm --version

# List installed packages
pnpm list
```

---

## 📁 Project Structure

```
reservex/
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── components/     # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── layout/    # Layout components (Header, Footer)
│   │   │   └── ...        # Feature-specific components
│   │   ├── contexts/      # React Context (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Restaurants.tsx
│   │   │   ├── RestaurantDetail.tsx
│   │   │   └── dashboard/
│   │   ├── services/      # API service layers
│   │   │   ├── api.ts             # Axios configuration
│   │   │   ├── auth.service.ts    # Authentication API
│   │   │   ├── restaurant.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── review.service.ts
│   │   │   └── favourite.service.ts
│   │   ├── lib/           # Utilities and helpers
│   │   ├── routes.tsx     # React Router configuration
│   │   └── App.tsx        # Main app component
│   ├── styles/            # Global styles
│   │   ├── theme.css      # Tailwind theme configuration
│   │   └── fonts.css      # Font imports
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── TUTORIAL.md            # This file!
```

---

## 🔌 Backend API Integration

The application is configured to connect to your backend at:
```
https://reservex.vercel.app/v1
```

### API Configuration

The API configuration is located in `/src/app/services/api.ts`:

```typescript
export const API_BASE_URL = 'https://reservex.vercel.app/v1';
```

### Changing the API URL

If your backend URL is different, update it in `/src/app/services/api.ts`:

```typescript
// For local development backend
export const API_BASE_URL = 'http://localhost:5000/v1';

// For production backend
export const API_BASE_URL = 'https://your-backend-url.com/v1';
```

### API Endpoints Expected

Your backend should provide these endpoints:

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

**Restaurants:**
- `GET /restaurants` - Get all restaurants (with filters)
- `GET /restaurants/:id` - Get restaurant by ID
- `GET /restaurants/:id/menu` - Get restaurant menu
- `GET /restaurants/search` - Search restaurants
- `GET /restaurants/cuisines` - Get available cuisines
- `GET /restaurants/:id/availability` - Check seat availability
- `GET /restaurants/:id/reviews` - Get restaurant reviews
- `POST /restaurants` - Create restaurant (manager)
- `PUT /restaurants/:id` - Update restaurant (manager)
- `DELETE /restaurants/:id` - Delete restaurant (manager)

**Bookings:**
- `GET /bookings/my-bookings` - Get user's bookings
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/status` - Update booking status (manager)
- `GET /restaurants/:id/bookings` - Get restaurant bookings (manager)

**Reviews:**
- `GET /reviews/my-reviews` - Get user's reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `GET /reviews/can-review/:restaurantId` - Check if user can review

**Favourites:**
- `GET /favourites/my-favourites` - Get user's favourites
- `POST /favourites` - Add favourite
- `DELETE /favourites/:restaurantId` - Remove favourite
- `POST /favourites/toggle` - Toggle favourite
- `GET /favourites/check/:restaurantId` - Check if favourite

### Authentication Flow

The app uses JWT token-based authentication:

1. User logs in → Backend returns `{ user, token }`
2. Token stored in `localStorage` as `reservex_auth_token`
3. All API requests include: `Authorization: Bearer <token>`
4. On 401 error → User redirected to login

---

## ⚙️ Environment Configuration

### Creating Environment Files

Create a `.env` file in the root directory:

```bash
# .env
VITE_API_BASE_URL=https://reservex.vercel.app/v1
VITE_APP_NAME=ReserveX
VITE_APP_VERSION=1.0.0
```

### Using Environment Variables

Access them in your code:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

**Important:** 
- All Vite env variables must start with `VITE_`
- Don't commit `.env` to Git (add to `.gitignore`)
- Use `.env.example` for sharing template

---

## 🏃 Running the Application

### Development Mode

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

This will start the development server at `http://localhost:5173`

**Features in Development Mode:**
- Hot Module Replacement (HMR)
- Fast refresh on file changes
- Source maps for debugging
- TypeScript type checking

### Accessing the Application

1. Open browser to `http://localhost:5173`
2. You'll see the ReserveX homepage

### Test Accounts

Use these credentials to test (if your backend has seeded data):

**Customer Account:**
- Email: `customer@test.com`
- Password: `customer123`

**Manager Account:**
- Email: `manager@test.com`
- Password: `manager123`

**Admin Account:**
- Email: `admin@reservex.com`
- Password: `admin123`

---

## 🔨 Building for Production

### Build the Application

```bash
# Using pnpm
pnpm build

# Using npm
npm run build

# Using yarn
yarn build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build Locally

```bash
# Using pnpm
pnpm preview

# Using npm
npm run preview

# Using yarn
yarn preview
```

This serves the production build at `http://localhost:4173`

### Build Output

The `dist/` folder contains:
```
dist/
├── assets/           # Compiled JS, CSS, and assets
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── index.html        # Main HTML file
└── ...
```

---

## 🌐 Deployment Options

### Deploying to Vercel

Vercel is the recommended platform (same as your backend).

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` or `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` or `npm install`
5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://reservex.vercel.app/v1
   ```
6. Click "Deploy"

#### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `reservex.com`)
3. Update DNS records as instructed
4. SSL automatically configured

---

### Deploying to Netlify

#### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Method 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to Git repository
4. Configure:
   - **Build command**: `pnpm build` or `npm run build`
   - **Publish directory**: `dist`
5. Add Environment Variables
6. Click "Deploy site"

#### Netlify Configuration File

Create `netlify.toml` in root:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Deploying to Custom Server

#### Using Apache

1. Build the application:
   ```bash
   pnpm build
   ```

2. Upload `dist/` folder to server:
   ```bash
   scp -r dist/* user@yourserver.com:/var/www/html/
   ```

3. Configure Apache (`.htaccess`):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

#### Using Nginx

1. Build and upload files (same as above)

2. Configure Nginx (`/etc/nginx/sites-available/reservex`):
   ```nginx
   server {
     listen 80;
     server_name reservex.com www.reservex.com;
     root /var/www/reservex;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

3. Enable site and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/reservex /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Using PM2 + Serve

```bash
# Install serve globally
npm install -g serve pm2

# Serve the dist folder
pm2 serve dist 3000 --name reservex --spa

# Save PM2 configuration
pm2 save

# Auto-start on reboot
pm2 startup
```

---

## 🔧 Backend Setup

If you need to set up the backend from scratch:

### Expected Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hashed
  name VARCHAR(255) NOT NULL,
  role ENUM('customer', 'manager', 'admin') NOT NULL,
  phone VARCHAR(20),
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Restaurants Table:**
```sql
CREATE TABLE restaurants (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  location VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  division VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Bangladesh',
  description TEXT,
  image VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  opening_time VARCHAR(20),
  closing_time VARCHAR(20),
  total_seats INT NOT NULL,
  price_range VARCHAR(10),
  phone VARCHAR(20),
  manager_id VARCHAR(255),
  status ENUM('active', 'pending', 'blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);
```

**Menu Items Table:**
```sql
CREATE TABLE menu_items (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category ENUM('Appetizer', 'Main Course', 'Dessert', 'Drinks') NOT NULL,
  image VARCHAR(500),
  available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

**Bookings Table:**
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  seats INT NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Reviews Table:**
```sql
CREATE TABLE reviews (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Favourites Table:**
```sql
CREATE TABLE favourites (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favourite (user_id, restaurant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### Sample Backend Technologies

- **Node.js + Express** - REST API framework
- **PostgreSQL / MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads (images)

---

## 🧪 Testing & Debugging

### Browser DevTools

1. **Open DevTools**: F12 or Right-click → Inspect
2. **Console Tab**: View logs and errors
3. **Network Tab**: Monitor API calls
4. **React DevTools**: Install browser extension

### Common Debug Commands

```typescript
// In your code
console.log('Data:', data);
console.error('Error:', error);
console.table(arrayOfObjects);
```

### API Testing

Use these tools to test your backend:

1. **Postman** - [Download](https://www.postman.com/)
2. **Insomnia** - [Download](https://insomnia.rest/)
3. **Thunder Client** - VS Code extension

### Checking API Responses

```typescript
// In services/api.ts, add logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## ❗ Common Issues & Solutions

### Issue 1: "Cannot find module"

**Problem:** Import errors after installing packages

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Restart dev server
pnpm dev
```

### Issue 2: API Connection Failed

**Problem:** Network errors when calling backend

**Solutions:**
1. Check backend is running
2. Verify API URL in `/src/app/services/api.ts`
3. Check CORS settings on backend
4. Verify network connection

**Backend CORS Example (Express):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
```

### Issue 3: "401 Unauthorized"

**Problem:** API returns 401 error

**Solutions:**
1. Check token exists: `localStorage.getItem('reservex_auth_token')`
2. Verify token is valid (not expired)
3. Check Authorization header is sent
4. Login again to get fresh token

### Issue 4: Build Fails

**Problem:** `pnpm build` command fails

**Solutions:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix ESLint errors
npx eslint src --fix

# Clear cache and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Issue 5: Routing Not Working After Deploy

**Problem:** Page refresh gives 404 on deployed site

**Solution:** Configure server to handle SPA routing (see deployment sections above)

### Issue 6: Environment Variables Not Working

**Problem:** `import.meta.env.VITE_API_URL` is undefined

**Solutions:**
1. Ensure variable starts with `VITE_`
2. Restart dev server after changing `.env`
3. Check deployment platform has env vars set

---

## 📚 Features Guide

### For Customers

**1. Browse Restaurants**
- View all restaurants on `/restaurants` page
- Filter by cuisine, price range, rating
- Search by name or location

**2. View Restaurant Details**
- Click any restaurant to see full details
- View menu with prices in BDT
- Read reviews and ratings
- Check opening hours and contact info

**3. Make a Reservation**
- Click "Book a Table" button
- Select date, time slot, and number of seats
- Fill in contact details
- Submit booking

**4. Manage Bookings**
- Go to Dashboard → Reservations
- View upcoming, completed, and cancelled bookings
- Cancel bookings if needed
- View booking details

**5. Add Favourites**
- Click heart icon on any restaurant
- View all favourites in Dashboard → Favourites
- Quick access to favorite restaurants

**6. Write Reviews**
- Go to Dashboard → Reviews
- Rate restaurants (1-5 stars)
- Write detailed comments
- Edit or delete your reviews

**7. Update Profile**
- Go to Dashboard → Profile
- Update name, email, phone
- Change profile picture
- Update password

### For Restaurant Managers

**1. Manage Restaurant**
- View restaurant dashboard
- Update restaurant details
- Manage menu items
- Set opening hours and capacity

**2. Handle Bookings**
- View all bookings for your restaurant
- Confirm or cancel bookings
- Mark bookings as completed
- View booking statistics

**3. Menu Management**
- Add new menu items
- Update prices and descriptions
- Mark items as available/unavailable
- Upload item images

### For Admins

**1. Platform Overview**
- View all restaurants
- See all bookings across platform
- Monitor user activity
- View statistics and analytics

**2. Restaurant Management**
- Approve/reject new restaurants
- Block/unblock restaurants
- Manage restaurant status

**3. User Management**
- View all users
- Manage user roles
- Block problematic users

---

## 🎓 Additional Resources

### Documentation Links

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/docs/intro)

### Video Tutorials

- React + TypeScript: [YouTube Playlist](https://www.youtube.com/results?search_query=react+typescript+tutorial)
- Vite Setup: [YouTube](https://www.youtube.com/results?search_query=vite+tutorial)
- Deployment: [YouTube](https://www.youtube.com/results?search_query=deploy+react+app)

### Getting Help

1. **Check Documentation** - Read this tutorial thoroughly
2. **Search Error Messages** - Google the exact error
3. **Stack Overflow** - Ask specific questions
4. **GitHub Issues** - Check if it's a known issue
5. **Developer Community** - Join React Discord/Reddit

---

## 📝 Next Steps

After completing this tutorial:

1. ✅ Test all features thoroughly
2. ✅ Customize branding and colors
3. ✅ Add your own restaurants data
4. ✅ Set up analytics (Google Analytics)
5. ✅ Configure SSL certificate
6. ✅ Set up monitoring and error tracking
7. ✅ Write user documentation
8. ✅ Prepare project presentation

---

## 🎉 Congratulations!

You now have a complete understanding of the ReserveX application! This project demonstrates:

- ✅ Full-stack development skills
- ✅ Modern React architecture
- ✅ RESTful API integration
- ✅ User authentication & authorization
- ✅ Real-world application deployment
- ✅ Professional code organization

**Good luck with your Final Year Project! 🚀**

---

## 📞 Support

If you encounter issues:

1. Review this tutorial
2. Check the browser console for errors
3. Verify backend API is running
4. Test API endpoints with Postman
5. Check network connectivity

**Pro Tip:** Keep a development log of issues and solutions - it's great for your project documentation!

---

*Last Updated: February 19, 2026*
*Version: 1.0.0*
