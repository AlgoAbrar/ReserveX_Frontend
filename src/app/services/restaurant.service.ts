/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESTAURANT SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This service handles all restaurant-related operations:
 * - Fetching restaurant listings with filters
 * - Getting restaurant details
 * - Managing restaurant menus
 * - Checking seat availability
 * - Restaurant CRUD operations (for managers/admins)
 * 
 * FALLBACK BEHAVIOR:
 * When the backend is unavailable, this service automatically falls back to
 * demo data to ensure the application remains functional for testing.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { api, handleApiError } from './api';
import { 
  DEMO_RESTAURANTS, 
  DEMO_CUISINES, 
  DEMO_MENU_ITEMS,
  getDemoMenuByRestaurantId 
} from './demo-data';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Restaurant Interface
 * Represents a complete restaurant entity with all its properties
 */
export interface Restaurant {
  id: string;                    // Unique identifier
  name: string;                  // Restaurant name
  cuisine: string;               // Type of cuisine (e.g., Italian, Chinese)
  location: string;              // Full address
  city: string;                  // City name (for filtering)
  division: string;              // Administrative division
  country: string;               // Country name
  description: string;           // Full description of the restaurant
  image: string;                 // Main restaurant image URL
  rating: number;                // Average rating (1-5)
  totalReviews: number;          // Total number of reviews
  openingTime: string;           // Opening time (e.g., "11:00 AM")
  closingTime: string;           // Closing time (e.g., "10:00 PM")
  totalSeats: number;            // Total seating capacity
  priceRange: string;            // Price indicator (৳, ৳৳, ৳৳৳)
  phone: string;                 // Contact phone number
  managerId?: string;            // ID of the restaurant manager (optional)
  status: 'active' | 'pending' | 'blocked'; // Restaurant status
  createdAt: string;             // Creation timestamp (ISO format)
}

/**
 * Menu Item Interface
 * Represents a food/drink item in a restaurant's menu
 */
export interface MenuItem {
  id: string;                    // Unique identifier for the menu item
  restaurantId: string;          // ID of the restaurant this item belongs to
  name: string;                  // Item name (e.g., "Margherita Pizza")
  description: string;           // Detailed description of the item
  price: number;                 // Price in BDT (Bangladeshi Taka)
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Drinks'; // Menu category
  image: string;                 // Image URL of the food item
  available: boolean;            // Whether item is currently available
}

/**
 * Restaurant Filters Interface
 * Used for filtering restaurant listings
 */
export interface RestaurantFilters {
  search?: string;               // Search by restaurant name
  cuisine?: string;              // Filter by cuisine type
  city?: string;                 // Filter by city
  priceRange?: string;           // Filter by price range
  minRating?: number;            // Minimum rating filter
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESTAURANT SERVICE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 */

class RestaurantService {
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
      // Make API request to backend
      // The filters are sent as query parameters (e.g., ?cuisine=Italian&city=Rajshahi)
      const response = await api.get('/restaurants', { params: filters });
      
      // Return the restaurant data from backend
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Use demo data when backend is unavailable
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo restaurants data.');
      
      // Start with all demo restaurants
      let restaurants = [...DEMO_RESTAURANTS];
      
      // Apply filters if provided
      if (filters) {
        // Filter by search query (matches restaurant name)
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          restaurants = restaurants.filter(r => 
            r.name.toLowerCase().includes(searchLower) ||
            r.description.toLowerCase().includes(searchLower) ||
            r.cuisine.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by cuisine type
        if (filters.cuisine && filters.cuisine !== 'All') {
          restaurants = restaurants.filter(r => r.cuisine === filters.cuisine);
        }
        
        // Filter by city
        if (filters.city) {
          restaurants = restaurants.filter(r => r.city === filters.city);
        }
        
        // Filter by price range
        if (filters.priceRange) {
          restaurants = restaurants.filter(r => r.priceRange === filters.priceRange);
        }
        
        // Filter by minimum rating
        if (filters.minRating) {
          restaurants = restaurants.filter(r => r.rating >= filters.minRating);
        }
      }
      
      return restaurants;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET RESTAURANT BY ID
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches detailed information about a specific restaurant
   * 
   * FALLBACK: Returns matching demo restaurant if API fails
   * 
   * @param id - The unique ID of the restaurant
   * @returns Promise<Restaurant> - The restaurant object
   */
  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      // Make API request to get specific restaurant
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Find restaurant in demo data
      // ───────────────────────────────────────────────────────────────────
      console.warn(`Backend unavailable. Using demo data for restaurant ${id}`);
      
      const restaurant = DEMO_RESTAURANTS.find(r => r.id === id);
      
      if (!restaurant) {
        // If restaurant not found even in demo data, throw error
        throw new Error('Restaurant not found');
      }
      
      return restaurant;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET RESTAURANT MENU
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches all menu items for a specific restaurant
   * 
   * FALLBACK: Returns demo menu items if API fails
   * 
   * @param restaurantId - The ID of the restaurant
   * @returns Promise<MenuItem[]> - Array of menu items
   */
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    try {
      // Make API request to get restaurant's menu
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return demo menu items
      // ───────────────────────────────────────────────────────────────────
      console.warn(`Backend unavailable. Using demo menu for restaurant ${restaurantId}`);
      
      return getDemoMenuByRestaurantId(restaurantId);
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * SEARCH RESTAURANTS
   * ─────────────────────────────────────────────────────────────────────────
   * Searches restaurants by query string
   * 
   * FALLBACK: Searches demo restaurants if API fails
   * 
   * @param query - Search query string
   * @returns Promise<Restaurant[]> - Matching restaurants
   */
  async searchRestaurants(query: string): Promise<Restaurant[]> {
    try {
      // Make API request with search query
      const response = await api.get('/restaurants/search', { params: { q: query } });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Search in demo restaurants
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Searching in demo restaurants.');
      
      const queryLower = query.toLowerCase();
      
      return DEMO_RESTAURANTS.filter(restaurant => 
        restaurant.name.toLowerCase().includes(queryLower) ||
        restaurant.description.toLowerCase().includes(queryLower) ||
        restaurant.cuisine.toLowerCase().includes(queryLower) ||
        restaurant.location.toLowerCase().includes(queryLower)
      );
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET CUISINES
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches list of all available cuisines
   * 
   * FALLBACK: Always returns demo cuisines if API fails
   * This ensures the cuisine filter always works
   * 
   * @returns Promise<string[]> - Array of cuisine names
   */
  async getCuisines(): Promise<string[]> {
    try {
      // Make API request to get all cuisines
      const response = await api.get('/restaurants/cuisines');
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return demo cuisines (NO ERROR THROWN)
      // ───────────────────────────────────────────────────────────────────
      // This is intentionally silent to not disrupt the user experience
      console.warn('Backend unavailable. Using demo cuisines list.');
      
      return DEMO_CUISINES;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET AVAILABLE SEATS
   * ─────────────────────────────────────────────────────────────────────────
   * Checks how many seats are available for a specific date and time
   * 
   * FALLBACK: Returns a random number of available seats (for demo purposes)
   * 
   * @param restaurantId - The ID of the restaurant
   * @param date - Reservation date (YYYY-MM-DD format)
   * @param timeSlot - Time slot (e.g., "7:00 PM")
   * @returns Promise<number> - Number of available seats
   */
  async getAvailableSeats(restaurantId: string, date: string, timeSlot: string): Promise<number> {
    try {
      // Make API request to check availability
      const response = await api.get(`/restaurants/${restaurantId}/availability`, {
        params: { date, timeSlot }
      });
      return response.data.availableSeats;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return random available seats (demo mode)
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Returning demo availability.');
      
      // Find the restaurant to get total seats
      const restaurant = DEMO_RESTAURANTS.find(r => r.id === restaurantId);
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      // Generate a random number of available seats (50-90% of total capacity)
      // This simulates realistic availability
      const minAvailable = Math.floor(restaurant.totalSeats * 0.5); // 50% of capacity
      const maxAvailable = Math.floor(restaurant.totalSeats * 0.9); // 90% of capacity
      const availableSeats = Math.floor(Math.random() * (maxAvailable - minAvailable + 1)) + minAvailable;
      
      return availableSeats;
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * MANAGER FUNCTIONS (Restaurant Management)
   * ═══════════════════════════════════════════════════════════════════════════
   * These functions are only accessible to restaurant managers
   */

  /**
   * CREATE RESTAURANT
   * Allows a manager to create a new restaurant
   * 
   * @param data - Partial restaurant data
   * @returns Promise<Restaurant> - The created restaurant
   */
  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response = await api.post('/restaurants', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * UPDATE RESTAURANT
   * Allows a manager to update their restaurant information
   * 
   * @param id - Restaurant ID
   * @param data - Updated restaurant data
   * @returns Promise<Restaurant> - The updated restaurant
   */
  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response = await api.put(`/restaurants/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * DELETE RESTAURANT
   * Allows a manager to delete their restaurant
   * 
   * @param id - Restaurant ID
   */
  async deleteRestaurant(id: string): Promise<void> {
    try {
      await api.delete(`/restaurants/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * MENU MANAGEMENT FUNCTIONS (For Restaurant Managers)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * ADD MENU ITEM
   * Adds a new item to the restaurant's menu
   * 
   * @param restaurantId - Restaurant ID
   * @param item - Menu item data
   * @returns Promise<MenuItem> - The created menu item
   */
  async addMenuItem(restaurantId: string, item: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/menu`, item);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * UPDATE MENU ITEM
   * Updates an existing menu item
   * 
   * @param restaurantId - Restaurant ID
   * @param itemId - Menu item ID
   * @param data - Updated menu item data
   * @returns Promise<MenuItem> - The updated menu item
   */
  async updateMenuItem(restaurantId: string, itemId: string, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await api.put(`/restaurants/${restaurantId}/menu/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * DELETE MENU ITEM
   * Removes an item from the restaurant's menu
   * 
   * @param restaurantId - Restaurant ID
   * @param itemId - Menu item ID
   */
  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    try {
      await api.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT RESTAURANT SERVICE INSTANCE
 * ═══════════════════════════════════════════════════════════════════════════
 * This creates a singleton instance that's used throughout the application
 */
export const restaurantService = new RestaurantService();
