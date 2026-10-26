import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { PenLine, User } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function HeaderAuth() {
  const { user } = useAuth();

  if (hasClerk) {
    return (
      <div className="flex items-center gap-4">
        <SignedIn>
          <Link
            href="/studio/new"
            className="flex items-center gap-1.5 border border-[#b78a58]/60 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f3f0ea] transition-all hover:border-[#f3f0ea] hover:bg-[#b78a58]/10"
          >
            <PenLine size={13} className="text-[#b78a58]" />
            <span>Tulis Jurnal</span>
          </Link>
          <div className="flex items-center">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-white/20",
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <Link
            href="/studio"
            className="flex items-center gap-1.5 border border-white/20 bg-white/5 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f3f0ea] transition-all hover:border-[#b78a58] hover:text-[#b78a58]"
          >
            <User size={13} />
            <span>Masuk / Tulis</span>
          </Link>
        </SignedOut>
      </div>
    );
  }

  // Fallback when Clerk is not configured
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/studio"
        className="flex items-center gap-1.5 border border-[#b78a58]/70 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f3f0ea] transition-colors hover:border-[#f3f0ea]"
      >
        <PenLine size={13} className="text-[#b78a58]" />
        <span>{user ? "Studio" : "Tulis Jurnal"}</span>
      </Link>
    </div>
  );
}
