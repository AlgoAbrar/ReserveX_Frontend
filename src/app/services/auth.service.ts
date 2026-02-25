/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This service handles all authentication and user management operations:
 * - User login and registration
 * - Session management
 * - Profile updates
 * - Token storage and retrieval
 * 
 * FALLBACK BEHAVIOR:
 * When the backend is unavailable, this service uses demo users for testing.
 * Demo credentials are stored in demo-data.ts
 * 
 * SECURITY NOTE:
 * In production, never store passwords in plaintext or use demo authentication.
 * This fallback is ONLY for development and testing purposes.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { api, handleApiError } from './api';
import { DEMO_USERS, DEMO_CREDENTIALS } from './demo-data';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Login Credentials Interface
 * Used when a user attempts to log in
 */
export interface LoginCredentials {
  email: string;        // User's email address
  password: string;     // User's password (sent securely to backend)
}

/**
 * Registration Data Interface
 * Used when a new user signs up
 */
export interface RegisterData {
  email: string;        // User's email address (must be unique)
  password: string;     // User's chosen password
  name: string;         // User's full name
  role: 'customer' | 'manager';  // User role (admin is created by system only)
  phone?: string;       // Optional phone number
}

/**
 * User Interface
 * Represents a user in the system
 */
export interface User {
  id: string;                    // Unique user identifier
  email: string;                 // User's email address
  name: string;                  // User's full name
  role: 'customer' | 'manager' | 'admin';  // User's role in the system
  profileImage?: string;         // Optional profile picture URL
  phone?: string;                // Optional phone number
  createdAt: string;             // Account creation timestamp (ISO format)
}

/**
 * Authentication Response Interface
 * Returned after successful login or registration
 */
export interface AuthResponse {
  user: User;           // User information
  token: string;        // JWT authentication token
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION SERVICE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 */

class AuthService {
  /**
   * ─────────────────────────────────────────────────────────────────────────
   * LOGIN
   * ─────────────────────────────────────────────────────────────────────────
   * Authenticates a user with email and password
   * 
   * FALLBACK: Uses demo credentials when backend is unavailable
   * Demo credentials:
   * - customer@demo.com / demo123 (Customer role)
   * - manager@demo.com / demo123 (Manager role)
   * - admin@demo.com / demo123 (Admin role)
   * 
   * @param credentials - Email and password
   * @returns Promise<AuthResponse> - User info and auth token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND LOGIN: Send credentials to backend for authentication
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      // Store authentication token in localStorage
      // CHANGEABLE: Modify storage key if needed
      localStorage.setItem('reservex_auth_token', token);
      
      // Store user information in localStorage for quick access
      // CHANGEABLE: Modify storage key if needed
      localStorage.setItem('reservex_current_user', JSON.stringify(user));
      
      return { user, token };
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Use demo authentication
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using demo authentication.');
      
      // Check if email matches a demo user
      const demoUser = DEMO_USERS.find(u => u.email === credentials.email);
      
      if (!demoUser) {
        throw new Error('Invalid email or password (Backend unavailable - Use demo credentials)');
      }
      
      // In demo mode, we don't actually verify password
      // IMPORTANT: This is ONLY for testing. Real authentication must verify passwords!
      console.log('Demo Login: Any password accepted for demo users');
      
      // Generate a fake JWT token for demo purposes
      // CHANGEABLE: This is just a placeholder token
      const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;
      
      // Store demo token
      localStorage.setItem('reservex_auth_token', demoToken);
      localStorage.setItem('reservex_current_user', JSON.stringify(demoUser));
      
      // Also store a flag indicating we're in demo mode
      localStorage.setItem('reservex_demo_mode', 'true');
      
      return {
        user: demoUser,
        token: demoToken
      };
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * REGISTER
   * ─────────────────────────────────────────────────────────────────────────
   * Creates a new user account
   * 
   * FALLBACK: Creates a temporary demo user when backend is unavailable
   * Note: This demo user only exists in localStorage and is lost on refresh
   * 
   * @param data - Registration information
   * @returns Promise<AuthResponse> - User info and auth token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REGISTRATION: Send registration data to backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('reservex_auth_token', token);
      localStorage.setItem('reservex_current_user', JSON.stringify(user));
      
      return { user, token };
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Create demo user
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Creating temporary demo user.');
      
      // Create a temporary demo user
      // NOTE: This user only exists locally and will be lost on page refresh
      const demoUser: User = {
        id: `demo-user-${Date.now()}`, // Unique ID based on timestamp
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        createdAt: new Date().toISOString()
      };
      
      // Generate demo token
      const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('reservex_auth_token', demoToken);
      localStorage.setItem('reservex_current_user', JSON.stringify(demoUser));
      localStorage.setItem('reservex_demo_mode', 'true');
      
      console.log('Demo user created:', demoUser);
      
      return {
        user: demoUser,
        token: demoToken
      };
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * LOGOUT
   * ─────────────────────────────────────────────────────────────────────────
   * Logs out the current user and clears all session data
   * 
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      // Try to notify backend about logout (to invalidate token server-side)
      await api.post('/auth/logout');
    } catch (error) {
      // If backend is unavailable, just log the error
      // We still proceed with local logout
      console.error('Logout error:', error);
    } finally {
      // ───────────────────────────────────────────────────────────────────
      // ALWAYS clear local authentication data
      // ───────────────────────────────────────────────────────────────────
      // This happens whether backend logout succeeds or fails
      
      // CHANGEABLE: Add/remove localStorage keys based on what you store
      localStorage.removeItem('reservex_auth_token');      // Remove JWT token
      localStorage.removeItem('reservex_current_user');    // Remove user data
      localStorage.removeItem('reservex_demo_mode');       // Remove demo mode flag
      
      console.log('User logged out successfully');
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET CURRENT USER
   * ─────────────────────────────────────────────────────────────────────────
   * Fetches the latest user information from backend
   * Useful for refreshing user data after profile updates
   * 
   * FALLBACK: Returns stored user from localStorage if backend fails
   * 
   * @returns Promise<User | null> - User object or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND REQUEST: Get latest user data from server
      // ───────────────────────────────────────────────────────────────────
      const response = await api.get('/auth/me');
      const user = response.data;
      
      // Update stored user data with latest from backend
      localStorage.setItem('reservex_current_user', JSON.stringify(user));
      
      return user;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Return stored user from localStorage
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Using stored user data.');
      
      return this.getStoredUser();
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * UPDATE PROFILE
   * ─────────────────────────────────────────────────────────────────────────
   * Updates user profile information
   * 
   * FALLBACK: Updates localStorage only when backend is unavailable
   * 
   * @param data - Partial user data to update
   * @returns Promise<User> - Updated user object
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      // ───────────────────────────────────────────────────────────────────
      // BACKEND UPDATE: Send updated profile data to backend
      // ───────────────────────────────────────────────────────────────────
      const response = await api.put('/auth/profile', data);
      const user = response.data;
      
      // Update localStorage with new user data
      localStorage.setItem('reservex_current_user', JSON.stringify(user));
      
      return user;
      
    } catch (error) {
      // ───────────────────────────────────────────────────────────────────
      // FALLBACK BEHAVIOR: Update localStorage only
      // ───────────────────────────────────────────────────────────────────
      console.warn('Backend unavailable. Updating local user data only.');
      
      // Get current stored user
      const currentUser = this.getStoredUser();
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Merge updated data with current user
      const updatedUser: User = {
        ...currentUser,
        ...data,
        id: currentUser.id,              // Never allow changing user ID
        email: currentUser.email,        // Never allow changing email (requires separate flow)
        role: currentUser.role,          // Never allow self-role change
        createdAt: currentUser.createdAt // Preserve creation date
      };
      
      // Save updated user to localStorage
      localStorage.setItem('reservex_current_user', JSON.stringify(updatedUser));
      
      console.log('Profile updated locally:', updatedUser);
      
      return updatedUser;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET STORED USER
   * ─────────────────────────────────────────────────────────────────────────
   * Retrieves user data from localStorage
   * This is synchronous and doesn't require API call
   * 
   * @returns User | null - User object or null if not found
   */
  getStoredUser(): User | null {
    // CHANGEABLE: Modify storage key if needed
    const userStr = localStorage.getItem('reservex_current_user');
    
    if (!userStr) {
      return null;
    }
    
    try {
      // Parse JSON string back to User object
      return JSON.parse(userStr);
    } catch (error) {
      // If JSON parsing fails, clear corrupted data
      console.error('Failed to parse stored user data:', error);
      localStorage.removeItem('reservex_current_user');
      return null;
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET TOKEN
   * ─────────────────────────────────────────────────────────────────────────
   * Retrieves the JWT token from localStorage
   * 
   * @returns string | null - JWT token or null if not authenticated
   */
  getToken(): string | null {
    // CHANGEABLE: Modify storage key if needed
    return localStorage.getItem('reservex_auth_token');
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * IS AUTHENTICATED
   * ─────────────────────────────────────────────────────────────────────────
   * Checks if a user is currently authenticated
   * Simply checks if a token exists (doesn't verify token validity)
   * 
   * @returns boolean - true if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * IS DEMO MODE
   * ─────────────────────────────────────────────────────────────────────────
   * Checks if the app is currently running in demo mode
   * (using fallback data instead of backend)
   * 
   * @returns boolean - true if in demo mode, false otherwise
   */
  isDemoMode(): boolean {
    return localStorage.getItem('reservex_demo_mode') === 'true';
  }

  /**
   * ─────────────────────────────────────────────────────────────────────────
   * GET DEMO CREDENTIALS
   * ─────────────────────────────────────────────────────────────────────────
   * Returns available demo credentials for testing
   * Useful for displaying login hints when backend is unavailable
   * 
   * @returns Object with demo credentials
   */
  getDemoCredentials() {
    return DEMO_CREDENTIALS;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT AUTH SERVICE INSTANCE
 * ═══════════════════════════════════════════════════════════════════════════
 * This creates a singleton instance that's used throughout the application
 */
export const authService = new AuthService();
