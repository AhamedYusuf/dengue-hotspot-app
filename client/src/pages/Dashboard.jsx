import { useEffect, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { getAnalytics } from '../api/getAnalytics';

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="animate-fade-in-up flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: color + '20' }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value?.toLocaleString() ?? '—'}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Skeleton block ───────────────────────────────────────────────────────────
function SkeletonChart() {
  return <div className="skeleton h-64 rounded-2xl" />;
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-md text-sm">
      <p className="mb-1 font-semibold text-slate-700">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong> {unit || ''}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError]   = useState('');

  useEffect(() => {
    let mounted = true;
    getAnalytics()
      .then((d) => { if (mounted) { setData(d); setStatus('ready'); } })
      .catch((e) => { if (mounted) { setError(e.message); setStatus('error'); } });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Outbreak trends and hotspot summary — last 30 days</p>
      </header>

      {/* Error */}
      {status === 'error' && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-700">⚠️ Couldn't load analytics</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {status === 'loading'
          ? [1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
          : status === 'ready' && (
            <>
              <StatCard label="Total Reports"    value={data.summary.totalReports}  icon="📋" color="#2563eb" />
              <StatCard label="Total Cases"      value={data.summary.totalCases}     icon="🧑" color="#d97706" />
              <StatCard label="Verified Reports" value={data.summary.verifiedCount}  icon="✅" color="#059669" />
            </>
          )
        }
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Line chart – reports over time */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Reports per day (last 30 days)</h2>
          {status === 'loading' && <SkeletonChart />}
          {status === 'ready' && data.byDay.length === 0 && (
            <p className="flex h-64 items-center justify-center text-sm text-slate-400">No data for this period</p>
          )}
          {status === 'ready' && data.byDay.length > 0 && (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={data.byDay} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(d) => {
                    const [, m, day] = d.split('-');
                    return `${day}/${m}`;
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={(props) => <ChartTooltip {...props} />} />
                <Line
                  type="monotone"
                  dataKey="reportCount"
                  name="Reports"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalCases"
                  name="Cases"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart – top areas */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Top 10 areas by total cases</h2>
          {status === 'loading' && <SkeletonChart />}
          {status === 'ready' && data.byArea.length === 0 && (
            <p className="flex h-64 items-center justify-center text-sm text-slate-400">No data yet</p>
          )}
          {status === 'ready' && data.byArea.length > 0 && (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart
                data={data.byArea}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="area"
                  width={110}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => v.length > 16 ? v.slice(0, 14) + '…' : v}
                />
                <Tooltip content={(props) => <ChartTooltip {...props} unit="cases" />} />
                <Bar dataKey="totalCases" name="Total cases" radius={[0, 4, 4, 0]}>
                  {data.byArea.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i < 3 ? '#ef4444' : i < 6 ? '#f59e0b' : '#2563eb'}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
