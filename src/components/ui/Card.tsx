import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/70 backdrop-blur ring-1 ring-zinc-200 shadow-sm",
        "dark:bg-zinc-950/60 dark:ring-zinc-800",
        className ?? "",
      ].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-5 pb-0", className ?? ""].join(" ")} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-5", className ?? ""].join(" ")} {...props} />;
}

