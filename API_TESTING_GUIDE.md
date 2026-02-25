# ReserveX API Testing Guide

This guide will help you test your backend API to ensure it's compatible with the ReserveX frontend.

## 📋 Prerequisites

- Your backend API running at `https://reservex.vercel.app/v1` (or your custom URL)
- API testing tool (Postman, Insomnia, or Thunder Client)
- Valid test data in your database

## 🔑 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

**Login Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "customer@test.com",
  "password": "customer123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "user-1",
    "email": "customer@test.com",
    "name": "Demo Customer",
    "role": "customer",
    "phone": "+880 1711-123456",
    "createdAt": "2026-02-19T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🧪 Test Cases by Feature

### 1. Authentication Endpoints

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@test.com",
  "password": "password123",
  "name": "New User",
  "role": "customer",
  "phone": "+880 1711-999999"
}
```

**Expected:** 201 Created with user object and token

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Expected:** 200 OK with user object

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+880 1711-888888"
}
```

**Expected:** 200 OK with updated user object

### 2. Restaurant Endpoints

#### Get All Restaurants
```http
GET /restaurants
```

**Expected:** 200 OK with array of restaurants

#### Get Restaurants with Filters
```http
GET /restaurants?cuisine=Continental&priceRange=৳৳৳&minRating=4.5
```

**Expected:** 200 OK with filtered restaurants

#### Search Restaurants
```http
GET /restaurants/search?q=Aurora
```

**Expected:** 200 OK with matching restaurants

#### Get Restaurant by ID
```http
GET /restaurants/rest-1
```

**Expected Response:**
```json
{
  "id": "rest-1",
  "name": "Aurora",
  "cuisine": "Continental",
  "location": "Shaheb Bazar, Rajshahi",
  "city": "Rajshahi",
  "division": "Rajshahi",
  "country": "Bangladesh",
  "description": "...",
  "image": "https://...",
  "rating": 4.8,
  "totalReviews": 124,
  "openingTime": "11:00 AM",
  "closingTime": "11:00 PM",
  "totalSeats": 50,
  "priceRange": "৳৳৳",
  "phone": "+880 1711-123456",
  "status": "active",
  "createdAt": "2026-02-19T10:00:00.000Z"
}
```

#### Get Restaurant Menu
```http
GET /restaurants/rest-1/menu
```

**Expected:** 200 OK with array of menu items

**Sample Menu Item:**
```json
{
  "id": "menu-1-1",
  "restaurantId": "rest-1",
  "name": "Garlic Bread",
  "description": "Toasted bread with garlic butter and herbs",
  "price": 180,
  "category": "Appetizer",
  "image": "https://...",
  "available": true
}
```

#### Get Available Cuisines
```http
GET /restaurants/cuisines
```

**Expected:** 200 OK with array of cuisine names

```json
["Continental", "Fusion", "Italian", "Fast Food", "Pizza & Burger", "Mughlai", "Chinese", "Burger", "BBQ", "Café"]
```

#### Check Seat Availability
```http
GET /restaurants/rest-1/availability?date=2026-02-20&timeSlot=6:00 PM - 8:00 PM
```

**Expected Response:**
```json
{
  "availableSeats": 25
}
```

### 3. Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "rest-1",
  "date": "2026-02-20",
  "timeSlot": "6:00 PM - 8:00 PM",
  "seats": 4,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+880 1711-123456",
  "specialRequests": "Window seat preferred"
}
```

**Expected:** 201 Created with booking object

#### Get My Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": "booking-1",
    "restaurantId": "rest-1",
    "userId": "user-1",
    "date": "2026-02-20",
    "timeSlot": "6:00 PM - 8:00 PM",
    "seats": 4,
    "status": "pending",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+880 1711-123456",
    "specialRequests": "Window seat preferred",
    "createdAt": "2026-02-19T10:00:00.000Z",
    "updatedAt": "2026-02-19T10:00:00.000Z",
    "restaurant": {
      "id": "rest-1",
      "name": "Aurora",
      "image": "https://...",
      "location": "Shaheb Bazar, Rajshahi"
    }
  }
]
```

#### Get Booking by ID
```http
GET /bookings/booking-1
Authorization: Bearer <token>
```

**Expected:** 200 OK with booking object

#### Cancel Booking
```http
PUT /bookings/booking-1/cancel
Authorization: Bearer <token>
```

**Expected:** 200 OK with updated booking (status: "cancelled")

#### Update Booking Status (Manager/Admin)
```http
PUT /bookings/booking-1/status
Authorization: Bearer <manager-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Expected:** 200 OK with updated booking

### 4. Review Endpoints

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "rest-1",
  "rating": 5,
  "comment": "Excellent food and service! Highly recommended."
}
```

**Expected:** 201 Created with review object

#### Get My Reviews
```http
GET /reviews/my-reviews
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": "review-1",
    "restaurantId": "rest-1",
    "userId": "user-1",
    "userName": "Demo Customer",
    "rating": 5,
    "comment": "Excellent food and service!",
    "createdAt": "2026-02-19T10:00:00.000Z",
    "restaurant": {
      "id": "rest-1",
      "name": "Aurora",
      "image": "https://..."
    }
  }
]
```

#### Get Restaurant Reviews
```http
GET /restaurants/rest-1/reviews
```

**Expected:** 200 OK with array of reviews

#### Update Review
```http
PUT /reviews/review-1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review text"
}
```

**Expected:** 200 OK with updated review

#### Delete Review
```http
DELETE /reviews/review-1
Authorization: Bearer <token>
```

**Expected:** 204 No Content or 200 OK

### 5. Favourite Endpoints

#### Get My Favourites
```http
GET /favourites/my-favourites
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": "fav-1",
    "userId": "user-1",
    "restaurantId": "rest-1",
    "createdAt": "2026-02-19T10:00:00.000Z",
    "restaurant": {
      "id": "rest-1",
      "name": "Aurora",
      "cuisine": "Continental",
      "image": "https://...",
      "rating": 4.8,
      "location": "Shaheb Bazar, Rajshahi",
      "priceRange": "৳৳৳"
    }
  }
]
```

#### Toggle Favourite
```http
POST /favourites/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "rest-1"
}
```

**Expected Response:**
```json
{
  "isFavourite": true
}
```

#### Check if Favourite
```http
GET /favourites/check/rest-1
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "isFavourite": true
}
```

#### Remove Favourite
```http
DELETE /favourites/rest-1
Authorization: Bearer <token>
```

**Expected:** 204 No Content or 200 OK

## ✅ Testing Checklist

Use this checklist to verify your backend API:

### Authentication
- [ ] User can register with valid data
- [ ] Registration rejects duplicate emails
- [ ] User can login with correct credentials
- [ ] Login rejects incorrect credentials
- [ ] `/auth/me` returns current user with valid token
- [ ] `/auth/me` returns 401 with invalid/missing token
- [ ] User can update profile
- [ ] Logout clears session (if stateful)

### Restaurants
- [ ] Get all restaurants returns array
- [ ] Get restaurants with filters works correctly
- [ ] Search restaurants by name/cuisine works
- [ ] Get single restaurant by ID works
- [ ] Get restaurant menu returns menu items
- [ ] Get cuisines returns unique cuisine list
- [ ] Check availability returns correct seat count
- [ ] Invalid restaurant ID returns 404

### Bookings
- [ ] Create booking with valid data succeeds
- [ ] Create booking validates seat availability
- [ ] Create booking requires authentication
- [ ] Get my bookings returns user's bookings only
- [ ] Bookings include restaurant details
- [ ] Cancel booking updates status
- [ ] Cannot cancel already cancelled booking
- [ ] Cannot cancel completed booking

### Reviews
- [ ] Create review with valid data succeeds
- [ ] Create review requires authentication
- [ ] Get my reviews returns user's reviews only
- [ ] Get restaurant reviews returns all reviews for that restaurant
- [ ] Update review works for review owner
- [ ] Cannot update someone else's review
- [ ] Delete review works for review owner
- [ ] Rating must be between 1-5

### Favourites
- [ ] Add favourite requires authentication
- [ ] Toggle favourite adds when not exists
- [ ] Toggle favourite removes when exists
- [ ] Get my favourites returns user's favourites only
- [ ] Favourites include restaurant details
- [ ] Check if favourite returns boolean
- [ ] Remove favourite works

## 🚨 Common Errors to Handle

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Restaurant not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## 🔧 Debugging Tips

### 1. Check Request Format
- Ensure `Content-Type: application/json` header
- Verify JSON is valid (no trailing commas)
- Check all required fields are present

### 2. Verify Token
- Copy token exactly (no extra spaces)
- Check token hasn't expired
- Ensure Bearer prefix: `Bearer <token>`

### 3. Check CORS
If frontend can't connect:
```javascript
// Backend CORS config should include:
{
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}
```

### 4. Database Check
- Verify restaurants table has data
- Check user exists before testing bookings
- Ensure foreign keys are set up correctly

### 5. Log Everything
```javascript
// Add logging in your backend:
console.log('Request body:', req.body);
console.log('Auth user:', req.user);
console.log('Query params:', req.query);
```

## 📊 Test Data Requirements

### Minimum Data Needed

1. **Users**
   - 1 Admin user
   - 1 Manager user  
   - 2+ Customer users

2. **Restaurants**
   - 10 restaurants (as specified)
   - Each with complete data

3. **Menu Items**
   - 12+ items per restaurant
   - Mix of all categories (Appetizer, Main Course, Dessert, Drinks)

4. **Test Bookings**
   - Some confirmed
   - Some pending
   - Some cancelled

5. **Reviews**
   - At least 3 reviews per restaurant
   - Various ratings (1-5 stars)

## 🎯 Performance Tests

### Response Time Targets
- Get all restaurants: < 500ms
- Get restaurant by ID: < 200ms
- Create booking: < 300ms
- Search: < 400ms

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://reservex.vercel.app/v1/restaurants
```

## 📝 API Documentation Template

Document your actual API endpoints:

```markdown
## POST /auth/login

Authenticates user and returns JWT token.

**Request:**
{
  "email": "string",
  "password": "string"
}

**Response:** 200 OK
{
  "user": {...},
  "token": "string"
}

**Errors:**
- 400: Invalid credentials
- 500: Server error
```

## ✨ Best Practices

1. **Always validate input** - Check all required fields
2. **Use proper HTTP status codes** - 200, 201, 400, 401, 404, 500
3. **Return consistent error format** - Same structure for all errors
4. **Include related data** - Return restaurant details with bookings
5. **Implement pagination** - For large lists
6. **Rate limit** - Prevent abuse
7. **Log errors** - Track issues in production

---

**Happy Testing! 🚀**

If you find any issues, check the console logs in both frontend and backend.
