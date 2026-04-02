import React, { useState, useMemo } from "react";
import { Calendar, Users, User, ClipboardList } from "lucide-react";

export function ReservationForm({ selectedSeats, onSubmit, onClearSelection, userRole = "student", venueData = [] }) {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reservationTime, setReservationTime] = useState("");

  const maxGroupSize = userRole === "guest" ? 3 : 6;

  const selectedVenue = useMemo(() => {
    if (selectedSeats.length === 0) return null;
    return venueData.find((v) => v.table_id === selectedSeats[0]);
  }, [selectedSeats, venueData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      alert("Please select a shade/table first!");
      return;
    }

    if (!reservationTime) {
      alert("Please select a reservation time.");
      return;
    }

    onSubmit({
      userType: userRole,
      numberOfPeople,
      seats: selectedSeats,
      time: reservationTime,
    });

    setNumberOfPeople(1);
    setReservationTime("");
    onClearSelection();
  };

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
         Make a Reservation
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <User className="size-4 text-blue-600" />
            I am a:
          </label>
          <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium capitalize text-gray-700">
            {userRole}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <Users className="size-4 text-blue-600" />
            Group Size {userRole === "guest" && "(Max 3)"}
          </label>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            {Array.from({ length: maxGroupSize }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Person" : "People"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-sm">
            <Calendar className="size-4 text-blue-600" />
            Booking Time
          </label>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            min={minDateTime}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-bold text-gray-700 text-sm">Selected Shade Seats</label>
          <div className="p-4 bg-blue-50 rounded-xl min-h-[60px] border border-dashed border-blue-200 flex items-center justify-center">
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="px-4 py-1 bg-blue-600 text-white rounded-full text-xs font-black shadow-sm">
                    {seat}
                    {selectedVenue && <span className="ml-1 opacity-70">({selectedVenue.shade})</span>}
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
