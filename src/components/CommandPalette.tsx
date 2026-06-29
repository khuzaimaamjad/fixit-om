import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import {
  LayoutDashboard, Sparkles, Gavel, ShieldCheck, Receipt, AlertTriangle, Wallet,
  Inbox, MapPin, Hammer, BadgeCheck, Store, Crown, Camera, Stethoscope, Ticket,
  Recycle, Radio, Bell, SlidersHorizontal,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

type Item = { label: string; to: string; icon: any; hint?: string; role: "consumer" | "vendor" | "both" };

const ITEMS: Item[] = [
  { label: "Dashboard", to: "/consumer/dashboard", icon: LayoutDashboard, role: "consumer" },
  { label: "Post a new job", to: "/consumer/new-job", icon: Sparkles, hint: "AI-assisted", role: "consumer" },
  { label: "Blind bids feed", to: "/consumer/bids", icon: Gavel, role: "consumer" },
  { label: "Escrow tracking", to: "/consumer/escrow", icon: ShieldCheck, role: "consumer" },
  { label: "Wallet & top-ups", to: "/consumer/wallet", icon: Wallet, role: "consumer" },
  { label: "Triple-verify completion", to: "/consumer/verify", icon: Camera, role: "consumer" },
  { label: "Diagnostic pass", to: "/consumer/diagnostic", icon: Stethoscope, role: "consumer" },
  { label: "Redeem voucher", to: "/consumer/vouchers", icon: Ticket, role: "consumer" },
  { label: "Available now (live vendors)", to: "/consumer/available-now", icon: Radio, role: "consumer" },
  { label: "Marketplace", to: "/consumer/marketplace", icon: Store, role: "consumer" },
  { label: "Junk auction", to: "/consumer/junk", icon: Recycle, role: "consumer" },
  { label: "Material costs", to: "/consumer/materials", icon: Receipt, role: "consumer" },
  { label: "Dispute resolution", to: "/consumer/dispute", icon: AlertTriangle, role: "consumer" },
  { label: "FixIt Plus", to: "/consumer/plus", icon: Crown, role: "consumer" },

  { label: "Opportunities", to: "/vendor/opportunities", icon: Inbox, role: "vendor" },
  { label: "Submit bid", to: "/vendor/bid", icon: SlidersHorizontal, role: "vendor" },
  { label: "On-site route", to: "/vendor/route", icon: MapPin, role: "vendor" },
  { label: "Parts logger", to: "/vendor/parts", icon: Receipt, role: "vendor" },
  { label: "Capital ledger", to: "/vendor/ledger", icon: Wallet, role: "vendor" },
  { label: "Warranty claims", to: "/vendor/warranty", icon: ShieldCheck, role: "vendor" },
  { label: "Skill tags", to: "/vendor/skills", icon: BadgeCheck, role: "vendor" },
  { label: "Workshop intake", to: "/vendor/workshop", icon: Hammer, role: "vendor" },
  { label: "Sell on FixIt", to: "/vendor/marketplace", icon: Store, role: "vendor" },
  { label: "FixIt Pro", to: "/vendor/pro", icon: Crown, role: "vendor" },

  { label: "Activity inbox", to: "/activity", icon: Bell, role: "both" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role, setRole } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const items = ITEMS.filter((i) => i.role === "both" || i.role === role);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-start justify-center bg-[#0B2545]/40 px-4 pt-[12vh] backdrop-blur-sm animate-in fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl animate-in zoom-in-95"
      >
        <Command label="Command palette" className="flex flex-col">
          <Command.Input
            autoFocus
            placeholder="Jump to anything in FixIt — type to search…"
            className="w-full border-b border-border bg-transparent px-5 py-4 text-sm font-semibold text-[var(--navy)] outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
              No matches — try "bid", "wallet", or "warranty".
            </Command.Empty>
            <Command.Group heading="Switch role" className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Command.Item
                value="switch consumer role"
                onSelect={() => { setRole("consumer"); navigate({ to: "/consumer/dashboard" }); setOpen(false); }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--navy)] data-[selected=true]:bg-[var(--offwhite)]"
              >
                <LayoutDashboard className="h-4 w-4 text-[var(--azure)]" /> Consumer mode
              </Command.Item>
              <Command.Item
                value="switch vendor role"
                onSelect={() => { setRole("vendor"); navigate({ to: "/vendor/opportunities" }); setOpen(false); }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--navy)] data-[selected=true]:bg-[var(--offwhite)]"
              >
                <Hammer className="h-4 w-4 text-[var(--azure)]" /> Vendor mode
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Navigate" className="px-2 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <Command.Item
                    key={it.to}
                    value={`${it.label} ${it.to}`}
                    onSelect={() => { navigate({ to: it.to }); setOpen(false); }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--navy)] data-[selected=true]:bg-[var(--offwhite)]"
                  >
                    <Icon className="h-4 w-4 text-[var(--azure)]" />
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.hint && <span className="rounded bg-[var(--offwhite)] px-2 py-0.5 text-[10px] font-bold text-[var(--azure)]">{it.hint}</span>}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-border bg-[var(--offwhite)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>⌘K to toggle · ↵ to go</span>
            <span className="text-[var(--azure)]">FixIt</span>
          </div>
        </Command>
      </div>
    </div>
  );
}