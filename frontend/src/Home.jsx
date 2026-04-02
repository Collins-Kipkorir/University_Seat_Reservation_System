import React, { useState, useEffect } from "react";
import { SeatMap } from "./Components/SeatMap.jsx";
import { ReservationForm } from "./Components/ReservationForm.jsx";
import { ReservationList } from "./Components/ReservationList.jsx";
import { LogOut, MapPin, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, venues, reservations } from "./api";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [venueData, setVenueData] = useState([]);
  const [reservationsList, setReservationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    auth.me()
      .then((data) => {
        if (!data.authenticated) {
          navigate('/');
          return;
        }
        setUser(data.user);
        return Promise.all([venues.list(), reservations.list()]);
      })
      .then(([v, r]) => {
        if (v) setVenueData(v.venues);
        if (r) setReservationsList(r.reservations);
      })
      .catch((err) => {
        if (err.message !== 'Unauthenticated. Please log in.') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const refreshData = () => {
    Promise.all([venues.list(), reservations.list()])
      .then(([v, r]) => {
        setVenueData(v.venues);
        setReservationsList(r.reservations);
      })
      .catch((err) => setError(err.message));
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } finally {
      navigate('/');
    }
  };

  const handleSeatClick = (tableId) => {
    const venue = venueData.find((v) => v.table_id === tableId);
    if (!venue || venue.remaining <= 0) return;
    if (user?.role === 'guest' && venue.shade === 'A') return;

    if (selectedSeats.includes(tableId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== tableId));
    } else {
      setSelectedSeats([tableId]);
    }
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
  };

  const handleSubmitReservation = async (newBooking) => {
    setError('');
    const venue = venueData.find((v) => v.table_id === newBooking.seats[0]);
    if (!venue) return;

    try {
      await reservations.create({
        venue_id: venue.id,
        group_size: newBooking.numberOfPeople,
        booking_time: newBooking.time,
      });
      setSelectedSeats([]);
      refreshData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditReservation = async (id, updates) => {
    setError('');
    try {
      await reservations.update({ id, ...updates });
      refreshData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReservation = async (id) => {
    setError('');
    try {
      await reservations.cancel(id);
      refreshData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500 font-bold">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased">

      <nav className="bg-slate-900 shadow-xl sticky top-0 z-[100] border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
              <MapPin style={{ color: '#FFFFFF' }} className="size-6" />
            </div>

            <div className="flex flex-col">
              <div style={{
                color: '#FFFFFF',
                fontSize: '1.25rem',
                fontWeight: '900',
                letterSpacing: '-0.025em',
                lineHeight: '1.2'
              }}>
                University Seat Reservation
              </div>
              <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest block mt-1">
                {user.full_name} ({user.role})
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-slate-800 hover:bg-red-600 px-5 py-2.5 rounded-full transition-all duration-300 border border-slate-700 shadow-md"
          >
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">Logout</span>
            <LogOut style={{ color: '#FFFFFF' }} className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-2 w-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Select Your Spot</h2>
              </div>

              <div className="bg-slate-50 rounded-[1.5rem] p-6 border border-dashed border-slate-300">
                <SeatMap
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                  venueData={venueData}
                  userRole={user.role}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">

            <div className="bg-white rounded-[2rem] shadow-2xl border-t-8 border-blue-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <ClipboardList size={100} />
               </div>
               <div className="p-2">
                 <ReservationForm
                   selectedSeats={selectedSeats}
                   onSubmit={handleSubmitReservation}
                   onClearSelection={handleClearSelection}
                   userRole={user.role}
                   venueData={venueData}
                 />
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
              <div className="flex items-center gap-2 mb-4 px-2">
                <ClipboardList size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">My Reservations</h3>
              </div>
              <ReservationList
                reservations={reservationsList}
                onEdit={handleEditReservation}
                onDelete={handleDeleteReservation}
                userRole={user.role}
              />
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 py-10 bg-slate-900 text-slate-500 text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>
            © 2026 University Reservation System | Secure Campus Infrastructure
          </p>
        </div>
      </footer>
    </div>
  );
}
