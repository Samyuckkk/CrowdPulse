import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const highlights = [
  { label: "Live watch", value: "24/7 event view" },
  { label: "Zone focus", value: "Rapid risk routing" },
  { label: "Response", value: "Volunteer dispatch" },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
    setLoading(true);
    const { email, password } = form;

    try {
      await axios.post("http://localhost:3000/auth/admin/login", { email, password }, { withCredentials: true });
      return navigate("/admin");
    } catch (adminErr) {
      const adminMsg = adminErr.response?.data?.message;

      try {
        await axios.post("http://localhost:3000/auth/volunteer/login", { email, password }, { withCredentials: true });
        return navigate("/volunteer");
      } catch (volErr) {
        const volMsg = volErr.response?.data?.message;
        setError(volMsg || adminMsg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="hero-panel float-in rounded-[28px] p-8 sm:p-10 lg:p-14">
            <div className="section-label mb-6">
              <span className="status-dot bg-cyan-300" />
              Event Crowd Intelligence
            </div>
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Command the crowd before the crowd commands the night.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                A cinematic control room for real-time event awareness, response coordination, and safer audience movement.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="metric-tile pulse-glow">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-white">Zone visibility</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Keep every gate, stage, corridor, and hotspot visible inside one event dashboard.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Response clarity</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Assign volunteers, resolve alerts, and keep the whole incident trail readable in seconds.
                </p>
              </div>
            </div>
          </section>

          <section className="panel float-in rounded-[28px] p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="section-label mb-4">
                <span className="status-dot bg-emerald-300" />
                Secure access
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in as an admin or volunteer using your existing account.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <span className="text-xs text-slate-500">Protected session</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
                {loading ? "Signing in..." : "Enter Control Room"}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              New here?{" "}
              <Link to="/register" className="font-semibold text-cyan-300 transition-colors hover:text-white">
                Create an account
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
