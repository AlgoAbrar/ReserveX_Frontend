
import React, { useEffect, useState } from 'react';
import { Calendar, Heart, Clock, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/booking.service';
import { favouriteService } from '../services/favourite.service';

// 🔷 Types
interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  location: string;
  date: string;
  timeSlot: string;
  seats: number;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

const CustomerDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favourites, setFavourites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingData, favData] = await Promise.all([
        bookingService.getUserBookings(),
        favouriteService.getUserFavourites()
      ]);

      setBookings(bookingData);
      setFavourites(favData);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= today
  );

  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < today
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* 👤 User Info */}
        <div className="bg-[#1e1e1e] p-6 rounded-xl mb-8 border border-gray-700">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* 📅 Upcoming Bookings */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar /> Upcoming Bookings
          </h2>

          {upcomingBookings.length === 0 ? (
            <p className="text-gray-400">No upcoming bookings</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#1e1e1e] p-5 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {b.restaurantName}
                  </h3>

                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {b.location}
                  </p>

                  <p className="text-sm mt-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {b.date} | {b.timeSlot}
                  </p>

                  <p className="text-sm mt-1">👥 {b.seats} seats</p>

                  <button
                    className="mt-4 w-full py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                    onClick={() =>
                      onNavigate('details', { id: b.restaurantId })
                    }
                  >
                    View Restaurant
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ❤️ Favourite Restaurants */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Heart /> Your Favourites
          </h2>

          {favourites.length === 0 ? (
            <p className="text-gray-400">No favourites yet</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700 cursor-pointer"
                  onClick={() => onNavigate('details', { id: r.id })}
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{r.name}</h3>
                    <p className="text-sm text-gray-400">{r.cuisine}</p>

                    <div className="flex items-center gap-1 mt-2 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      {r.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🕓 Past Bookings */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Past Bookings
          </h2>

          {pastBookings.length === 0 ? (
            <p className="text-gray-400">No past bookings</p>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#1e1e1e] p-4 rounded border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {b.restaurantName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {b.date} | {b.timeSlot}
                    </p>
                  </div>

                  <button
                    className="px-4 py-1 bg-yellow-500 text-black rounded"
                    onClick={() =>
                      onNavigate('details', { id: b.restaurantId })
                    }
                  >
                    Book Again
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default CustomerDashboard;