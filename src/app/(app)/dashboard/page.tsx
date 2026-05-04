'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, type Project, type TimeLog } from '@/lib/types';

function todayLocal(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // Sun = 0
  const diff = day === 0 ? -6 : 1 - day; // make Mon = start
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [form, setForm] = useState({
    date: todayLocal(),
    project: '',
    category: 'Coding',
    hours: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // filter state
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');

  async function load() {
    setLoading(true);
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/projects'),
        fetch('/api/logs'),
      ]);
      if (meRes.status === 401) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      setMe(meData.user);
      if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
      if (lRes.ok) setLogs((await lRes.json()).logs ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    if (!form.project) {
      setSubmitMsg({ kind: 'err', text: 'Pick a project.' });
      return;
    }
    if (!form.hours) {
      setSubmitMsg({ kind: 'err', text: 'Enter hours.' });
      return;
    }
    if (!form.description) {
      setSubmitMsg({ kind: 'err', text: 'Description is required.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hours: Number(form.hours) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitMsg({ kind: 'err', text: data?.message ?? data?.error ?? 'Failed.' });
        return;
      }
      setSubmitMsg({ kind: 'ok', text: 'Logged.' });
      setForm({ ...form, hours: '', description: '' });
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  async function deleteLog(id: string) {
    if (!confirm('Delete this entry?')) return;
    const res = await fetch(`/api/logs?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message ?? 'Could not delete this entry.');
      return;
    }
    load();
  }

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [logs]);

  const filtered = useMemo(() => {
    return sortedLogs.filter((l) => {
      if (filterCategory && l.category !== filterCategory) return false;
      if (filterProject && l.project !== filterProject) return false;
      return true;
    });
  }, [sortedLogs, filterCategory, filterProject]);

  const weekTotal = useMemo(() => {
    const start = startOfWeek(new Date());
    return logs
      .filter((l) => new Date(l.date) >= start)
      .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  }, [logs]);

  const todayTotal = useMemo(() => {
    const t = todayLocal();
    return logs
      .filter((l) => l.date === t)
      .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  }, [logs]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Devaicon · Time Tracker</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-600">
              {me?.username} {me?.role === 'admin' && <span className="text-neutral-400">(admin)</span>}
            </span>
            {me?.role === 'admin' && (
              <a href="/admin" className="text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors">
                Admin
              </a>
            )}
            <button onClick={logout} className="text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm ml-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Top row: stats + form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Today</div>
            <div className="mt-1 text-2xl font-semibold">{todayTotal.toFixed(1)} h</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">This week</div>
            <div className="mt-1 text-2xl font-semibold">{weekTotal.toFixed(1)} h</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">All time</div>
            <div className="mt-1 text-2xl font-semibold">
              {logs.reduce((s, l) => s + (Number(l.hours) || 0), 0).toFixed(1)} h
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Log time</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 animate-pulse">
              <div className="md:col-span-1"><div className="h-4 bg-neutral-200 rounded w-10 mb-1"></div><div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div></div>
              <div className="md:col-span-2"><div className="h-4 bg-neutral-200 rounded w-12 mb-1"></div><div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div></div>
              <div className="md:col-span-1"><div className="h-4 bg-neutral-200 rounded w-16 mb-1"></div><div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div></div>
              <div className="md:col-span-1"><div className="h-4 bg-neutral-200 rounded w-10 mb-1"></div><div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div></div>
              <div className="md:col-span-1 flex items-end"><div className="h-9 bg-neutral-200 rounded w-full"></div></div>
              <div className="md:col-span-6"><div className="h-4 bg-neutral-200 rounded w-20 mb-1 mt-2"></div><div className="h-9 bg-neutral-100 rounded border border-neutral-200 w-full"></div></div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
              <label className="block text-xs text-neutral-600 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                max={todayLocal()}
                className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-neutral-600 mb-1">Project</label>
              <select
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
                required
              >
                <option value="">Select…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              {!loading && projects.length === 0 && (
                <p className="text-xs text-amber-700 mt-1">
                  No projects yet — ask your admin to add one.
                </p>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-neutral-600 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-neutral-600 mb-1">Hours</label>
              <input
                type="number"
                min={0.25}
                max={24}
                step={0.25}
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
                required
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm active:scale-[0.98]"
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
            </div>
            <div className="md:col-span-6">
              <label className="block text-xs text-neutral-600 mb-1">
                Description
              </label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What did you work on?"
                className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
                required
              />
            </div>
            {submitMsg && (
              <div
                className={`md:col-span-6 text-sm rounded-md px-3 py-2 ${
                  submitMsg.kind === 'ok'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {submitMsg.text}
              </div>
            )}
            </form>
          )}
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 className="font-semibold">Your entries</h2>
            <div className="flex gap-2">
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">All projects</option>
                {projects.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-left px-4 py-2 font-medium">Project</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-right px-4 py-2 font-medium">Hours</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <tr key={`skeleton-${i}`} className="border-t border-neutral-100 animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-20"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-32"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-24"></div></td>
                        <td className="px-4 py-3 text-right flex justify-end"><div className="h-4 bg-neutral-200 rounded w-8"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-48"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-16"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-12"></div></td>
                      </tr>
                    ))}
                  </>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                      No entries yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const isApproved = !!l.approvedAt;
                    return (
                      <tr key={l.id} className="border-t border-neutral-100">
                        <td className="px-4 py-2">{l.date}</td>
                        <td className="px-4 py-2">{l.project}</td>
                        <td className="px-4 py-2">{l.category}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {Number(l.hours).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-neutral-700">{l.description}</td>
                        <td className="px-4 py-2">
                          {isApproved ? (
                            <span
                              title={`Approved by ${l.approvedBy} on ${new Date(
                                l.approvedAt,
                              ).toLocaleDateString()}`}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-medium"
                            >
                              ✓ Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {isApproved ? (
                            <span
                              className="text-xs text-neutral-400"
                              title="Approved entries are locked. Ask an admin to unapprove first."
                            >
                              Locked
                            </span>
                          ) : (
                            <button
                              onClick={() => deleteLog(l.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
