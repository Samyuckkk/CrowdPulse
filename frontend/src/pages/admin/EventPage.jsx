import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const typeStyles = {
  entry:     "bg-green-500/15 text-green-400 border-green-500/30",
  exit:      "bg-red-500/15 text-red-400 border-red-500/30",
  stage:     "bg-violet-500/15 text-violet-400 border-violet-500/30",
  food:      "bg-orange-500/15 text-orange-400 border-orange-500/30",
  market:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  activity:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  parking:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  camping:   "bg-lime-500/15 text-lime-400 border-lime-500/30",
  service:   "bg-white/5 text-gray-400 border-white/10",
  medical:   "bg-pink-500/15 text-pink-400 border-pink-500/30",
  emergency: "bg-red-600/20 text-red-300 border-red-600/40",
};

const severityStyles = {
  HIGH:   { bar: "bg-red-500",    badge: "bg-red-500/15 text-red-400 border-red-500/30" },
  MEDIUM: { bar: "bg-yellow-500", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  SAFE:   { bar: "bg-green-500",  badge: "bg-green-500/15 text-green-400 border-green-500/30" },
};

const crowdBarColor = (current, capacity) => {
  if (!capacity) return "bg-gray-600";
  const r = current / capacity;
  if (r >= 0.9) return "bg-red-500";
  if (r >= 0.6) return "bg-yellow-500";
  return "bg-green-500";
};

// ── Spinner / Error helpers ──────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {msg}
  </div>
);

const Empty = ({ icon, label, sub }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-violet-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </div>
    <p className="text-gray-400 font-medium">{label}</p>
    <p className="text-gray-600 text-sm mt-1">{sub}</p>
  </div>
);

const VolunteerAssignModal = ({
  alert,
  volunteers,
  loading,
  submitting,
  error,
  onClose,
  onAssign,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md bg-[#16161d] border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-semibold text-lg">Assign Volunteer</h2>
          <p className="text-gray-500 text-xs mt-0.5 font-mono">
            {alert.zoneId?.code} - {alert.zoneId?.name}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && <ErrorMsg msg={error} />}

      {loading ? (
        <Spinner />
      ) : volunteers.length === 0 ? (
        <Empty
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          label="No volunteers available"
          sub="Register volunteers for this event before assigning alerts"
        />
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {volunteers.map((volunteer) => {
            const isAssigned = alert.assignedVolunteerId?._id === volunteer._id;
            return (
              <button
                key={volunteer._id}
                type="button"
                onClick={() => onAssign(volunteer._id)}
                disabled={submitting || isAssigned}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isAssigned
                    ? "border-violet-500/40 bg-violet-500/10 cursor-default"
                    : "border-white/10 bg-white/5 hover:border-violet-500/30 hover:bg-white/10"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{volunteer.fullName}</p>
                    <p className="text-gray-500 text-xs truncate">{volunteer.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {isAssigned ? "Assigned" : submitting ? "Assigning..." : "Assign"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const VolunteerAssignmentBadge = ({ volunteerName }) => {
  if (!volunteerName) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400">
        <span className="h-2 w-2 rounded-full bg-gray-500" />
        No volunteer assigned
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
      <span className="h-2 w-2 rounded-full bg-violet-400" />
      <span className="text-violet-100">Assigned volunteer:</span>
      <span className="font-semibold text-white">{volunteerName}</span>
    </div>
  );
};

// ── Generate Alert Modal ────────────────────────────────────────────────────
const GenerateAlertModal = ({ zone, eventId, onClose, onSuccess }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError("Please select a video file.");
    setError("");
    setLoading(true);

    const data = new FormData();
    data.append("eventId", eventId);
    data.append("zoneId", zone.code);
    data.append("video", videoFile);

    try {
      const res = await axios.post("http://localhost:3000/alert/generate", data, { withCredentials: true });
      setResult(res.data.alert);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate alert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#16161d] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold text-lg">Generate Alert</h2>
            <p className="text-gray-500 text-xs mt-0.5 font-mono">{zone.code} — {zone.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {result ? (
          <div className="space-y-3">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold ${
              result.severity === "HIGH" ? "bg-red-500/10 border-red-500/30 text-red-400" :
              result.severity === "MEDIUM" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
              "bg-green-500/10 border-green-500/30 text-green-400"
            }`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Risk Level: {result.severity}
            </div>
            <p className="text-gray-400 text-sm bg-white/5 rounded-xl px-4 py-3 leading-relaxed">{result.action}</p>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Video Feed</label>
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 hover:bg-white/5 cursor-pointer transition-all duration-300">
                {videoFile ? (
                  <div className="flex items-center gap-2 text-violet-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span className="text-sm font-medium truncate max-w-[200px]">{videoFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Click to upload <span className="text-violet-400">video</span></p>
                    <p className="text-gray-600 text-xs">MP4, MOV, AVI</p>
                  </div>
                )}
                <input type="file" accept="video/*" onChange={(e) => { setError(""); setVideoFile(e.target.files[0]); }} className="hidden" />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Generate Alert"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Zones Tab ────────────────────────────────────────────────────────────────
const ZoneCard = ({ zone, alert, onClick }) => {
  const capacity = zone.capacity || 500; // mock capacity
  const currentCrowd = zone.currentCrowd || Math.floor(Math.random() * capacity); // mock crowd
  const ratio = Math.min(currentCrowd / capacity, 1);
  const pct = Math.round(ratio * 100);
  const sev = alert?.severity;

  return (
    <div onClick={onClick} className={`bg-white/5 hover:bg-white/8 border rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] cursor-pointer ${
      sev === "HIGH" ? "border-red-500/40" : sev === "MEDIUM" ? "border-yellow-500/40" : "border-white/10 hover:border-violet-500/30"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-mono mb-0.5">{zone.code}</p>
          <h3 className="text-white font-semibold">{zone.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${typeStyles[zone.type] || "bg-white/5 text-gray-400 border-white/10"}`}>
            {zone.type}
          </span>
          {sev && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${severityStyles[sev].badge}`}>
              {sev}
            </span>
          )}
        </div>
      </div>

      {alert && (
        <p className="text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          {alert.action}
        </p>
      )}

      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Crowd</span>
          <span>{currentCrowd} / {capacity} ({pct}%)</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${sev ? severityStyles[sev].bar : crowdBarColor(currentCrowd, capacity)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ZonesTab = ({ eventId, navigate }) => {
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:3000/event/${eventId}/zones`, { withCredentials: true }),
      axios.get(`http://localhost:3000/alert/${eventId}/active`, { withCredentials: true }),
    ])
      .then(([zonesRes, alertsRes]) => {
        setZones(zonesRes.data.zones);
        setAlerts(alertsRes.data.alerts);
      })
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load zones.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (zones.length === 0) return (
    <Empty
      icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      label="No zones found"
      sub="Zones will appear once seeded for this event"
    />
  );

  // map zoneId → latest unresolved alert
  const alertByZone = {};
  alerts.forEach((a) => {
    const zid = a.zoneId?._id || a.zoneId;
    if (!alertByZone[zid] || a.severity === "HIGH") alertByZone[zid] = a;
  });

  return (
    <>
      {selectedZone && (
        <GenerateAlertModal
          zone={selectedZone}
          eventId={eventId}
          onClose={() => setSelectedZone(null)}
          onSuccess={() => { setSelectedZone(null); fetchData(); }}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <ZoneCard key={zone._id} zone={zone} alert={alertByZone[zone._id]} onClick={() => setSelectedZone(zone)} />
        ))}
      </div>
    </>
  );
};

// ── Alerts Tab ───────────────────────────────────────────────────────────────
const AlertsTab = ({ eventId, navigate }) => {
  const [alerts, setAlerts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignError, setAssignError] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [assigningVolunteerId, setAssigningVolunteerId] = useState("");
  const [resolvingAlertId, setResolvingAlertId] = useState("");

  const fetchAlerts = () => {
    setLoading(true);
    setError("");
    axios.get(`http://localhost:3000/alert/${eventId}/active`, { withCredentials: true })
      .then((res) => setAlerts(res.data.alerts))
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load alerts.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [eventId, navigate]);

  const openAssignModal = async (alert) => {
    setSelectedAlert(alert);
    setAssignError("");
    setVolunteersLoading(true);

    try {
      const res = await axios.get(`http://localhost:3000/event/${eventId}/volunteers`, { withCredentials: true });
      setVolunteers(res.data.volunteers);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
        return;
      }
      setAssignError(err.response?.data?.message || "Failed to load volunteers.");
    } finally {
      setVolunteersLoading(false);
    }
  };

  const handleAssignVolunteer = async (volunteerId) => {
    if (!selectedAlert) return;

    setAssignError("");
    setAssigningVolunteerId(volunteerId);

    try {
      const res = await axios.patch(
        `http://localhost:3000/alert/${selectedAlert._id}/assign`,
        { volunteerId },
        { withCredentials: true }
      );

      setAlerts((current) =>
        current.map((alert) =>
          alert._id === selectedAlert._id ? { ...alert, ...res.data.alert } : alert
        )
      );
      setSelectedAlert((current) =>
        current ? { ...current, ...res.data.alert } : current
      );
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
        return;
      }
      setAssignError(err.response?.data?.message || "Failed to assign volunteer.");
    } finally {
      setAssigningVolunteerId("");
    }
  };

  const handleResolveAlert = async (alertId) => {
    setResolvingAlertId(alertId);

    try {
      await axios.patch(`http://localhost:3000/alert/${alertId}/resolve`, {}, { withCredentials: true });
      setAlerts((current) => current.filter((alert) => alert._id !== alertId));
      if (selectedAlert?._id === alertId) {
        setSelectedAlert(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
        return;
      }
      setError(err.response?.data?.message || "Failed to resolve alert.");
    } finally {
      setResolvingAlertId("");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (alerts.length === 0) return (
    <Empty
      icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      label="No active alerts"
      sub="All clear — no unresolved alerts for this event"
    />
  );

  return (
    <>
      {selectedAlert && (
        <VolunteerAssignModal
          alert={selectedAlert}
          volunteers={volunteers}
          loading={volunteersLoading}
          submitting={Boolean(assigningVolunteerId)}
          error={assignError}
          onClose={() => {
            setSelectedAlert(null);
            setAssignError("");
            setVolunteers([]);
          }}
          onAssign={handleAssignVolunteer}
        />
      )}

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert._id} className={`p-4 rounded-2xl border bg-white/5 ${
            alert.severity === "HIGH" ? "border-red-500/30" : alert.severity === "MEDIUM" ? "border-yellow-500/30" : "border-white/10"
          }`}>
            <div className="flex items-start gap-4">
              <span className={`mt-0.5 text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${severityStyles[alert.severity]?.badge}`}>
                {alert.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{alert.zoneId?.name || "Unknown Zone"} <span className="text-gray-500 font-mono text-xs">({alert.zoneId?.code})</span></p>
                <p className="text-gray-400 text-sm mt-0.5">{alert.action}</p>
                <div className="mt-3">
                  <VolunteerAssignmentBadge volunteerName={alert.assignedVolunteerId?.fullName} />
                </div>
              </div>
              <p className="text-gray-600 text-xs shrink-0">{new Date(alert.createdAt).toLocaleTimeString()}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => openAssignModal(alert)}
                className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all duration-200"
              >
                {alert.assignedVolunteerId ? "Reassign Volunteer" : "Assign Volunteer"}
              </button>
              <button
                type="button"
                onClick={() => handleResolveAlert(alert._id)}
                disabled={resolvingAlertId === alert._id}
                className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resolvingAlertId === alert._id ? "Resolving..." : "Resolve Alert"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ── Volunteers Tab ───────────────────────────────────────────────────────────
const VolunteersTab = ({ eventId, navigate }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/event/${eventId}/volunteers`, { withCredentials: true })
      .then((res) => setVolunteers(res.data.volunteers))
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load volunteers.");
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (volunteers.length === 0) return (
    <Empty
      icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      label="No volunteers assigned"
      sub={`Volunteers with eventId set to this event's ID will appear here`}
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {volunteers.map((v) => (
        <div key={v._id} className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-violet-500/30 rounded-2xl p-5 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
              {v.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{v.fullName}</p>
              <p className="text-gray-500 text-xs truncate">{v.email}</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3">
            {v.assignedTo ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
                <svg className="w-3.5 h-3.5 shrink-0 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-violet-100">Assigned zone:</span>
                <span className="font-semibold text-white">{v.assignedTo.name}</span>
                <span className="font-mono text-violet-300">({v.assignedTo.code})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400">
                <span className="h-2 w-2 rounded-full bg-gray-500" />
                Available for assignment
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Logs Tab ─────────────────────────────────────────────────────────────────
const LogsTab = ({ eventId, navigate }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/alert/${eventId}/logs`, { withCredentials: true })
      .then((res) => setLogs(res.data.alerts))
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load logs.");
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (logs.length === 0) return (
    <Empty
      icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      label="No resolved alerts"
      sub="Resolved alerts will be logged here"
    />
  );

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log) => (
        <div key={log._id} className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 opacity-75">
          <span className={`mt-0.5 text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${severityStyles[log.severity]?.badge}`}>
            {log.severity}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">{log.zoneId?.name || "Unknown Zone"} <span className="text-gray-500 font-mono text-xs">({log.zoneId?.code})</span></p>
            <p className="text-gray-400 text-sm mt-0.5">{log.action}</p>
            <div className="mt-3">
              <VolunteerAssignmentBadge volunteerName={log.assignedVolunteerId?.fullName} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gray-600 text-xs">Resolved</p>
            <p className="text-gray-500 text-xs">{new Date(log.resolvedAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const tabs = [
  { key: "zones",      label: "Zones",      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { key: "alerts",     label: "Alerts",     icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { key: "volunteers", label: "Volunteers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { key: "logs",       label: "Logs",       icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
];

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("zones");

  return (
    <div className="min-h-screen bg-[#0f0f13] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/admin")} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Event Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5 font-mono">{eventId}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40" : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "zones"      && <ZonesTab      eventId={eventId} navigate={navigate} />}
        {activeTab === "alerts"     && <AlertsTab     eventId={eventId} navigate={navigate} />}
        {activeTab === "volunteers" && <VolunteersTab  eventId={eventId} navigate={navigate} />}
        {activeTab === "logs"       && <LogsTab        eventId={eventId} navigate={navigate} />}
      </div>
    </div>
  );
};

export default EventPage;
