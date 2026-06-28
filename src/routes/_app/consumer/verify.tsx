import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";
import { Camera, CheckCircle2, ShieldCheck, ImageIcon, XCircle } from "lucide-react";

export const Route = createFileRoute("/_app/consumer/verify")({
  head: () => ({ meta: [{ title: "Triple-Verify — FixIt" }] }),
  component: Verify,
});

function Verify() {
  const { vendorPhoto, consumerPhoto, setVendorPhoto, setConsumerPhoto, advanceEscrow, escrowStage } = useApp();
  const bothIn = vendorPhoto && consumerPhoto;

  return (
    <div>
      <PageHeader
        eyebrow="Module 06 · Completion proof"
        title="Triple-Verify completion"
        subtitle="Vendor After + Consumer After + system match against Before — no he-said-she-said."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <PhotoSlot label="Before (locked)" filled subtitle="Captured during job posting." color="bg-[var(--offwhite)]" />
        <PhotoSlot
          label="Vendor 'After' photo"
          filled={vendorPhoto}
          subtitle={vendorPhoto ? "Submitted via in-app camera." : "Awaiting vendor capture."}
          color="bg-white"
          onClick={() => setVendorPhoto(!vendorPhoto)}
          actionLabel={vendorPhoto ? "Reset" : "Simulate vendor capture"}
        />
        <PhotoSlot
          label="Your 'After' confirmation"
          filled={consumerPhoto}
          subtitle={consumerPhoto ? "Your photo matches the vendor's." : "Take your own photo to confirm."}
          color="bg-white"
          onClick={() => setConsumerPhoto(!consumerPhoto)}
          actionLabel={consumerPhoto ? "Reset" : "Capture my After"}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--navy)]">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Final confirmation
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          "Is the job done?" → YES releases the platform-side rolling payout. NO opens dispute review.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            disabled={!bothIn}
            onClick={advanceEscrow}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" /> Yes — job done
          </button>
          <button
            disabled={!bothIn}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-40"
          >
            <XCircle className="h-4 w-4" /> No — open dispute
          </button>
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">
          Current escrow stage: <b>{escrowStage}</b> / 3 — confirming releases stage progression.
        </div>
      </div>
    </div>
  );
}

function PhotoSlot({ label, subtitle, filled, color, onClick, actionLabel }: {
  label: string; subtitle: string; filled?: boolean; color: string; onClick?: () => void; actionLabel?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border ${color} p-4 shadow-[var(--shadow-soft)]`}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 grid h-32 place-items-center rounded-xl border-2 border-dashed border-border bg-[var(--offwhite)] text-[var(--azure)]">
        {filled ? <ImageIcon className="h-8 w-8" /> : <Camera className="h-8 w-8 opacity-50" />}
      </div>
      <p className="mt-2 text-xs text-[var(--navy)]/70">{subtitle}</p>
      {onClick && (
        <button onClick={onClick} className="mt-2 w-full rounded-lg bg-[var(--navy)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--azure)]">
          {actionLabel}
        </button>
      )}
    </div>
  );
}