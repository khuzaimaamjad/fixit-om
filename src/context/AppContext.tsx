import { createContext, useContext, useState, type ReactNode } from "react";
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

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  walletOMR: number;
  topUp: (n: number) => void;
  bids: Bid[];
  lockedBidId: string | null;
  lockBid: (id: string) => void;
  escrowStage: 0 | 1 | 2 | 3;
  advanceEscrow: () => void;
  resetEscrow: () => void;
  isPlus: boolean;
  setPlus: (v: boolean) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("consumer");
  const [walletOMR, setWallet] = useState(42.5);
  const [bids, setBids] = useState<Bid[]>([
    { id: "b1", vendorCode: "Vendor #A-204", rating: 4.9, jobsCompleted: 312, completionRate: 98, warrantyDays: 60, amount: 28, pro: true },
    { id: "b2", vendorCode: "Vendor #C-118", rating: 4.8, jobsCompleted: 207, completionRate: 96, warrantyDays: 45, amount: 32, pro: true },
    { id: "b3", vendorCode: "Vendor #M-77",  rating: 4.6, jobsCompleted: 88,  completionRate: 92, warrantyDays: 30, amount: 24, pro: false },
    { id: "b4", vendorCode: "Vendor #K-42",  rating: 4.5, jobsCompleted: 54,  completionRate: 90, warrantyDays: 21, amount: 22, pro: false },
    { id: "b5", vendorCode: "Vendor #R-09",  rating: 4.3, jobsCompleted: 31,  completionRate: 87, warrantyDays: 14, amount: 19, pro: false },
  ]);
  const [lockedBidId, setLockedBidId] = useState<string | null>(null);
  const [escrowStage, setEscrowStage] = useState<0 | 1 | 2 | 3>(0);
  const [isPlus, setPlus] = useState(false);

  return (
    <AppCtx.Provider
      value={{
        role, setRole,
        walletOMR,
        topUp: (n) => setWallet((w) => w + n),
        bids,
        lockedBidId,
        lockBid: (id) => { setLockedBidId(id); setEscrowStage(1); setBids((bs) => bs.filter((b) => b.id === id || true)); },
        escrowStage,
        advanceEscrow: () => setEscrowStage((s) => (s < 3 ? ((s + 1) as 0|1|2|3) : s)),
        resetEscrow: () => { setEscrowStage(0); setLockedBidId(null); },
        isPlus, setPlus,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}