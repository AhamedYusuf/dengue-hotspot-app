import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createReport } from '../api/createReport';

// Reusable field wrapper
function Field({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="flex items-center gap-1 text-xs text-red-600" role="alert">
          <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_BASE =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100';
const INPUT_ERROR =
  'border-red-300 focus:border-red-400 focus:ring-red-100';

export default function ReportForm() {
  const [form, setForm] = useState({
    area: '', date: '', caseCount: '', notes: '',
    latitude: '', longitude: '',
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState('idle');
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'

  const todayStr = new Date().toISOString().split('T')[0];

  function validate() {
    const e = {};
    if (!form.area.trim())
      e.area = 'Area is required.';
    if (!form.date)
      e.date = 'Date is required.';
    else if (new Date(form.date) > new Date())
      e.date = 'Date cannot be in the future.';
    if (!form.caseCount || Number(form.caseCount) <= 0)
      e.caseCount = 'Case count must be a positive number.';
    // Validate lat/lng only if one is filled but not the other
    const hasLat = form.latitude !== '';
    const hasLng = form.longitude !== '';
    if (hasLat && !hasLng) e.longitude = 'Longitude is required when latitude is set.';
    if (hasLng && !hasLat) e.latitude  = 'Latitude is required when longitude is set.';
    if (hasLat && (isNaN(Number(form.latitude))  || Number(form.latitude)  < -90  || Number(form.latitude)  > 90))
      e.latitude  = 'Latitude must be between –90 and 90.';
    if (hasLng && (isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180))
      e.longitude = 'Longitude must be between –180 and 180.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoStatus('done');
      },
      () => setGeoStatus('error'),
    );
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const payload = {
        area: form.area,
        date: form.date,
        caseCount: Number(form.caseCount),
        notes: form.notes,
      };
      if (form.latitude !== '' && form.longitude !== '') {
        payload.latitude  = Number(form.latitude);
        payload.longitude = Number(form.longitude);
      }
      await createReport(payload);
      setStatus('success');
      setForm({ area: '', date: '', caseCount: '', notes: '', latitude: '', longitude: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
      setErrors({ form: err.message });
    }
  }

  function handleReset() {
    setStatus('idle');
    setErrors({});
  }

  // ── Success screen ───────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl" aria-hidden="true">✅</span>
        <h2 className="text-xl font-bold text-slate-800">Report submitted!</h2>
        <p className="mt-2 text-sm text-slate-500">
          Thank you for helping track dengue in your community. Your report is
          now visible to everyone.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            id="submit-another-btn"
            type="button"
            onClick={handleReset}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Submit another report
          </button>
          <Link
            to="/hotspots"
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse hotspots
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Submit a Report</h1>
        <p className="mt-1 text-sm text-slate-500">
          Help your community by reporting a suspected dengue hotspot. Fields marked
          with <span className="text-red-500">*</span> are required.
        </p>
      </header>

      <form
        id="report-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        {/* Area */}
        <Field label={<>Area <span className="text-red-500">*</span></>} htmlFor="area" error={errors.area}>
          <input
            id="area" type="text" autoComplete="off"
            placeholder="e.g. Nugegoda, Colombo"
            value={form.area} onChange={set('area')}
            aria-describedby={errors.area ? 'area-error' : undefined}
            aria-invalid={!!errors.area}
            className={`${INPUT_BASE} ${errors.area ? INPUT_ERROR : ''}`}
          />
        </Field>

        {/* Date */}
        <Field label={<>Date <span className="text-red-500">*</span></>} htmlFor="report-date" error={errors.date}>
          <input
            id="report-date" type="date" max={todayStr}
            value={form.date} onChange={set('date')}
            aria-describedby={errors.date ? 'report-date-error' : undefined}
            aria-invalid={!!errors.date}
            className={`${INPUT_BASE} ${errors.date ? INPUT_ERROR : ''}`}
          />
        </Field>

        {/* Case count */}
        <Field label={<>Case count <span className="text-red-500">*</span></>} htmlFor="case-count" error={errors.caseCount}>
          <input
            id="case-count" type="number" min="1"
            placeholder="Number of suspected cases"
            value={form.caseCount} onChange={set('caseCount')}
            aria-describedby={errors.caseCount ? 'case-count-error' : undefined}
            aria-invalid={!!errors.caseCount}
            className={`${INPUT_BASE} ${errors.caseCount ? INPUT_ERROR : ''}`}
          />
        </Field>

        {/* Notes */}
        <Field label="Notes" htmlFor="notes" error={undefined}>
          <textarea
            id="notes" rows={3}
            placeholder="Any additional details — symptoms, standing water, affected streets…"
            value={form.notes} onChange={set('notes')}
            className={`${INPUT_BASE} resize-none`}
          />
        </Field>

        {/* ── Location (optional) ───────────────────────────── */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              📍 Location <span className="font-normal text-slate-400">(optional — enables map pin)</span>
            </p>
            <button
              id="use-location-btn"
              type="button"
              onClick={useMyLocation}
              disabled={geoStatus === 'loading'}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              {geoStatus === 'loading' ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Detecting…
                </>
              ) : '📡 Use my location'}
            </button>
          </div>

          {geoStatus === 'done' && (
            <p className="mb-3 text-xs text-emerald-700">✓ Location detected</p>
          )}
          {geoStatus === 'error' && (
            <p className="mb-3 text-xs text-red-600">Location unavailable — enter manually below.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" htmlFor="latitude" error={errors.latitude}>
              <input
                id="latitude" type="number" step="any"
                placeholder="-6.9271" min="-90" max="90"
                value={form.latitude} onChange={set('latitude')}
                aria-invalid={!!errors.latitude}
                className={`${INPUT_BASE} ${errors.latitude ? INPUT_ERROR : ''}`}
              />
            </Field>
            <Field label="Longitude" htmlFor="longitude" error={errors.longitude}>
              <input
                id="longitude" type="number" step="any"
                placeholder="79.8612" min="-180" max="180"
                value={form.longitude} onChange={set('longitude')}
                aria-invalid={!!errors.longitude}
                className={`${INPUT_BASE} ${errors.longitude ? INPUT_ERROR : ''}`}
              />
            </Field>
          </div>
        </div>

        {/* Form-level error */}
        {status === 'error' && errors.form && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700" role="alert">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
            {errors.form}
          </div>
        )}

        {/* Submit */}
        <button
          id="submit-report-btn"
          type="submit"
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10"/></svg>
              Submitting…
            </>
          ) : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}