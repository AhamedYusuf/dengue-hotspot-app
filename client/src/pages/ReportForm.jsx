import { useState } from 'react';
import { createReport } from '../api/createReport';

export default function ReportForm() {
  const [form, setForm] = useState({ area: '', date: '', caseCount: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function validate() {
    const e = {};
    if (!form.area.trim()) e.area = 'Area is required.';
    if (!form.date) e.date = 'Date is required.';
    else if (new Date(form.date) > new Date()) e.date = 'Date cannot be in the future.';
    if (!form.caseCount || Number(form.caseCount) <= 0)
      e.caseCount = 'Case count must be a positive number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await createReport(form);
      setStatus('success');
      setForm({ area: '', date: '', caseCount: '', notes: '' });
    } catch (err) {
      setStatus('error');
      setErrors({ form: err.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Submit a Report</h2>

      <div>
        <label className="block font-medium">Area</label>
        <input
          className="border rounded w-full p-2"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        />
        {errors.area && <p className="text-red-600 text-sm">{errors.area}</p>}
      </div>

      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          className="border rounded w-full p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
      </div>

      <div>
        <label className="block font-medium">Case Count</label>
        <input
          type="number"
          className="border rounded w-full p-2"
          value={form.caseCount}
          onChange={(e) => setForm({ ...form, caseCount: e.target.value })}
        />
        {errors.caseCount && <p className="text-red-600 text-sm">{errors.caseCount}</p>}
      </div>

      <div>
        <label className="block font-medium">Notes</label>
        <textarea
          className="border rounded w-full p-2"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
      </button>

      {status === 'success' && <p className="text-green-600">Report submitted!</p>}
      {errors.form && <p className="text-red-600">{errors.form}</p>}
    </form>
  );
}