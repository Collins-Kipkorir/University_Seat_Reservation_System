import React, { useState } from "react";
import { SeatMap } from "./Components/SeatMap.jsx";
import { ReservationForm } from "./Components/ReservationForm.jsx";
import { ReservationList } from "./Components/ReservationList.jsx";
import { LogOut, MapPin, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  // State Management
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservations, setReservations] = useState([]);

  // 1. Handles clicking a table on the map
  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      // Allowing one table selection at a time for clarity
      setSelectedSeats([seatId]); 
    }
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
  };

  // 2. Handles the "Confirm Reservation" button click
  const handleSubmitReservation = (newBooking) => {
    const reservationWithId = {
      id: Date.now().toString(),
      ...newBooking,
    };
    
    setReservations([...reservations, reservationWithId]);
    setSelectedSeats([]); // Clear map selection after booking
  };

  const handleEditReservation = (id, updates) => {
    setReservations(reservations.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // 3. Handles deleting a booking (Refunds capacity back to the map)
  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased">
      
      {/* --- MODERN NAV BAR (Forced White Text) --- */}
      <nav className="bg-slate-900 shadow-xl sticky top-0 z-[100] border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
              <MapPin style={{ color: '#FFFFFF' }} className="size-6" />
            </div>
            
            <div className="flex flex-col">
              {/* Forced White Title - Using Div to avoid Global H1 CSS conflicts */}
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
                Campus Management System
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-2 bg-slate-800 hover:bg-red-600 px-5 py-2.5 rounded-full transition-all duration-300 border border-slate-700 shadow-md"
          >
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">Logout</span>
            <LogOut style={{ color: '#FFFFFF' }} className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Column: The Interactive Map */}
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
                  reservations={reservations} 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Form & Recent Bookings */}
          <div className="space-y-8">
            
            {/* Reservation Form Card */}
            <div className="bg-white rounded-[2rem] shadow-2xl border-t-8 border-blue-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <ClipboardList size={100} />
               </div>
               <div className="p-2">
                 <ReservationForm
                   selectedSeats={selectedSeats}
                   onSubmit={handleSubmitReservation}
                   onClearSelection={handleClearSelection}
                 />
               </div>
            </div>

            {/* Recent Bookings List Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
              <div className="flex items-center gap-2 mb-4 px-2">
                <ClipboardList size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">Recent Bookings</h3>
              </div>
              <ReservationList
                reservations={reservations}
                onEdit={handleEditReservation}
                onDelete={handleDeleteReservation}
              />
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
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