import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const typeStyles = {
  entry: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  exit: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  stage: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  food: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  market: "border-yellow-400/25 bg-yellow-400/10 text-yellow-100",
  activity: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  parking: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  camping: "border-lime-400/25 bg-lime-400/10 text-lime-200",
  service: "border-white/10 bg-white/5 text-slate-300",
  medical: "border-pink-400/25 bg-pink-400/10 text-pink-200",
  emergency: "border-red-400/25 bg-red-400/10 text-red-200",
};

const severityStyles = {
  HIGH: {
    bar: "bg-red-400",
    badge: "border-red-400/25 bg-red-400/10 text-red-200",
  },
  MEDIUM: {
    bar: "bg-amber-400",
    badge: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
  SAFE: {
    bar: "bg-emerald-400",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  },
};

const crowdBarColor = (current, capacity) => {
  if (!capacity) return "bg-slate-500";
  const ratio = current / capacity;
  if (ratio >= 0.9) return "bg-red-400";
  if (ratio >= 0.6) return "bg-amber-400";
  return "bg-emerald-400";
};

const Spinner = () => (
  <div className="panel rounded-[24px] py-24">
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
    </div>
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
    {msg}
  </div>
);

const Empty = ({ icon, label, sub }) => (
  <div className="panel rounded-[24px] px-6 py-16 text-center">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-cyan-300/20 bg-cyan-300/10">
      <svg className="h-8 w-8 text-cyan-200/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </div>
    <p className="text-xl font-bold text-white">{label}</p>
    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">{sub}</p>
  </div>
);

const VolunteerAssignmentBadge = ({ volunteerName }) => {
  if (!volunteerName) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
        <span className="status-dot bg-slate-500" />
        No volunteer assigned
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">
      <span className="status-dot bg-cyan-300" />
      <span>Assigned volunteer:</span>
      <span className="font-semibold text-white">{volunteerName}</span>
    </div>
  );
};

const VolunteerAssignModal = ({
  alert,
  volunteers,
  loading,
  submitting,
  error,
  onClose,
  onAssign,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-sm">
    <div className="hero-panel w-full max-w-xl rounded-[28px] p-6 sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="section-label mb-4">
            <span className="status-dot bg-cyan-300" />
            Volunteer dispatch
          </p>
          <h2 className="text-2xl font-black text-white">Assign Volunteer</h2>
          <p className="mt-2 text-sm text-slate-400">
            {alert.zoneId?.name} ({alert.zoneId?.code})
          </p>
        </div>
        <button type="button" onClick={onClose} className="secondary-button flex h-10 w-10 items-center justify-center rounded-full">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && <div className="mb-4"><ErrorMsg msg={error} /></div>}

      {loading ? (
        <Spinner />
      ) : volunteers.length === 0 ? (
        <Empty
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          label="No volunteers available"
          sub="Register volunteers for this event before assigning alerts."
        />
      ) : (
        <div className="soft-scrollbar grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
          {volunteers.map((volunteer) => {
            const isAssigned = alert.assignedVolunteerId?._id === volunteer._id;
            return (
              <button
                key={volunteer._id}
                type="button"
                onClick={() => onAssign(volunteer._id)}
                disabled={submitting || isAssigned}
                className={`rounded-[20px] border p-4 text-left transition-all duration-200 ${
                  isAssigned
                    ? "border-cyan-300/30 bg-cyan-300/10"
                    : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25 hover:bg-white/[0.06]"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{volunteer.fullName}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{volunteer.email}</p>
                  </div>
                  <span className="text-xs font-semibold text-cyan-200">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-sm">
      <div className="hero-panel w-full max-w-xl rounded-[28px] p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="section-label mb-4">
              <span className="status-dot bg-fuchsia-300" />
              Alert simulation
            </p>
            <h2 className="text-2xl font-black text-white">Generate Alert</h2>
            <p className="mt-2 text-sm text-slate-400">
              {zone.name} ({zone.code})
            </p>
          </div>
          <button type="button" onClick={onClose} className="secondary-button flex h-10 w-10 items-center justify-center rounded-full">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${severityStyles[result.severity].badge}`}>
              Risk Level: {result.severity}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
              {result.action}
            </div>
            <button type="button" onClick={onClose} className="primary-button w-full px-4 py-3">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMsg msg={error} />}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Video Feed</span>
              <span className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-6 text-center transition-colors duration-200 hover:border-cyan-300/30 hover:bg-white/[0.05]">
                {videoFile ? (
                  <>
                    <p className="text-lg font-semibold text-white">{videoFile.name}</p>
                    <p className="mt-2 text-sm text-slate-400">Click to replace the video file</p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] border border-cyan-300/18 bg-cyan-300/10">
                      <svg className="h-8 w-8 text-cyan-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white">Upload a crowd video</p>
                    <p className="mt-2 text-sm text-slate-400">Use MP4, MOV, or AVI to simulate alert generation.</p>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    setError("");
                    setVideoFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </span>
            </label>

            <button type="submit" disabled={loading} className="primary-button w-full px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Analyzing..." : "Generate Alert"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const ZoneCard = ({ zone, alert, onClick }) => {
  const capacity = zone.capacity || 500;
  const currentCrowd = zone.currentCrowd || Math.floor(Math.random() * capacity);
  const ratio = Math.min(currentCrowd / capacity, 1);
  const pct = Math.round(ratio * 100);
  const severity = alert?.severity;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`panel rounded-[24px] p-5 text-left transition-transform duration-300 hover:-translate-y-1 ${
        severity === "HIGH" ? "border-red-400/25" : severity === "MEDIUM" ? "border-amber-400/25" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/65">{zone.code}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{zone.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${typeStyles[zone.type] || typeStyles.service}`}>
            {zone.type}
          </span>
          {severity && (
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[severity].badge}`}>
              {severity}
            </span>
          )}
        </div>
      </div>

      {alert && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
          {alert.action}
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Crowd load</span>
          <span>{currentCrowd} / {capacity} ({pct}%)</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${severity ? severityStyles[severity].bar : crowdBarColor(currentCrowd, capacity)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
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

  useEffect(() => {
    fetchData();
  }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (zones.length === 0) {
    return (
      <Empty
        icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        label="No zones found"
        sub="Zones will appear once seeded for this event."
      />
    );
  }

  const alertByZone = {};
  alerts.forEach((alert) => {
    const zoneId = alert.zoneId?._id || alert.zoneId;
    if (!alertByZone[zoneId] || alert.severity === "HIGH") {
      alertByZone[zoneId] = alert;
    }
  });

  return (
    <>
      {selectedZone && (
        <GenerateAlertModal
          zone={selectedZone}
          eventId={eventId}
          onClose={() => setSelectedZone(null)}
          onSuccess={() => {
            setSelectedZone(null);
            fetchData();
          }}
        />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {zones.map((zone) => (
          <ZoneCard key={zone._id} zone={zone} alert={alertByZone[zone._id]} onClick={() => setSelectedZone(zone)} />
        ))}
      </div>
    </>
  );
};

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
    axios
      .get(`http://localhost:3000/alert/${eventId}/active`, { withCredentials: true })
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
        current.map((alert) => (alert._id === selectedAlert._id ? { ...alert, ...res.data.alert } : alert))
      );
      setSelectedAlert((current) => (current ? { ...current, ...res.data.alert } : current));
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
  if (alerts.length === 0) {
    return (
      <Empty
        icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        label="No active alerts"
        sub="All clear. There are no unresolved alerts for this event."
      />
    );
  }

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

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert._id} className="panel rounded-[24px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[alert.severity]?.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {alert.zoneId?.name || "Unknown Zone"} <span className="font-mono text-slate-400">({alert.zoneId?.code})</span>
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-300">{alert.action}</p>
                <div className="mt-4">
                  <VolunteerAssignmentBadge volunteerName={alert.assignedVolunteerId?.fullName} />
                </div>
              </div>
              <p className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleTimeString()}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/5 pt-4">
              <button type="button" onClick={() => openAssignModal(alert)} className="primary-button px-4 py-2 text-sm">
                {alert.assignedVolunteerId ? "Reassign Volunteer" : "Assign Volunteer"}
              </button>
              <button
                type="button"
                onClick={() => handleResolveAlert(alert._id)}
                disabled={resolvingAlertId === alert._id}
                className="secondary-button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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

const VolunteersTab = ({ eventId, navigate }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/event/${eventId}/volunteers`, { withCredentials: true })
      .then((res) => setVolunteers(res.data.volunteers))
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load volunteers.");
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (volunteers.length === 0) {
    return (
      <Empty
        icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        label="No volunteers assigned"
        sub="Volunteers with this event ID will appear here."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {volunteers.map((volunteer) => (
        <div key={volunteer._id} className="panel rounded-[24px] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-bold text-cyan-200">
              {volunteer.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{volunteer.fullName}</p>
              <p className="truncate text-xs text-slate-400">{volunteer.email}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-white/5 pt-4">
            {volunteer.assignedTo ? (
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-100">
                <span className="status-dot bg-violet-300" />
                Assigned zone:
                <span className="font-semibold text-white">{volunteer.assignedTo.name}</span>
                <span className="font-mono text-violet-200">({volunteer.assignedTo.code})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                <span className="status-dot bg-slate-500" />
                Available for assignment
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const LogsTab = ({ eventId, navigate }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/alert/${eventId}/logs`, { withCredentials: true })
      .then((res) => setLogs(res.data.alerts))
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load logs.");
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg msg={error} />;
  if (logs.length === 0) {
    return (
      <Empty
        icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        label="No resolved alerts"
        sub="Resolved alert history will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {logs.map((log) => (
        <div key={log._id} className="panel rounded-[24px] p-5 opacity-85">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[log.severity]?.badge}`}>
                  {log.severity}
                </span>
                <span className="text-sm font-semibold text-white">
                  {log.zoneId?.name || "Unknown Zone"} <span className="font-mono text-slate-400">({log.zoneId?.code})</span>
                </span>
              </div>
              <p className="text-sm leading-7 text-slate-300">{log.action}</p>
              <div className="mt-4">
                <VolunteerAssignmentBadge volunteerName={log.assignedVolunteerId?.fullName} />
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Resolved</p>
              <p className="mt-2 text-sm text-slate-300">{new Date(log.resolvedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const tabs = [
  { key: "zones", label: "Zones", description: "Live venue sectors" },
  { key: "alerts", label: "Alerts", description: "Active incidents" },
  { key: "volunteers", label: "Volunteers", description: "Field team roster" },
  { key: "logs", label: "Logs", description: "Resolved timeline" },
];

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("zones");

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="hero-panel rounded-[30px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <button type="button" onClick={() => navigate("/admin")} className="secondary-button mb-5 inline-flex items-center gap-2 px-4 py-2 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to events
              </button>
              <div className="section-label mb-5">
                <span className="status-dot bg-cyan-300" />
                Event operations
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Event Dashboard</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Monitor zones, manage volunteers, generate alerts, and review the event history from one immersive workspace.
              </p>
            </div>

            <div className="metric-tile max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Event identifier</p>
              <p className="mt-3 break-all font-mono text-sm text-cyan-200">{eventId}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[22px] border p-4 text-left transition-all duration-200 ${
                  activeTab === tab.key
                    ? "border-cyan-300/30 bg-cyan-300/10 shadow-[0_18px_36px_rgba(34,211,238,0.1)]"
                    : "border-white/10 bg-white/[0.03] hover:border-cyan-300/18 hover:bg-white/[0.05]"
                }`}
              >
                <p className="text-sm font-semibold text-white">{tab.label}</p>
                <p className="mt-2 text-xs text-slate-400">{tab.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          {activeTab === "zones" && <ZonesTab eventId={eventId} navigate={navigate} />}
          {activeTab === "alerts" && <AlertsTab eventId={eventId} navigate={navigate} />}
          {activeTab === "volunteers" && <VolunteersTab eventId={eventId} navigate={navigate} />}
          {activeTab === "logs" && <LogsTab eventId={eventId} navigate={navigate} />}
        </section>
      </div>
    </div>
  );
};

export default EventPage;
