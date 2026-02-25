/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO/FALLBACK DATA FOR RESERVEX SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file contains comprehensive demo data that will be used when the backend
 * API is unavailable or returns errors. This ensures the application remains
 * functional for testing and demonstration purposes.
 * 
 * USAGE: Import and use this data in service files when API calls fail
 * MAINTENANCE: Update this file when backend data structure changes
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Restaurant, MenuItem } from './restaurant.service';
import { Booking } from './booking.service';
import { Review } from './review.service';
import { Favourite } from './favourite.service';
import { User } from './auth.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO USERS
 * ═══════════════════════════════════════════════════════════════════════════
 * These users can be used for testing different roles in the application
 * - Customer: Can make bookings, add favourites, write reviews
 * - Manager: Can manage restaurants, tables, and bookings
 * - Admin: Has full system access
 */
export const DEMO_USERS: User[] = [
  {
    id: 'user-customer-1',
    email: 'customer@demo.com', // Login email for customer testing
    name: 'Rakib Hassan', // Display name
    role: 'customer', // User role determines accessible features
    phone: '+880 1711-999001', // Contact number
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'user-customer-2',
    email: 'customer2@demo.com',
    name: 'Fatima Ahmed',
    role: 'customer',
    phone: '+880 1711-999002',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 'user-manager-1',
    email: 'manager@demo.com', // Login email for manager testing
    name: 'Karim Rahman', // Manager name
    role: 'manager', // Manager role for restaurant management
    phone: '+880 1711-999003',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    createdAt: new Date('2023-12-01').toISOString()
  },
  {
    id: 'user-admin-1',
    email: 'admin@demo.com', // Login email for admin testing
    name: 'System Admin', // Administrator name
    role: 'admin', // Admin role for full system access
    phone: '+880 1711-999000',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    createdAt: new Date('2023-10-01').toISOString()
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO RESTAURANTS (10 Real Restaurants in Rajshahi, Bangladesh)
 * ═══════════════════════════════════════════════════════════════════════════
 * Complete restaurant data with all required fields
 * Each restaurant represents a real establishment in Rajshahi
 */
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1', // Unique restaurant identifier
    name: 'Aurora', // Restaurant name
    cuisine: 'Continental', // Type of food served (used for filtering)
    location: 'Shaheb Bazar, Rajshahi', // Specific address
    city: 'Rajshahi', // City name (for location filtering)
    division: 'Rajshahi', // Administrative division
    country: 'Bangladesh', // Country name
    description: 'Aurora is a premium continental dining restaurant in Rajshahi offering fine dining experience with modern ambiance and fresh ingredients.', // Full description
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Main restaurant image
    rating: 4.8, // Average rating (1-5 scale)
    totalReviews: 124, // Number of reviews received
    openingTime: '11:00 AM', // Daily opening time
    closingTime: '11:00 PM', // Daily closing time
    totalSeats: 50, // Maximum seating capacity
    priceRange: '৳৳৳', // Price indicator (৳ = budget, ৳৳ = moderate, ৳৳৳ = expensive)
    phone: '+880 1711-123456', // Contact phone number
    managerId: 'user-manager-1', // ID of the manager user
    status: 'active', // Restaurant status (active/pending/blocked)
    createdAt: new Date('2023-11-01').toISOString() // Creation timestamp
  },
  {
    id: 'rest-2',
    name: 'Helium',
    cuisine: 'Fusion',
    location: 'Alokar Mor, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Helium brings you an innovative fusion dining experience, combining Asian and Western cuisines in a contemporary setting.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    rating: 4.6,
    totalReviews: 89,
    openingTime: '12:00 PM',
    closingTime: '10:30 PM',
    totalSeats: 40,
    priceRange: '৳৳',
    phone: '+880 1711-123457',
    managerId: 'user-manager-1',
    status: 'active',
    createdAt: new Date('2023-11-15').toISOString()
  },
  {
    id: 'rest-3',
    name: 'Calisto',
    cuisine: 'Italian',
    location: 'Laxmipur, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Authentic Italian cuisine in the heart of Rajshahi. Calisto offers handmade pasta, wood-fired pizzas, and classic Italian desserts.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    rating: 4.7,
    totalReviews: 156,
    openingTime: '1:00 PM',
    closingTime: '11:00 PM',
    totalSeats: 45,
    priceRange: '৳৳৳',
    phone: '+880 1711-123458',
    status: 'active',
    createdAt: new Date('2023-10-20').toISOString()
  },
  {
    id: 'rest-4',
    name: 'Chillox',
    cuisine: 'Fast Food',
    location: 'Ghoda Mara, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Your favorite fast food destination! Chillox serves up delicious burgers, wraps, and shakes in a vibrant, casual setting.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    rating: 4.3,
    totalReviews: 201,
    openingTime: '10:00 AM',
    closingTime: '12:00 AM',
    totalSeats: 60,
    priceRange: '৳',
    phone: '+880 1711-123459',
    status: 'active',
    createdAt: new Date('2024-01-05').toISOString()
  },
  {
    id: 'rest-5',
    name: 'Pizza Burg',
    cuisine: 'Pizza & Burger',
    location: 'C&B Mor, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Specializing in gourmet pizzas and premium burgers, Pizza Burg combines quality ingredients with creative recipes.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    rating: 4.5,
    totalReviews: 178,
    openingTime: '11:00 AM',
    closingTime: '11:30 PM',
    totalSeats: 55,
    priceRange: '৳৳',
    phone: '+880 1711-123460',
    status: 'active',
    createdAt: new Date('2023-12-10').toISOString()
  },
  {
    id: 'rest-6',
    name: 'Kebab House',
    cuisine: 'Mughlai',
    location: 'Station Road, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Experience the rich heritage of Mughlai cuisine at Kebab House. We serve traditional kebabs, biryanis, and curries.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    rating: 4.6,
    totalReviews: 143,
    openingTime: '12:00 PM',
    closingTime: '11:00 PM',
    totalSeats: 48,
    priceRange: '৳৳',
    phone: '+880 1711-123461',
    status: 'active',
    createdAt: new Date('2023-11-25').toISOString()
  },
  {
    id: 'rest-7',
    name: 'Kudos',
    cuisine: 'Chinese',
    location: 'Sapura, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Kudos brings authentic Chinese flavors to Rajshahi with a menu featuring dim sum, noodles, and traditional wok dishes.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
    rating: 4.4,
    totalReviews: 112,
    openingTime: '12:00 PM',
    closingTime: '10:00 PM',
    totalSeats: 42,
    priceRange: '৳৳',
    phone: '+880 1711-123462',
    status: 'active',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 'rest-8',
    name: 'North Burg',
    cuisine: 'Burger',
    location: 'Binodpur, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'North Burg is your go-to spot for juicy, handcrafted burgers. We use 100% pure beef and fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    rating: 4.5,
    totalReviews: 167,
    openingTime: '11:00 AM',
    closingTime: '11:00 PM',
    totalSeats: 50,
    priceRange: '৳',
    phone: '+880 1711-123463',
    status: 'active',
    createdAt: new Date('2023-12-15').toISOString()
  },
  {
    id: 'rest-9',
    name: 'Backyard Kitchen',
    cuisine: 'BBQ',
    location: 'Boalia, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'Backyard Kitchen offers a rustic BBQ experience with smoked meats, grilled specialties, and live outdoor cooking.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    rating: 4.7,
    totalReviews: 134,
    openingTime: '5:00 PM',
    closingTime: '12:00 AM',
    totalSeats: 38,
    priceRange: '৳৳৳',
    phone: '+880 1711-123464',
    status: 'active',
    createdAt: new Date('2023-10-30').toISOString()
  },
  {
    id: 'rest-10',
    name: 'Hideout',
    cuisine: 'Café',
    location: 'Talaimari, Rajshahi',
    city: 'Rajshahi',
    division: 'Rajshahi',
    country: 'Bangladesh',
    description: 'A cozy café hideaway perfect for coffee lovers, book readers, and those seeking a peaceful ambiance.',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
    rating: 4.6,
    totalReviews: 98,
    openingTime: '8:00 AM',
    closingTime: '10:00 PM',
    totalSeats: 35,
    priceRange: '৳৳',
    phone: '+880 1711-123465',
    status: 'active',
    createdAt: new Date('2024-01-10').toISOString()
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO CUISINES
 * ═══════════════════════════════════════════════════════════════════════════
 * List of all available cuisines for filtering
 * Should match the cuisines used in DEMO_RESTAURANTS
 */
export const DEMO_CUISINES = [
  'Continental', // Western-style fine dining
  'Fusion', // Mixed Asian-Western cuisine
  'Italian', // Pasta, pizza, Italian dishes
  'Fast Food', // Quick service food
  'Pizza & Burger', // Specialty pizza and burger restaurant
  'Mughlai', // Traditional Indian/Pakistani cuisine
  'Chinese', // Chinese dishes
  'Burger', // Burger specialist
  'BBQ', // Barbecue and grilled items
  'Café' // Coffee shop and light meals
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO MENU ITEMS
 * ═══════════════════════════════════════════════════════════════════════════
 * Sample menu items for each restaurant
 * Each restaurant has 8-12 items across different categories
 * Categories: Appetizer, Main Course, Dessert, Drinks
 */
export const DEMO_MENU_ITEMS: MenuItem[] = [
  // Aurora (Continental) - Restaurant ID: rest-1
  {
    id: 'menu-1-1',
    restaurantId: 'rest-1',
    name: 'Caesar Salad', // Item name
    description: 'Fresh romaine lettuce with parmesan, croutons, and classic Caesar dressing', // Detailed description
    price: 450, // Price in BDT (Bangladeshi Taka)
    category: 'Appetizer', // Menu category
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', // Item image
    available: true // Availability status (true = in stock, false = out of stock)
  },
  {
    id: 'menu-1-2',
    restaurantId: 'rest-1',
    name: 'Mushroom Soup',
    description: 'Creamy mushroom soup with herbs and garlic bread',
    price: 380,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-3',
    restaurantId: 'rest-1',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection with lemon butter sauce and vegetables',
    price: 1200,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-4',
    restaurantId: 'rest-1',
    name: 'Beef Tenderloin',
    description: 'Premium beef tenderloin with mashed potatoes and red wine reduction',
    price: 1500,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-5',
    restaurantId: 'rest-1',
    name: 'Chicken Cordon Bleu',
    description: 'Breaded chicken breast stuffed with ham and cheese',
    price: 950,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-6',
    restaurantId: 'rest-1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    price: 480,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-7',
    restaurantId: 'rest-1',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 520,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80',
    available: true
  },
  {
    id: 'menu-1-8',
    restaurantId: 'rest-1',
    name: 'Fresh Juice',
    description: 'Choice of orange, apple, or mixed fruit juice',
    price: 250,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    available: true
  },

  // Helium (Fusion) - Restaurant ID: rest-2
  {
    id: 'menu-2-1',
    restaurantId: 'rest-2',
    name: 'Asian Tapas',
    description: 'Selection of small fusion plates with Asian flavors',
    price: 680,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80',
    available: true
  },
  {
    id: 'menu-2-2',
    restaurantId: 'rest-2',
    name: 'Fusion Spring Rolls',
    description: 'Crispy spring rolls with unique fusion filling',
    price: 420,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80',
    available: true
  },
  {
    id: 'menu-2-3',
    restaurantId: 'rest-2',
    name: 'Teriyaki Beef Bowl',
    description: 'Tender beef with teriyaki sauce over jasmine rice',
    price: 890,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    available: true
  },
  {
    id: 'menu-2-4',
    restaurantId: 'rest-2',
    name: 'Thai Basil Chicken',
    description: 'Spicy stir-fried chicken with Thai basil and vegetables',
    price: 750,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&q=80',
    available: true
  },
  {
    id: 'menu-2-5',
    restaurantId: 'rest-2',
    name: 'Mango Sticky Rice',
    description: 'Sweet sticky rice with fresh mango and coconut cream',
    price: 380,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1597582876229-cb6ef9eaf5e0?w=400&q=80',
    available: true
  },
  {
    id: 'menu-2-6',
    restaurantId: 'rest-2',
    name: 'Thai Iced Tea',
    description: 'Sweet and creamy Thai-style iced tea',
    price: 220,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1547825407-4a0e0e51a04d?w=400&q=80',
    available: true
  },

  // Calisto (Italian) - Restaurant ID: rest-3
  {
    id: 'menu-3-1',
    restaurantId: 'rest-3',
    name: 'Bruschetta',
    description: 'Toasted bread topped with tomatoes, basil, and garlic',
    price: 420,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-2',
    restaurantId: 'rest-3',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    price: 480,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-3',
    restaurantId: 'rest-3',
    name: 'Margherita Pizza',
    description: 'Wood-fired pizza with tomato sauce, mozzarella, and fresh basil',
    price: 850,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-4',
    restaurantId: 'rest-3',
    name: 'Carbonara Pasta',
    description: 'Creamy pasta with bacon, egg, and parmesan cheese',
    price: 780,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-5',
    restaurantId: 'rest-3',
    name: 'Lasagna',
    description: 'Layered pasta with meat sauce, béchamel, and cheese',
    price: 920,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-6',
    restaurantId: 'rest-3',
    name: 'Panna Cotta',
    description: 'Italian custard dessert with berry compote',
    price: 450,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    available: true
  },
  {
    id: 'menu-3-7',
    restaurantId: 'rest-3',
    name: 'Italian Soda',
    description: 'Sparkling water with fruit syrup',
    price: 200,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    available: true
  },

  // Chillox (Fast Food) - Restaurant ID: rest-4
  {
    id: 'menu-4-1',
    restaurantId: 'rest-4',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, cheese, and special sauce',
    price: 350,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    available: true
  },
  {
    id: 'menu-4-2',
    restaurantId: 'rest-4',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings with choice of sauce',
    price: 480,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80',
    available: true
  },
  {
    id: 'menu-4-3',
    restaurantId: 'rest-4',
    name: 'Chicken Wrap',
    description: 'Grilled chicken wrap with vegetables and mayo',
    price: 320,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80',
    available: true
  },
  {
    id: 'menu-4-4',
    restaurantId: 'rest-4',
    name: 'French Fries',
    description: 'Crispy golden french fries',
    price: 180,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
    available: true
  },
  {
    id: 'menu-4-5',
    restaurantId: 'rest-4',
    name: 'Chocolate Shake',
    description: 'Thick chocolate milkshake with whipped cream',
    price: 280,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80',
    available: true
  },
  {
    id: 'menu-4-6',
    restaurantId: 'rest-4',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and toppings',
    price: 320,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    available: true
  },

  // Pizza Burg (Pizza & Burger) - Restaurant ID: rest-5
  {
    id: 'menu-5-1',
    restaurantId: 'rest-5',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with pepperoni and mozzarella cheese',
    price: 720,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    available: true
  },
  {
    id: 'menu-5-2',
    restaurantId: 'rest-5',
    name: 'BBQ Chicken Pizza',
    description: 'Pizza with BBQ chicken, onions, and cilantro',
    price: 780,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    available: true
  },
  {
    id: 'menu-5-3',
    restaurantId: 'rest-5',
    name: 'Double Cheese Burger',
    description: 'Two beef patties with double cheese and special sauce',
    price: 580,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
    available: true
  },
  {
    id: 'menu-5-4',
    restaurantId: 'rest-5',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 220,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&q=80',
    available: true
  },
  {
    id: 'menu-5-5',
    restaurantId: 'rest-5',
    name: 'Mozzarella Sticks',
    description: 'Fried mozzarella sticks with marinara sauce',
    price: 380,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80',
    available: true
  },
  {
    id: 'menu-5-6',
    restaurantId: 'rest-5',
    name: 'Soft Drink',
    description: 'Choice of cola, sprite, or fanta',
    price: 120,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80',
    available: true
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO BOOKINGS
 * ═══════════════════════════════════════════════════════════════════════════
 * Sample bookings for different statuses and dates
 * Statuses: pending (awaiting confirmation), confirmed (approved), completed (past date), cancelled
 */
export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    restaurantId: 'rest-1', // Aurora restaurant
    userId: 'user-customer-1', // Customer who made the booking
    date: '2024-02-25', // Reservation date (YYYY-MM-DD format)
    timeSlot: '7:00 PM', // Reserved time slot
    seats: 4, // Number of seats booked
    status: 'confirmed', // Booking status
    customerName: 'Rakib Hassan', // Customer name for the reservation
    customerEmail: 'customer@demo.com', // Contact email
    customerPhone: '+880 1711-999001', // Contact phone
    specialRequests: 'Window seat please', // Special requests/notes
    createdAt: new Date('2024-02-10').toISOString(), // When booking was made
    updatedAt: new Date('2024-02-10').toISOString(), // Last update time
    restaurant: { // Populated restaurant data for display
      id: 'rest-1',
      name: 'Aurora',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      location: 'Shaheb Bazar, Rajshahi'
    }
  },
  {
    id: 'booking-2',
    restaurantId: 'rest-3', // Calisto restaurant
    userId: 'user-customer-1',
    date: '2024-02-22',
    timeSlot: '8:00 PM',
    seats: 2,
    status: 'pending', // Awaiting restaurant confirmation
    customerName: 'Rakib Hassan',
    customerEmail: 'customer@demo.com',
    customerPhone: '+880 1711-999001',
    specialRequests: 'Anniversary dinner',
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
    restaurant: {
      id: 'rest-3',
      name: 'Calisto',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      location: 'Laxmipur, Rajshahi'
    }
  },
  {
    id: 'booking-3',
    restaurantId: 'rest-5', // Pizza Burg
    userId: 'user-customer-1',
    date: '2024-02-18', // Past date
    timeSlot: '6:30 PM',
    seats: 6,
    status: 'completed', // Reservation was fulfilled
    customerName: 'Rakib Hassan',
    customerEmail: 'customer@demo.com',
    customerPhone: '+880 1711-999001',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-18').toISOString(),
    restaurant: {
      id: 'rest-5',
      name: 'Pizza Burg',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      location: 'C&B Mor, Rajshahi'
    }
  },
  {
    id: 'booking-4',
    restaurantId: 'rest-9', // Backyard Kitchen
    userId: 'user-customer-2',
    date: '2024-02-23',
    timeSlot: '7:30 PM',
    seats: 5,
    status: 'confirmed',
    customerName: 'Fatima Ahmed',
    customerEmail: 'customer2@demo.com',
    customerPhone: '+880 1711-999002',
    specialRequests: 'Outdoor seating if available',
    createdAt: new Date('2024-02-12').toISOString(),
    updatedAt: new Date('2024-02-13').toISOString(),
    restaurant: {
      id: 'rest-9',
      name: 'Backyard Kitchen',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      location: 'Boalia, Rajshahi'
    }
  },
  {
    id: 'booking-5',
    restaurantId: 'rest-2', // Helium
    userId: 'user-customer-1',
    date: '2024-02-15', // Past date
    timeSlot: '8:00 PM',
    seats: 3,
    status: 'cancelled', // Customer cancelled
    customerName: 'Rakib Hassan',
    customerEmail: 'customer@demo.com',
    customerPhone: '+880 1711-999001',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-08').toISOString(),
    restaurant: {
      id: 'rest-2',
      name: 'Helium',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
      location: 'Alokar Mor, Rajshahi'
    }
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO REVIEWS
 * ═══════════════════════════════════════════════════════════════════════════
 * Sample customer reviews for restaurants
 * Each review includes rating (1-5 stars) and comment
 */
export const DEMO_REVIEWS: Review[] = [
  {
    id: 'review-1',
    restaurantId: 'rest-1', // Aurora
    userId: 'user-customer-1',
    userName: 'Rakib Hassan', // Reviewer's name
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', // Reviewer's avatar
    rating: 5, // Star rating (1-5)
    comment: 'Excellent food and service! The beef tenderloin was cooked to perfection. Highly recommended for special occasions.', // Review text
    createdAt: new Date('2024-02-01').toISOString(), // Review submission date
    restaurant: { // Populated restaurant data
      id: 'rest-1',
      name: 'Aurora',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
    }
  },
  {
    id: 'review-2',
    restaurantId: 'rest-1', // Aurora
    userId: 'user-customer-2',
    userName: 'Fatima Ahmed',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 4,
    comment: 'Great ambiance and delicious food. The only downside was a bit of wait time during peak hours.',
    createdAt: new Date('2024-01-28').toISOString(),
    restaurant: {
      id: 'rest-1',
      name: 'Aurora',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
    }
  },
  {
    id: 'review-3',
    restaurantId: 'rest-3', // Calisto
    userId: 'user-customer-1',
    userName: 'Rakib Hassan',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    comment: 'Best Italian restaurant in Rajshahi! The pasta was authentic and the tiramisu was heavenly.',
    createdAt: new Date('2024-02-05').toISOString(),
    restaurant: {
      id: 'rest-3',
      name: 'Calisto',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
    }
  },
  {
    id: 'review-4',
    restaurantId: 'rest-5', // Pizza Burg
    userId: 'user-customer-2',
    userName: 'Fatima Ahmed',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 4,
    comment: 'Good quality pizza and burgers at reasonable prices. Great for family dining.',
    createdAt: new Date('2024-02-03').toISOString(),
    restaurant: {
      id: 'rest-5',
      name: 'Pizza Burg',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'
    }
  },
  {
    id: 'review-5',
    restaurantId: 'rest-9', // Backyard Kitchen
    userId: 'user-customer-1',
    userName: 'Rakib Hassan',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    comment: 'Amazing BBQ experience! The outdoor setting and live cooking add to the atmosphere. Must try the smoked ribs!',
    createdAt: new Date('2024-01-30').toISOString(),
    restaurant: {
      id: 'rest-9',
      name: 'Backyard Kitchen',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'
    }
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO FAVOURITES
 * ═══════════════════════════════════════════════════════════════════════════
 * Sample favourite restaurants for users
 * Allows quick access to preferred restaurants
 */
export const DEMO_FAVOURITES: Favourite[] = [
  {
    id: 'fav-1',
    userId: 'user-customer-1', // User who favorited
    restaurantId: 'rest-1', // Aurora
    createdAt: new Date('2024-01-20').toISOString(), // When favorited
    restaurant: { // Populated restaurant data for quick display
      id: 'rest-1',
      name: 'Aurora',
      cuisine: 'Continental',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      rating: 4.8,
      location: 'Shaheb Bazar, Rajshahi',
      priceRange: '৳৳৳'
    }
  },
  {
    id: 'fav-2',
    userId: 'user-customer-1',
    restaurantId: 'rest-3', // Calisto
    createdAt: new Date('2024-01-25').toISOString(),
    restaurant: {
      id: 'rest-3',
      name: 'Calisto',
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      rating: 4.7,
      location: 'Laxmipur, Rajshahi',
      priceRange: '৳৳৳'
    }
  },
  {
    id: 'fav-3',
    userId: 'user-customer-1',
    restaurantId: 'rest-9', // Backyard Kitchen
    createdAt: new Date('2024-02-01').toISOString(),
    restaurant: {
      id: 'rest-9',
      name: 'Backyard Kitchen',
      cuisine: 'BBQ',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      rating: 4.7,
      location: 'Boalia, Rajshahi',
      priceRange: '৳৳৳'
    }
  },
  {
    id: 'fav-4',
    userId: 'user-customer-2',
    restaurantId: 'rest-10', // Hideout
    createdAt: new Date('2024-02-05').toISOString(),
    restaurant: {
      id: 'rest-10',
      name: 'Hideout',
      cuisine: 'Café',
      image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
      rating: 4.6,
      location: 'Talaimari, Rajshahi',
      priceRange: '৳৳'
    }
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * Utility functions to filter and retrieve demo data
 */

/**
 * Get menu items for a specific restaurant
 * @param restaurantId - The ID of the restaurant
 * @returns Array of menu items for that restaurant
 */
export function getDemoMenuByRestaurantId(restaurantId: string): MenuItem[] {
  return DEMO_MENU_ITEMS.filter(item => item.restaurantId === restaurantId);
}

/**
 * Get bookings for a specific user
 * @param userId - The ID of the user
 * @returns Array of bookings made by that user
 */
export function getDemoBookingsByUserId(userId: string): Booking[] {
  return DEMO_BOOKINGS.filter(booking => booking.userId === userId);
}

/**
 * Get reviews for a specific restaurant
 * @param restaurantId - The ID of the restaurant
 * @returns Array of reviews for that restaurant
 */
export function getDemoReviewsByRestaurantId(restaurantId: string): Review[] {
  return DEMO_REVIEWS.filter(review => review.restaurantId === restaurantId);
}

/**
 * Get favourites for a specific user
 * @param userId - The ID of the user
 * @returns Array of favourite restaurants for that user
 */
export function getDemoFavouritesByUserId(userId: string): Favourite[] {
  return DEMO_FAVOURITES.filter(fav => fav.userId === userId);
}

/**
 * Check if a restaurant is in user's favourites
 * @param userId - The ID of the user
 * @param restaurantId - The ID of the restaurant
 * @returns true if restaurant is favourited, false otherwise
 */
export function isDemoFavourite(userId: string, restaurantId: string): boolean {
  return DEMO_FAVOURITES.some(
    fav => fav.userId === userId && fav.restaurantId === restaurantId
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO AUTHENTICATION CREDENTIALS
 * ═══════════════════════════════════════════════════════════════════════════
 * For testing purposes when backend is unavailable
 * Use these credentials to test different user roles
 */
export const DEMO_CREDENTIALS = {
  customer: {
    email: 'customer@demo.com',
    password: 'demo123', // In demo mode, any password works
    user: DEMO_USERS[0]
  },
  manager: {
    email: 'manager@demo.com',
    password: 'demo123',
    user: DEMO_USERS[2]
  },
  admin: {
    email: 'admin@demo.com',
    password: 'demo123',
    user: DEMO_USERS[3]
  }
};
