import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ErrorMsg = ({ msg }) => (
  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
    {msg}
  </div>
);

const ZonePickerModal = ({ zones, loadingZoneId, onClose, onSelect }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-sm">
    <div className="hero-panel w-full max-w-3xl rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="section-label mb-4">
            <span className="status-dot bg-red-300" />
            SOS dispatch
          </div>
          <h2 className="text-2xl font-black text-white">Select the zone in danger</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Tapping a zone sends a high-risk alert immediately to the event control room.
          </p>
        </div>
        <button type="button" onClick={onClose} className="secondary-button flex h-10 w-10 items-center justify-center rounded-full">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="soft-scrollbar grid max-h-[60vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
        {zones.map((zone) => (
          <button
            key={zone._id}
            type="button"
            onClick={() => onSelect(zone)}
            disabled={loadingZoneId === zone._id}
            className="panel rounded-[22px] p-5 text-left transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/65">{zone.code}</p>
                <p className="mt-2 text-xl font-bold text-white">{zone.name}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${typeStyles[zone.type] || typeStyles.service}`}>
                {zone.type}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Capacity {zone.capacity || 0} people
            </p>
            <div className="mt-5">
              <span className="inline-flex rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-200">
                {loadingZoneId === zone._id ? "Sending SOS..." : "Trigger High Risk Alert"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const VolunteerDashboard = () => {
  const [zones, setZones] = useState([]);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sosError, setSosError] = useState("");
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [sendingZoneId, setSendingZoneId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/event/volunteer/zones", { withCredentials: true })
      .then((res) => {
        setZones(res.data.zones);
        setEventId(res.data.eventId);
      })
      .catch((err) => {
        if (err.response?.status === 401) return navigate("/");
        setError(err.response?.data?.message || "Failed to load volunteer event zones.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSendSos = async (zone) => {
    setSosError("");
    setSuccessMessage("");
    setSendingZoneId(zone._id);

    try {
      const res = await axios.post(
        `http://localhost:3000/alert/volunteer/sos/${zone._id}`,
        {},
        { withCredentials: true }
      );
      setSuccessMessage(res.data.message || `High-risk alert raised for ${zone.name}.`);
      setShowZonePicker(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
        return;
      }
      setSosError(err.response?.data?.message || "Failed to send SOS alert.");
    } finally {
      setSendingZoneId("");
    }
  };

  if (loading) {
    return (
      <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
          <div className="panel w-full rounded-[28px] py-24">
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-6xl">
        {showZonePicker && (
          <ZonePickerModal
            zones={zones}
            loadingZoneId={sendingZoneId}
            onClose={() => setShowZonePicker(false)}
            onSelect={handleSendSos}
          />
        )}

        <section className="hero-panel rounded-[30px] p-8 sm:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="section-label mb-6">
                <span className="status-dot bg-emerald-300" />
                Volunteer response deck
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Field support with an instant SOS line.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                You are linked to a live event and can now raise a real high-risk alert by choosing the affected zone. No admin handoff needed.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Connected event</p>
                  <p className="mt-3 break-all text-sm font-semibold text-white">{eventId || "Unavailable"}</p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Available zones</p>
                  <p className="mt-3 text-3xl font-black text-cyan-200">{zones.length}</p>
                </div>
              </div>
            </div>

            <div className="panel rounded-[24px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-200/80">Emergency action</p>
              <h2 className="mt-3 text-2xl font-black text-white">Trigger SOS Alert</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Press the SOS button, choose the zone in danger, and the system will create a high-risk alert for the admin dashboard immediately.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSosError("");
                  setSuccessMessage("");
                  setShowZonePicker(true);
                }}
                disabled={zones.length === 0}
                className="mt-8 w-full rounded-[24px] border border-red-400/25 bg-gradient-to-br from-red-500 to-rose-700 px-6 py-6 text-left text-white shadow-[0_24px_60px_rgba(190,24,93,0.32)] transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-100/80">One tap escalation</p>
                    <p className="mt-2 text-3xl font-black">SOS</p>
                    <p className="mt-3 text-sm text-red-50/85">Open zone picker and send a high-risk alert.</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z" />
                    </svg>
                  </div>
                </div>
              </button>

              {sosError && <div className="mt-5"><ErrorMsg msg={sosError} /></div>}
              {successMessage && (
                <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8">
          {error && <ErrorMsg msg={error} />}

          {!error && zones.length === 0 && (
            <Empty
              icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              label="No zones mapped to your event"
              sub="Ask the admin to seed zones for the event before using the SOS flow."
            />
          )}

          {!error && zones.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {zones.map((zone) => (
                <div key={zone._id} className="panel rounded-[24px] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/65">{zone.code}</p>
                      <p className="mt-2 text-xl font-bold text-white">{zone.name}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${typeStyles[zone.type] || typeStyles.service}`}>
                      {zone.type}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    Capacity {zone.capacity || 0} people
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
