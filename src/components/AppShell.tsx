import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { LOGO_URL, useApp } from "@/context/AppContext";
import {
  LayoutDashboard, Sparkles, Gavel, ShieldCheck, Receipt, AlertTriangle,
  Inbox, SlidersHorizontal, MapPin, Wallet, LogOut, Menu, X,
  Store, Recycle, Stethoscope, Ticket, Crown, Hammer, BadgeCheck, Radio, CheckSquare,
  Bell, Command as CommandIcon,
} from "lucide-react";
import { useState } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import { CountUp } from "@/components/CountUp";
import { motion, AnimatePresence } from "framer-motion";

const consumerNav = [
  { to: "/consumer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-job", label: "Post a Job", icon: Sparkles },
  { to: "/bids", label: "Blind Bids", icon: Gavel },
  { to: "/escrow", label: "Escrow Tracking", icon: ShieldCheck },
  { to: "/materials", label: "Material Costs", icon: Receipt },
  { to: "/dispute", label: "Resolution Center", icon: AlertTriangle },
] as const;

const vendorNav = [
  { to: "/vendor/opportunities", label: "Opportunities",    icon: Inbox },
  { to: "/vendor/bid",           label: "Submit Bid",       icon: SlidersHorizontal },
  { to: "/vendor/route",         label: "On-Site Route",    icon: MapPin },
  { to: "/vendor/parts",         label: "Parts Logger",     icon: Receipt },
  { to: "/vendor/ledger",        label: "Capital Ledger",   icon: Wallet },
  { to: "/vendor/warranty",      label: "Warranty Claims",  icon: ShieldCheck },
  { to: "/vendor/skills",        label: "Skill Tags",       icon: BadgeCheck },
  { to: "/vendor/workshop",      label: "Workshop Intake",  icon: Hammer },
  { to: "/vendor/marketplace",   label: "Sell on FixIt",    icon: Store },
  { to: "/vendor/pro",           label: "FixIt Pro",        icon: Crown },
] as const;

export default function AppShell() {
  const { role, setRole, walletOMR } = useApp();
  const nav = role === "consumer" ? consumerNav : vendorNav;
  const loc = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--offwhite)] pb-16 text-foreground lg:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/consumer/dashboard" className="flex min-w-0 items-center gap-2">
            <img src={LOGO_URL} alt="FixIt" className="h-9 w-9 shrink-0" />
            <span className="truncate text-xl font-black tracking-tight text-[var(--navy)]">FixIt</span>
            <span className="ml-1 hidden rounded-md bg-[var(--offwhite)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--azure)] sm:inline">
              OMAN
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => { const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true }); window.dispatchEvent(ev); }}
              className="hidden items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-[var(--azure)] hover:text-[var(--navy)] md:flex"
              aria-label="Open command palette"
            >
              <CommandIcon className="h-3.5 w-3.5" /> Search
              <kbd className="rounded bg-[var(--offwhite)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--azure)]">⌘K</kbd>
            </button>
            <Link
              to="/activity"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white text-[var(--navy)] hover:border-[var(--azure)]"
              aria-label="Activity inbox"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <div className="hidden items-center gap-1 rounded-xl bg-[var(--offwhite)] p-1 sm:flex">
              {(["consumer", "vendor"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    navigate({ to: r === "consumer" ? "/dashboard" : "/vendor/opportunities" });
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    role === r ? "bg-[var(--navy)] text-white shadow" : "text-[var(--navy)]/70"
                  }`}
                >
                  {r === "consumer" ? "Consumer" : "Vendor"}
                </button>
              ))}
            </div>
            <div className="hidden rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-[var(--navy)] md:block">
              Wallet · <span className="text-[var(--azure)]"><CountUp value={walletOMR} decimals={2} suffix=" OMR" /></span>
            </div>
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-[var(--navy)]" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* mobile role toggle */}
        <div className="flex items-center gap-1 border-t border-border bg-white px-4 py-2 sm:hidden">
          {(["consumer", "vendor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                navigate({ to: r === "consumer" ? "/dashboard" : "/vendor/opportunities" });
              }}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                role === r ? "bg-[var(--navy)] text-white" : "bg-[var(--offwhite)] text-[var(--navy)]/70"
              }`}
            >
              {r === "consumer" ? "Consumer" : "Vendor"}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-30 w-64 transform border-r border-border bg-white p-3 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {role === "consumer" ? "Consumer Pipeline" : "Vendor Workspace"}
          </div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = loc.pathname === item.to || (item.to !== "/consumer/dashboard" && item.to !== "/vendor/opportunities" && loc.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--navy)] text-white shadow"
                      : "text-[var(--navy)]/75 hover:bg-[var(--offwhite)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-border p-4" style={{ background: "var(--gradient-canvas)" }}>
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--navy)]">FixIt Pro</div>
            <p className="mt-1 text-xs text-[var(--navy)]/75">
              Unlock 10-image jobs, priority bids & lower escrow fees.
            </p>
            <button className="mt-3 w-full rounded-lg bg-[var(--azure)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--navy)]">
              Upgrade · 4.9 OMR / mo
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-[calc(100dvh-4rem)] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}