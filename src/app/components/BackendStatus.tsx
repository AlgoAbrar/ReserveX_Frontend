/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BACKEND STATUS INDICATOR COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component displays a visual indicator showing the connection status
 * to the backend API. It helps users understand when they're working with
 * live data vs demo/fallback data.
 * 
 * STATES:
 * - Checking: Initial state while testing connection
 * - Online: Backend is reachable and responding
 * - Offline (Demo Mode): Backend unavailable, using fallback data
 * 
 * CHANGEABLE SETTINGS:
 * - Auto-hide timeout for online status (currently 3 seconds)
 * - Position (currently bottom-right corner)
 * - Health check endpoint (currently tries /health then /restaurants)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * BackendStatus Component
 * 
 * Displays real-time backend connection status
 * Automatically checks on mount and allows manual retry
 */
export function BackendStatus() {
  // ═════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════
  
  // Current connection status
  // CHANGEABLE: Add more states if needed (e.g., 'degraded', 'slow')
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  // Whether to show the status indicator
  // Hides automatically when online to reduce UI clutter
  const [showStatus, setShowStatus] = useState(true);
  
  // Check if app is in demo mode (using fallback data)
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ═════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════════════════
  
  /**
   * Check backend status on component mount
   * Runs once when component first renders
   */
  useEffect(() => {
    checkBackendStatus();
  }, []);

  /**
   * Monitor demo mode flag from localStorage
   * Updates whenever localStorage changes
   */
  useEffect(() => {
    // Check initial demo mode status
    const checkDemoMode = () => {
      const isDemo = localStorage.getItem('reservex_demo_mode') === 'true';
      setIsDemoMode(isDemo);
    };
    
    checkDemoMode();
    
    // Listen for localStorage changes (when demo mode is activated/deactivated)
    window.addEventListener('storage', checkDemoMode);
    
    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(checkDemoMode, 1000); // Check every second
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkDemoMode);
      clearInterval(interval);
    };
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  // BACKEND CONNECTION CHECK
  // ═════════════════════════════════════════════════════════════════════════
  
  /**
   * Tests backend connection by making a lightweight API call
   * 
   * CHANGEABLE ENDPOINTS:
   * - Primary: /health (dedicated health check endpoint)
   * - Fallback: /restaurants (if health endpoint doesn't exist)
   * - Timeout: 5000ms (5 seconds) - adjust in api.ts if needed
   */
  const checkBackendStatus = async () => {
    try {
      // Try to reach the health check endpoint
      // If it doesn't exist, fall back to /restaurants
      await api.get('/health', { timeout: 5000 }).catch(() => {
        // Health endpoint doesn't exist, try a real endpoint
        return api.get('/restaurants', { timeout: 5000 });
      });
      
      // If we reach here, backend is online
      setStatus('online');
      setIsDemoMode(false);
      
      // Clear demo mode flag from localStorage
      localStorage.removeItem('reservex_demo_mode');
      
      // Auto-hide status indicator after 3 seconds when online
      // CHANGEABLE: Adjust timeout or remove auto-hide
      setTimeout(() => setShowStatus(false), 3000);
      
    } catch (error) {
      // Backend is unreachable
      setStatus('offline');
      
      // Set demo mode flag
      // This flag is used by services to trigger fallback behavior
      localStorage.setItem('reservex_demo_mode', 'true');
      setIsDemoMode(true);
      
      // Keep status visible when offline
      setShowStatus(true);
      
      console.warn('Backend connection failed:', error);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER LOGIC
  // ═════════════════════════════════════════════════════════════════════════
  
  /**
   * Hide component when online and timeout expired
   * This reduces UI clutter when everything is working normally
   */
  if (!showStatus && status === 'online') return null;

  return (
    // Position: Fixed to bottom-right corner
    // CHANGEABLE: Modify position (top-right, bottom-left, etc.)
    <div className={`fixed bottom-4 right-4 z-50 ${showStatus ? 'animate-in slide-in-from-bottom-5' : ''}`}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CHECKING STATE - While testing connection                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {status === 'checking' && (
        <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
          <div>
            <p className="text-sm font-semibold">Checking backend connection...</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ONLINE STATE - Backend connected successfully                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {status === 'online' && (
        <div className="bg-card border border-green-500/20 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-600">Backend Connected</p>
            <p className="text-xs text-muted-foreground">All features available</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* OFFLINE STATE - Backend unavailable, using demo mode            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {status === 'offline' && (
        <div className="bg-card border border-amber-500/20 rounded-lg px-4 py-3 shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              {/* Main status message */}
              <p className="text-sm font-semibold text-amber-600 mb-1">
                Demo Mode Active
              </p>
              
              {/* Detailed explanation */}
              <p className="text-xs text-muted-foreground mb-2">
                Backend unavailable. Using demo data for testing. 
                {isDemoMode && ' Your changes will be stored locally.'}
              </p>
              
              {/* Demo credentials hint */}
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded px-2 py-1.5 mb-2">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">
                  Demo Login:
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 font-mono">
                  customer@demo.com
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 font-mono">
                  Password: demo123
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setStatus('checking');
                    checkBackendStatus();
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Retry Connection
                </button>
                <span className="text-xs text-muted-foreground">•</span>
                <button
                  onClick={() => setShowStatus(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
