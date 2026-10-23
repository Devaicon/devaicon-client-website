/** A titled card of related settings, with an optional line on where they are kept. */
export default function Group({
  title,
  description,
  footnote,
  children,
}: {
  title: string;
  description: string;
  footnote?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      <div className="mt-4">{children}</div>
      {footnote && (
        <p className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3 text-[11px] text-neutral-400 dark:text-neutral-500">
          {footnote}
        </p>
      )}
    </section>
  );
}
