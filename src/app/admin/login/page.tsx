import { LoginForm } from "@/components/AuthForms";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Admin login", robots: { index: false } };

export default function AdminLogin() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="cut w-full max-w-sm border border-neon/40 bg-panel p-8">
        <Logo />
        <h1 className="mt-6 font-display text-xl font-black uppercase">Admin <span className="text-volt">control</span></h1>
        <div className="mt-6"><LoginForm admin /></div>
      </div>
    </div>
  );
}
