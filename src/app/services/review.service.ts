/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REVIEW SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This service handles all restaurant review operations:
 * - Creating reviews
 * - Fetching restaurant reviews
 * - Managing user's reviews
 * - Updating/deleting reviews
 * 
 * FALLBACK BEHAVIOR:
 * When the backend is unavailable, this service uses demo reviews and allows
 * creating temporary reviews stored in localStorage.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { api, handleApiError } from './api';
import { DEMO_REVIEWS, getDemoReviewsByRestaurantId } from './demo-data';
import { authService } from './auth.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Review Interface
 * Represents a customer review for a restaurant
 */
export interface Review {
  id: string;                    // Unique review identifier
  restaurantId: string;          // ID of the reviewed restaurant
  userId: string;                // ID of the user who wrote the review
  userName: string;              // Name of the reviewer
  userImage?: string;            // Optional reviewer profile image
  rating: number;                // Star rating (1-5)
  comment: string;               // Review text/comment
  createdAt: string;             // When review was created (ISO format)
  restaurant?: {                 // Optional populated restaurant data
    id: string;
    name: string;
    image: string;
  };
}

/**
 * Create Review Data Interface
 * Data required to create a new review
 */
export interface CreateReviewData {
  restaurantId: string;          // Which restaurant to review
  rating: number;                // Star rating (1-5)
  comment: string;               // Review text
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOCAL STORAGE KEYS (for demo mode)
 * ═══════════════════════════════════════════════════════════════════════════
 */
const DEMO_REVIEWS_KEY = 'reservex_demo_reviews'; // Key for storing demo reviews

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REVIEW SERVICE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 */

class ReviewService {
  /**
   * ─────────────────────────────────────────────────────────────────────────
   * CREATE REVIEW
   * ─────────────────────────────────────────────────────────────────────────
   * Creates a new restaurant review
   * 
   * FALLBACK: Creates a temporary review in localStorage
   * 
   * @param data - Review information
   * @returns Promise<Review> - The created review
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Send review data to backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/reviews', data);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Create review in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Creating demo review.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('You must be logged in to write a review');
      }
      
      // Validate rating (must be between 1 and 5)
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5 stars');
      }
      
      // Create new review object
      const newReview: Review = {
        id: `review-demo-${Date.now()}`, // Unique ID based on timestamp
        restaurantId: data.restaurantId,
        userId: user.id,
        userName: user.name,
        userImage: user.profileImage,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      this.saveDemoReview(newReview);
      
      console.log('Demo review created:', newReview);
      
      return newReview;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET RESTAURANT REVIEWS
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches all reviews for a specific restaurant
   * 
   * FALLBACK: Returns demo reviews + localStorage reviews
   * 
   * @param restaurantId - Restaurant ID
   * @returns Promise<Review[]> - Array of reviews
   */
  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get restaurant reviews from backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get(`/restaurants/${restaurantId}/reviews`);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return demo + localStorage reviews
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo reviews.');
      
      // Get demo reviews for this restaurant
      const demoReviews = getDemoReviewsByRestaurantId(restaurantId);
      
      // Get localStorage reviews for this restaurant
      const localReviews = this.getLocalReviewsByRestaurantId(restaurantId);
      
      // Combine and sort by date (newest first)
      const allReviews = [...demoReviews, ...localReviews];
      allReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return allReviews;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET MY REVIEWS
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches all reviews written by the current user
   * 
   * FALLBACK: Returns user's demo reviews + localStorage reviews
   * 
   * @returns Promise<Review[]> - Array of user's reviews
   */
  async getMyReviews(): Promise<Review[]> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get user's reviews from backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get('/reviews/my-reviews');
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return user's demo + localStorage reviews
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo reviews.');
      
      // Get current user
      const user = authService.getStoredUser();
      if (!user) {
        return [];
      }
      
      // Get demo reviews by this user
      const demoReviews = DEMO_REVIEWS.filter(r => r.userId === user.id);
      
      // Get localStorage reviews by this user
      const localReviews = this.getLocalReviewsByUserId(user.id);
      
      // Combine and sort by date (newest first)
      const allReviews = [...demoReviews, ...localReviews];
      allReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return allReviews;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * UPDATE REVIEW
   * ─────────────────────────────────────────────────────────────────────────
   * Updates an existing review
   * 
   * FALLBACK: Updates review in localStorage
   * 
   * @param id - Review ID
   * @param data - Updated review data
   * @returns Promise<Review> - The updated review
   */
  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Update review on backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.put(`/reviews/${id}`, data);
      return response.data;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Update review in localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Updating review locally.');
      
      const localReviews = this.getAllLocalReviews();
      const reviewIndex = localReviews.findIndex(r => r.id === id);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }
      
      // Validate rating if being updated
      if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Rating must be between 1 and 5 stars');
      }
      
      // Merge updated data
      localReviews[reviewIndex] = {
        ...localReviews[reviewIndex],
        ...data
      };
      
      // Save back to localStorage
      this.saveAllLocalReviews(localReviews);
      
      return localReviews[reviewIndex];
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * DELETE REVIEW
   * ─────────────────────────────────────────────────────────────────────────
   * Deletes a review
   * 
   * FALLBACK: Removes review from localStorage
   * 
   * @param id - Review ID
   */
  async deleteReview(id: string): Promise<void> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Delete review on backend
      // ───────────────────────────────────────────────────────────────────
      await api.delete(`/reviews/${id}`);
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Remove review from localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Deleting review locally.');
      
      const localReviews = this.getAllLocalReviews();
      const filteredReviews = localReviews.filter(r => r.id !== id);
      
      if (filteredReviews.length === localReviews.length) {
        // Review not found in localStorage
        throw new Error('Review not found');
      }
      
      // Save filtered reviews back to localStorage
      this.saveAllLocalReviews(filteredReviews);
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * CAN REVIEW
   * ─────────────────────────────────────────────────────────────────────────
   * Checks if the current user can review a restaurant
   * (typically requires a completed booking)
   * 
   * FALLBACK: Always returns true in demo mode
   * 
   * @param restaurantId - Restaurant ID
   * @returns Promise<boolean> - true if user can review, false otherwise
   */
  async canReview(restaurantId: string): Promise<boolean> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Check if user can review
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get(`/reviews/can-review/${restaurantId}`);
      return response.data.canReview;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Allow reviews in demo mode
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Allowing review in demo mode.');
      
      // In demo mode, anyone logged in can review
      // In production, this would check for completed bookings
      return authService.isAuthenticated();
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * PRIVATE HELPER METHODS (for demo mode localStorage management)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * Save a review to localStorage
   * @param review - Review to save
   */
  private saveDemoReview(review: Review): void {
    const reviews = this.getAllLocalReviews();
    reviews.push(review);
    this.saveAllLocalReviews(reviews);
  }

  /**
   * Get all reviews from localStorage
   * @returns Array of reviews
   */
  private getAllLocalReviews(): Review[] {
    try {
      const reviewsStr = localStorage.getItem(DEMO_REVIEWS_KEY);
      return reviewsStr ? JSON.parse(reviewsStr) : [];
    } catch (error) {
      console.error('Failed to parse local reviews:', error);
      return [];
    }
  }

  /**
   * Save all reviews to localStorage
   * @param reviews - Array of reviews to save
   */
  private saveAllLocalReviews(reviews: Review[]): void {
    localStorage.setItem(DEMO_REVIEWS_KEY, JSON.stringify(reviews));
  }

  /**
   * Get reviews for a specific restaurant from localStorage
   * @param restaurantId - Restaurant ID
   * @returns Array of restaurant's reviews
   */
  private getLocalReviewsByRestaurantId(restaurantId: string): Review[] {
    const allReviews = this.getAllLocalReviews();
    return allReviews.filter(r => r.restaurantId === restaurantId);
  }

  /**
   * Get reviews for a specific user from localStorage
   * @param userId - User ID
   * @returns Array of user's reviews
   */
  private getLocalReviewsByUserId(userId: string): Review[] {
    const allReviews = this.getAllLocalReviews();
    return allReviews.filter(r => r.userId === userId);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT REVIEW SERVICE INSTANCE
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const reviewService = new ReviewService();
