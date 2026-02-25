import React, { useState } from 'react';
import { Calendar, Users, MapPin, Search, Star } from 'lucide-react';
import { db, TIME_SLOTS } from '../data/mockData';

interface ListingsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const restaurants = db.getRestaurants();

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check availability for "Tonight" (Defaulting to today's 6-8 PM slot for preview)
  const today = new Date().toISOString().split('T')[0];
  const peakSlot = TIME_SLOTS[2]; // 6:00 PM - 8:00 PM

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-white mb-6">Find your table in Rajshahi</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search restaurants (e.g., Chillox, Aurora)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="flex gap-4">
              <select className="h-12 px-4 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#d4af37] min-w-[140px]">
                <option>Any Price</option>
                <option>$</option>
                <option>$$</option>
                <option>$$$</option>
                <option>$$$$</option>
              </select>
              <select className="h-12 px-4 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#d4af37] min-w-[140px]">
                <option>Any Rating</option>
                <option>4.5+</option>
                <option>4.0+</option>
                <option>3.5+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => {
             const availableSeats = db.getAvailableSeats(restaurant.id, today, peakSlot);
             const isAvailable = availableSeats > 0;

             return (
              <div 
                key={restaurant.id} 
                className="bg-[#222] rounded-xl overflow-hidden border border-[#333] hover:border-[#d4af37] transition-all group cursor-pointer"
                onClick={() => onNavigate('details', { id: restaurant.id })}
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-2xl font-serif text-white font-bold">{restaurant.name}</h2>
                    <p className="text-zinc-300 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {restaurant.location}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#d4af37] font-medium">{restaurant.cuisine}</span>
                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded text-white text-sm">
                      <Star className="w-3 h-3 fill-current text-[#d4af37]" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                    <div className="flex items-center gap-1">
                      <span className="text-white">{restaurant.price}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                    <div className="flex items-center gap-1">
                      {isAvailable ? (
                        <span className="text-green-500 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          {availableSeats} Seats (6-8 PM)
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Booked Out
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    className="w-full py-3 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('details', { id: restaurant.id });
                    }}
                  >
                    Reserve Table
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
