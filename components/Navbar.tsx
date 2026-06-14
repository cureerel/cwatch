"use client";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import {
  Search,
  Sun,
  Moon,
  Home,
  Settings,
  Users,
  X,
  Check,
} from "lucide-react";
import { useAppSelector, type RootState } from "@/store";
import { cn } from "@/lib/utils";

const desktopNavLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
];

const mobileNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "#settings", label: "Settings", icon: Settings },
];

const profiles = [
  { id: "guest", label: "Guest", icon: Users },
];

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeProfile, setActiveProfile] = useState("guest");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 16, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: "power3.out" },
    );
  }, []);

  const handleClose = () => {
    if (!panelRef.current) { onClose(); return; }
    gsap.to(panelRef.current, {
      y: 12, opacity: 0, scale: 0.97,
      duration: 0.18, ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />

      {/* Panel — bottom sheet on mobile, popover on desktop */}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-50 bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl",
          // Mobile: bottom sheet sitting above nav
          "bottom-24 left-2 right-2 rounded-2xl",
          // Desktop: top-right popover
          "md:bottom-auto md:top-16 md:right-4 md:left-auto md:w-72 md:rounded-2xl",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40">
          <span className="text-sm font-semibold text-foreground tracking-wide">Settings</span>
          <button
            onClick={handleClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-4">
          {/* Profile section */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">
              Profile
            </p>
            <div className="space-y-1">
              {profiles.map(({ id, label, icon: Icon }) => {
                const isActive = activeProfile === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveProfile(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                    )}
                  >
                    <div className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                      isActive ? "bg-accent-foreground/15" : "bg-muted",
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 text-left">{label}</span>
                    {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Theme section */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">
              Appearance
            </p>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((mode) => {
                const isActive = resolvedTheme === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-accent/30",
                    )}
                  >
                    {mode === "light"
                      ? <Sun className="h-4 w-4" />
                      : <Moon className="h-4 w-4" />}
                    <span className="capitalize">{mode}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground/50 text-center tracking-wide">
            cWatch · v1.0
          </p>
        </div>
      </div>
    </>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  useEffect(() => {
    if (!mobileNavRef.current) return;
    gsap.fromTo(mobileNavRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 },
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
    gsap.to(logoRef.current, { scale: 1.05, duration: 0.25, ease: "power2.out" });
  };
  const handleLogoLeave = () => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <>
      {/* Settings panel */}
      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}

      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-2"
            : "bg-transparent py-4",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }} className="flex items-center gap-2 shrink-0">
            <div
              ref={logoRef}
              onMouseEnter={handleLogoHover}
              onMouseLeave={handleLogoLeave}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="cWatch Logo"
                width={250}
                height={150}
                priority
                className="object-contain"
                style={{ display: "block" }}
              />
            
            </div>
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {desktopNavLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none" }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right — theme + settings */}
          <div className="flex items-center gap-1">
            

            <button
              onClick={() => setSettingsOpen((p) => !p)}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-lg transition-colors",
                settingsOpen
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
              aria-label="Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Floating Bottom Nav (3 tabs) ── */}
      <div
        ref={mobileNavRef}
        className="fixed z-50 flex md:hidden"
        style={{ bottom: 12, left: 8, right: 8 }}
      >
        <div className="w-full bg-background/75 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl flex items-center overflow-hidden">
          {mobileNavLinks.map((link, i) => {
            const Icon = link.icon;
            const isSettings = link.href === "#settings";
            const active = isSettings
              ? settingsOpen
              : pathname === link.href;
            const isLast = i === mobileNavLinks.length - 1;

            const inner = (
              <>
                {active && (
                  <span className="absolute inset-1.5 rounded-xl bg-accent/40 -z-10" />
                )}
                {link.href === "/" ? (
                 <Home className="h-4 w-4" />
                ) : (
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                )}
                <span className={cn("text-[10px] font-medium tracking-wide", active ? "opacity-100" : "opacity-60")}>
                  {link.label}
                </span>
              </>
            );

            if (isSettings) {
              return (
                <button
                  key={link.href}
                  onClick={() => setSettingsOpen((p) => !p)}
                  style={{ flex: 1, textDecoration: "none" }}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 py-3 transition-colors duration-200",
                    !isLast && "border-r border-border/30",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {inner}
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", flex: 1 }}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-3 transition-colors duration-200",
                  !isLast && "border-r border-border/30",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-background py-4" />
    }>
      <NavbarContent />
    </Suspense>
  );
}