import { Calendar, CheckCircle, Clock, MapPin, Users } from 'lucide-react';

// --- Types ---

export type Role = 'customer' | 'owner' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string; // Mock password
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  division: string;
  city: string;
  country: string;
  address: string;
  description: string;
  image: string;
  cuisine: string;
  totalSeats: number;
  rating: number;
  price: string;
  status: 'approved' | 'pending';
  available: boolean; // Added for backward compatibility
  location: string; // Added for backward compatibility
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // in BDT
  image: string;
  category: string;
}

export interface Booking {
  id: string;
  userId: string;
  restaurantId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  guests: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending'; // Added pending for compat
  createdAt: string;
  // properties for backward compatibility if needed (optional)
  restaurantName?: string;
  restaurantImage?: string;
  time?: string;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  date: string;
}

// --- Constants ---

export const TIME_SLOTS = [
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '6:00 PM - 8:00 PM',
  '8:00 PM - 10:00 PM',
];

// --- Initial Data ---

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Rahim Ahmed', role: 'customer', email: 'customer@reservex.com', password: 'password', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { id: '2', name: 'Owner Aurora', role: 'manager', email: 'manager@aurora.com', password: 'password', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: '3', name: 'System Admin', role: 'admin', email: 'admin@reservex.com', password: 'password', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
  // Add some fallback users for exact matches in legacy code
  { id: '4', name: 'John Doe', role: 'customer', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { id: '5', name: 'Urban Spice Manager', role: 'manager', email: 'manager@urbanspice.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
];

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    ownerId: '2',
    name: 'Aurora',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Shaheb Bazar, Rajshahi',
    location: 'Shaheb Bazar, Rajshahi', // Compat
    description: 'Experience fine dining with a panoramic view of the Padma river.',
    image: 'https://images.unsplash.com/photo-1767277680127-dc94441d576c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkYXJrJTIwbHV4dXJ5fGVufDF8fHx8MTc3MTE2ODkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Fine Dining',
    totalSeats: 60,
    rating: 4.9,
    price: '$$$$',
    status: 'approved',
    available: true
  },
  {
    id: '2',
    ownerId: '2', // Shared owner for demo
    name: 'Helium',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Kazihata, Rajshahi',
    location: 'Kazihata, Rajshahi',
    description: 'Modern rooftop ambiance perfect for evening gatherings.',
    image: 'https://images.unsplash.com/photo-1712849848587-f7428f18337a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwcmVzdGF1cmFudCUyMG5pZ2h0JTIwdmlld3xlbnwxfHx8fDE3NzExNjg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Rooftop Cafe',
    totalSeats: 45,
    rating: 4.7,
    price: '$$$',
    status: 'approved',
    available: true
  },
  {
    id: '3',
    ownerId: '4',
    name: 'Calisto',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Uposhahar, Rajshahi',
    location: 'Uposhahar, Rajshahi',
    description: 'A cozy spot for coffee lovers and continental breakfast.',
    image: 'https://images.unsplash.com/photo-1681073302782-10f85371deb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FmZSUyMGludGVyaW9yJTIwd2FybSUyMGxpZ2h0aW5nfGVufDF8fHx8MTc3MTE2MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Cafe & Continental',
    totalSeats: 50,
    rating: 4.5,
    price: '$$',
    status: 'approved',
    available: true
  },
  {
    id: '4',
    ownerId: '5',
    name: 'Chillox',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Alupatti, Rajshahi',
    location: 'Alupatti, Rajshahi',
    description: 'The best burgers in town with a vibrant atmosphere.',
    image: 'https://images.unsplash.com/photo-1763596304819-c97878428b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50JTIwbW9kZXJuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxMTY4OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Burger & Fast Food',
    totalSeats: 40,
    rating: 4.6,
    price: '$$',
    status: 'approved',
    available: true
  },
  {
    id: '5',
    ownerId: '6',
    name: 'Pizza Burg',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'New Market, Rajshahi',
    location: 'New Market, Rajshahi',
    description: 'Authentic stone-oven pizzas and cheesy delights.',
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&q=80&w=1080', // Fallback or generic
    cuisine: 'Pizza',
    totalSeats: 35,
    rating: 4.4,
    price: '$$',
    status: 'approved',
    available: true
  },
  {
    id: '6',
    ownerId: '7',
    name: 'Kebab House',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Station Road, Rajshahi',
    location: 'Station Road, Rajshahi',
    description: 'Succulent kebabs and traditional grill.',
    image: 'https://images.unsplash.com/photo-1631033286192-787635f7ba0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZWJhYiUyMGdyaWxsJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTE2ODkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Grill & BBQ',
    totalSeats: 55,
    rating: 4.3,
    price: '$$',
    status: 'approved',
    available: true
  },
  {
    id: '7',
    ownerId: '8',
    name: 'Kudos',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'C&B Mor, Rajshahi',
    location: 'C&B Mor, Rajshahi',
    description: 'Modern fusion cuisine for the experimental palate.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1080',
    cuisine: 'Fusion',
    totalSeats: 30,
    rating: 4.2,
    price: '$$$',
    status: 'approved',
    available: true
  },
  {
    id: '8',
    ownerId: '9',
    name: 'Backyard Kitchen',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Padma Garden, Rajshahi',
    location: 'Padma Garden, Rajshahi',
    description: 'Open air dining surrounded by nature.',
    image: 'https://images.unsplash.com/photo-1763208692631-00a41bbdc11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjByZXN0YXVyYW50JTIwb3V0ZG9vciUyMHNlYXRpbmclMjBuaWdodHxlbnwxfHx8fDE3NzExNjg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: 'Outdoor',
    totalSeats: 48,
    rating: 4.8,
    price: '$$$',
    status: 'approved',
    available: true
  },
  {
    id: '9',
    ownerId: '10',
    name: 'Hideout',
    division: 'Rajshahi',
    city: 'Rajshahi',
    country: 'Bangladesh',
    address: 'Talaimari, Rajshahi',
    location: 'Talaimari, Rajshahi',
    description: 'A secret getaway for peace and good food.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1080',
    cuisine: 'Cafe',
    totalSeats: 42,
    rating: 4.4,
    price: '$$',
    status: 'approved',
    available: true
  }
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Aurora
  { id: 'm1', restaurantId: '1', name: 'Grilled Chicken', description: 'Tender chicken grilled to perfection with herbs.', price: 350, category: 'Main', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=300' },
  { id: 'm2', restaurantId: '1', name: 'Beef Steak', description: 'Premium cut beef steak served with mashed potatoes.', price: 550, category: 'Main', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=300' },
  { id: 'm3', restaurantId: '1', name: 'Cold Coffee', description: 'Refreshing cold coffee with a scoop of vanilla ice cream.', price: 180, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=300' },
  
  // Chillox
  { id: 'm4', restaurantId: '4', name: 'Smash Burger', description: 'Classic smash burger with double cheese patty.', price: 220, category: 'Main', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300' },
  { id: 'm5', restaurantId: '4', name: 'French Fries', description: 'Crispy golden fries seasoned with salt.', price: 120, category: 'Sides', image: 'https://images.unsplash.com/photo-1630384060421-a4323ce66ad1?auto=format&fit=crop&q=80&w=300' },
  { id: 'm6', restaurantId: '4', name: 'Mojito', description: 'Virgin mojito with fresh mint and lime.', price: 150, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300' },

  // Generics for others
  { id: 'm7', restaurantId: '5', name: 'Pepperoni Pizza', description: 'Spicy pepperoni with mozzarella cheese.', price: 600, category: 'Main', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=300' },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: '1',
    restaurantId: '1', // Aurora
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: TIME_SLOTS[2], // 6-8 PM
    guests: 4,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    // Compat fields
    restaurantName: 'Aurora',
    restaurantImage: 'https://images.unsplash.com/photo-1767277680127-dc94441d576c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkYXJrJTIwbHV4dXJ5fGVufDF8fHx8MTc3MTE2ODkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '6:00 PM - 8:00 PM'
  }
];

// --- Mock Database Class ---

class MockDatabase {
  private users: User[];
  private restaurants: Restaurant[];
  private bookings: Booking[];
  private reviews: Review[];
  private menuItems: MenuItem[];

  constructor() {
    this.users = INITIAL_USERS;
    this.restaurants = INITIAL_RESTAURANTS;
    this.bookings = INITIAL_BOOKINGS;
    this.menuItems = INITIAL_MENU_ITEMS;
    this.reviews = [];
  }

  // --- Users ---
  getUsers() { return this.users; }
  
  login(email: string, role: Role): User | undefined {
    // Simple mock login matching email and role
    return this.users.find(u => u.email === email && u.role === role);
  }

  // --- Restaurants ---
  getRestaurants() { return this.restaurants; }
  
  getRestaurant(id: string) { return this.restaurants.find(r => r.id === id); }
  
  getRestaurantsByOwner(ownerId: string) { return this.restaurants.filter(r => r.ownerId === ownerId); }

  // --- Menu ---
  getMenu(restaurantId: string) {
    return this.menuItems.filter(item => item.restaurantId === restaurantId);
  }

  // --- Bookings & Availability ---
  
  getBookings() { return this.bookings; }
  
  getBookingsByUser(userId: string) { 
    return this.bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  getBookingsByRestaurant(restaurantId: string) {
    return this.bookings.filter(b => b.restaurantId === restaurantId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getAvailableSeats(restaurantId: string, date: string, timeSlot: string): number {
    const restaurant = this.getRestaurant(restaurantId);
    if (!restaurant) return 0;

    const existingBookings = this.bookings.filter(b => 
      b.restaurantId === restaurantId && 
      b.date === date && 
      b.timeSlot === timeSlot &&
      b.status === 'confirmed'
    );

    const bookedSeats = existingBookings.reduce((sum, b) => sum + b.guests, 0);
    return Math.max(0, restaurant.totalSeats - bookedSeats);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking | { error: string } {
    const available = this.getAvailableSeats(booking.restaurantId, booking.date, booking.timeSlot);
    
    if (available < booking.guests) {
      return { error: 'Not enough seats available.' };
    }

    const restaurant = this.getRestaurant(booking.restaurantId);

    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      restaurantName: restaurant?.name,
      restaurantImage: restaurant?.image,
      time: booking.timeSlot
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  cancelBooking(bookingId: string) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
    }
  }

  // --- Analytics ---
  getAdminStats() {
    return {
      users: this.users.length,
      restaurants: this.restaurants.length,
      bookings: this.bookings.length,
      revenue: this.bookings.filter(b => b.status === 'confirmed').length * 50, // Mock avg revenue
      pending: 5 // Mock pending
    };
  }
}

export const db = new MockDatabase();

// --- Export Constants for Backward Compatibility ---
export const RESTAURANTS = db.getRestaurants();
export const USERS = db.getUsers();
export const RESERVATIONS = db.getBookings(); // Note: Structure might differ slightly but fields added for compat
export const MANAGER_STATS = {
  totalSeats: 60,
  bookedToday: 4,
  availableNow: 56,
};
export const ADMIN_STATS = db.getAdminStats();
