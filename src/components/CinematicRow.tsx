import React, { useState } from "react";
import { Movie } from "../types";
import { Heart, Eye, Star } from "lucide-react";
import { motion } from "motion/react";

interface CinematicRowProps {
  title: string;
  subtitle: string;
  movies: Movie[];
  onOpenReviews: (movie: Movie) => void;
  watchlist: number[];
  onToggleWatchlist: (movieId: number) => void;
  accentColor?: string;
  isMature?: boolean;
}

export default function CinematicRow({
  title,
  subtitle,
  movies,
  onOpenReviews,
  watchlist,
  onToggleWatchlist,
  accentColor = "text-rose-500",
  isMature = false
}: CinematicRowProps) {
  const [locked, setLocked] = useState(isMature);

  return (
    <div className={`space-y-4 px-1 pb-4 relative ${isMature && locked ? "group/mature" : ""}`}>
      <div className="flex items-end justify-between px-1">
        <div className="space-y-1">
          <span className={`text-[10px] font-mono tracking-widest font-extrabold uppercase ${accentColor}`}>
            {subtitle}
          </span>
          <h3 className="font-display font-extrabold text-sm md:text-base text-white tracking-widest uppercase">
            {title}
          </h3>
        </div>

        {isMature && locked ? (
          <button
            type="button"
            onClick={() => setLocked(false)}
            className="text-[10px] bg-red-950/80 hover:bg-rose-950 border border-red-900/40 text-red-400 font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all animate-pulse cursor-pointer"
          >
            <span>🔓 Reveal Mature (18+) content</span>
          </button>
        ) : (
          <span className="text-[10px] text-zinc-650 font-mono hidden sm:inline">Scroll horizontally ➔</span>
        )}
      </div>

      <div className="relative">
        <div className={`flex overflow-x-auto gap-6 pb-2 scrollbar-none scroll-smooth snap-x ${isMature && locked ? "blur-[15px] pointer-events-none select-none" : ""}`}>
          {movies?.map((movie, index) => {
            const isFavorited = watchlist.includes(movie.id);
            const releaseYear = movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A";

            return (
              <motion.div
                key={`movie-row-card-${movie.id}-${index}`}
                className="snap-start shrink-0 w-[240px] md:w-[270px] bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Poster Element */}
                <div className="relative h-44 md:h-[190px] overflow-hidden bg-black shrink-0">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/20 to-transparent"></div>

                  {/* Rating indicator */}
                  <div className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded border border-zinc-900 text-amber-400 font-mono text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                    ★ {movie.vote_average.toFixed(1)}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(movie.id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-black/80 hover:bg-black backdrop-blur-md rounded-xl border border-zinc-900 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500 animate-pulse" : "text-zinc-500"}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs md:text-sm text-zinc-200 line-clamp-1 hover:text-white transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {releaseYear} • {movie.original_language.toUpperCase()}
                    </p>
                  </div>

                  <p className="text-[11px] text-zinc-450 leading-relaxed font-sans line-clamp-2">
                    {movie.overview}
                  </p>

                  <button
                    type="button"
                    onClick={() => onOpenReviews(movie)}
                    className="w-full py-2 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer focus:outline-none"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Reviews</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mature Blur lock panel */}
        {isMature && locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-md rounded-3xl border border-red-950/40 p-4 text-center z-10">
            <span className="bg-red-950/90 text-red-400 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full border border-red-900/50 mb-2 uppercase select-none">
              18+ Protected Mode
            </span>
            <p className="text-xs text-zinc-300 max-w-xs leading-relaxed mb-3 font-semibold select-none">
              This gallery contains mature, sexually explicit, and steamy erotic content.
            </p>
            <button
              type="button"
              onClick={() => setLocked(false)}
              className="px-5 py-2.5 bg-red-650 hover:bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              Reveal 18+ Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
