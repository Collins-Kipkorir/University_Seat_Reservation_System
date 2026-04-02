import React from 'react';
import { TabletIcon as Table, Users } from 'lucide-react';

export const SeatMap = ({ selectedSeats, onSeatClick, venueData = [], userRole = 'student' }) => {
  const shadeA = venueData.filter((v) => v.shade === 'A');
  const shadeB = venueData.filter((v) => v.shade === 'B');

  const TableCard = ({ venue }) => {
    const isSelected = selectedSeats.includes(venue.table_id);
    const isFull = venue.remaining <= 0;
    const isGuestRestricted = userRole === 'guest' && venue.shade === 'A';
    const disabled = isFull || isGuestRestricted;

    return (
      <button
        disabled={disabled}
        title={isGuestRestricted ? 'Guests cannot access Shade A' : ''}
        onClick={() => onSeatClick(venue.table_id)}
        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
          isGuestRestricted
            ? "bg-amber-50 border-amber-200 opacity-60 cursor-not-allowed"
            : isFull
              ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
              : isSelected
                ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-105"
                : "bg-white border-slate-100 hover:border-blue-400 text-slate-800 shadow-sm"
        }`}
      >
        <Table className={`size-8 mb-1 ${isSelected ? "text-white" : "text-slate-600"}`} />
        <span className="font-black text-lg">{venue.table_id}</span>

        <div className="mt-2 flex items-center gap-1">
          <Users size={10} className={isSelected ? "text-blue-200" : "text-slate-400"} />
          <span className={`text-[9px] font-bold uppercase tracking-tighter ${isSelected ? "text-blue-100" : isGuestRestricted ? "text-amber-600" : "text-slate-500"}`}>
            {isGuestRestricted ? "RESTRICTED" : isFull ? "FULL" : `${venue.remaining} Left`}
          </span>
        </div>

        {!isFull && !isGuestRestricted && venue.booked > 0 && (
          <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-blue-500'}`}
              style={{ width: `${(venue.booked / venue.capacity) * 100}%` }}
            />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Shade A {userRole === 'guest' && '(Restricted)'}</h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {shadeA.map((venue) => <TableCard key={venue.id} venue={venue} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Shade B</h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {shadeB.map((venue) => <TableCard key={venue.id} venue={venue} />)}
        </div>
      </section>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-md bg-white border-2 border-slate-200"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-4 rounded-md bg-blue-600 shadow-sm"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-4 rounded-md bg-slate-100 border-2 border-slate-200"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full / Occupied</span>
        </div>

        {userRole === 'guest' && (
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-md bg-amber-50 border-2 border-amber-200"></div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Restricted</span>
          </div>
        )}

        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-2">
          <Users size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max 6 per Table</span>
        </div>
      </div>
    </div>
  );
}
