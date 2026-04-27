import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const EventCard = ({ event, navigate }) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const status =
    now < start ? "upcoming" : now > end ? "ended" : "live";

  const statusStyles = {
    live: "bg-green-500/15 text-green-400 border-green-500/30",
    upcoming: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    ended: "bg-white/5 text-gray-500 border-white/10",
  };

  const statusLabel = { live: "Live", upcoming: "Upcoming", ended: "Ended" };

  return (
    <div onClick={() => navigate(`/admin/event/${event._id}`)} className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-violet-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)] cursor-pointer">
      {/* Map Image */}
      <div className="relative h-40 bg-white/5 overflow-hidden">
        <img
          src={event.mapURL}
          alt={event.name}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-transparent" />
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg leading-tight mb-1 truncate">{event.name}</h3>

        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.startDate)}
          </div>
          <span className="text-white/20">→</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.endDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/event/", { withCredentials: true })
      .then((res) => setEvents(res.data.events))
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (err.response?.status === 401) return navigate("/");
        setError(msg || "Failed to load events.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0f0f13] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">My Events</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and monitor your events</p>
          </div>
          <button
            onClick={() => navigate("/admin/event")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Event
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-violet-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No events yet</p>
            <p className="text-gray-600 text-sm mt-1">Create your first event to get started</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
