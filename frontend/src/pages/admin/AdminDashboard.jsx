import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const statusMeta = {
  live: {
    label: "Live",
    classes: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    glow: "from-emerald-400/35 to-cyan-400/5",
  },
  upcoming: {
    label: "Upcoming",
    classes: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    glow: "from-sky-400/35 to-violet-400/5",
  },
  ended: {
    label: "Archived",
    classes: "border-white/10 bg-white/5 text-slate-300",
    glow: "from-slate-400/20 to-transparent",
  },
};

const EventCard = ({ event, navigate }) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const status = now < start ? "upcoming" : now > end ? "ended" : "live";
  const meta = statusMeta[status];

  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/event/${event._id}`)}
      className="group panel float-in overflow-hidden rounded-[24px] text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative h-52 overflow-hidden bg-slate-900 bg-gradient-to-br ${meta.glow}`}>
        <img
          src={event.mapURL}
          alt={event.name}
          className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06101d] via-[#06101d]/35 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.classes}`}>
            {meta.label}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70">Event map intelligence</p>
          <h3 className="mt-2 text-2xl font-black text-white">{event.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="metric-tile">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Location</p>
            <p className="mt-2 text-sm font-medium text-white">{event.location}</p>
          </div>
          <div className="metric-tile">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Timeline</p>
            <p className="mt-2 text-sm font-medium text-white">
              {formatDate(event.startDate)} to {formatDate(event.endDate)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
          <span className="text-slate-400">Open command dashboard</span>
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200 transition-colors duration-200 group-hover:text-white">
            View event
          </span>
        </div>
      </div>
    </button>
  );
};

const EmptyState = ({ onCreate }) => (
  <div className="panel rounded-[28px] p-8 text-center sm:p-12">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] border border-cyan-300/20 bg-cyan-300/10">
      <svg className="h-10 w-10 text-cyan-200/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <h2 className="text-3xl font-black text-white">No events yet</h2>
    <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">
      Start your showcase with a polished event dashboard, upload the venue map, and turn this workspace into a live operations room.
    </p>
    <button type="button" onClick={onCreate} className="primary-button mt-8 px-6 py-3">
      Create First Event
    </button>
  </div>
);

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

  const liveCount = events.filter((event) => {
    const now = new Date();
    return now >= new Date(event.startDate) && now <= new Date(event.endDate);
  }).length;

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="hero-panel float-in rounded-[30px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-label mb-5">
                <span className="status-dot bg-cyan-300" />
                Admin command center
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Orchestrate every event like a live control room.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Monitor active shows, launch new operations spaces, and move from map to alert to volunteer response without losing context.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/event")}
              className="primary-button inline-flex items-center justify-center gap-2 px-6 py-3"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Event
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="metric-tile">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total events</p>
              <p className="mt-3 text-3xl font-black text-white">{events.length}</p>
            </div>
            <div className="metric-tile">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live now</p>
              <p className="mt-3 text-3xl font-black text-emerald-300">{liveCount}</p>
            </div>
            <div className="metric-tile">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Readiness</p>
              <p className="mt-3 text-3xl font-black text-cyan-200">{events.length > 0 ? "Active" : "Standby"}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {loading && (
            <div className="panel rounded-[28px] py-24">
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <EmptyState onCreate={() => navigate("/admin/event")} />
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} navigate={navigate} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
