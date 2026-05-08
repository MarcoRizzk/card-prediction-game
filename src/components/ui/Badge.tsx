import * as React from "react";

type Variant = "default" | "muted" | "success" | "warning";

const variants: Record<Variant, string> = {
  default:
    "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950",
  muted:
    "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800",
  success:
    "bg-emerald-600 text-white dark:bg-emerald-500",
  warning:
    "bg-amber-500 text-white dark:bg-amber-400",
};

export function Badge({
  className,
  variant = "muted",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className ?? "",
      ].join(" ")}
      {...props}
    />
  );
}

