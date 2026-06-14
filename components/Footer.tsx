import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from "lucide-react";



export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16 pb-20 md:pb-0">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="cwatch Logo"
                width={250}
                height={150} 
                priority   
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Discover, search, tap, and play. Built for portfolio showcase purposes.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com/cureerel"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/cureerel"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} • cwatch
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