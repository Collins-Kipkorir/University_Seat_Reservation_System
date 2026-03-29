import React, { useState } from "react";
import { Calendar, Users, User, Edit2, Trash2, Save, X } from "lucide-react";

export function ReservationList({ reservations, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      userType: reservation.userType,
      numberOfPeople: reservation.numberOfPeople,
      time: reservation.time,
    });
  };

  const saveEdit = (id) => {
    onEdit(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-KE", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Reservations</h3>
        <p className="text-gray-400 text-center py-8 italic">No active bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Active Bookings ({reservations.length})
      </h3>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
          >
            {editingId === reservation.id ? (
              /* --- Edit Mode --- */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-500">User</label>
                    <select
                      value={editForm.userType}
                      onChange={(e) => setEditForm({ ...editForm, userType: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Size</label>
                    <input
                      type="number"
                      value={editForm.numberOfPeople}
                      onChange={(e) => setEditForm({ ...editForm, numberOfPeople: Number(e.target.value) })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-500">New Time</label>
                  <input
                    type="datetime-local"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => saveEdit(reservation.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Save className="size-4" /> Save
                  </button>
                  <button onClick={cancelEdit} className="p-2 border border-gray-200 rounded-lg">
                    <X className="size-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              /* --- View Mode --- */
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="size-4 text-blue-600" />
                      <span className="text-sm font-bold">{formatDateTime(reservation.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="size-3" />
                      <span className="text-xs capitalize">{reservation.userType}</span>
                      <span className="text-gray-300">|</span>
                      <Users className="size-3" />
                      <span className="text-xs">{reservation.numberOfPeople} People</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(reservation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reservation.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {reservation.seats.map((seat) => (
                    <span key={seat} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-black uppercase">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}