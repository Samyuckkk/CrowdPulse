import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventDashboard = () => {
  const [form, setForm] = useState({ name: "", location: "", startDate: "", endDate: "" });
  const [mapFile, setMapFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (file) => {
    if (!file) return;
    setMapFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputFile = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mapFile) return setError("Please upload a map image.");
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return setError("End date must be after start date.");
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("location", form.location);
    data.append("startDate", new Date(form.startDate).toISOString());
    data.append("endDate", new Date(form.endDate).toISOString());
    data.append("map", mapFile);

    try {
      await axios.post("http://localhost:3000/event/create", data, { withCredentials: true });
      navigate("/admin");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 401) return navigate("/");
      setError(msg || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="panel float-in rounded-[28px] p-6 sm:p-8">
            <div className="section-label mb-5">
              <span className="status-dot bg-emerald-300" />
              Event launch
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Design the next event control space.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Create the operational shell for a venue, upload its map, and prepare the dashboard that the jury will see in motion.
            </p>

            <div className="mt-8 space-y-4">
              <div className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">What you set here</p>
                <p className="mt-3 text-sm leading-7 text-white">
                  Event identity, venue location, active timeline, and the visual map used across monitoring flows.
                </p>
              </div>
              <div className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why it matters</p>
                <p className="mt-3 text-sm leading-7 text-white">
                  Every later alert, volunteer dispatch, and zone insight depends on this setup being crisp and trustworthy.
                </p>
              </div>
            </div>

            <button type="button" onClick={() => navigate("/admin")} className="secondary-button mt-8 inline-flex items-center gap-2 px-4 py-3">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to dashboard
            </button>
          </section>

          <section className="hero-panel float-in rounded-[28px] p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white">New Event</h2>
              <p className="mt-2 text-sm text-slate-400">
                Keep the existing functionality. Just make the creation flow feel premium.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Annual Tech Fest"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Mumbai, Maharashtra"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="auth-input [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    min={form.startDate}
                    className="auth-input [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Event Map</label>
                <label
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={`group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed transition-all duration-300 ${
                    preview ? "border-cyan-300/35 bg-cyan-300/8" : "border-white/12 bg-white/[0.03] hover:border-cyan-300/35 hover:bg-white/[0.06]"
                  }`}
                >
                  {preview ? (
                    <div className="relative h-64 w-full">
                      <img src={preview} alt="map preview" className="h-full w-full object-cover opacity-85" />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#06101d] via-transparent to-transparent p-5">
                        <div>
                          <p className="text-sm font-semibold text-white">Map preview ready</p>
                          <p className="mt-1 text-xs text-slate-300">Drop another file or click to replace</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-cyan-300/18 bg-cyan-300/10">
                        <svg className="h-8 w-8 text-cyan-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-white">Drop venue map here</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Upload PNG, JPG, or WEBP to power the visual event dashboard.
                      </p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleInputFile} className="hidden" />
                </label>
                {mapFile && <p className="mt-2 text-xs text-slate-400">{mapFile.name}</p>}
              </div>

              <button type="submit" disabled={loading} className="primary-button mt-2 w-full px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating..." : "Create Event"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
