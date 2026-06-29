import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="grid place-items-center rounded-3xl border-2 border-dashed border-[var(--azure)]/25 bg-white px-6 py-14 text-center"
      style={{ background: "var(--gradient-canvas)" }}
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[var(--azure)] shadow-[var(--shadow-soft)]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-black text-[var(--navy)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--navy)]/70">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}