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
  Loader2,
  X
} from 'lucide-react';
import { favouriteService, Favourite } from '../../services/favourite.service';
import { bookingService, Booking } from '../../services/booking.service';
import { reviewService, Review } from '../../services/review.service';
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

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Profile edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }

    loadDashboardData();
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [favData, bookData, revData] = await Promise.all([
        favouriteService.getMyFavourites(),
        bookingService.getMyBookings(),
        reviewService.getMyReviews()
      ]);

      setFavourites(favData);
      setBookings(bookData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setReviews(revData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review deleted');
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleRemoveFavourite = async (restaurantId: string) => {
    try {
      await favouriteService.removeFavourite(restaurantId);
      toast.success('Removed from favourites');
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove favourite');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      await updateProfile({ 
        name: editName, 
        email: editEmail,
        phone: editPhone 
      });
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
      <Badge className={`${variants[status] || ''} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const upcomingBookings = bookings.filter(b => 
    b.status !== 'cancelled' && b.status !== 'completed'
  );
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">ReserveX</h1>
                <p className="text-xs text-muted-foreground">Customer Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/')} variant="outline">
                Browse Restaurants
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">Manage your bookings, favourites, and reviews</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="favourites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favourites
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Favourites</p>
                    <p className="text-3xl font-bold">{favourites.length}</p>
                  </div>
                  <Heart className="h-10 w-10 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reviews Written</p>
                    <p className="text-3xl font-bold">{reviews.length}</p>
                  </div>
                  <Star className="h-10 w-10 text-primary" />
                </div>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Bookings</h3>
              {upcomingBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{booking.restaurant?.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{booking.timeSlot}</span>
                          <span>•</span>
                          <span>{booking.seats} seats</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Bookings</h3>
              {upcomingBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{booking.restaurant?.name}</h4>
                          <p className="text-sm text-muted-foreground">{booking.restaurant?.location}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/restaurants/${booking.restaurantId}`)}
                        >
                          View Restaurant
                        </Button>
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Past Bookings</h3>
              {pastBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No past bookings</p>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="border border-border rounded-lg p-4 opacity-75">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{booking.restaurant?.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{booking.timeSlot}</span>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
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
              <h3 className="text-xl font-bold mb-4">My Favourite Restaurants</h3>
              {favourites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favourites yet</p>
                  <Button className="mt-4" onClick={() => navigate('/restaurants')}>
                    Browse Restaurants
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favourites.map((fav) => (
                    <div key={fav.id} className="border border-border rounded-lg overflow-hidden group relative">
                      <button
                        onClick={() => handleRemoveFavourite(fav.restaurantId)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-card/90 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/restaurants/${fav.restaurantId}`)}
                      >
                        <div className="h-32 overflow-hidden">
                          <img
                            src={fav.restaurant?.image}
                            alt={fav.restaurant?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold">{fav.restaurant?.name}</h4>
                          <p className="text-sm text-muted-foreground">{fav.restaurant?.cuisine}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm font-semibold">{fav.restaurant?.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm">{fav.restaurant?.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">My Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold">{review.restaurant?.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'fill-primary text-primary' : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Profile Settings</h3>
              
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditName(user?.name || '');
                        setEditEmail(user?.email || '');
                        setEditPhone(user?.phone || '');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-lg">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge className="mt-1">Customer</Badge>
                  </div>
                  <Button onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
