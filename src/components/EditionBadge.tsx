export function EditionBadge({ edition }: { edition: "DIGITAL" | "PHYSICAL" }) {
  return edition === "DIGITAL" ? (
    <span className="border border-neon/60 bg-void/80 px-2 py-0.5 font-display text-[0.55rem] font-bold tracking-[0.18em] text-neon backdrop-blur">
      ⚡ DIGITAL KEY
    </span>
  ) : (
    <span className="border border-volt/60 bg-void/80 px-2 py-0.5 font-display text-[0.55rem] font-bold tracking-[0.18em] text-volt backdrop-blur">
      ◆ PHYSICAL DISC
    </span>
  );
}
