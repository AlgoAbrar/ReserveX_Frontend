/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOOKING SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This service handles all restaurant booking/reservation operations:
 * - Creating new bookings
 * - Viewing user's bookings
 * - Canceling bookings
 * - Updating booking details
 * - Manager booking management
 * 
 * FALLBACK BEHAVIOR:
 * When the backend is unavailable, this service uses demo bookings and allows
 * creating temporary bookings stored in localStorage.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { api, handleApiError } from './api';
import { DEMO_BOOKINGS, DEMO_RESTAURANTS, getDemoBookingsByUserId } from './demo-data';
import { authService } from './auth.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

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
  customerName: string;          // Name for the reservation
  customerEmail: string;         // Contact email
  customerPhone: string;         // Contact phone number
  specialRequests?: string;      // Optional special requests/notes
  createdAt: string;             // When booking was created (ISO format)
  updatedAt: string;             // Last update time (ISO format)
  restaurant?: {                 // Optional populated restaurant data
    id: string;
    name: string;
    image: string;
    location: string;
  };
}

/**
 * Create Booking Data Interface
 * Data required to create a new booking
 */
export interface CreateBookingData {
  restaurantId: string;          // Which restaurant to book
  date: string;                  // Reservation date
  timeSlot: string;              // Preferred time slot
  seats: number;                 // Number of people
  customerName: string;          // Name for reservation
  customerEmail: string;         // Contact email
  customerPhone: string;         // Contact phone
  specialRequests?: string;      // Optional special requests
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOCAL STORAGE KEYS (for demo mode)
 * ═══════════════════════════════════════════════════════════════════════════
 */
const DEMO_BOOKINGS_KEY = 'reservex_demo_bookings'; // Key for storing demo bookings

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOOKING SERVICE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 */

class BookingService {
  /**
   * ─────────────────────────────────────────────────────────────────────────
   * CREATE BOOKING
   * ─────────────────────────────────────────────────────────────────────────
   * Creates a new restaurant reservation
   * 
   * FALLBACK: Creates a temporary booking in localStorage
   * 
   * @param data - Booking information
   * @returns Promise<Booking> - The created booking
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Send booking data to backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/bookings', data);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Create booking in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Creating demo booking.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('You must be logged in to make a booking');
      }
      
      // Find restaurant details
      const restaurant = DEMO_RESTAURANTS.find(r => r.id === data.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      // Create new booking object
      const newBooking: Booking = {
        id: `booking-demo-${Date.now()}`, // Unique ID based on timestamp
        restaurantId: data.restaurantId,
        userId: user.id,
        date: data.date,
        timeSlot: data.timeSlot,
        seats: data.seats,
        status: 'pending', // New bookings start as pending
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          image: restaurant.image,
          location: restaurant.location
        }
      };
      
      // Save to localStorage
      this.saveDemoBooking(newBooking);
      
      console.log('Demo booking created:', newBooking);
      
      return newBooking;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET MY BOOKINGS
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches all bookings for the current user
   * 
   * FALLBACK: Returns demo bookings + any localStorage bookings
   * 
   * @returns Promise<Booking[]> - Array of user's bookings
   */
  async getMyBookings(): Promise<Booking[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get user's bookings from backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get('/bookings/my-bookings');
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return demo + localStorage bookings
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo bookings.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        return [];
      }
      
      // Get demo bookings for this user
      const demoBookings = getDemoBookingsByUserId(user.id);
      
      // Get localStorage bookings for this user
      const localBookings = this.getLocalBookingsByUserId(user.id);
      
      // Combine and sort by date (newest first)
      const allBookings = [...demoBookings, ...localBookings];
      allBookings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return allBookings;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET BOOKING BY ID
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches a specific booking by its ID
   * 
   * FALLBACK: Searches in demo and localStorage bookings
   * 
   * @param id - Booking ID
   * @returns Promise<Booking> - The booking object
   */
  async getBookingById(id: string): Promise<Booking> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get specific booking
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get(`/bookings/${id}`);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Search in demo and local bookings
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Searching in demo bookings.');
      
      // Check demo bookings first
      let booking = DEMO_BOOKINGS.find(b => b.id === id);
      
      // If not found, check localStorage bookings
      if (!booking) {
        const localBookings = this.getAllLocalBookings();
        booking = localBookings.find(b => b.id === id);
      }
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * CANCEL BOOKING
   * ─────────────────────────────────────────────────────────────────────────
   * Cancels a booking (changes status to 'cancelled')
   * 
   * FALLBACK: Updates booking status in localStorage
   * 
   * @param id - Booking ID
   * @returns Promise<Booking> - The updated booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Cancel booking on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Update status in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Canceling booking locally.');
      
      // Get the booking
      const localBookings = this.getAllLocalBookings();
      const bookingIndex = localBookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      // Update status to cancelled
      localBookings[bookingIndex].status = 'cancelled';
      localBookings[bookingIndex].updatedAt = new Date().toISOString();
      
      // Save back to localStorage
      this.saveAllLocalBookings(localBookings);
      
      return localBookings[bookingIndex];
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * UPDATE BOOKING
   * ─────────────────────────────────────────────────────────────────────────
   * Updates booking details (date, time, seats, etc.)
   * 
   * FALLBACK: Updates booking in localStorage
   * 
   * @param id - Booking ID
   * @param data - Updated booking data
   * @returns Promise<Booking> - The updated booking
   */
  async updateBooking(id: string, data: Partial<CreateBookingData>): Promise<Booking> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Update booking on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.put(`/bookings/${id}`, data);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Update booking in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Updating booking locally.');
      
      const localBookings = this.getAllLocalBookings();
      const bookingIndex = localBookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      // Merge updated data
      localBookings[bookingIndex] = {
        ...localBookings[bookingIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Save back to localStorage
      this.saveAllLocalBookings(localBookings);
      
      return localBookings[bookingIndex];
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * MANAGER FUNCTIONS (Restaurant Booking Management)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * GET RESTAURANT BOOKINGS
   * Fetches all bookings for a specific restaurant (manager view)
   * 
   * @param restaurantId - Restaurant ID
   * @param filters - Optional filters (status, date)
   * @returns Promise<Booking[]> - Array of bookings for the restaurant
   */
  async getRestaurantBookings(restaurantId: string, filters?: {
    status?: string;
    date?: string;
  }): Promise<Booking[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get restaurant bookings
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get(`/restaurants/${restaurantId}/bookings`, { params: filters });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Filter demo + local bookings by restaurant
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo restaurant bookings.');
      
      // Combine demo and local bookings
      const allBookings = [...DEMO_BOOKINGS, ...this.getAllLocalBookings()];
      
      // Filter by restaurant
      let restaurantBookings = allBookings.filter(b => b.restaurantId === restaurantId);
      
      // Apply additional filters if provided
      if (filters?.status) {
        restaurantBookings = restaurantBookings.filter(b => b.status === filters.status);
      }
      
      if (filters?.date) {
        restaurantBookings = restaurantBookings.filter(b => b.date === filters.date);
      }
      
      return restaurantBookings;
    }
  }

  /**
   * UPDATE BOOKING STATUS
   * Changes the status of a booking (e.g., from pending to confirmed)
   * 
   * @param id - Booking ID
   * @param status - New status
   * @returns Promise<Booking> - The updated booking
   */
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Update booking status
      // ───────────────────────────────────────────────────────────────────
      const response = await api.put(`/bookings/${id}/status`, { status });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Update status locally
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Updating booking status locally.');
      
      const localBookings = this.getAllLocalBookings();
      const bookingIndex = localBookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      localBookings[bookingIndex].status = status;
      localBookings[bookingIndex].updatedAt = new Date().toISOString();
      
      this.saveAllLocalBookings(localBookings);
      
      return localBookings[bookingIndex];
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * ADMIN FUNCTIONS
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * GET ALL BOOKINGS
   * Fetches all bookings in the system (admin view)
   * 
   * @param filters - Optional filters
   * @returns Promise<Booking[]> - Array of all bookings
   */
  async getAllBookings(filters?: {
    status?: string;
    restaurantId?: string;
    userId?: string;
    date?: string;
  }): Promise<Booking[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get all bookings
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get('/bookings', { params: filters });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return all demo + local bookings
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using all demo bookings.');
      
      let allBookings = [...DEMO_BOOKINGS, ...this.getAllLocalBookings()];
      
      // Apply filters if provided
      if (filters?.status) {
        allBookings = allBookings.filter(b => b.status === filters.status);
      }
      
      if (filters?.restaurantId) {
        allBookings = allBookings.filter(b => b.restaurantId === filters.restaurantId);
      }
      
      if (filters?.userId) {
        allBookings = allBookings.filter(b => b.userId === filters.userId);
      }
      
      if (filters?.date) {
        allBookings = allBookings.filter(b => b.date === filters.date);
      }
      
      return allBookings;
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * PRIVATE HELPER METHODS (for demo mode localStorage management)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * Save a booking to localStorage
   * @param booking - Booking to save
   */
  private saveDemoBooking(booking: Booking): void {
    const bookings = this.getAllLocalBookings();
    bookings.push(booking);
    this.saveAllLocalBookings(bookings);
  }

  /**
   * Get all bookings from localStorage
   * @returns Array of bookings
   */
  private getAllLocalBookings(): Booking[] {
    try {
      const bookingsStr = localStorage.getItem(DEMO_BOOKINGS_KEY);
      return bookingsStr ? JSON.parse(bookingsStr) : [];
    } catch (error) {
      console.error('Failed to parse local bookings:', error);
      return [];
    }
  }

  /**
   * Save all bookings to localStorage
   * @param bookings - Array of bookings to save
   */
  private saveAllLocalBookings(bookings: Booking[]): void {
    localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(bookings));
  }

  /**
   * Get bookings for a specific user from localStorage
   * @param userId - User ID
   * @returns Array of user's bookings
   */
  private getLocalBookingsByUserId(userId: string): Booking[] {
    const allBookings = this.getAllLocalBookings();
    return allBookings.filter(b => b.userId === userId);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT BOOKING SERVICE INSTANCE
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const bookingService = new BookingService();
