import React from 'react';
import { TabletIcon as Table, Users } from 'lucide-react';

export const SeatMap = ({ selectedSeats, onSeatClick, reservations = [] }) => {
  const shadeA = ["A1", "A2", "A3", "A4", "A5", "A6"];
  const shadeB = Array.from({ length: 25 }, (_, i) => `B${i + 1}`);

  const getTableStatus = (id) => {
    // 1. Find every booking that includes this table ID
    const bookingsForThisTable = reservations.filter(res => res.seats.includes(id));
    
    // 2. Sum up the people from those bookings
    // Note: This matches the 'numberOfPeople' key from your ReservationForm
    const totalPeople = bookingsForThisTable.reduce((sum, res) => sum + (Number(res.numberOfPeople) || 0), 0);
    
    const remaining = 6 - totalPeople;
    const isFull = remaining <= 0;
    
    return { totalPeople, remaining, isFull };
  };

  const TableCard = ({ id }) => {
    const { totalPeople, remaining, isFull } = getTableStatus(id);
    const isSelected = selectedSeats.includes(id);

    return (
      <button
        disabled={isFull}
        onClick={() => onSeatClick(id)}
        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
          isFull 
            ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed" 
            : isSelected
              ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-105"
              : "bg-white border-slate-100 hover:border-blue-400 text-slate-800 shadow-sm"
        }`}
      >
        <Table className={`size-8 mb-1 ${isSelected ? "text-white" : "text-slate-600"}`} />
        <span className="font-black text-lg">{id}</span>
        
        {/* Seats Remaining Label */}
        <div className="mt-2 flex items-center gap-1">
          <Users size={10} className={isSelected ? "text-blue-200" : "text-slate-400"} />
          <span className={`text-[9px] font-bold uppercase tracking-tighter ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
            {isFull ? "FULL" : `${remaining} Left`}
          </span>
        </div>

        {/* Visual Progress Bar (Optional, but looks great) */}
        {!isFull && totalPeople > 0 && (
          <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-blue-500'}`} 
              style={{ width: `${(totalPeople / 6) * 100}%` }}
            />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-12">
      {/* SHADE A SECTION */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Shade A</h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {shadeA.map(id => <TableCard key={id} id={id} />)}
        </div>
      </section>

      {/* SHADE B SECTION */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Shade B</h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {shadeB.map(id => <TableCard key={id} id={id} />)}
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

  <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

  <div className="flex items-center gap-2">
    <Users size={14} className="text-blue-500" />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max 6 per Table</span>
  </div>
    </div>
    </div>
  );
}   