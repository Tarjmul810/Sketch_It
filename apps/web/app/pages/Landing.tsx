import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100/70 via-white to-cyan-100/50 text-slate-800">
      {/* Subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 py-40 text-center">
        {/* Glow */}
        <div className="absolute -top-40 h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-3xl -z-10" />

        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-slate-900">
          Infinite Canvas
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
          A calm, shared space to think visually, explore ideas,
          and collaborate in real time.
        </p>

        <div className="mt-14 flex items-center gap-5">
          <Link
            href="/signin"
            className="rounded-2xl bg-blue-600 px-10 py-4 text-white font-medium shadow-xl shadow-blue-600/30 transition hover:bg-blue-700 hover:scale-[1.03]"
          >
            Get started
          </Link>

          <Link
            href="/signup"
            className="rounded-2xl px-10 py-4 font-medium text-blue-700 transition hover:bg-blue-50"
          >
            Create account
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Free to try • No setup • Works in your browser
        </p>
      </section>

      {/* Feature / Preview */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
              Designed for flow
            </h2>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Move freely on an infinite canvas, sketch ideas together,
              and stay in sync without distractions.
              Everything is built to feel natural and fast.
            </p>

            <ul className="mt-10 space-y-4 text-slate-600">
              <li>• Infinite pan & zoom</li>
              <li>• Real-time multi-user collaboration</li>
              <li>• Simple tools that stay out of the way</li>
            </ul>
          </div>

          {/* Floating preview */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-blue-200/40 blur-xl" />
            <div className="relative aspect-video w-full rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/10 flex items-center justify-center text-slate-400">
              Canvas preview
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-sm text-slate-500">
        Built with focus and clarity · © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
