import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Star,
  User,
  LogOut,
  ChefHat,
  MapPin,
  Clock,
  Trash2,
  Edit
} from 'lucide-react';
import { db, Restaurant, Booking, Review } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [favourites, setFavourites] = useState<Restaurant[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Profile edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }

    loadDashboardData();
    setEditName(user.name);
    setEditEmail(user.email);
  }, [user, navigate]);

  const loadDashboardData = () => {
    if (!user) return;

    setFavourites(db.getFavouriteRestaurants(user.id));
    setBookings(db.getBookingsByUser(user.id).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setReviews(db.getReviewsByUser(user.id));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      db.updateBooking(bookingId, { status: 'cancelled' });
      loadDashboardData();
      toast.success('Booking cancelled');
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      db.deleteReview(reviewId);
      loadDashboardData();
      toast.success('Review deleted');
    }
  };

  const handleRemoveFavourite = (restaurantId: string) => {
    if (!user) return;
    db.toggleFavourite(user.id, restaurantId);
    loadDashboardData();
    toast.success('Removed from favourites');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }

    updateProfile({ name: editName, email: editEmail });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  const getRestaurantById = (id: string) => db.getRestaurantById(id);

  const upcomingBookings = bookings.filter(b => 
    (b.status === 'pending' || b.status === 'confirmed') && 
    new Date(b.date) >= new Date()
  );

  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || 
    b.status === 'cancelled' ||
    (new Date(b.date) < new Date() && b.status === 'confirmed')
  );

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">ReserveX</h1>
                <p className="text-xs text-muted-foreground">Customer Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">Manage your reservations and explore your favourite restaurants</p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="favourites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favourites
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <Calendar className="h-4 w-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Calendar className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold">{confirmedBookings}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Favourites</p>
                    <p className="text-2xl font-bold">{favourites.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-yellow-500/10">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">{avgRating}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Reservations</h3>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming reservations</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => {
                    const restaurant = getRestaurantById(booking.restaurantId);
                    if (!restaurant) return null;
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{restaurant.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.date} • {booking.timeSlot}</p>
                            <p className="text-sm text-muted-foreground">{booking.seats} seats</p>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                          {booking.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Favourite Restaurants */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Your Favourite Restaurants</h3>
              {favourites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No favourite restaurants yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favourites.slice(0, 3).map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                      className="cursor-pointer rounded-lg border border-border hover:border-primary/50 transition-all overflow-hidden"
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold">{restaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Favourites Tab */}
          <TabsContent value="favourites">
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">My Favourite Restaurants</h3>
              {favourites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground mb-2">No favourites yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Start adding restaurants to your favourites</p>
                  <Button onClick={() => navigate('/')}>Explore Restaurants</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favourites.map((restaurant) => (
                    <Card key={restaurant.id} className="overflow-hidden hover:border-primary/50 transition-all">
                      <div
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        className="cursor-pointer"
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold mb-1">{restaurant.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-semibold">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{restaurant.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFavourite(restaurant.id)}
                          className="w-full gap-2 text-red-500 border-red-500 hover:bg-red-500/10"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            {/* Upcoming Reservations */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">Upcoming Reservations</h3>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming reservations</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const restaurant = getRestaurantById(booking.restaurantId);
                    if (!restaurant) return null;
                    return (
                      <div key={booking.id} className="p-4 rounded-lg border border-border">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full md:w-32 h-32 rounded-lg object-cover cursor-pointer"
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                              </div>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.timeSlot}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{restaurant.location}</span>
                              </div>
                              <div>
                                <span className="font-semibold">{booking.seats}</span> seats
                              </div>
                            </div>
                            {booking.specialRequests && (
                              <p className="text-sm text-muted-foreground mb-3">
                                <span className="font-semibold">Special Requests:</span> {booking.specialRequests}
                              </p>
                            )}
                            <div className="flex gap-2">
                              {booking.status === 'pending' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Past Reservations */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">Past Reservations</h3>
              {pastBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No past reservations</p>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => {
                    const restaurant = getRestaurantById(booking.restaurantId);
                    if (!restaurant) return null;
                    return (
                      <div key={booking.id} className="p-4 rounded-lg border border-border opacity-75">
                        <div className="flex items-center gap-4">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{restaurant.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.date} • {booking.timeSlot} • {booking.seats} seats
                                </p>
                              </div>
                              <Badge variant={booking.status === 'completed' ? 'default' : 'outline'}>
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">My Reviews</h3>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground mb-2">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">Visit restaurants and leave your feedback</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const restaurant = getRestaurantById(review.restaurantId);
                    if (!restaurant) return null;
                    return (
                      <div key={review.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold">{restaurant.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6">My Profile</h3>
              
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <p className="mt-2 p-3 rounded-md bg-secondary">{user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-2 p-3 rounded-md bg-secondary">{user.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="mt-2 p-3 rounded-md bg-secondary capitalize">{user.role}</p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="mt-2 p-3 rounded-md bg-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => setIsEditingProfile(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditName(user.name);
                        setEditEmail(user.email);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}