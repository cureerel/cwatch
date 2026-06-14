import Image from "next/image";
import { TMDB_IMAGE_BASE } from "@/lib/api";
import type { CastMember } from "@/types";

interface TvCastProps {
  cast: CastMember[];
}

export function TvCast({ cast }: TvCastProps) {
  if (!cast.length) return null;

  return (
    <div>
      <h2 className="font-display text-2xl tracking-wider uppercase text-foreground mb-4">
        <span className="text-primary">Top</span> Cast
      </h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {cast.slice(0, 15).map((member) => (
          <div key={member.id} className="shrink-0 w-20 md:w-24 text-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border mb-2 mx-auto bg-muted">
              {member.profile_path ? (
                <Image
                  src={`${TMDB_IMAGE_BASE}/w185${member.profile_path}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg text-muted-foreground">
                  {member.name[0]}
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-foreground line-clamp-1">{member.name}</p>
            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}