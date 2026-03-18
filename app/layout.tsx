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
  title: "CWatch — Stream Everything",
  description: "Your cinematic universe. Movies, TV shows, all in one place.",
  keywords: ["movies", "tv shows", "streaming", "watch online"],
  openGraph: {
    title: "CWatch — Stream Everything",
    description: "Your cinematic universe.",
    type: "website",
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
