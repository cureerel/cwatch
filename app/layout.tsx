import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StoreProvider } from "@/store/provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LenisProvider } from "@/components/LenisProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cwatch.cureerel.com"),

  title: "cwatch | Play Cinema",
  description: "Discover, Click and Enjoy Binge Watch. Movies, TV shows, all in one place.",

  keywords: ["movies", "tv shows", "streaming", "watch online"],

  openGraph: {
    title: "cwatch | Play Cinema",
    description: "Discover, Click and Enjoy Binge Watch. Movies, TV shows, all in one place.",
    type: "website",
    images: ["/preview.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "cwatch | Play Cinema",
    description: "Discover, Click and Enjoy Binge Watch. Movies, TV shows, all in one place.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-background text-foreground isolate">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <StoreProvider>
            <LenisProvider>
              <Navbar />
              <main className="relative z-0 ">{children}</main>
              <Footer />
            </LenisProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
