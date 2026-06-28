import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import logoAsset from "@/assets/fixit-logo.png.asset.json";

export const LOGO_URL = logoAsset.url;

export type Role = "consumer" | "vendor";

export type Bid = {
  id: string;
  vendorCode: string;
  rating: number;
  jobsCompleted: number;
  completionRate: number;
  warrantyDays: number;
  amount: number;
  pro: boolean;
};

export type Voucher = { code: string; type: "credit" | "plan" | "fee"; amount: number; label: string };
export type Listing = {
  id: string; title: string; price: number; kind: "fixed" | "auction" | "junk";
  seller: string; area: string; emoji: string; topBid?: number;
};
export type WarrantyClaim = {
  id: string; jobTitle: string; raisedAgo: string; status: "open" | "scheduled" | "ignored";
};

/** Top-up bonus scale per spec (10→+1, 20→+3, 30/40/50→+5). */
export function topUpBonus(amount: number): number {
  if (amount >= 30) return 5;
  if (amount >= 20) return 3;
  if (amount >= 10) return 1;
  return 0;
}

/** Dynamic fee scale: <15 → 20%, 16–50 → 12%, ≥50 → 8%. */
export function feeRate(jobOMR: number): number {
  if (jobOMR >= 50) return 0.08;
  if (jobOMR > 15) return 0.12;
  return 0.2;
}

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  walletOMR: number;
  topUp: (n: number) => { credited: number; bonus: number };
  spend: (n: number) => boolean;
  bids: Bid[];
  lockedBidId: string | null;
  lockBid: (id: string) => void;
  escrowStage: 0 | 1 | 2 | 3;
  advanceEscrow: () => void;
  resetEscrow: () => void;
  isPlus: boolean;
  setPlus: (v: boolean) => void;
  isPro: boolean;
  setPro: (v: boolean) => void;

  // Triple-Verify
  vendorPhoto: boolean;
  consumerPhoto: boolean;
  setVendorPhoto: (v: boolean) => void;
  setConsumerPhoto: (v: boolean) => void;

  // Vouchers
  vouchers: Voucher[];
  redeemVoucher: (code: string) => Voucher | null;

  // Marketplace listings
  listings: Listing[];
  placeBid: (id: string, amount: number) => void;

  // Vendor side
  vendorWallet: number;
  lockedWarrantyPool: number;
  bidTokens: number;
  useBidToken: () => boolean;
  refundBidToken: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
  availableNow: boolean;
  setAvailableNow: (v: boolean) => void;
  strikes: number;
  addStrike: () => void;
  warrantyClaims: WarrantyClaim[];
  resolveClaim: (id: string, action: "schedule" | "ignore") => void;
  skills: { name: string; status: "approved" | "pending" }[];
  addSkill: (name: string) => void;

  // Parts protocol receipts (Multi-Receipt mode)
  receipts: { id: string; store: string; amount: number }[];
  addReceipt: (store: string, amount: number) => void;
  approveParts: () => void;
  partsApproved: boolean;

  // Diagnostic Pass
  diagnosticPassActive: boolean;
  buyDiagnosticPass: () => void;
  releaseDiagnosticPass: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("consumer");
  const [walletOMR, setWallet] = useState(42.5);
  const [bids] = useState<Bid[]>([
    { id: "b1", vendorCode: "Vendor #A-204", rating: 4.9, jobsCompleted: 312, completionRate: 98, warrantyDays: 60, amount: 28, pro: true },
    { id: "b2", vendorCode: "Vendor #C-118", rating: 4.8, jobsCompleted: 207, completionRate: 96, warrantyDays: 45, amount: 32, pro: true },
    { id: "b3", vendorCode: "Vendor #M-77",  rating: 4.6, jobsCompleted: 88,  completionRate: 92, warrantyDays: 30, amount: 24, pro: false },
    { id: "b4", vendorCode: "Vendor #K-42",  rating: 4.5, jobsCompleted: 54,  completionRate: 90, warrantyDays: 21, amount: 22, pro: false },
    { id: "b5", vendorCode: "Vendor #R-09",  rating: 4.3, jobsCompleted: 31,  completionRate: 87, warrantyDays: 14, amount: 19, pro: false },
  ]);
  const [lockedBidId, setLockedBidId] = useState<string | null>(null);
  const [escrowStage, setEscrowStage] = useState<0 | 1 | 2 | 3>(0);
  const [isPlus, setPlus] = useState(false);
  const [isPro, setPro] = useState(false);

  const [vendorPhoto, setVendorPhoto] = useState(false);
  const [consumerPhoto, setConsumerPhoto] = useState(false);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [listings, setListings] = useState<Listing[]>([
    { id: "l1", title: "Pre-owned Bosch drill (lightly used)", price: 14, kind: "fixed",   seller: "Seller #H-22", area: "Qurum",    emoji: "🛠️" },
    { id: "l2", title: "IKEA bookshelf — pick up only",        price: 8,  kind: "fixed",   seller: "Seller #A-91", area: "Mawaleh",  emoji: "📚" },
    { id: "l3", title: "Vintage rug 2×3m (auction)",            price: 6,  kind: "auction", seller: "Seller #N-04", area: "Al Hail",  emoji: "🧶", topBid: 11 },
    { id: "l4", title: "Broken washing machine (scrap)",        price: 0,  kind: "junk",    seller: "Seller #J-18", area: "Bowsher",  emoji: "♻️", topBid: 5 },
    { id: "l5", title: "Old copper pipes ≈4kg (scrap)",         price: 0,  kind: "junk",    seller: "Seller #J-44", area: "Ghala",    emoji: "🔩", topBid: 7 },
  ]);

  const [vendorWallet, setVendorWallet] = useState(142.4);
  const [lockedWarrantyPool, setLockedPool] = useState(86);
  const [bidTokens, setBidTokens] = useState(5);
  const [busy, setBusy] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [warrantyClaims, setClaims] = useState<WarrantyClaim[]>([
    { id: "wc1", jobTitle: "Kitchen sink re-seal — leaking again", raisedAgo: "2 hr ago", status: "open" },
  ]);
  const [skills, setSkills] = useState<{ name: string; status: "approved" | "pending" }[]>([
    { name: "Plumbing", status: "approved" },
    { name: "AC Repair", status: "pending" },
  ]);

  const [receipts, setReceipts] = useState<{ id: string; store: string; amount: number }[]>([]);
  const [partsApproved, setPartsApproved] = useState(false);

  const [diagnosticPassActive, setDiag] = useState(false);

  const value = useMemo<Ctx>(() => ({
    role, setRole,
    walletOMR,
    topUp: (n) => {
      const bonus = topUpBonus(n);
      setWallet((w) => w + n + bonus);
      return { credited: n + bonus, bonus };
    },
    spend: (n) => { if (walletOMR < n) return false; setWallet((w) => w - n); return true; },
    bids,
    lockedBidId,
    lockBid: (id) => { setLockedBidId(id); setEscrowStage(1); },
    escrowStage,
    advanceEscrow: () => setEscrowStage((s) => (s < 3 ? ((s + 1) as 0|1|2|3) : s)),
    resetEscrow: () => { setEscrowStage(0); setLockedBidId(null); setVendorPhoto(false); setConsumerPhoto(false); setPartsApproved(false); setReceipts([]); },
    isPlus, setPlus, isPro, setPro,
    vendorPhoto, consumerPhoto, setVendorPhoto, setConsumerPhoto,
    vouchers,
    redeemVoucher: (raw) => {
      const code = raw.trim().toUpperCase();
      if (!/^FIXIT-[A-Z0-9]{4}$/.test(code)) return null;
      let v: Voucher;
      const tail = code.slice(-1);
      if ("0123".includes(tail))      v = { code, type: "credit", amount: 5, label: "+5 OMR wallet credit" };
      else if ("456".includes(tail))  v = { code, type: "fee",    amount: 50, label: "−50% FixIt fee on next job" };
      else                            v = { code, type: "plan",   amount: 30, label: "30 days FixIt Plus unlocked" };
      setVouchers((vs) => [v, ...vs]);
      if (v.type === "credit") setWallet((w) => w + v.amount);
      if (v.type === "plan")   setPlus(true);
      return v;
    },
    listings,
    placeBid: (id, amount) => setListings((ls) => ls.map((l) => l.id === id ? { ...l, topBid: Math.max(l.topBid ?? 0, amount) } : l)),
    vendorWallet, lockedWarrantyPool,
    bidTokens,
    useBidToken: () => { if (bidTokens <= 0) return false; setBidTokens((t) => t - 1); return true; },
    refundBidToken: () => setBidTokens((t) => t + 1),
    busy, setBusy,
    availableNow, setAvailableNow,
    strikes, addStrike: () => setStrikes((s) => s + 1),
    warrantyClaims,
    resolveClaim: (id, action) => setClaims((cs) => cs.map((c) => c.id === id ? { ...c, status: action === "schedule" ? "scheduled" : "ignored" } : c)),
    skills, addSkill: (name) => setSkills((s) => [...s, { name, status: "pending" }]),
    receipts,
    addReceipt: (store, amount) => setReceipts((r) => [...r, { id: `r${r.length + 1}`, store, amount }]),
    approveParts: () => setPartsApproved(true),
    partsApproved,
    diagnosticPassActive,
    buyDiagnosticPass: () => { setWallet((w) => Math.max(0, w - 3)); setDiag(true); },
    releaseDiagnosticPass: () => { setDiag(false); setVendorWallet((w) => w + 1); },
  }), [role, walletOMR, bids, lockedBidId, escrowStage, isPlus, isPro, vendorPhoto, consumerPhoto, vouchers, listings, vendorWallet, lockedWarrantyPool, bidTokens, busy, availableNow, strikes, warrantyClaims, skills, receipts, partsApproved, diagnosticPassActive]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}