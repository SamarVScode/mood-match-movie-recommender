import React from "react";
import { Movie, GENRE_MAP } from "../types";
import { Star, Eye, Calendar, Languages, Heart, Sparkles, RefreshCw, Smartphone } from "lucide-react";
import { motion } from "motion/react";

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  onOpenReviews: (movie: Movie) => void;
  watchlist: number[];
  onToggleWatchlist: (movieId: number) => void;
  onReset: () => void;
}

export default function MovieGrid({
  movies,
  loading,
  onOpenReviews,
  watchlist,
  onToggleWatchlist,
  onReset,
}: MovieGridProps) {
  
  // Custom rating badge colors based on score
  const getRatingBadgeClass = (score: number) => {
    if (score >= 8.0) {
      return "bg-emerald-950/65 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10";
    }
    if (score >= 7.0) {
      return "bg-amber-950/65 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/10";
    }
    return "bg-zinc-900/90 text-zinc-400 border border-zinc-850 shadow-sm";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Desktop Skeleton */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div 
              key={idx} 
              className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[480px] animate-pulse"
            >
              <div className="relative h-64 bg-zinc-900/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-zinc-800 animate-pulse" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-900 rounded-lg w-3/4"></div>
                  <div className="h-3 bg-zinc-900/60 rounded-lg w-1/2"></div>
                </div>
                <div className="space-y-1.5 flex-1 mt-2">
                  <div className="h-3 bg-zinc-900/40 rounded-lg w-full"></div>
                  <div className="h-3 bg-zinc-900/40 rounded-lg w-full"></div>
                </div>
                <div className="h-11 bg-zinc-900 rounded-xl w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="block md:hidden space-y-4">
          <div className="h-4 bg-zinc-900 rounded-lg w-1/3 animate-pulse mb-3"></div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-2xl w-[260px] h-[380px] shrink-0 animate-pulse p-4 flex flex-col justify-between">
                <div className="h-48 bg-zinc-900 rounded-xl"></div>
                <div className="h-4 bg-zinc-900 rounded-lg w-3/4 mt-3"></div>
                <div className="h-10 bg-zinc-900 rounded-lg w-full mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center py-16 px-4 bg-zinc-950 border border-zinc-900 rounded-3xl shadow-xl flex flex-col items-center justify-center max-w-lg mx-auto"
      >
        <div className="bg-amber-500/5 p-4 rounded-full border border-amber-500/10 text-amber-500 mb-4 animate-bounce">
          <Star className="w-8 h-8 fill-amber-500 text-amber-400" />
        </div>
        <h3 className="font-display font-bold text-lg text-white">No Matches for Your Mood</h3>
        <p className="text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
          The filters might be too combined! Try relaxing your rating threshold, choosing "All Regions", or resetting the search engine parameters.
        </p>
        <button
          onClick={onReset}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-bold rounded-xl text-xs hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
          id="btn-no-results-reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filter Engine</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* ==========================================
          💻 DESKTOP ONLY: PREMIUM SOLID GRID VIEW
          ========================================== */}
      <div 
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        id="movies-discover-grid"
      >
        {movies.map((movie, index) => {
          const isFavorited = watchlist.includes(movie.id);
          const releaseYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A";
            
          return (
            <motion.article
              key={movie.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[480px] select-none"
              id={`movie-card-${movie.id}`}
            >
              {/* Poster Element */}
              <div className="relative h-64 overflow-hidden bg-black shrink-0">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                
                {/* Live Rank Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-900 text-zinc-400 text-[9px] font-mono font-bold tracking-wider uppercase select-none">
                  # {index + 1} Recommendation
                </div>

                {/* Watchlist Quick Heart Button */}
                <button
                  onClick={() => onToggleWatchlist(movie.id)}
                  className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-black backdrop-blur-md rounded-xl border border-zinc-900 text-zinc-400 hover:text-rose-500 focus:text-rose-500 transition-all cursor-pointer focus:outline-none"
                  aria-label="Add to Watchlist"
                  id={`watch-toggle-${movie.id}`}
                >
                  <Heart className={`w-4 h-4 transition-colors ${isFavorited ? "fill-rose-500 text-rose-500" : "text-zinc-500 group-hover:scale-110"}`} />
                </button>
              </div>

              {/* Card Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-display font-semibold text-sm md:text-base text-zinc-200 group-hover:text-white line-clamp-1 group-hover:line-clamp-2 transition-colors leading-snug">
                      {movie.title}
                    </h3>
                    
                    {/* Score Badge */}
                    <div className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold shrink-0 ${getRatingBadgeClass(movie.vote_average)}`}>
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>

                  {/* Sub-meta details row */}
                  <div className="flex items-center gap-3 text-zinc-500 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{releaseYear}</span>
                    </span>
                    <span className="text-zinc-800">•</span>
                    <span className="flex items-center gap-1 uppercase tracking-wide">
                      <Languages className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{movie.original_language}</span>
                    </span>
                  </div>

                  {/* Genre tags */}
                  {movie.genre_ids && movie.genre_ids.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {movie.genre_ids.slice(0, 3).map((gId) => {
                        const label = GENRE_MAP[gId];
                        if (!label) return null;
                        return (
                          <span 
                            key={gId} 
                            className="text-[9px] font-mono font-bold tracking-tight text-rose-450 bg-rose-950/20 border border-rose-900/40 px-1.5 py-0.5 rounded-md"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Snippet summary */}
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-350 pt-1 font-sans">
                    {movie.overview}
                  </p>
                </div>

                {/* View Reviews CTA button */}
                <div className="pt-4 shrink-0">
                  <button
                    onClick={() => onOpenReviews(movie)}
                    className="w-full py-2.5 bg-zinc-950 border border-zinc-900 text-zinc-400 group-hover:text-white group-hover:bg-zinc-900 group-hover:border-zinc-800 hover:border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.98] focus:outline-none"
                    id={`btn-reviews-${movie.id}`}
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>View Reviews</span>
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ==========================================
          📱 MOBILE ONLY: CINEMATIC SHOWUPS (SCROLLS)
          ========================================== */}
      <div className="block md:hidden space-y-6">
        
        {/* Swiper Reel Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Cinematic Match Reel</span>
          </h3>
          <span className="text-[10px] text-zinc-600 font-mono">Swipe left / right</span>
        </div>

        {/* 1. The Horizontal Snap Scroll Swiper Deck */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 scrollbar-none scroll-smooth -mx-4 px-4"
          id="movies-mobile-scroller"
        >
          {movies.map((movie, index) => {
            const isFavorited = watchlist.includes(movie.id);
            const releaseYear = movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A";

            return (
              <motion.article
                key={`scroll-${movie.id}`}
                className="snap-center shrink-0 w-[270px] h-[400px] bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none relative group"
                id={`movie-scroll-card-${movie.id}`}
              >
                {/* Background image & gradient overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30"></div>
                </div>

                {/* Content over the image base */}
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  
                  {/* Top Badge Panel */}
                  <div className="flex items-center justify-between">
                    <span className="bg-rose-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-rose-500/20 text-rose-300 text-[8px] font-mono font-bold tracking-wider uppercase">
                      # {index + 1} Best Match
                    </span>
                    
                    <button
                      onClick={() => onToggleWatchlist(movie.id)}
                      className="p-1.5 bg-black/75 backdrop-blur-md rounded-lg border border-zinc-850 text-zinc-400 hover:text-rose-500"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : "text-zinc-450"}`} />
                    </button>
                  </div>

                  {/* Bottom Text Panel */}
                  <div className="space-y-3 px-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 text-xs font-bold bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/10 flex items-center">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold">{releaseYear} ({movie.original_language.toUpperCase()})</span>
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-white tracking-wide line-clamp-1">
                        {movie.title}
                      </h4>
                    </div>

                    {/* Genre tags */}
                    {movie.genre_ids && movie.genre_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {movie.genre_ids.slice(0, 2).map((gId) => {
                          const label = GENRE_MAP[gId];
                          if (!label) return null;
                          return (
                            <span 
                              key={gId} 
                              className="text-[9px] font-mono font-bold tracking-tight text-rose-450 bg-rose-950/30 border border-rose-900/40 px-1.5 py-0.5 rounded-md"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                      {movie.overview}
                    </p>

                    <button
                      onClick={() => onOpenReviews(movie)}
                      className="w-full py-2 bg-white text-zinc-950 font-bold rounded-xl text-[10px] tracking-wide flex items-center justify-center gap-1.5 transition-transform active:scale-95 duration-200"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-900" />
                      <span>Explore Community Reviews</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>

    </div>
  );
}
