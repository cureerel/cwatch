import { SearchClient } from "@/components/search/SearchClient";

export const metadata = {
  title: "Search — cwatch",
  description: "Search for movies and TV shows on CWatch.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <SearchClient />
    </div>
  );
}