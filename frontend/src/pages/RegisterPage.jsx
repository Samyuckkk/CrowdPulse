import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const roleCards = [
  {
    value: "admin",
    label: "Admin",
    detail: "Create events, monitor alerts, coordinate response.",
  },
  {
    value: "volunteer",
    label: "Volunteer",
    detail: "Receive assignments and support on-ground action.",
  },
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    eventId: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      return setError("Please choose whether you're registering as an admin or volunteer.");
    }

    if (form.role === "volunteer" && !form.eventId.trim()) {
      return setError("Event ID is required for volunteer registration.");
    }

    setLoading(true);

    try {
      const endpoint =
        form.role === "admin"
          ? "http://localhost:3000/auth/admin/register"
          : "http://localhost:3000/auth/volunteer/register";

      await axios.post(
        endpoint,
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          eventId: form.role === "volunteer" ? form.eventId.trim() : undefined,
        },
        {
          withCredentials: true,
        }
      );

      navigate(form.role === "admin" ? "/admin" : "/volunteer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="panel float-in rounded-[28px] p-6 sm:p-8 lg:p-10">
            <div className="section-label mb-5">
              <span className="status-dot bg-fuchsia-300" />
              Build the team
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Launch the right role into the right event.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Register organizers and volunteers through the same premium flow while keeping account logic unchanged underneath.
            </p>

            <div className="mt-8 space-y-4">
              {roleCards.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    setError("");
                    setForm({ ...form, role: role.value });
                  }}
                  className={`w-full rounded-[22px] border p-5 text-left transition-all duration-200 ${
                    form.role === role.value
                      ? "border-cyan-300/40 bg-cyan-400/10 shadow-[0_18px_36px_rgba(34,211,238,0.12)]"
                      : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{role.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{role.detail}</p>
                    </div>
                    <span className={`mt-1 h-4 w-4 rounded-full border ${form.role === role.value ? "border-cyan-300 bg-cyan-300" : "border-slate-500"}`} />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold text-white">Volunteer registration note</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Volunteers must enter a valid event ID so they appear inside the matching event dashboard and can receive alert assignments.
              </p>
            </div>
          </section>

          <section className="hero-panel float-in rounded-[28px] p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="section-label mb-4">
                <span className="status-dot bg-emerald-300" />
                New account
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">Create your access profile</h2>
              <p className="mt-2 text-sm text-slate-400">
                Same functionality, better presence. Your registration data still goes through the exact same endpoints.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="auth-input"
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Event ID</label>
                  <input
                    type="text"
                    name="eventId"
                    value={form.eventId}
                    onChange={handleChange}
                    placeholder="Required for volunteers"
                    className="auth-input disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={form.role !== "volunteer"}
                    required={form.role === "volunteer"}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className="auth-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="primary-button mt-2 w-full px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/" className="font-semibold text-cyan-300 transition-colors hover:text-white">
                Sign in
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
