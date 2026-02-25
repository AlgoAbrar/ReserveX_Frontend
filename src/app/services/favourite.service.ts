/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FAVOURITE SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This service handles all favourite/wishlist operations:
 * - Adding restaurants to favourites
 * - Removing restaurants from favourites
 * - Fetching user's favourite restaurants
 * - Checking if a restaurant is favourited
 * - Toggling favourite status
 * 
 * FALLBACK BEHAVIOR:
 * When the backend is unavailable, this service uses demo favourites and stores
 * user favourites in localStorage.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { api, handleApiError } from './api';
import { DEMO_FAVOURITES, DEMO_RESTAURANTS, getDemoFavouritesByUserId, isDemoFavourite } from './demo-data';
import { authService } from './auth.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Favourite Interface
 * Represents a favourited restaurant
 */
export interface Favourite {
  id: string;                    // Unique favourite identifier
  userId: string;                // ID of the user who favourited
  restaurantId: string;          // ID of the favourited restaurant
  createdAt: string;             // When favourited (ISO format)
  restaurant?: {                 // Optional populated restaurant data
    id: string;
    name: string;
    cuisine: string;
    image: string;
    rating: number;
    location: string;
    priceRange: string;
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOCAL STORAGE KEYS (for demo mode)
 * ═══════════════════════════════════════════════════════════════════════════
 */
const DEMO_FAVOURITES_KEY = 'reservex_demo_favourites'; // Key for storing demo favourites

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FAVOURITE SERVICE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 */

class FavouriteService {
  /**
   * ─────────────────────────────────────────────────────────────────────────
   * ADD FAVOURITE
   * ─────────────────────────────────────────────────────────────────────────
   * Adds a restaurant to user's favourites
   * 
   * FALLBACK: Stores favourite in localStorage
   * 
   * @param restaurantId - Restaurant ID to favourite
   * @returns Promise<Favourite> - The created favourite entry
   */
  async addFavourite(restaurantId: string): Promise<Favourite> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Add favourite on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/favourites', { restaurantId });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Add favourite to localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Adding favourite locally.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('You must be logged in to add favourites');
      }
      
      // Check if already favourited
      const localFavourites = this.getAllLocalFavourites();
      const alreadyFavourited = localFavourites.some(
        f => f.userId === user.id && f.restaurantId === restaurantId
      );
      
      if (alreadyFavourited) {
        throw new Error('Restaurant is already in your favourites');
      }
      
      // Find restaurant details
      const restaurant = DEMO_RESTAURANTS.find(r => r.id === restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      // Create new favourite object
      const newFavourite: Favourite = {
        id: `fav-demo-${Date.now()}`, // Unique ID based on timestamp
        userId: user.id,
        restaurantId: restaurantId,
        createdAt: new Date().toISOString(),
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          image: restaurant.image,
          rating: restaurant.rating,
          location: restaurant.location,
          priceRange: restaurant.priceRange
        }
      };
      
      // Save to localStorage
      this.saveDemoFavourite(newFavourite);
      
      console.log('Demo favourite added:', newFavourite);
      
      return newFavourite;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * REMOVE FAVOURITE
   * ─────────────────────────────────────────────────────────────────────────
   * Removes a restaurant from user's favourites
   * 
   * FALLBACK: Removes favourite from localStorage
   * 
   * @param restaurantId - Restaurant ID to unfavourite
   */
  async removeFavourite(restaurantId: string): Promise<void> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Remove favourite on backend
      // ───────────────────────────────────────────────────────────────────
      await api.delete(`/favourites/${restaurantId}`);
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Remove favourite from localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Removing favourite locally.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('You must be logged in');
      }
      
      // Remove from localStorage
      const localFavourites = this.getAllLocalFavourites();
      const filteredFavourites = localFavourites.filter(
        f => !(f.userId === user.id && f.restaurantId === restaurantId)
      );
      
      // Save filtered favourites back to localStorage
      this.saveAllLocalFavourites(filteredFavourites);
      
      console.log('Demo favourite removed for restaurant:', restaurantId);
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET MY FAVOURITES
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches all favourited restaurants for the current user
   * 
   * FALLBACK: Returns demo favourites + localStorage favourites
   * 
   * @returns Promise<Favourite[]> - Array of user's favourites
   */
  async getMyFavourites(): Promise<Favourite[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get user's favourites from backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get('/favourites/my-favourites');
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return demo + localStorage favourites
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo favourites.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        return [];
      }
      
      // Get demo favourites for this user
      const demoFavourites = getDemoFavouritesByUserId(user.id);
      
      // Get localStorage favourites for this user
      const localFavourites = this.getLocalFavouritesByUserId(user.id);
      
      // Combine and sort by date (newest first)
      const allFavourites = [...demoFavourites, ...localFavourites];
      allFavourites.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return allFavourites;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * IS FAVOURITE
   * ─────────────────────────────────────────────────────────────────────────
   * Checks if a restaurant is in user's favourites
   * 
   * FALLBACK: Checks localStorage + demo data
   * 
   * @param restaurantId - Restaurant ID to check
   * @returns Promise<boolean> - true if favourited, false otherwise
   */
  async isFavourite(restaurantId: string): Promise<boolean> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Check if favourited on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get(`/favourites/check/${restaurantId}`);
      return response.data.isFavourite;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Check in demo + localStorage
      // ───────────────────────────────────────────────────────────────────
      // This is intentionally silent to not disrupt the user experience
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        return false;
      }
      
      // Check in demo favourites
      const inDemoFavourites = isDemoFavourite(user.id, restaurantId);
      
      if (inDemoFavourites) {
        return true;
      }
      
      // Check in localStorage favourites
      const localFavourites = this.getAllLocalFavourites();
      return localFavourites.some(
        f => f.userId === user.id && f.restaurantId === restaurantId
      );
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * TOGGLE FAVOURITE
   * ─────────────────────────────────────────────────────────────────────────
   * Toggles a restaurant's favourite status
   * (adds if not favourited, removes if already favourited)
   * 
   * FALLBACK: Toggles in localStorage
   * 
   * @param restaurantId - Restaurant ID to toggle
   * @returns Promise<{isFavourite: boolean}> - New favourite status
   */
  async toggleFavourite(restaurantId: string): Promise<{ isFavourite: boolean }> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Toggle favourite on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/favourites/toggle', { restaurantId });
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Toggle in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Toggling favourite locally.');
      
      // Check if currently favourited
      const isFav = await this.isFavourite(restaurantId);
      
      if (isFav) {
        // Remove from favourites
        await this.removeFavourite(restaurantId);
        return { isFavourite: false };
      } else {
        // Add to favourites
        await this.addFavourite(restaurantId);
        return { isFavourite: true };
      }
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * PRIVATE HELPER METHODS (for demo mode localStorage management)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * Save a favourite to localStorage
   * @param favourite - Favourite to save
   */
  private saveDemoFavourite(favourite: Favourite): void {
    const favourites = this.getAllLocalFavourites();
    favourites.push(favourite);
    this.saveAllLocalFavourites(favourites);
  }

  /**
   * Get all favourites from localStorage
   * @returns Array of favourites
   */
  private getAllLocalFavourites(): Favourite[] {
    try {
      const favouritesStr = localStorage.getItem(DEMO_FAVOURITES_KEY);
      return favouritesStr ? JSON.parse(favouritesStr) : [];
    } catch (error) {
      console.error('Failed to parse local favourites:', error);
      return [];
    }
  }

  /**
   * Save all favourites to localStorage
   * @param favourites - Array of favourites to save
   */
  private saveAllLocalFavourites(favourites: Favourite[]): void {
    localStorage.setItem(DEMO_FAVOURITES_KEY, JSON.stringify(favourites));
  }

  /**
   * Get favourites for a specific user from localStorage
   * @param userId - User ID
   * @returns Array of user's favourites
   */
  private getLocalFavouritesByUserId(userId: string): Favourite[] {
    const allFavourites = this.getAllLocalFavourites();
    return allFavourites.filter(f => f.userId === userId);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT FAVOURITE SERVICE INSTANCE
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const favouriteService = new FavouriteService();
