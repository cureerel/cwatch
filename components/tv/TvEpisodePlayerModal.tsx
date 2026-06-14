import { X } from "lucide-react";

interface TvEpisodePlayerModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function TvEpisodePlayerModal({ url, title, onClose }: TvEpisodePlayerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/60 rounded-full p-1.5 hover:bg-black/80 transition"
          aria-label="Close video"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      </div>
    </div>
  );
}