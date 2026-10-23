import { Glitch } from "@/components/Glitch";

/**
 * Route loaders (used by the loading.tsx files). Each page gets a HUD panel —
 * spinning rings, glitch title, terminal lines, a load bar — on top of a
 * skeleton shaped like that page, so the layout is there before the data.
 */

function Hud({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="hud cut mx-auto flex w-full max-w-md items-center gap-5 border border-neon/40 bg-void/90 p-5 shadow-[0_0_40px_-10px_rgb(0_194_255/.6)]">
      <div className="hud-ring shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-neon">
          <Glitch text={title} auto />
        </p>
        <div className="term mt-2 space-y-0.5 font-display text-[0.55rem] uppercase tracking-[0.2em] text-ink-dim">
          {lines.map((line) => (
            <p key={line}><span className="text-volt">&gt;</span> {line}</p>
          ))}
        </div>
        <div className="load-bar mt-3" />
      </div>
    </div>
  );
}

/** Any page without its own loader. */
export function PageLoader() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-12">
      <Hud title="Loading" lines={["Establishing link", "Decrypting page", "Almost there"]} />
    </div>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardGridSkeleton({ count = 8, cols = "lg:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-5 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="hud cut border border-line bg-panel" style={{ opacity: 1 - i * 0.07 }}>
          <Bar className="aspect-[460/215]" />
          <div className="space-y-2 p-3 sm:p-4">
            <Bar className="h-2 w-1/2" />
            <Bar className="h-4 w-4/5" />
            <Bar className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-floor absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="shell relative py-12 sm:py-20">
          <Bar className="h-3 w-40" />
          <Bar className="mt-5 h-12 w-3/4 max-w-md sm:h-16" />
          <Bar className="mt-3 h-12 w-2/3 max-w-sm sm:h-16" />
          <div className="mt-10"><Hud title="Booting Xveria" lines={["Linking neural grid", "Loading game vault", "Syncing prices"]} /></div>
        </div>
      </section>
      <div className="shell py-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => <Bar key={i} className="cut-sm h-16 sm:h-20" />)}
        </div>
        <div className="mt-12"><CardGridSkeleton /></div>
      </div>
    </>
  );
}

export function GamesSkeleton() {
  return (
    <div className="shell py-6 sm:py-12">
      <Bar className="h-3 w-28" />
      <Bar className="mt-3 h-9 w-2/3 max-w-sm" />
      <div className="mt-6"><Hud title="Scanning arsenal" lines={["Indexing titles", "Applying filters", "Rendering grid"]} /></div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-3">
          <Bar className="h-11 w-full" />
          <div className="flex gap-2 overflow-hidden lg:flex-col">
            {Array.from({ length: 4 }).map((_, i) => <Bar key={i} className="h-9 w-28 shrink-0 lg:w-full" />)}
          </div>
        </div>
        <CardGridSkeleton count={6} cols="xl:grid-cols-3" />
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="shell py-8 sm:py-12">
      <Bar className="h-3 w-40" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Bar className="hud cut aspect-[460/215] w-full" />
        <div className="space-y-4">
          <Bar className="h-4 w-1/3" />
          <Bar className="h-10 w-4/5" />
          <Bar className="h-10 w-1/2" />
          <Hud title="Decrypting data" lines={["Fetching game file", "Checking stock", "Locking price"]} />
          <Bar className="cut h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
