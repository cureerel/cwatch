import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTvDetails } from "@/lib/api";
import { TvPageClient } from "@/components/TvPageClient";
import type { Metadata } from "next";

interface TvPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getTvDetails(Number(id)).catch(() => null);
  if (!show) return { title: "TV Show — CWatch" };
  return {
    title: `${show.name ?? show.title} — CWatch`,
    description: show.overview,
    openGraph: {
      title: `${show.name ?? show.title} — CWatch`,
      description: show.overview,
      images: show.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`]
        : [],
    },
  };
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  const show = await getTvDetails(Number(id)).catch(() => null);
  if (!show) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TvPageClient show={show} />
    </Suspense>
  );
}
