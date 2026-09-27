import { useEffect, useRef, useState } from 'react';
import { getReports } from '../api/getReports';

// ─── Marker colour: ALWAYS red for high, amber for medium, green for low ─────
function markerColor(caseCount) {
  if (caseCount >= 50) return '#ef4444'; // red   — severe
  if (caseCount >= 10) return '#f59e0b'; // amber — moderate
  return '#22c55e';                      // green — low
}

function createSvgIcon(color, verified) {
  // Drop-pin SVG: filled circle body + pointed base, white border.
  // Verified reports get a white checkmark inside.
  const check = verified
    ? `<text x="14" y="18" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="bold">✓</text>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">
    <path d="M15 2 C8.4 2 3 7.4 3 14 C3 22 15 36 15 36 C15 36 27 22 27 14 C27 7.4 21.6 2 15 2Z"
      fill="${color}" stroke="white" stroke-width="2.5"/>
    ${check}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2 rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Case count</p>
      {[
        { color: '#22c55e', label: '< 10  — Low' },
        { color: '#f59e0b', label: '10–49 — Moderate' },
        { color: '#ef4444', label: '≥ 50  — Severe' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-slate-700">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white shadow"
            style={{ background: color }}
          />
          {label}
        </div>
      ))}
      <div className="mt-1 border-t border-slate-100 pt-1 flex items-center gap-2 text-xs text-slate-500">
        <span className="font-bold text-emerald-600">✓</span> = Verified
      </div>
    </div>
  );
}

// ─── Leaflet map (runs only in the browser, dynamically imported) ─────────────
function LeafletMap({ reports }) {
  const mapRef      = useRef(null);
  const instanceRef = useRef(null);
  const markersRef  = useRef([]);

  useEffect(() => {
    let mounted = true;

    import('leaflet').then((mod) => {
      if (!mounted || !mapRef.current) return;
      const L = mod.default;

      // Initialise map only once
      if (!instanceRef.current) {
        instanceRef.current = L.map(mapRef.current, {
          center: [7.8731, 80.7718], // Sri Lanka centroid
          zoom: 7,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(instanceRef.current);
      }

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Plot every report that has coords
      reports.forEach((report) => {
        if (report.latitude == null || report.longitude == null) return;

        const color = markerColor(report.caseCount ?? 0);
        const icon = L.icon({
          iconUrl:    createSvgIcon(color, report.verified),
          iconSize:   [30, 38],
          iconAnchor: [15, 38],      // tip of the pin
          popupAnchor: [0, -40],
        });

        const formattedDate = report.date
          ? new Intl.DateTimeFormat('en-LK', {
              day: 'numeric', month: 'short', year: 'numeric',
            }).format(new Date(report.date))
          : '—';

        const verifiedBadge = report.verified
          ? `<span style="display:inline-block;background:#d1fae5;color:#065f46;border-radius:9999px;
               font-size:11px;font-weight:700;padding:1px 8px;margin-top:4px">✓ Verified</span>`
          : `<span style="display:inline-block;background:#f1f5f9;color:#64748b;border-radius:9999px;
               font-size:11px;padding:1px 8px;margin-top:4px">Unverified</span>`;

        const severityColor = markerColor(report.caseCount ?? 0);
        const popupHtml = `
          <div style="font-family:Inter,system-ui,sans-serif;min-width:180px;padding:2px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;
                background:${severityColor};border:2px solid white;
                box-shadow:0 0 0 1px ${severityColor}"></span>
              <strong style="font-size:14px;color:#1e293b">${report.area || 'Unknown area'}</strong>
            </div>
            <p style="font-size:12px;color:#64748b;margin:0 0 3px">📅 ${formattedDate}</p>
            <p style="font-size:13px;color:#1e293b;font-weight:600;margin:0 0 4px">
              🧑 ${report.caseCount ?? 0} case${report.caseCount === 1 ? '' : 's'}
            </p>
            ${verifiedBadge}
            ${report.notes
              ? `<p style="font-size:11px;color:#475569;margin:8px 0 0;
                   border-top:1px solid #e2e8f0;padding-top:6px;line-height:1.4">
                   ${report.notes}
                 </p>`
              : ''}
          </div>`;

        const marker = L.marker([report.latitude, report.longitude], { icon })
          .bindPopup(popupHtml, { maxWidth: 260 })
          .addTo(instanceRef.current);

        markersRef.current.push(marker);
      });

      // Auto-fit bounds to all markers
      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        instanceRef.current.fitBounds(group.getBounds().pad(0.25));
      }
    });

    return () => { mounted = false; };
  }, [reports]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MapView() {
  const [reports, setReports]   = useState([]);
  const [status, setStatus]     = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    getReports()
      .then((data) => {
        if (!mounted) return;
        setReports(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (!mounted) return;
        setErrorMsg(err.message);
        setStatus('error');
      });
    return () => { mounted = false; };
  }, []);

  const pinnedReports  = reports.filter((r) => r.latitude != null && r.longitude != null);
  const unpinnedCount  = reports.length - pinnedReports.length;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Hotspot Map</h1>
        <p className="mt-1 text-sm text-slate-500">
          {status === 'ready' && (
            <>
              <span className="font-medium text-slate-700">{pinnedReports.length}</span> pin{pinnedReports.length !== 1 ? 's' : ''} on map
              {unpinnedCount > 0 && (
                <span className="ml-2 text-slate-400">
                  · {unpinnedCount} report{unpinnedCount !== 1 ? 's' : ''} without coordinates (submit with lat/lng to pin them)
                </span>
              )}
            </>
          )}
          {status === 'loading' && 'Loading reports…'}
        </p>
      </div>

      {/* Map container — fills remaining height */}
      <div className="relative flex-1 overflow-hidden">

        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <svg className="h-8 w-8 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <p className="text-sm text-slate-500">Loading reports…</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="font-semibold text-red-700">Couldn't load reports</p>
              <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Map always renders when ready — even with 0 pins it shows Sri Lanka */}
        {status === 'ready' && (
          <>
            <LeafletMap reports={reports} />
            <Legend />
            {pinnedReports.length === 0 && (
              <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm pointer-events-auto max-w-xs">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="font-semibold text-slate-700">No pinned reports yet</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Submit a report with latitude &amp; longitude to see it appear as a pin.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
