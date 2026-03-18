import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/api";
import { MoviePageClient } from "@/components/MoviePageClient";
import type { Metadata } from "next";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id)).catch(() => null);
  if (!movie) return { title: "Movie — CWatch" };
  return {
    title: `${movie.title} — CWatch`,
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id)).catch(() => null);
  if (!movie) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MoviePageClient movie={movie} mediaType="movie" />
    </Suspense>
  );
}
