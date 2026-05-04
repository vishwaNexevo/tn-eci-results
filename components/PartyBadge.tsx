"use client";
import { partyMeta } from "@/lib/parties";

export function PartyBadge({
  party,
  color,
  size = "md",
}: {
  party: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const meta = partyMeta(party, color);
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-white ${dim}`}
      style={{ background: meta.color }}
      aria-label={meta.full}
      title={meta.full}
    >
      {meta.short.replace(/[^A-Z]/g, "").slice(0, 4) || meta.short.slice(0, 3)}
    </div>
  );
}
