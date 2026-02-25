import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, MapPin, Star, Users, Clock, ChefHat, LogIn, User, Loader2 } from 'lucide-react';
import { restaurantService, Restaurant } from '../services/restaurant.service';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BackendStatus } from '../components/BackendStatus';
import { toast } from 'sonner';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCuisines();
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [searchQuery, selectedCuisine]);

  const loadCuisines = async () => {
    try {
      const data = await restaurantService.getCuisines();
      setCuisines(['All', ...data]);
    } catch (error) {
      
      console.warn('Using default cuisines');
      setCuisines(['All', 'Continental', 'Fusion', 'Italian', 'Fast Food', 'Pizza & Burger', 'Mughlai', 'Chinese', 'Burger', 'BBQ', 'Café']);
    }
  };

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }
      if (selectedCuisine !== 'All') {
        filters.cuisine = selectedCuisine;
      }

      const data = await restaurantService.getAllRestaurants(filters);
      setRestaurants(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRestaurants();
  };

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`);
  };

  const handleAuthClick = () => {
    navigate('/auth/login');
  };

  const handleDashboardClick = () => {
    if (user?.role === 'customer') {
      navigate('/customer');
    } else if (user?.role === 'manager') {
      navigate('/manager');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">ReserveX</h1>
                <p className="text-xs text-muted-foreground">Rajshahi, Bangladesh</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <Button onClick={handleDashboardClick} variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              ) : (
                <Button onClick={handleAuthClick} className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Premium Dining in <span className="text-primary">Rajshahi</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Reserve your table at the finest restaurants with real-time availability
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search restaurants by name or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-card border-primary/20 focus:border-primary"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </div>
          </form>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className="rounded-full"
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="container mx-auto px-4 py-8 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-xl text-muted-foreground">Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No restaurants found</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.id)}
                className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {restaurant.priceRange}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({restaurant.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">{restaurant.totalSeats} seats</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 ReserveX. Premium Restaurant Reservation System</p>
            <p className="mt-2">Rajshahi City, Rajshahi Division, Bangladesh</p>
          </div>
        </div>
      </footer>

      {/* Backend Status Indicator */}
      <BackendStatus />
    </div>
  );
}