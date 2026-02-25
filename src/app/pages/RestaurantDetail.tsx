import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Heart,
  Loader2,
  ArrowLeft,
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';
import { restaurantService, Restaurant, MenuItem } from '../services/restaurant.service';
import { reviewService, Review } from '../services/review.service';
import { favouriteService } from '../services/favourite.service';
import { bookingService } from '../services/booking.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    timeSlot: '6:00 PM - 8:00 PM',
    seats: 2,
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialRequests: ''
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email
      }));
    }
  }, [user]);

  useEffect(() => {
    if (id && isAuthenticated) {
      checkFavouriteStatus();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (bookingForm.date && bookingForm.timeSlot && id) {
      checkAvailability();
    }
  }, [bookingForm.date, bookingForm.timeSlot, id]);

  const loadRestaurantData = async () => {
    setLoading(true);
    try {
      const [restaurantData, menuData, reviewsData] = await Promise.all([
        restaurantService.getRestaurantById(id!),
        restaurantService.getRestaurantMenu(id!),
        reviewService.getRestaurantReviews(id!)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
      setReviews(reviewsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load restaurant details');
      navigate('/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const checkFavouriteStatus = async () => {
    try {
      const isFav = await favouriteService.isFavourite(id!);
      setIsFavourite(isFav);
    } catch (error) {
      console.error('Failed to check favourite status');
    }
  };

  const checkAvailability = async () => {
    try {
      const seats = await restaurantService.getAvailableSeats(
        id!,
        bookingForm.date,
        bookingForm.timeSlot
      );
      setAvailableSeats(seats);
    } catch (error) {
      setAvailableSeats(null);
    }
  };

  const toggleFavourite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favourites');
      navigate('/auth');
      return;
    }

    try {
      const result = await favouriteService.toggleFavourite(id!);
      setIsFavourite(result.isFavourite);
      toast.success(result.isFavourite ? 'Added to favourites' : 'Removed from favourites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favourites');
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.createBooking({
        restaurantId: id!,
        ...bookingForm
      });
      
      toast.success('Booking created successfully!');
      setBookingDialogOpen(false);
      // Reset form
      setBookingForm({
        date: '',
        timeSlot: '6:00 PM - 8:00 PM',
        seats: 2,
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        specialRequests: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({
        restaurantId: id!,
        ...reviewForm
      });
      
      toast.success('Review submitted successfully!');
      setReviewDialogOpen(false);
      setReviewForm({ rating: 5, comment: '' });
      // Reload reviews
      const reviewsData = await reviewService.getRestaurantReviews(id!);
      setReviews(reviewsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
    '6:00 PM - 8:00 PM',
    '7:00 PM - 9:00 PM',
    '8:00 PM - 10:00 PM',
    '9:00 PM - 11:00 PM'
  ];

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-96 bg-muted">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/restaurants')}
          className="absolute top-6 left-6 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Favourite Button */}
        <button
          onClick={toggleFavourite}
          className="absolute top-6 right-6 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${isFavourite ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <span className="font-semibold">{restaurant.cuisine}</span>
              <span>•</span>
              <span>{restaurant.priceRange}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-white/80">({restaurant.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Menu */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Menu</h2>
              <div className="space-y-8">
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 text-primary">{category}</h3>
                    <div className="grid gap-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-border last:border-0">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <span className="font-bold text-primary whitespace-nowrap">৳{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Write a Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <Label>Rating</Label>
                        <select
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                          className="w-full mt-1.5 h-10 px-3 bg-input-background border border-input rounded-md"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      <div>
                        <Label>Comment</Label>
                        <Textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Share your experience..."
                          rows={4}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Restaurant Info</h3>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                  <p className="text-sm text-muted-foreground">{restaurant.city}, {restaurant.division}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Capacity</p>
                  <p className="text-sm text-muted-foreground">{restaurant.totalSeats} seats</p>
                </div>
              </div>

              <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" size="lg">
                    Book a Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book a Table at {restaurant.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Time Slot</Label>
                      <select
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                        className="w-full mt-1.5 h-10 px-3 bg-input-background border border-input rounded-md"
                        required
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      {availableSeats !== null && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {availableSeats > 0 ? `${availableSeats} seats available` : 'Fully booked'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Number of Seats</Label>
                      <Input
                        type="number"
                        value={bookingForm.seats}
                        onChange={(e) => setBookingForm({ ...bookingForm, seats: parseInt(e.target.value) })}
                        min={1}
                        max={20}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={bookingForm.customerName}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={bookingForm.customerEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={bookingForm.customerPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Special Requests (Optional)</Label>
                      <Textarea
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submitting || (availableSeats !== null && availableSeats < bookingForm.seats)} 
                      className="w-full"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
