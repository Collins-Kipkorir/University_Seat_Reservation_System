import React, { useState } from "react";
import { Calendar, Users, User, ClipboardList } from "lucide-react";

export function ReservationForm({ selectedSeats, onSubmit, onClearSelection }) {
  // State to hold form data - matching your variable names
  const [userType, setUserType] = useState("student");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reservationTime, setReservationTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check if a Table (A1, B5, etc) is selected
    if (selectedSeats.length === 0) {
      alert("Please select a shade/table first!");
      return;
    }

    // 2. Check if the Time is filled
    if (!reservationTime) {
      alert("Please select a reservation time.");
      return;
    }

    // 3. SUCCESS: Send the data to Home.jsx
    // Note: We REMOVED the "cannot exceed" logic because 1 Table = 6 Seats
    onSubmit({
      userType,
      numberOfPeople,
      seats: selectedSeats,
      time: reservationTime,
    });

    // 4. Reset form after success
    setNumberOfPeople(1);
    setReservationTime("");
    onClearSelection(); // Clears the blue selection on the map
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
         Make a Reservation
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* User Type */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <User className="size-4 text-blue-600" />
            I am a:
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            <option value="student">Student</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {/* Group Size (1-6) */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <Users className="size-4 text-blue-600" />
            Group Size
          </label>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Person" : "People"}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selection */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <Calendar className="size-4 text-blue-600" />
            Booking Time
          </label>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            required
          />
        </div>

        {/* Selected Tables Preview */}
        <div>
          <label className="block mb-2 font-bold text-gray-700 text-sm">Selected Shade Seats</label>
          <div className="p-4 bg-blue-50 rounded-xl min-h-[60px] border border-dashed border-blue-200 flex items-center justify-center">
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="px-4 py-1 bg-blue-600 text-white rounded-full text-xs font-black shadow-sm">
                    {seat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center">
                Click a shade on the map to select it
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all active:scale-95 mt-4"
        >
          Confirm Reservation
        </button>
      </form>
    </div>
  );
}