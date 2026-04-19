import React, { useState, useMemo } from 'react';
import { MapPin, Search, Star } from 'lucide-react';
import { db, TIME_SLOTS } from '../data/mockData';

export const ListingsPage = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('any');
  const [ratingFilter, setRatingFilter] = useState(0);

  const restaurants = db.getRestaurants();

  const today = new Date().toISOString().split('T')[0];
  const peakSlot = TIME_SLOTS[2];

  // 🔥 Optimized filtering using useMemo
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrice = priceFilter === 'any' || r.price === priceFilter;
      const matchRating = r.rating >= ratingFilter;

      return matchSearch && matchPrice && matchRating;
    });
  }, [searchTerm, priceFilter, ratingFilter, restaurants]);

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* 🔍 Search Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-6">
            Find Restaurants in Rajshahi
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, cuisine, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#1e1e1e] border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none"
              />
            </div>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="h-12 px-4 bg-[#1e1e1e] border border-gray-700 rounded-lg text-white"
            >
              <option value="any">Any Price</option>
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="h-12 px-4 bg-[#1e1e1e] border border-gray-700 rounded-lg text-white"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5+</option>
              <option value={4}>4.0+</option>
              <option value={3.5}>3.5+</option>
            </select>
          </div>
        </div>

        {/* 🍽 Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            const availableSeats = db.getAvailableSeats(
              restaurant.id,
              today,
              peakSlot
            );

            const isAvailable = availableSeats > 0;

            return (
              <div
                key={restaurant.id}
                onClick={() => onNavigate('details', { id: restaurant.id })}
                className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded flex items-center gap-1 text-sm text-white">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {restaurant.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {restaurant.name}
                  </h2>

                  <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" /> {restaurant.location}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-yellow-400 text-sm">
                      {restaurant.cuisine}
                    </span>
                    <span className="text-white text-sm">
                      {restaurant.price}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="mb-4 text-sm">
                    {isAvailable ? (
                      <span className="text-green-500">
                        {availableSeats} seats available (6-8 PM)
                      </span>
                    ) : (
                      <span className="text-red-500">Fully booked</span>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('details', { id: restaurant.id });
                    }}
                    className="w-full py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No restaurants found.
          </p>
        )}
      </div>
    </div>
  );
};