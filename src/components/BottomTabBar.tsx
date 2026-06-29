import { Link, useLocation } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard, Gavel, ShieldCheck, Wallet, Bell,
  Inbox, SlidersHorizontal, MapPin, BadgeCheck,
} from "lucide-react";

const consumerTabs = [
  { to: "/consumer/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/consumer/bids", label: "Bids", icon: Gavel },
  { to: "/consumer/escrow", label: "Escrow", icon: ShieldCheck },
  { to: "/consumer/wallet", label: "Wallet", icon: Wallet },
  { to: "/activity", label: "Inbox", icon: Bell },
] as const;

const vendorTabs = [
  { to: "/vendor/opportunities", label: "Jobs", icon: Inbox },
  { to: "/vendor/bid", label: "Bid", icon: SlidersHorizontal },
  { to: "/vendor/route", label: "Route", icon: MapPin },
  { to: "/vendor/ledger", label: "Ledger", icon: BadgeCheck },
  { to: "/activity", label: "Inbox", icon: Bell },
] as const;

export function BottomTabBar() {
  const { role } = useApp();
  const loc = useLocation();
  const tabs = role === "consumer" ? consumerTabs : vendorTabs;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = loc.pathname === t.to || loc.pathname.startsWith(t.to + "/");
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-bold transition ${
                  active ? "text-[var(--azure)]" : "text-[var(--navy)]/60"
                }`}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-lg transition ${active ? "bg-[var(--offwhite)]" : ""}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}