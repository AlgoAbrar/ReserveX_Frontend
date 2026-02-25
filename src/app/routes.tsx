import { createBrowserRouter, Navigate } from 'react-router';
import { HomePage } from './pages/HomePage';
import RestaurantsPage from './pages/Restaurants';
import RestaurantDetailPage from './pages/RestaurantDetail';
import { AuthPages } from './pages/AuthPages';
import { CustomerDashboard } from './pages/customer/Dashboard';
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { authService } from './services/auth.service';

// Protected route wrapper
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'manager' | 'admin')[];
}) {
  const user = authService.getStoredUser();
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/restaurants',
    element: <RestaurantsPage />
  },
  {
    path: '/restaurants/:id',
    element: <RestaurantDetailPage />
  },
  {
    path: '/restaurant/:id',
    element: <Navigate to="/restaurants/:id" replace />
  },
  {
    path: '/auth',
    element: <AuthPages />
  },
  {
    path: '/auth/:type',
    element: <AuthPages />
  },
  {
    path: '/customer',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <CustomerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['manager']}>
        <ManagerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);