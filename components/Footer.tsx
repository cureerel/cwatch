import Link from "next/link";
import { Clapperboard, Github, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Browse",
    links: [
      { label: "Movies", href: "/home?tab=movies" },
      { label: "TV Shows", href: "/home?tab=tv" },
      { label: "Trending", href: "/home?tab=trending" },
      { label: "Top Rated", href: "/home?tab=top-rated" },
    ],
  },
  {
    title: "Genres",
    links: [
      { label: "Action", href: "/home?genre=28" },
      { label: "Comedy", href: "/home?genre=35" },
      { label: "Drama", href: "/home?genre=18" },
      { label: "Thriller", href: "/home?genre=53" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Clapperboard className="h-4 w-4" />
              </div>
              <span className="font-display text-2xl tracking-wider">
                C<span className="text-blue-400">WATCH</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Have a goodtime.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-blue-400 font-medium">Cureerel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
