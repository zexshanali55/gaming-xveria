/**
 * Cyberpunk glitch text. The real text never moves; two tinted copies
 * (::before / ::after, from data-text) slice across it — see .glitch-text in
 * globals.css. `auto` glitches in short bursts on its own; otherwise it fires
 * while a parent `.glitch-host` (or the text itself) is hovered.
 */
export function Glitch({ text, auto = false, className = "" }: { text: string; auto?: boolean; className?: string }) {
  return (
    <span className={`glitch-text ${auto ? "glitch-auto" : ""} ${className}`} data-text={text}>
      {text}
    </span>
  );
}
