import { X } from "lucide-react";

interface TvTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeKey: string | null;
  title: string;
}

export function TvTrailerModal({
  isOpen,
  onClose,
  youtubeKey,
  title,
}: TvTrailerModalProps) {
  if (!isOpen || !youtubeKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold text-sm truncate">
            {title} - Official Trailer
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close trailer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}