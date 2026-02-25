import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Users, ChefHat } from 'lucide-react';
import { db, Restaurant, MenuItem, Review } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function RestaurantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [seats, setSeats] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [availableSeats, setAvailableSeats] = useState(0);

  // Review state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const timeSlots = [
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
    '7:00 PM - 9:00 PM',
    '9:00 PM - 11:00 PM'
  ];

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
  }, [id, user]);

  useEffect(() => {
    if (restaurant && bookingDate && timeSlot) {
      const available = db.getAvailableSeats(restaurant.id, bookingDate, timeSlot);
      setAvailableSeats(available);
    }
  }, [restaurant, bookingDate, timeSlot]);

  const loadRestaurantData = () => {
    if (!id) return;

    const restaurantData = db.getRestaurantById(id);
    if (restaurantData) {
      setRestaurant(restaurantData);
      setMenuItems(db.getMenuItemsByRestaurant(id));
      setReviews(db.getReviewsByRestaurant(id));

      if (user) {
        setIsFavourite(db.isFavourite(user.id, id));
        setCustomerName(user.name);
        setCustomerEmail(user.email);
      }
    }
  };

  const handleToggleFavourite = () => {
    if (!user) {
      toast.error('Please login to add favourites');
      navigate('/auth/login');
      return;
    }

    if (!id) return;

    const newState = db.toggleFavourite(user.id, id);
    setIsFavourite(newState);
    toast.success(newState ? 'Added to favourites' : 'Removed from favourites');
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to make a booking');
      navigate('/auth/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can make bookings');
      return;
    }

    if (!restaurant || !bookingDate || !timeSlot || !customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (seats > availableSeats) {
      toast.error(`Only ${availableSeats} seats available for this time slot`);
      return;
    }

    const booking = db.createBooking({
      restaurantId: restaurant.id,
      userId: user.id,
      date: bookingDate,
      timeSlot,
      seats,
      status: 'pending',
      customerName,
      customerEmail,
      customerPhone,
      specialRequests
    });

    toast.success('Booking created successfully! Awaiting restaurant confirmation.');
    
    // Reset form
    setBookingDate('');
    setTimeSlot('');
    setSeats(2);
    setSpecialRequests('');
    setAvailableSeats(0);

    // Redirect to customer dashboard
    setTimeout(() => navigate('/customer'), 1500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/auth/login');
      return;
    }

    if (!restaurant) return;

    if (!newReviewComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    db.createReview({
      restaurantId: restaurant.id,
      userId: user.id,
      userName: user.name,
      rating: newReviewRating,
      comment: newReviewComment
    });

    toast.success('Review submitted successfully!');
    setNewReviewComment('');
    setNewReviewRating(5);
    loadRestaurantData();
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  const menuByCategory = {
    Appetizer: menuItems.filter(m => m.category === 'Appetizer'),
    'Main Course': menuItems.filter(m => m.category === 'Main Course'),
    Dessert: menuItems.filter(m => m.category === 'Dessert'),
    Drinks: menuItems.filter(m => m.category === 'Drinks')
  };

  const bookedSeats = restaurant.totalSeats - (availableSeats || restaurant.totalSeats);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">ReserveX</span>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <Card className="p-6 md:p-8 border-primary/20">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary">
                      {restaurant.cuisine}
                    </Badge>
                    <Badge variant="outline">{restaurant.priceRange}</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavourite}
                  className={isFavourite ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isFavourite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-xl font-semibold">{restaurant.rating}</span>
                <span className="text-muted-foreground">({restaurant.totalReviews} reviews)</span>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.location}, {restaurant.city}, {restaurant.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Card className="p-4 bg-secondary">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Seats</p>
                  <p className="text-2xl font-bold">{restaurant.totalSeats}</p>
                </div>
              </Card>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setSelectedTab('book')}
              >
                Book Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8 mb-16">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="book">Book Table</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About Us</h2>
              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Seat Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">Available Seats</span>
                    <span className="text-2xl font-bold text-green-500">{restaurant.totalSeats}</span>
                  </div>
                  <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: restaurant.totalSeats }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                      >
                        <Users className="h-3 w-3 text-green-500" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    🟢 Green = Available (Select date & time to see real-time availability)
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-8">
            {Object.entries(menuByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:border-primary/50 transition-all">
                      <div className="h-32 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">৳{item.price}</span>
                          {item.available && (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {user && user.role === 'customer' && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          variant={newReviewRating >= rating ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewReviewRating(rating)}
                        >
                          <Star className={`h-4 w-4 ${newReviewRating >= rating ? 'fill-current' : ''}`} />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Your Review</Label>
                    <Textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              </Card>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Book Table Tab */}
          <TabsContent value="book">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Reserve Your Table</h2>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Please login to make a reservation</p>
                  <Button onClick={() => navigate('/auth/login')}>Login</Button>
                </div>
              ) : user.role !== 'customer' ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Only customers can make reservations</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeSlot">Time Slot *</Label>
                      <select
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        required
                        className="w-full mt-2 h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="seats">Number of Seats *</Label>
                      <Input
                        id="seats"
                        type="number"
                        min={1}
                        max={availableSeats || restaurant.totalSeats}
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value))}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+880 1711-000000"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {bookingDate && timeSlot && (
                    <Card className="p-4 bg-secondary">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Available Seats</p>
                          <p className="text-2xl font-bold text-green-500">{availableSeats}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Booked Seats</p>
                          <p className="text-2xl font-bold text-red-500">{bookedSeats}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-10 gap-2 mt-4">
                        {Array.from({ length: restaurant.totalSeats }).map((_, i) => {
                          const isAvailable = i < availableSeats;
                          return (
                            <div
                              key={i}
                              className={`aspect-square rounded ${
                                isAvailable
                                  ? 'bg-green-500/20 border-2 border-green-500'
                                  : 'bg-red-500/20 border-2 border-red-500'
                              } flex items-center justify-center`}
                            >
                              <Users className={`h-3 w-3 ${isAvailable ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500" />
                          Available
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500" />
                          Booked
                        </span>
                      </div>
                    </Card>
                  )}

                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any dietary restrictions or special occasions?"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Confirm Booking
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
