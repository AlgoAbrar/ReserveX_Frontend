import { useNavigate } from 'react-router';
import { ChefHat, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!user || user.role !== 'manager') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">ReserveX</h1>
                <p className="text-xs text-muted-foreground">Manager Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Welcome, {user.name}! This is the Restaurant Manager dashboard.
          </p>
          <p className="text-sm text-muted-foreground">
            Manager features are available for restaurant owners to manage their bookings, 
            tables, and menu items.
          </p>
        </Card>
      </div>
    </div>
  );
}
