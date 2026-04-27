import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventDashboard = () => {
  const [form, setForm] = useState({ name: "", location: "", startDate: "", endDate: "" });
  const [mapFile, setMapFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMapFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setMapFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mapFile) return setError("Please upload a map image.");
    if (new Date(form.endDate) <= new Date(form.startDate))
      return setError("End date must be after start date.");

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

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white/5 text-white placeholder-gray-500 outline-none transition-all duration-300 ${
      focused === field
        ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        : "border-white/10 hover:border-white/25"
    }`;

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">New Event</h1>
              <p className="text-gray-400 text-sm mt-0.5">Fill in the details to create an event</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Event Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
                placeholder="e.g. Annual Tech Fest"
                className={inputClass("name")}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                onFocus={() => setFocused("location")}
                onBlur={() => setFocused("")}
                placeholder="e.g. Mumbai, Maharashtra"
                className={inputClass("location")}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  onFocus={() => setFocused("startDate")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("startDate")} [color-scheme:dark]`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  onFocus={() => setFocused("endDate")}
                  onBlur={() => setFocused("")}
                  min={form.startDate}
                  className={`${inputClass("endDate")} [color-scheme:dark]`}
                  required
                />
              </div>
            </div>

            {/* Map Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Event Map</label>
              <label
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
                  preview
                    ? "border-violet-500/40 h-44"
                    : "border-white/10 hover:border-violet-500/40 hover:bg-white/5 h-36"
                }`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="map preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white text-sm font-medium">Change image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Drag & drop or <span className="text-violet-400">browse</span></p>
                    <p className="text-gray-600 text-xs">PNG, JPG, WEBP</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
              {mapFile && (
                <p className="text-xs text-gray-500 mt-1.5 truncate">{mapFile.name}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
