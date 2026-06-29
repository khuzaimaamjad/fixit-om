import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { MotionPage, MotionStagger, MotionItem } from "@/components/MotionPage";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/context/AppContext";
import { Bell, ShieldCheck, Gavel, Ticket, AlertTriangle, Wallet, Sparkles } from "lucide-react";
import { omr } from "@/lib/utils";

export const Route = createFileRoute("/_app/activity")({
  head: () => ({
    meta: [
      { title: "Activity Inbox — FixIt" },
      { name: "description", content: "All your FixIt updates: bids, escrow, warranty, vouchers — in one timeline." },
    ],
  }),
  component: Activity,
});

function Activity() {
  const { role, escrowStage, lockedBidId, vouchers, warrantyClaims, walletOMR, isPlus } = useApp();

  const items = [
    lockedBidId && {
      icon: ShieldCheck, tone: "emerald",
      title: `Escrow locked — stage ${escrowStage}/3`,
      body: "Funds held with FixIt. Vendor dispatch in progress.",
      to: "/consumer/escrow", time: "just now",
    },
    ...vouchers.slice(0, 3).map((v) => ({
      icon: Ticket, tone: "azure",
      title: `Voucher redeemed · ${v.code}`,
      body: v.label, to: "/consumer/vouchers", time: "today",
    })),
    ...warrantyClaims.map((c) => ({
      icon: AlertTriangle, tone: c.status === "open" ? "amber" : "navy",
      title: `Warranty: ${c.jobTitle}`,
      body: `Status — ${c.status}`,
      to: role === "vendor" ? "/vendor/warranty" : "/consumer/dispute", time: c.raisedAgo,
    })),
    {
      icon: Wallet, tone: "navy",
      title: "Wallet balance",
      body: `${omr(walletOMR)} available across trades`,
      to: "/consumer/wallet", time: "live",
    },
    isPlus && {
      icon: Sparkles, tone: "azure",
      title: "FixIt Plus active",
      body: "10-image vault, priority bids, reduced escrow fees.",
      to: "/consumer/plus", time: "active",
    },
    {
      icon: Gavel, tone: "navy",
      title: "3 new bids in your feed",
      body: "Blind auction — vendor identities sealed until lock-in.",
      to: "/consumer/bids", time: "1h ago",
    },
  ].filter(Boolean) as any[];

  return (
    <MotionPage>
      <PageHeader
        eyebrow="Inbox"
        title="Everything happening on your account"
        subtitle="Bids, escrow milestones, warranty claims, vouchers — one chronological feed."
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Quiet so far"
          description="When vendors bid, escrow advances, or warranties trigger, you'll see them here."
          action={
            <Link
              to="/consumer/new-job"
              className="inline-flex rounded-xl bg-[var(--navy)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--azure)]"
            >
              Post your first job →
            </Link>
          }
        />
      ) : (
        <MotionStagger className="space-y-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            const toneCls =
              it.tone === "emerald" ? "bg-emerald-50 text-emerald-700" :
              it.tone === "amber"   ? "bg-amber-50 text-amber-700"   :
              it.tone === "azure"   ? "bg-[var(--offwhite)] text-[var(--azure)]" :
                                       "bg-[var(--offwhite)] text-[var(--navy)]";
            return (
              <MotionItem key={i}>
                <Link
                  to={it.to}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--azure)] hover:shadow-[var(--shadow-card)]"
                >
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneCls}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-[var(--navy)]">{it.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{it.body}</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{it.time}</div>
                </Link>
              </MotionItem>
            );
          })}
        </MotionStagger>
      )}
    </MotionPage>
  );
}