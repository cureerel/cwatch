import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — CWatch",
  description: "Search for movies and TV shows on CWatch.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
