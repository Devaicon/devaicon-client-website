import type { LucideIcon } from "lucide-react";

/**
 * A square icon button for table rows. The label is both the accessible name
 * and a small tooltip on hover or keyboard focus, so the icon never has to
 * explain itself. A disabled button keeps its place (rows stay aligned) and
 * its tooltip says why it's disabled.
 */
export default function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  disabledReason,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  tone?: "default" | "danger";
}) {
  const tip = disabled && disabledReason ? disabledReason : label;
  return (
    <span className="group/icon relative inline-flex">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-30 ${
          tone === "danger"
            ? "text-red-600 dark:text-red-400 enabled:hover:bg-red-50 dark:enabled:hover:bg-red-950/50"
            : "text-neutral-600 dark:text-neutral-400 enabled:hover:bg-neutral-100 dark:enabled:hover:bg-neutral-800 enabled:hover:text-neutral-900 dark:enabled:hover:text-neutral-100"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </button>
      <span
        role="presentation"
        className="pointer-events-none absolute bottom-full right-0 z-30 mb-1.5 translate-y-1 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow transition duration-150 ease-out group-hover/icon:translate-y-0 group-hover/icon:opacity-100 group-hover/icon:delay-100 group-focus-within/icon:translate-y-0 group-focus-within/icon:opacity-100 motion-reduce:translate-y-0 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {tip}
      </span>
    </span>
  );
}
