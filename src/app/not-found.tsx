import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="glitch font-display text-8xl font-black text-neon">404</p>
        <p className="mt-4 font-display text-xl font-bold uppercase">Wrong turn, racer.</p>
        <Link href="/games" className="btn-volt mt-8">Back to the store</Link>
      </div>
    </div>
  );
}
