"use client";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 transition-colors hover:border-[var(--color-border-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlowCard({
  className,
  glowColor = "#3b82f6",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glowColor?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 transition-all hover:border-opacity-60 group",
        className,
      )}
      style={{
        borderColor: `${glowColor}30`,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}08, transparent 40%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
