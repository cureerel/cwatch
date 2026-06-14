import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Browse",
    links: [
      { label: "Movies", href: "/browse?tab=movies" },
      { label: "TV Shows", href: "/browse?tab=tv" },
      { label: "Trending", href: "/browse?tab=trending" },
      { label: "Top Rated", href: "/browse?tab=top-rated" },
    ],
  },
  {
    title: "Genres",
    links: [
      { label: "Action", href: "/browse?genre=28" },
      { label: "Comedy", href: "/browse?genre=35" },
      { label: "Drama", href: "/browse?genre=18" },
      { label: "Thriller", href: "/browse?genre=53" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16 pb-20 md:pb-0">
      {/* Note: pb-20 md:pb-0 adds extra bottom padding on mobile so the floating navbar doesn't cover the footer links */}
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="cWatch Logo"
                width={32}
                height={36} 
                priority   
                className="object-contain"
              />
              <span className="font-bold text-lg tracking-tight text-foreground">
                cWatch
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your curated space for movies and shows. Have a good time.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
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
            © {new Date().getFullYear()} cWatch. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <Link 
              href="https://cureerel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Cureerel
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}