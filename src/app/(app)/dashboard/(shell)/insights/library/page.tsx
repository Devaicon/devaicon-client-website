"use client";

import { useState, type ReactNode } from "react";
import { Building2, Megaphone, Pencil, Plus, Tag, Trash2, User } from "lucide-react";
import type { Author, Category, Cta, CtaStyle } from "@/lib/blog/types";
import { PageHeader, SectionGate } from "@/components/dashboard/DashboardShell";
import IconButton from "@/components/dashboard/IconButton";
import { api } from "@/components/dashboard/api";
import { useApi } from "@/components/dashboard/useApi";
import { ImageSourceInput } from "@/components/blog-editor/ImagePicker";
import CtaCard from "@/components/blog/CtaCard";

type Used = { postCount: number };
type Tab = "authors" | "ctas" | "categories";

const INPUT =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm";
const LABEL = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";
const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "authors", label: "Authors", icon: User },
  { key: "ctas", label: "Calls to action", icon: Megaphone },
  { key: "categories", label: "Categories", icon: Tag },
];

export default function LibraryPage() {
  return (
    <SectionGate anyOf={["blog.library"]}>
      <Library />
    </SectionGate>
  );
}

function Library() {
  const [tab, setTab] = useState<Tab>("authors");
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog library"
        description="The pieces posts are built from. Changing one here updates every post that uses it."
      />
      <div role="tablist" aria-label="Library" className="flex flex-wrap gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm ${
                tab === t.key
                  ? "border-neutral-900 font-medium text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>
      <div key={tab} className="anim-fade">
        {tab === "authors" && <Authors />}
        {tab === "ctas" && <Ctas />}
        {tab === "categories" && <Categories />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shared */

function useCollection<T extends { id: string }>(path: string) {
  const res = useApi<{ items: (T & Used)[] }>(path);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<(T & Used) | "new" | null>(null);

  async function save(body: unknown) {
    const isNew = editing === "new";
    const r = await api(isNew ? path : `${path}/${(editing as T).id}`, {
      method: isNew ? "POST" : "PATCH",
      body,
    });
    if (!r.ok) return r.message ?? "Couldn't save.";
    setEditing(null);
    res.reload();
    return null;
  }

  async function remove(item: T & Used, name: string) {
    if (!confirm(`Delete “${name}”?`)) return;
    const r = await api(`${path}/${item.id}`, { method: "DELETE" });
    setMsg(r.ok ? null : r.message);
    res.reload();
  }

  return { items: res.data?.items ?? [], loading: res.loading, error: res.error, msg, editing, setEditing, save, remove };
}

function ListFrame({
  addLabel,
  onAdd,
  loading,
  error,
  empty,
  children,
}: {
  addLabel: string;
  onAdd: () => void;
  loading: boolean;
  error: string | null;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex justify-end">
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600">
          <Plus className="h-4 w-4" aria-hidden />
          {addLabel}
        </button>
      </div>
      {error && (
        <div role="status" className="anim-drop text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        {loading ? (
          <div className="h-40 animate-pulse" />
        ) : empty ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">{children}</ul>
        )}
      </div>
    </section>
  );
}

function Row({
  lead,
  title,
  meta,
  postCount,
  onEdit,
  onDelete,
}: {
  lead?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  postCount: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      {lead}
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{title}</div>
        {meta && <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">{meta}</div>}
      </div>
      <span className="hidden sm:inline text-xs text-neutral-500 whitespace-nowrap">
        {postCount === 0 ? "Not used" : `Used by ${postCount} post${postCount === 1 ? "" : "s"}`}
      </span>
      <div className="flex gap-1">
        <IconButton icon={Pencil} label="Edit" onClick={onEdit} />
        <IconButton
          icon={Trash2}
          label="Delete"
          tone="danger"
          onClick={onDelete}
          disabled={postCount > 0}
          disabledReason={`Used by ${postCount} post${postCount === 1 ? "" : "s"}; change ${postCount === 1 ? "it" : "them"} first`}
        />
      </div>
    </li>
  );
}

function Dialog({
  title,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: () => Promise<string | null>;
  children: ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-dialog-title"
      className="anim-fade fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-black/40 p-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const problem = await onSubmit();
          setBusy(false);
          setError(problem);
        }}
        className="w-full max-w-lg space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg"
      >
        <h2 id="library-dialog-title" className="font-semibold">
          {title}
        </h2>
        {children}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="rounded-md bg-neutral-900 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------------------------------------------- authors */

function Authors() {
  const c = useCollection<Author>("/authors");
  return (
    <>
      <ListFrame addLabel="Add author" onAdd={() => c.setEditing("new")} loading={c.loading} error={c.msg || c.error} empty={c.items.length === 0}>
        {c.items.map((a) => (
          <Row
            key={a.id}
            lead={
              a.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  {a.type === "Organization" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </span>
              )
            }
            title={a.name}
            meta={[a.type === "Organization" ? "Team byline" : "Person", a.jobTitle].filter(Boolean).join(" · ")}
            postCount={a.postCount}
            onEdit={() => c.setEditing(a)}
            onDelete={() => c.remove(a, a.name)}
          />
        ))}
      </ListFrame>
      {c.editing && <AuthorForm initial={c.editing === "new" ? null : c.editing} onClose={() => c.setEditing(null)} onSave={c.save} />}
    </>
  );
}

function AuthorForm({ initial, onClose, onSave }: { initial: Author | null; onClose: () => void; onSave: (b: unknown) => Promise<string | null> }) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    type: initial?.type ?? "Person",
    jobTitle: initial?.jobTitle ?? "",
    bio: initial?.bio ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    links: (initial?.links ?? []).join("\n"),
  });
  return (
    <Dialog
      title={initial ? `Edit ${initial.name}` : "Add an author"}
      onClose={onClose}
      onSubmit={() => onSave({ ...f, links: f.links.split("\n").map((l) => l.trim()).filter(Boolean) })}
    >
      <div>
        <label htmlFor="a-name" className={LABEL}>Name</label>
        <input id="a-name" required maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={INPUT} />
      </div>
      <div>
        <label htmlFor="a-type" className={LABEL}>This byline is</label>
        <select id="a-type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as Author["type"] })} className={INPUT}>
          <option value="Person">A person</option>
          <option value="Organization">A team (e.g. &quot;Devaicon Technology Team&quot;)</option>
        </select>
        <p className="mt-1 text-[11px] text-neutral-500">Search engines give more weight to a named person with a public profile.</p>
      </div>
      <div>
        <label htmlFor="a-job" className={LABEL}>Job title</label>
        <input id="a-job" maxLength={100} value={f.jobTitle} onChange={(e) => setF({ ...f, jobTitle: e.target.value })} className={INPUT} />
      </div>
      <div>
        <label htmlFor="a-bio" className={LABEL}>Short bio</label>
        <textarea id="a-bio" rows={3} maxLength={600} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} className={INPUT} />
      </div>
      <div>
        <div className={LABEL}>Photo</div>
        <ImageSourceInput value={f.avatarUrl} onChange={(avatarUrl) => setF({ ...f, avatarUrl })} />
      </div>
      <div>
        <label htmlFor="a-links" className={LABEL}>Profile links, one per line (LinkedIn, personal site)</label>
        <textarea id="a-links" rows={2} value={f.links} placeholder="https://www.linkedin.com/in/…" onChange={(e) => setF({ ...f, links: e.target.value })} className={INPUT} />
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------------- ctas */

const STYLE_LABEL: Record<CtaStyle, string> = {
  panel: "Panel: a tinted box",
  banner: "Banner: a bold dark strip",
  inline: "Inline: one line with a button",
};

function Ctas() {
  const c = useCollection<Cta>("/ctas");
  return (
    <>
      <ListFrame addLabel="Add call to action" onAdd={() => c.setEditing("new")} loading={c.loading} error={c.msg || c.error} empty={c.items.length === 0}>
        {c.items.map((cta) => (
          <Row
            key={cta.id}
            title={cta.name}
            meta={`${cta.heading} · ${cta.buttonLabel} → ${cta.buttonUrl}`}
            postCount={cta.postCount}
            onEdit={() => c.setEditing(cta)}
            onDelete={() => c.remove(cta, cta.name)}
          />
        ))}
      </ListFrame>
      {c.editing && <CtaForm initial={c.editing === "new" ? null : c.editing} onClose={() => c.setEditing(null)} onSave={c.save} />}
    </>
  );
}

function CtaForm({ initial, onClose, onSave }: { initial: Cta | null; onClose: () => void; onSave: (b: unknown) => Promise<string | null> }) {
  const [f, setF] = useState<Omit<Cta, "id">>({
    name: initial?.name ?? "",
    heading: initial?.heading ?? "",
    body: initial?.body ?? "",
    buttonLabel: initial?.buttonLabel ?? "Book a Session",
    buttonUrl: initial?.buttonUrl ?? "/contact-us",
    style: initial?.style ?? "panel",
  });
  return (
    <Dialog title={initial ? `Edit ${initial.name}` : "Add a call to action"} onClose={onClose} onSubmit={() => onSave(f)}>
      <div>
        <label htmlFor="c-name" className={LABEL}>Name (only editors see this)</label>
        <input id="c-name" maxLength={80} value={f.name} placeholder="e.g. AI discovery session" onChange={(e) => setF({ ...f, name: e.target.value })} className={INPUT} />
      </div>
      <div>
        <label htmlFor="c-heading" className={LABEL}>Heading</label>
        <input id="c-heading" required maxLength={140} value={f.heading} onChange={(e) => setF({ ...f, heading: e.target.value })} className={INPUT} />
      </div>
      <div>
        <label htmlFor="c-body" className={LABEL}>Text (optional)</label>
        <textarea id="c-body" rows={2} maxLength={400} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} className={INPUT} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="c-label" className={LABEL}>Button label</label>
          <input id="c-label" required maxLength={40} value={f.buttonLabel} onChange={(e) => setF({ ...f, buttonLabel: e.target.value })} className={INPUT} />
        </div>
        <div>
          <label htmlFor="c-url" className={LABEL}>Button link</label>
          <input id="c-url" required maxLength={500} value={f.buttonUrl} placeholder="/contact-us or https://…" onChange={(e) => setF({ ...f, buttonUrl: e.target.value })} className={INPUT} />
        </div>
      </div>
      <div>
        <label htmlFor="c-style" className={LABEL}>Style</label>
        <select id="c-style" value={f.style} onChange={(e) => setF({ ...f, style: e.target.value as CtaStyle })} className={INPUT}>
          {(Object.keys(STYLE_LABEL) as CtaStyle[]).map((s) => (
            <option key={s} value={s}>
              {STYLE_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className={LABEL}>Preview</div>
        <div className="rounded-md bg-white px-4 py-1 text-left [&_aside]:my-3">
          <CtaCard cta={{ id: "preview", ...f, heading: f.heading || "Heading" }} />
        </div>
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------- categories */

function Categories() {
  const c = useCollection<Category>("/categories");
  return (
    <>
      <ListFrame addLabel="Add category" onAdd={() => c.setEditing("new")} loading={c.loading} error={c.msg || c.error} empty={c.items.length === 0}>
        {c.items.map((cat) => (
          <Row
            key={cat.id}
            title={cat.name}
            meta={cat.description || `/${cat.slug}`}
            postCount={cat.postCount}
            onEdit={() => c.setEditing(cat)}
            onDelete={() => c.remove(cat, cat.name)}
          />
        ))}
      </ListFrame>
      {c.editing && <CategoryForm initial={c.editing === "new" ? null : c.editing} onClose={() => c.setEditing(null)} onSave={c.save} />}
    </>
  );
}

function CategoryForm({ initial, onClose, onSave }: { initial: Category | null; onClose: () => void; onSave: (b: unknown) => Promise<string | null> }) {
  const [f, setF] = useState({ name: initial?.name ?? "", description: initial?.description ?? "" });
  return (
    <Dialog title={initial ? `Edit ${initial.name}` : "Add a category"} onClose={onClose} onSubmit={() => onSave(f)}>
      <div>
        <label htmlFor="cat-name" className={LABEL}>Name</label>
        <input id="cat-name" required maxLength={60} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={INPUT} />
      </div>
      <div>
        <label htmlFor="cat-desc" className={LABEL}>Description (optional)</label>
        <textarea id="cat-desc" rows={2} maxLength={300} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={INPUT} />
      </div>
    </Dialog>
  );
}
