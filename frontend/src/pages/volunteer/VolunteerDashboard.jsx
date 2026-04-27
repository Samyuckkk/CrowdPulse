const VolunteerDashboard = () => {
  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="hero-panel w-full rounded-[30px] p-8 sm:p-10 lg:p-14">
          <div className="section-label mb-6">
            <span className="status-dot bg-emerald-300" />
            Volunteer access
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ready for field response.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your volunteer account is active. This route now presents a polished holding experience while preserving the existing application flow and routing exactly as-is.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mission mode</p>
                  <p className="mt-3 text-lg font-semibold text-white">Assignment-ready</p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Role signal</p>
                  <p className="mt-3 text-lg font-semibold text-white">Volunteer access</p>
                </div>
              </div>
            </div>

            <div className="panel rounded-[24px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Status</p>
              <h2 className="mt-3 text-2xl font-black text-white">Stand by for dispatch</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Admins can register you under an event, assign you to alert zones, and coordinate movement from the event dashboard.
              </p>

              <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <span className="status-dot bg-emerald-300" />
                  <span className="text-sm font-semibold text-white">Account session active</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  This page is intentionally presentational right now. No route logic or backend behavior has been changed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
