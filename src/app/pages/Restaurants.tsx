import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Star, MapPin, Loader2 } from 'lucide-react';
import { restaurantService, Restaurant } from '../services/restaurant.service';
import { toast } from 'sonner';

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('priceRange') || '');
  const [minRating, setMinRating] = useState<number | undefined>(
    searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
  );
  const [cuisines, setCuisines] = useState<string[]>([]);

  useEffect(() => {
    loadCuisines();
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [searchTerm, selectedCuisine, selectedPriceRange, minRating]);

  const loadCuisines = async () => {
    try {
      const data = await restaurantService.getCuisines();
      setCuisines(data);
    } catch (error: any) {
      // Use default cuisines on error
      console.warn('Using default cuisines');
      setCuisines(['Continental', 'Fusion', 'Italian', 'Fast Food', 'Pizza & Burger', 'Mughlai', 'Chinese', 'Burger', 'BBQ', 'Café']);
    }
  };

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCuisine) filters.cuisine = selectedCuisine;
      if (selectedPriceRange) filters.priceRange = selectedPriceRange;
      if (minRating) filters.minRating = minRating;

      const data = await restaurantService.getAllRestaurants(filters);
      setRestaurants(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateSearchParams('search', value);
  };

  const handleCuisineChange = (value: string) => {
    setSelectedCuisine(value);
    updateSearchParams('cuisine', value);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPriceRange(value);
    updateSearchParams('priceRange', value);
  };

  const handleRatingChange = (value: string) => {
    const rating = value ? parseFloat(value) : undefined;
    setMinRating(rating);
    updateSearchParams('minRating', value);
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Restaurants in Rajshahi</h1>
          <p className="text-muted-foreground">
            Discover and book the best dining experiences
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => handleCuisineChange(e.target.value)}
              className="h-12 px-4 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={selectedPriceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="h-12 px-4 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
            >
              <option value="">All Prices</option>
              <option value="৳">৳ - Budget</option>
              <option value="৳৳">৳৳ - Moderate</option>
              <option value="৳৳৳">৳৳৳ - Premium</option>
            </select>

            {/* Rating Filter */}
            <select
              value={minRating?.toString() || ''}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="h-12 px-4 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found <span className="font-semibold text-foreground">{restaurants.length}</span> restaurants
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {restaurant.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="font-medium text-primary">{restaurant.cuisine}</span>
                    <span>•</span>
                    <span>{restaurant.priceRange}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{restaurant.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {restaurant.totalReviews} reviews
                    </span>
                    <span className="text-primary font-semibold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && restaurants.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                No restaurants found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('');
                  setSelectedPriceRange('');
                  setMinRating(undefined);
                  setSearchParams(new URLSearchParams());
                }}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}