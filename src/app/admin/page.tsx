'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, type Project, type TimeLog } from '@/lib/types';

function todayLocal(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function shiftDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Mon = start
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function startOfMonthIso(): string {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState('');
  const [pMsg, setPMsg] = useState<string | null>(null);

  // filters
  const [fUser, setFUser] = useState('');
  const [fProject, setFProject] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');
  const [fStatus, setFStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [activePreset, setActivePreset] = useState<string>('all');

  // selection (for bulk approve)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [approvalBusy, setApprovalBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [meRes, pRes, lRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/projects'),
        fetch('/api/logs?all=1'),
      ]);
      if (meRes.status === 401) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      if (meData.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
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

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setPMsg(null);
    const name = newProject.trim();
    if (!name) return;
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPMsg(
        data.error === 'duplicate_project'
          ? 'Project already exists.'
          : 'Failed to add project.',
      );
      return;
    }
    setNewProject('');
    load();
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project? Existing logs are not removed.')) return;
    await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  }

  async function deleteLog(id: string) {
    if (!confirm('Delete this entry permanently?')) return;
    await fetch(`/api/logs?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  }

  async function setApproval(ids: string[], approved: boolean) {
    if (ids.length === 0) return;
    setApprovalBusy(true);
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, approved }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message ?? 'Approval update failed.');
        return;
      }
      setSelected(new Set());
      load();
    } finally {
      setApprovalBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  /* ---------------- presets ---------------- */
  function applyPreset(preset: string) {
    setActivePreset(preset);
    const today = todayLocal();
    switch (preset) {
      case 'today':
        setFFrom(today);
        setFTo(today);
        break;
      case 'week':
        setFFrom(startOfWeekIso());
        setFTo(today);
        break;
      case 'month':
        setFFrom(startOfMonthIso());
        setFTo(today);
        break;
      case 'last7':
        setFFrom(shiftDays(today, -6));
        setFTo(today);
        break;
      case 'last30':
        setFFrom(shiftDays(today, -29));
        setFTo(today);
        break;
      case 'all':
      default:
        setFFrom('');
        setFTo('');
    }
  }

  /* ---------------- derived ---------------- */
  const allUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.username));
    return [...set].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    return logs
      .filter((l) => {
        if (fUser && l.username !== fUser) return false;
        if (fProject && l.project !== fProject) return false;
        if (fCategory && l.category !== fCategory) return false;
        if (fFrom && l.date < fFrom) return false;
        if (fTo && l.date > fTo) return false;
        if (fStatus === 'pending' && l.approvedAt) return false;
        if (fStatus === 'approved' && !l.approvedAt) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [logs, fUser, fProject, fCategory, fFrom, fTo, fStatus]);

  const pendingInView = useMemo(
    () => filtered.filter((l) => !l.approvedAt).map((l) => l.id),
    [filtered],
  );

  const selectedPendingIds = useMemo(
    () =>
      filtered
        .filter((l) => selected.has(l.id) && !l.approvedAt)
        .map((l) => l.id),
    [filtered, selected],
  );

  const selectedApprovedIds = useMemo(
    () =>
      filtered
        .filter((l) => selected.has(l.id) && l.approvedAt)
        .map((l) => l.id),
    [filtered, selected],
  );

  const totals = useMemo(() => {
    const total = filtered.reduce((s, l) => s + (Number(l.hours) || 0), 0);
    const byUser = new Map<string, number>();
    const byProject = new Map<string, number>();
    const byCategory = new Map<string, number>();
    for (const l of filtered) {
      const h = Number(l.hours) || 0;
      byUser.set(l.username, (byUser.get(l.username) ?? 0) + h);
      byProject.set(l.project, (byProject.get(l.project) ?? 0) + h);
      byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + h);
    }
    return { total, byUser, byProject, byCategory };
  }, [filtered]);

  function clearFilters() {
    setFUser('');
    setFProject('');
    setFCategory('');
    setFFrom('');
    setFTo('');
    setFStatus('all');
    setActivePreset('all');
    setSelected(new Set());
  }

  function downloadFilteredCsv() {
    const headers = [
      'Date',
      'User',
      'Project',
      'Category',
      'Hours',
      'Description',
      'Status',
      'Approved By',
      'Approved At',
    ];
    const rows = filtered.map((l) => [
      l.date,
      l.username,
      l.project,
      l.category,
      Number(l.hours).toFixed(2),
      l.description,
      l.approvedAt ? 'Approved' : 'Pending',
      l.approvedBy,
      l.approvedAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? '');
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(','),
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devaicon-timelogs-${todayLocal()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const presets = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
    { id: 'last7', label: 'Last 7 days' },
    { id: 'last30', label: 'Last 30 days' },
    { id: 'all', label: 'All time' },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Devaicon · Admin</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-600">{me?.username}</span>
            <a href="/dashboard" className="text-neutral-700 hover:text-neutral-900">
              My dashboard
            </a>
            <button onClick={logout} className="text-neutral-700 hover:text-neutral-900">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Projects */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 print:hidden">
          <h2 className="font-semibold mb-4">Projects</h2>
          <form onSubmit={addProject} className="flex gap-2 mb-4">
            <input
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="New project name"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Add
            </button>
          </form>
          {pMsg && <p className="text-sm text-red-600 mb-3">{pMsg}</p>}

          {projects.length === 0 ? (
            <p className="text-sm text-neutral-500">No projects yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100 border border-neutral-200 rounded-md">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500">
                      Added {new Date(p.addedAt).toLocaleDateString()} by {p.addedBy}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Filters */}
        <section className="rounded-xl border border-neutral-200 bg-white p-4 print:hidden">
          {/* Date presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`text-xs rounded-md px-3 py-1.5 border ${
                  activePreset === p.id
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            <select
              value={fUser}
              onChange={(e) => setFUser(e.target.value)}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
            >
              <option value="">All users</option>
              {allUsers.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <select
              value={fProject}
              onChange={(e) => setFProject(e.target.value)}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={fCategory}
              onChange={(e) => setFCategory(e.target.value)}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value as typeof fStatus)}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm bg-white"
            >
              <option value="all">All status</option>
              <option value="pending">Pending only</option>
              <option value="approved">Approved only</option>
            </select>
            <input
              type="date"
              value={fFrom}
              onChange={(e) => {
                setFFrom(e.target.value);
                setActivePreset('custom');
              }}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm"
            />
            <input
              type="date"
              value={fTo}
              onChange={(e) => {
                setFTo(e.target.value);
                setActivePreset('custom');
              }}
              className="rounded-md border border-neutral-300 px-2 py-2 text-sm"
            />
            <button
              onClick={clearFilters}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-neutral-100 text-sm">
            <button
              onClick={() => window.print()}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-800"
            >
              Print / Save PDF
            </button>
            <button
              onClick={downloadFilteredCsv}
              className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
            >
              Download filtered CSV
            </button>
            <a
              href="/api/admin/export"
              className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
            >
              Download full .xlsx
            </a>
            <span className="text-neutral-500 ml-auto">
              {filtered.length} entries · {totals.total.toFixed(1)} hours total
            </span>
          </div>
        </section>

        {/* Print header */}
        <div className="hidden print:block mb-4">
          <h1 className="text-xl font-bold">Devaicon — Time Log Report</h1>
          <p className="text-sm text-neutral-600">
            Generated {new Date().toLocaleString()} · {filtered.length} entries · {totals.total.toFixed(1)}h total
          </p>
          {(fUser || fProject || fCategory || fFrom || fTo) && (
            <p className="text-xs text-neutral-600 mt-1">
              Filters:
              {fUser && ` user=${fUser}`}
              {fProject && ` project=${fProject}`}
              {fCategory && ` category=${fCategory}`}
              {fFrom && ` from=${fFrom}`}
              {fTo && ` to=${fTo}`}
            </p>
          )}
        </div>

        {/* Logs table */}
        <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden print:border-0">
          {/* Bulk action bar */}
          {(selected.size > 0 || pendingInView.length > 0) && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-neutral-200 bg-neutral-50 text-sm print:hidden">
              {selected.size > 0 ? (
                <>
                  <span className="text-neutral-700">
                    {selected.size} selected
                  </span>
                  {selectedPendingIds.length > 0 && (
                    <button
                      disabled={approvalBusy}
                      onClick={() => setApproval(selectedPendingIds, true)}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve {selectedPendingIds.length}
                    </button>
                  )}
                  {selectedApprovedIds.length > 0 && (
                    <button
                      disabled={approvalBusy}
                      onClick={() => setApproval(selectedApprovedIds, false)}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100 disabled:opacity-50"
                    >
                      Unapprove {selectedApprovedIds.length}
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(new Set())}
                    className="text-xs text-neutral-600 hover:text-neutral-900 ml-auto"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <>
                  <span className="text-neutral-600">
                    {pendingInView.length} pending entr{pendingInView.length === 1 ? 'y' : 'ies'} in view
                  </span>
                  <button
                    disabled={approvalBusy}
                    onClick={() => setApproval(pendingInView, true)}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve all pending in view
                  </button>
                </>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-3 py-2 print:hidden w-8">
                    <input
                      type="checkbox"
                      checked={
                        pendingInView.length > 0 &&
                        pendingInView.every((id) => selected.has(id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            pendingInView.forEach((id) => next.add(id));
                            return next;
                          });
                        } else {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            pendingInView.forEach((id) => next.delete(id));
                            return next;
                          });
                        }
                      }}
                      title="Select all pending in view"
                    />
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-left px-4 py-2 font-medium">User</th>
                  <th className="text-left px-4 py-2 font-medium">Project</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-right px-4 py-2 font-medium">Hours</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-right px-4 py-2 font-medium print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                      No entries match these filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const isApproved = !!l.approvedAt;
                    return (
                      <tr key={l.id} className="border-t border-neutral-100">
                        <td className="px-3 py-2 print:hidden">
                          <input
                            type="checkbox"
                            checked={selected.has(l.id)}
                            onChange={() => toggleSelect(l.id)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{l.date}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{l.username}</td>
                        <td className="px-4 py-2">{l.project}</td>
                        <td className="px-4 py-2">{l.category}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {Number(l.hours).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-neutral-700">{l.description}</td>
                        <td className="px-4 py-2">
                          {isApproved ? (
                            <button
                              onClick={() => setApproval([l.id], false)}
                              title={`Approved by ${l.approvedBy} on ${new Date(
                                l.approvedAt,
                              ).toLocaleString()} — click to unapprove`}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-medium hover:bg-green-100 print:hover:bg-green-50"
                            >
                              ✓ Approved
                            </button>
                          ) : (
                            <button
                              onClick={() => setApproval([l.id], true)}
                              title="Click to approve"
                              className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-medium hover:bg-amber-100 print:hover:bg-amber-50"
                            >
                              Pending
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right print:hidden">
                          <button
                            onClick={() => deleteLog(l.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                            title="Delete entry"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot className="bg-neutral-50 font-medium">
                  <tr>
                    <td className="print:hidden" />
                    <td colSpan={4} className="px-4 py-2 text-right">
                      Total
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {totals.total.toFixed(2)}
                    </td>
                    <td colSpan={2} />
                    <td className="print:hidden" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* Summary breakdowns — clickable to filter */}
        {filtered.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 print:break-inside-avoid">
            <SummaryCard
              title="Hours by user"
              entries={[...totals.byUser.entries()]}
              activeKey={fUser}
              onClick={(k) => setFUser(fUser === k ? '' : k)}
            />
            <SummaryCard
              title="Hours by project"
              entries={[...totals.byProject.entries()]}
              activeKey={fProject}
              onClick={(k) => setFProject(fProject === k ? '' : k)}
            />
            <SummaryCard
              title="Hours by category"
              entries={[...totals.byCategory.entries()]}
              activeKey={fCategory}
              onClick={(k) => setFCategory(fCategory === k ? '' : k)}
            />
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  entries,
  activeKey,
  onClick,
}: {
  title: string;
  entries: [string, number][];
  activeKey?: string;
  onClick?: (key: string) => void;
}) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-neutral-700 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 mb-3 print:hidden">
        Click a row to filter the table.
      </p>
      <ul className="space-y-2">
        {sorted.map(([k, v]) => {
          const isActive = activeKey === k;
          return (
            <li key={k}>
              <button
                onClick={() => onClick?.(k)}
                className={`w-full text-left rounded-md px-2 py-1 -mx-2 transition ${
                  isActive ? 'bg-neutral-900/5' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex justify-between text-sm">
                  <span className={isActive ? 'font-semibold' : 'text-neutral-700'}>
                    {k}
                  </span>
                  <span className="tabular-nums font-medium">{v.toFixed(1)}h</span>
                </div>
                <div className="mt-1 h-1.5 bg-neutral-100 rounded">
                  <div
                    className={`h-1.5 rounded ${
                      isActive ? 'bg-neutral-900' : 'bg-neutral-700'
                    }`}
                    style={{ width: total ? `${(v / total) * 100}%` : '0%' }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
