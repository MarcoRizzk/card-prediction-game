import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200",
  secondary:
    "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900",
  ghost:
    "bg-transparent text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:active:bg-zinc-800",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 dark:active:bg-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
        "disabled:opacity-80 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className ?? "",
      ].join(" ")}
      disabled={disabled}
      {...props}
    />
  );
}

