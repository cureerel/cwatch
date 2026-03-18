"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import {
  Search,
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  Clapperboard,
} from "lucide-react";
import { useAppSelector, type RootState } from "@/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = resolvedTheme === "dark";

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const watchlistCount = useAppSelector(
    (s: RootState) => s.watchlist.items.length,
  );

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogoHover = () => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      scale: 1.08,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleLogoLeave = () => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 mix-blend-difference",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              ref={logoRef}
              onMouseEnter={handleLogoHover}
              onMouseLeave={handleLogoLeave}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                <Clapperboard className="h-4 w-4" />
              </div>
              <span className="font-display text-2xl tracking-wider text-white">
                C<span className="text-white">WATCH</span>
              </span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white hover:text-white/80",
                      active && "bg-white/20",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push("/search")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/browse?tab=watchlist"
              className="relative h-9 w-9 flex items-center justify-center rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Watchlist"
            >
              <Bookmark className="h-4 w-4" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black text-[10px] font-medium">
                  {watchlistCount > 9 ? "9+" : watchlistCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16 mix-blend-difference">
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 mx-4 mt-2 rounded-xl p-2 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white",
                  pathname === link.href ? "bg-white/20" : "hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
