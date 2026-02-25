// Mock database with localStorage persistence
// Simulates SQL relationships for ReserveX

export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: 'customer' | 'manager' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  city: string;
  division: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  totalReviews: number;
  openingTime: string;
  closingTime: string;
  totalSeats: number;
  priceRange: string;
  phone: string;
  managerId?: string;
  status: 'active' | 'pending' | 'blocked';
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Drinks';
  image: string;
  available: boolean;
}

export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  timeSlot: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favourite {
  id: string;
  userId: string;
  restaurantId: string;
  createdAt: string;
}

class Database {
  private KEYS = {
    USERS: 'reservex_users',
    RESTAURANTS: 'reservex_restaurants',
    MENU_ITEMS: 'reservex_menu_items',
    BOOKINGS: 'reservex_bookings',
    REVIEWS: 'reservex_reviews',
    FAVOURITES: 'reservex_favourites',
    CURRENT_USER: 'reservex_current_user',
    INITIALIZED: 'reservex_initialized'
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    const initialized = localStorage.getItem(this.KEYS.INITIALIZED);
    if (!initialized) {
      this.seedDatabase();
      localStorage.setItem(this.KEYS.INITIALIZED, 'true');
    }
  }

  private seedDatabase() {
    // Seed admin user
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@reservex.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    // Seed demo customer
    const demoCustomer: User = {
      id: 'customer-1',
      email: 'customer@test.com',
      password: 'customer123',
      name: 'Demo Customer',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    this.setData(this.KEYS.USERS, [adminUser, demoCustomer]);
    this.setData(this.KEYS.RESTAURANTS, this.getInitialRestaurants());
    this.setData(this.KEYS.MENU_ITEMS, this.getInitialMenuItems());
    this.setData(this.KEYS.BOOKINGS, []);
    this.setData(this.KEYS.REVIEWS, this.getInitialReviews());
    this.setData(this.KEYS.FAVOURITES, []);
  }

  private getInitialRestaurants(): Restaurant[] {
    return [
      {
        id: 'rest-1',
        name: 'Aurora',
        cuisine: 'Continental',
        location: 'Shaheb Bazar, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Aurora is a premium continental dining restaurant in Rajshahi offering fine dining experience with modern ambiance and fresh ingredients. Our expert chefs craft exquisite dishes that blend international flavors with local touches.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        rating: 4.8,
        totalReviews: 124,
        openingTime: '11:00 AM',
        closingTime: '11:00 PM',
        totalSeats: 50,
        priceRange: '৳৳৳',
        phone: '+880 1711-123456',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-2',
        name: 'Helium',
        cuisine: 'Fusion',
        location: 'Alokar Mor, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Helium brings you an innovative fusion dining experience, combining Asian and Western cuisines in a contemporary setting. Perfect for those who love culinary adventures.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        rating: 4.6,
        totalReviews: 89,
        openingTime: '12:00 PM',
        closingTime: '10:30 PM',
        totalSeats: 40,
        priceRange: '৳৳',
        phone: '+880 1711-123457',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-3',
        name: 'Calisto',
        cuisine: 'Italian',
        location: 'Laxmipur, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Authentic Italian cuisine in the heart of Rajshahi. Calisto offers handmade pasta, wood-fired pizzas, and classic Italian desserts in a cozy Mediterranean atmosphere.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        rating: 4.7,
        totalReviews: 156,
        openingTime: '1:00 PM',
        closingTime: '11:00 PM',
        totalSeats: 45,
        priceRange: '৳৳৳',
        phone: '+880 1711-123458',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-4',
        name: 'Chillox',
        cuisine: 'Fast Food',
        location: 'Ghoda Mara, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Your favorite fast food destination! Chillox serves up delicious burgers, wraps, and shakes in a vibrant, casual setting perfect for hanging out with friends.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        rating: 4.3,
        totalReviews: 201,
        openingTime: '10:00 AM',
        closingTime: '12:00 AM',
        totalSeats: 60,
        priceRange: '৳',
        phone: '+880 1711-123459',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-5',
        name: 'Pizza Burg',
        cuisine: 'Pizza & Burger',
        location: 'C&B Mor, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Specializing in gourmet pizzas and premium burgers, Pizza Burg combines quality ingredients with creative recipes to deliver unforgettable flavors.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        rating: 4.5,
        totalReviews: 178,
        openingTime: '11:00 AM',
        closingTime: '11:30 PM',
        totalSeats: 55,
        priceRange: '৳৳',
        phone: '+880 1711-123460',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-6',
        name: 'Kebab House',
        cuisine: 'Mughlai',
        location: 'Station Road, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Experience the rich heritage of Mughlai cuisine at Kebab House. We serve traditional kebabs, biryanis, and curries with authentic spices and cooking methods.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        rating: 4.6,
        totalReviews: 143,
        openingTime: '12:00 PM',
        closingTime: '11:00 PM',
        totalSeats: 48,
        priceRange: '৳৳',
        phone: '+880 1711-123461',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-7',
        name: 'Kudos',
        cuisine: 'Chinese',
        location: 'Sapura, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Kudos brings authentic Chinese flavors to Rajshahi with a menu featuring dim sum, noodles, and traditional wok dishes prepared by experienced Chinese chefs.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        rating: 4.4,
        totalReviews: 112,
        openingTime: '12:00 PM',
        closingTime: '10:00 PM',
        totalSeats: 42,
        priceRange: '৳৳',
        phone: '+880 1711-123462',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-8',
        name: 'North Burg',
        cuisine: 'Burger',
        location: 'Binodpur, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'North Burg is your go-to spot for juicy, handcrafted burgers. We use 100% pure beef and fresh ingredients to create burger masterpieces.',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
        rating: 4.5,
        totalReviews: 167,
        openingTime: '11:00 AM',
        closingTime: '11:00 PM',
        totalSeats: 50,
        priceRange: '৳',
        phone: '+880 1711-123463',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-9',
        name: 'Backyard Kitchen',
        cuisine: 'BBQ',
        location: 'Boalia, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'Backyard Kitchen offers a rustic BBQ experience with smoked meats, grilled specialties, and live outdoor cooking in a garden setting.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        rating: 4.7,
        totalReviews: 134,
        openingTime: '5:00 PM',
        closingTime: '12:00 AM',
        totalSeats: 38,
        priceRange: '৳৳৳',
        phone: '+880 1711-123464',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rest-10',
        name: 'Hideout',
        cuisine: 'Café',
        location: 'Talaimari, Rajshahi',
        city: 'Rajshahi',
        division: 'Rajshahi',
        country: 'Bangladesh',
        description: 'A cozy café hideaway perfect for coffee lovers, book readers, and those seeking a peaceful ambiance. Hideout serves specialty coffee, pastries, and light meals.',
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
        rating: 4.6,
        totalReviews: 98,
        openingTime: '8:00 AM',
        closingTime: '10:00 PM',
        totalSeats: 35,
        priceRange: '৳৳',
        phone: '+880 1711-123465',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getInitialMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    
    // Aurora (Continental)
    const auroraMenu = [
      { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 180, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&q=80' },
      { name: 'Chicken Wings', description: 'Crispy wings with choice of sauce', price: 320, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80' },
      { name: 'Nachos Supreme', description: 'Loaded nachos with cheese and toppings', price: 250, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80' },
      { name: 'Grilled Chicken', description: 'Tender grilled chicken with vegetables', price: 450, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80' },
      { name: 'Beef Steak', description: 'Premium beef steak with mashed potatoes', price: 750, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80' },
      { name: 'Pasta Alfredo', description: 'Creamy alfredo pasta with chicken', price: 520, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80' },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 300, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80' },
      { name: 'Ice Cream Sundae', description: 'Three scoops with toppings', price: 220, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
      { name: 'Brownie Delight', description: 'Chocolate brownie with ice cream', price: 250, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
      { name: 'Cold Coffee', description: 'Iced coffee with cream', price: 200, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&q=80' },
      { name: 'Fresh Lime Soda', description: 'Refreshing lime with soda', price: 120, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1582106245687-0febf374d2ea?w=400&q=80' },
      { name: 'Virgin Mojito', description: 'Mint mojito mocktail', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80' }
    ];

    auroraMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-1-${index + 1}`,
        restaurantId: 'rest-1',
        ...item,
        available: true
      });
    });

    // Helium (Fusion)
    const heliumMenu = [
      { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 150, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80' },
      { name: 'Tempura Prawns', description: 'Lightly battered fried prawns', price: 380, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1625944527988-e8f170e08f90?w=400&q=80' },
      { name: 'Bruschetta', description: 'Tomato basil on toasted bread', price: 220, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80' },
      { name: 'Teriyaki Chicken', description: 'Grilled chicken with teriyaki glaze', price: 480, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1630851840155-9c90909948ea?w=400&q=80' },
      { name: 'Thai Red Curry', description: 'Spicy Thai curry with rice', price: 420, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80' },
      { name: 'Fusion Steak Bowl', description: 'Asian-inspired steak rice bowl', price: 650, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
      { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 280, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
      { name: 'Mango Sticky Rice', description: 'Thai sweet rice with mango', price: 240, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?w=400&q=80' },
      { name: 'Cheesecake', description: 'New York style cheesecake', price: 320, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1533134242116-f16925ad2c13?w=400&q=80' },
      { name: 'Green Tea Latte', description: 'Matcha green tea latte', price: 220, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80' },
      { name: 'Mango Lassi', description: 'Creamy mango yogurt drink', price: 160, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1601725488146-a9dd5a2f1a2c?w=400&q=80' },
      { name: 'Iced Tea', description: 'Peach flavored iced tea', price: 140, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' }
    ];

    heliumMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-2-${index + 1}`,
        restaurantId: 'rest-2',
        ...item,
        available: true
      });
    });

    // Calisto (Italian)
    const calistoMenu = [
      { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil', price: 280, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=80' },
      { name: 'Calamari Fritti', description: 'Crispy fried squid rings', price: 350, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
      { name: 'Minestrone Soup', description: 'Classic Italian vegetable soup', price: 200, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },
      { name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella', price: 520, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
      { name: 'Spaghetti Carbonara', description: 'Creamy pasta with bacon', price: 480, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80' },
      { name: 'Chicken Parmigiana', description: 'Breaded chicken with marinara', price: 620, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&q=80' },
      { name: 'Panna Cotta', description: 'Italian cream dessert with berries', price: 260, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
      { name: 'Tiramisu Classic', description: 'Coffee-soaked ladyfingers dessert', price: 300, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
      { name: 'Gelato', description: 'Italian ice cream, three scoops', price: 240, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&q=80' },
      { name: 'Espresso', description: 'Strong Italian coffee', price: 150, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80' },
      { name: 'Italian Soda', description: 'Flavored sparkling water', price: 130, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80' },
      { name: 'Cappuccino', description: 'Espresso with steamed milk', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' }
    ];

    calistoMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-3-${index + 1}`,
        restaurantId: 'rest-3',
        ...item,
        available: true
      });
    });

    // Chillox (Fast Food)
    const chilloxMenu = [
      { name: 'Chicken Nuggets', description: 'Crispy golden nuggets with sauce', price: 180, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
      { name: 'French Fries', description: 'Crispy golden fries', price: 120, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80' },
      { name: 'Onion Rings', description: 'Crispy battered onion rings', price: 140, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80' },
      { name: 'Smash Burger', description: 'Classic smashed beef burger', price: 220, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { name: 'Double Beef Burger', description: 'Two beef patties with cheese', price: 350, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80' },
      { name: 'Chicken Wrap', description: 'Grilled chicken in tortilla wrap', price: 260, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80' },
      { name: 'Soft Serve Ice Cream', description: 'Vanilla or chocolate soft serve', price: 90, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
      { name: 'Brownie Sundae', description: 'Brownie with ice cream and fudge', price: 180, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
      { name: 'Apple Pie', description: 'Warm apple pie slice', price: 120, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&q=80' },
      { name: 'Coca Cola', description: 'Chilled Coke', price: 60, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80' },
      { name: 'Chocolate Milkshake', description: 'Thick chocolate shake', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80' },
      { name: 'Fresh Lemonade', description: 'Homemade lemonade', price: 100, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe6ad1?w=400&q=80' }
    ];

    chilloxMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-4-${index + 1}`,
        restaurantId: 'rest-4',
        ...item,
        available: true
      });
    });

    // Pizza Burg (Pizza & Burger)
    const pizzaBurgMenu = [
      { name: 'Mozzarella Sticks', description: 'Fried mozzarella with marinara', price: 220, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&q=80' },
      { name: 'Buffalo Wings', description: 'Spicy buffalo chicken wings', price: 280, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80' },
      { name: 'Caesar Salad', description: 'Romaine with Caesar dressing', price: 200, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80' },
      { name: 'Pepperoni Pizza', description: 'Classic pepperoni pizza', price: 480, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80' },
      { name: 'BBQ Chicken Pizza', description: 'BBQ sauce with chicken toppings', price: 520, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
      { name: 'Gourmet Beef Burger', description: 'Premium beef with special sauce', price: 380, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
      { name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 220, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80' },
      { name: 'New York Cheesecake', description: 'Creamy classic cheesecake', price: 280, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1533134242116-f16925ad2c13?w=400&q=80' },
      { name: 'Cookie Dough Sundae', description: 'Ice cream with cookie dough', price: 250, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80' },
      { name: 'Iced Coffee', description: 'Cold brew coffee', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&q=80' },
      { name: 'Strawberry Smoothie', description: 'Fresh strawberry smoothie', price: 200, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80' },
      { name: 'Pepsi', description: 'Chilled Pepsi', price: 60, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80' }
    ];

    pizzaBurgMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-5-${index + 1}`,
        restaurantId: 'rest-5',
        ...item,
        available: true
      });
    });

    // Kebab House (Mughlai)
    const kebabHouseMenu = [
      { name: 'Seekh Kebab', description: 'Spiced minced meat skewers', price: 280, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
      { name: 'Chicken Tikka', description: 'Marinated grilled chicken pieces', price: 320, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
      { name: 'Samosa Chaat', description: 'Samosa with chickpea curry', price: 150, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
      { name: 'Chicken Biryani', description: 'Aromatic rice with spiced chicken', price: 380, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
      { name: 'Mutton Korma', description: 'Rich mutton curry with spices', price: 520, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
      { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 450, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
      { name: 'Gulab Jamun', description: 'Sweet milk solid balls in syrup', price: 120, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80' },
      { name: 'Ras Malai', description: 'Soft cheese patties in sweet milk', price: 150, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80' },
      { name: 'Kulfi', description: 'Traditional Indian ice cream', price: 100, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80' },
      { name: 'Masala Chai', description: 'Spiced tea with milk', price: 60, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1597318112817-b7e9c755b1c5?w=400&q=80' },
      { name: 'Lassi', description: 'Sweet yogurt drink', price: 120, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1601725488146-a9dd5a2f1a2c?w=400&q=80' },
      { name: 'Fresh Lime Water', description: 'Refreshing lime soda', price: 80, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1582106245687-0febf374d2ea?w=400&q=80' }
    ];

    kebabHouseMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-6-${index + 1}`,
        restaurantId: 'rest-6',
        ...item,
        available: true
      });
    });

    // Kudos (Chinese)
    const kudosMenu = [
      { name: 'Vegetable Spring Rolls', description: 'Crispy rolls with vegetables', price: 160, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80' },
      { name: 'Chicken Dumplings', description: 'Steamed chicken dumplings', price: 220, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80' },
      { name: 'Hot & Sour Soup', description: 'Spicy and tangy soup', price: 180, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },
      { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 420, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80' },
      { name: 'Sweet & Sour Pork', description: 'Crispy pork in sweet sauce', price: 480, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400&q=80' },
      { name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 350, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80' },
      { name: 'Mango Pudding', description: 'Sweet mango dessert', price: 160, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
      { name: 'Sesame Balls', description: 'Fried sesame seed balls', price: 140, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1587248720327-0ca37f6c179c?w=400&q=80' },
      { name: 'Fortune Cookies', description: 'Crispy cookies with fortune', price: 80, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1598214019257-c5a5b80e5b4b?w=400&q=80' },
      { name: 'Jasmine Tea', description: 'Fragrant jasmine tea', price: 100, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1563822249366-83166b09b309?w=400&q=80' },
      { name: 'Chinese Herbal Tea', description: 'Traditional herbal tea', price: 120, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1597318112817-b7e9c755b1c5?w=400&q=80' },
      { name: 'Lychee Juice', description: 'Sweet lychee drink', price: 150, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80' }
    ];

    kudosMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-7-${index + 1}`,
        restaurantId: 'rest-7',
        ...item,
        available: true
      });
    });

    // North Burg (Burger)
    const northBurgMenu = [
      { name: 'Loaded Fries', description: 'Fries with cheese and bacon', price: 200, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1630431341973-02e8ba229940?w=400&q=80' },
      { name: 'Chicken Tenders', description: 'Crispy chicken strips', price: 220, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
      { name: 'Jalapeño Poppers', description: 'Stuffed jalapeño peppers', price: 180, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f1f?w=400&q=80' },
      { name: 'Classic Beef Burger', description: 'Juicy beef patty with toppings', price: 280, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { name: 'BBQ Bacon Burger', description: 'BBQ sauce with crispy bacon', price: 380, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80' },
      { name: 'Chicken Burger Deluxe', description: 'Grilled chicken with special sauce', price: 320, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
      { name: 'Oreo Shake', description: 'Oreo cookie milkshake', price: 200, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1619158401952-69aa0b36fc82?w=400&q=80' },
      { name: 'Apple Pie Ala Mode', description: 'Warm apple pie with ice cream', price: 180, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&q=80' },
      { name: 'Chocolate Fudge Sundae', description: 'Ice cream with hot fudge', price: 220, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
      { name: '7UP', description: 'Chilled 7UP', price: 60, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80' },
      { name: 'Vanilla Shake', description: 'Classic vanilla milkshake', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80' },
      { name: 'Orange Juice', description: 'Fresh squeezed orange juice', price: 120, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80' }
    ];

    northBurgMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-8-${index + 1}`,
        restaurantId: 'rest-8',
        ...item,
        available: true
      });
    });

    // Backyard Kitchen (BBQ)
    const backyardMenu = [
      { name: 'BBQ Chicken Wings', description: 'Smoky grilled wings', price: 320, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80' },
      { name: 'Pulled Pork Sliders', description: 'Mini pulled pork sandwiches', price: 280, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1619881589331-adf8e492ed8a?w=400&q=80' },
      { name: 'Corn on the Cob', description: 'Grilled corn with butter', price: 120, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&q=80' },
      { name: 'BBQ Ribs Platter', description: 'Fall-off-the-bone pork ribs', price: 720, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
      { name: 'Smoked Brisket', description: 'Slow-smoked beef brisket', price: 680, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80' },
      { name: 'Grilled Chicken Platter', description: 'Full chicken with sides', price: 550, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80' },
      { name: 'Pecan Pie', description: 'Southern style pecan pie', price: 240, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1562007908-17c67e878c88?w=400&q=80' },
      { name: 'Banana Pudding', description: 'Classic banana pudding dessert', price: 200, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
      { name: 'Cinnamon Roll', description: 'Warm cinnamon roll', price: 160, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=400&q=80' },
      { name: 'Sweet Tea', description: 'Southern sweet iced tea', price: 100, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
      { name: 'Root Beer Float', description: 'Root beer with vanilla ice cream', price: 180, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1541658016979-f3662717d976?w=400&q=80' },
      { name: 'Fresh Limeade', description: 'Homemade limeade', price: 120, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe6ad1?w=400&q=80' }
    ];

    backyardMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-9-${index + 1}`,
        restaurantId: 'rest-9',
        ...item,
        available: true
      });
    });

    // Hideout (Café)
    const hideoutMenu = [
      { name: 'Avocado Toast', description: 'Smashed avocado on sourdough', price: 240, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80' },
      { name: 'Croissant', description: 'Buttery French croissant', price: 160, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
      { name: 'Bagel & Cream Cheese', description: 'Toasted bagel with cream cheese', price: 180, category: 'Appetizer' as const, image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80' },
      { name: 'Club Sandwich', description: 'Triple decker club sandwich', price: 320, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
      { name: 'Quiche Lorraine', description: 'Savory egg pie with bacon', price: 280, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1608367879542-d85d59231921?w=400&q=80' },
      { name: 'Caesar Wrap', description: 'Chicken Caesar in tortilla', price: 260, category: 'Main Course' as const, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80' },
      { name: 'Red Velvet Cake', description: 'Classic red velvet slice', price: 220, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80' },
      { name: 'Blueberry Muffin', description: 'Freshly baked muffin', price: 140, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80' },
      { name: 'Cookie Platter', description: 'Assorted cookies', price: 180, category: 'Dessert' as const, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80' },
      { name: 'Caramel Latte', description: 'Espresso with caramel and steamed milk', price: 220, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80' },
      { name: 'Flat White', description: 'Smooth espresso with microfoam', price: 200, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' },
      { name: 'Iced Matcha Latte', description: 'Cold matcha with milk', price: 240, category: 'Drinks' as const, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80' }
    ];

    hideoutMenu.forEach((item, index) => {
      menuItems.push({
        id: `menu-10-${index + 1}`,
        restaurantId: 'rest-10',
        ...item,
        available: true
      });
    });

    return menuItems;
  }

  private getInitialReviews(): Review[] {
    return [
      {
        id: 'rev-1',
        restaurantId: 'rest-1',
        userId: 'customer-1',
        userName: 'Sarah Ahmed',
        rating: 5,
        comment: 'Absolutely loved the ambiance and the food was exceptional! The beef steak was cooked to perfection.',
        createdAt: '2026-02-10T18:30:00Z'
      },
      {
        id: 'rev-2',
        restaurantId: 'rest-1',
        userId: 'customer-2',
        userName: 'Mahmud Hasan',
        rating: 4,
        comment: 'Great continental food. Service was quick and staff was very friendly.',
        createdAt: '2026-02-12T19:45:00Z'
      },
      {
        id: 'rev-3',
        restaurantId: 'rest-4',
        userId: 'customer-3',
        userName: 'Tasnia Rahman',
        rating: 5,
        comment: 'Best burgers in Rajshahi! Love the casual vibe here.',
        createdAt: '2026-02-14T20:15:00Z'
      }
    ];
  }

  // Generic data methods
  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User methods
  getUsers(): User[] {
    return this.getData<User>(this.KEYS.USERS);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setData(this.KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.setData(this.KEYS.USERS, users);
      return users[index];
    }
    return undefined;
  }

  // Auth methods
  login(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Restaurant methods
  getRestaurants(): Restaurant[] {
    return this.getData<Restaurant>(this.KEYS.RESTAURANTS);
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.getRestaurants().find(r => r.id === id);
  }

  searchRestaurants(query: string): Restaurant[] {
    const restaurants = this.getRestaurants();
    const lowerQuery = query.toLowerCase();
    return restaurants.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) ||
      r.cuisine.toLowerCase().includes(lowerQuery) ||
      r.location.toLowerCase().includes(lowerQuery)
    );
  }

  filterRestaurantsByCuisine(cuisine: string): Restaurant[] {
    return this.getRestaurants().filter(r => 
      r.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }

  // Menu methods
  getMenuItems(): MenuItem[] {
    return this.getData<MenuItem>(this.KEYS.MENU_ITEMS);
  }

  getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
    return this.getMenuItems().filter(m => m.restaurantId === restaurantId);
  }

  getMenuItemsByCategory(restaurantId: string, category: MenuItem['category']): MenuItem[] {
    return this.getMenuItemsByRestaurant(restaurantId).filter(m => m.category === category);
  }

  // Booking methods
  getBookings(): Booking[] {
    return this.getData<Booking>(this.KEYS.BOOKINGS);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.getBookings().filter(b => b.userId === userId);
  }

  getBookingsByRestaurant(restaurantId: string): Booking[] {
    return this.getBookings().filter(b => b.restaurantId === restaurantId);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    this.setData(this.KEYS.BOOKINGS, bookings);
    return newBooking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { 
        ...bookings[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setData(this.KEYS.BOOKINGS, bookings);
      return bookings[index];
    }
    return undefined;
  }

  getAvailableSeats(restaurantId: string, date: string, timeSlot: string): number {
    const restaurant = this.getRestaurantById(restaurantId);
    if (!restaurant) return 0;

    const confirmedBookings = this.getBookings().filter(b =>
      b.restaurantId === restaurantId &&
      b.date === date &&
      b.timeSlot === timeSlot &&
      (b.status === 'confirmed' || b.status === 'pending')
    );

    const bookedSeats = confirmedBookings.reduce((sum, b) => sum + b.seats, 0);
    return restaurant.totalSeats - bookedSeats;
  }

  // Review methods
  getReviews(): Review[] {
    return this.getData<Review>(this.KEYS.REVIEWS);
  }

  getReviewsByRestaurant(restaurantId: string): Review[] {
    return this.getReviews().filter(r => r.restaurantId === restaurantId);
  }

  getReviewsByUser(userId: string): Review[] {
    return this.getReviews().filter(r => r.userId === userId);
  }

  createReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    this.setData(this.KEYS.REVIEWS, reviews);

    // Update restaurant rating
    this.updateRestaurantRating(review.restaurantId);
    
    return newReview;
  }

  deleteReview(id: string): boolean {
    const reviews = this.getReviews();
    const review = reviews.find(r => r.id === id);
    if (!review) return false;

    const filtered = reviews.filter(r => r.id !== id);
    this.setData(this.KEYS.REVIEWS, filtered);

    // Update restaurant rating
    this.updateRestaurantRating(review.restaurantId);
    
    return true;
  }

  private updateRestaurantRating(restaurantId: string): void {
    const reviews = this.getReviewsByRestaurant(restaurantId);
    const restaurants = this.getRestaurants();
    const restaurantIndex = restaurants.findIndex(r => r.id === restaurantId);
    
    if (restaurantIndex !== -1) {
      const totalReviews = reviews.length;
      const avgRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      
      restaurants[restaurantIndex].rating = Math.round(avgRating * 10) / 10;
      restaurants[restaurantIndex].totalReviews = totalReviews;
      this.setData(this.KEYS.RESTAURANTS, restaurants);
    }
  }

  // Favourite methods
  getFavourites(): Favourite[] {
    return this.getData<Favourite>(this.KEYS.FAVOURITES);
  }

  getFavouritesByUser(userId: string): Favourite[] {
    return this.getFavourites().filter(f => f.userId === userId);
  }

  isFavourite(userId: string, restaurantId: string): boolean {
    return this.getFavourites().some(f => 
      f.userId === userId && f.restaurantId === restaurantId
    );
  }

  toggleFavourite(userId: string, restaurantId: string): boolean {
    const favourites = this.getFavourites();
    const existingIndex = favourites.findIndex(f =>
      f.userId === userId && f.restaurantId === restaurantId
    );

    if (existingIndex !== -1) {
      // Remove from favourites
      favourites.splice(existingIndex, 1);
      this.setData(this.KEYS.FAVOURITES, favourites);
      return false;
    } else {
      // Add to favourites
      const newFavourite: Favourite = {
        id: `fav-${Date.now()}`,
        userId,
        restaurantId,
        createdAt: new Date().toISOString()
      };
      favourites.push(newFavourite);
      this.setData(this.KEYS.FAVOURITES, favourites);
      return true;
    }
  }

  getFavouriteRestaurants(userId: string): Restaurant[] {
    const favourites = this.getFavouritesByUser(userId);
    const restaurants = this.getRestaurants();
    return favourites
      .map(f => restaurants.find(r => r.id === f.restaurantId))
      .filter((r): r is Restaurant => r !== undefined);
  }
}

export const db = new Database();
