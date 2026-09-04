import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Pinpoint Hotspots',
    body: 'Report outbreak locations by area so neighbours and health workers know where to focus efforts.',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Reports',
    body: 'Community members can mark reports as verified, adding a layer of credibility to each entry.',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: 'Instant Search',
    body: 'Search and filter reports by area in real time — find what matters to you in seconds.',
  },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="hero-gradient flex min-h-[72vh] flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6"
        aria-labelledby="hero-heading"
      >
        {/* Pill badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-100 backdrop-blur-sm">
          🦟 Community-driven reporting
        </span>

        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          Track dengue outbreaks.{' '}
          <span className="text-blue-300">Protect your community.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
          DengueWatch lets anyone report a suspected dengue hotspot. Browse
          community-submitted reports, search by area, and help verify
          outbreaks so health workers can act fast.
        </p>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-blue-200">
          Every report you submit or verify helps build a clearer picture of
          where dengue is spreading — and where it can be stopped.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/report"
            id="cta-submit"
            className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-800 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
          >
            Submit a report
          </Link>
          <Link
            to="/hotspots"
            id="cta-browse"
            className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Browse hotspots →
          </Link>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section
        className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6"
        aria-labelledby="features-heading"
      >
        <h2
          id="features-heading"
          className="mb-10 text-center text-2xl font-bold text-slate-800 sm:text-3xl"
        >
          How it works
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="animate-fade-in-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {f.icon}
              </span>
              <h3 className="mb-2 text-base font-semibold text-slate-800">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}