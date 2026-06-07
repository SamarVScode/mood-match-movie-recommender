import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Heart, Star, Award } from "lucide-react";
import { Movie, SpotlightItem } from "../types";
import { MOODS, MoodIcon } from "./FilterSidebar";

interface HeroShowcaseProps {
  isDynamicHeroActive: boolean;
  moodMatchedBaseMovie: Movie | null;
  currentActiveSpotlight: SpotlightItem;
  heroTitle: string;
  heroYear: string;
  heroRating: number;
  heroBackdrop: string;
  heroOverview: string;
  heroQuote: string;
  heroTagline: string;
  heroMoodName: string;
  heroMoodId: string;
  spotlights: SpotlightItem[];
  activeSpotlightIdx: number;
  setActiveSpotlightIdx: (idx: number) => void;
  watchlist: number[];
  handleToggleWatchlist: (id: number) => void;
  handleViewSpotlightReviews: (item: Movie | SpotlightItem) => void;
  handleActivateSpotlight: (item: SpotlightItem) => void;
}

export default function HeroShowcase({
  isDynamicHeroActive,
  moodMatchedBaseMovie,
  currentActiveSpotlight,
  heroTitle,
  heroYear,
  heroRating,
  heroBackdrop,
  heroOverview,
  heroQuote,
  heroTagline,
  heroMoodName,
  heroMoodId,
  spotlights,
  activeSpotlightIdx,
  setActiveSpotlightIdx,
  watchlist,
  handleToggleWatchlist,
  handleViewSpotlightReviews,
  handleActivateSpotlight
}: HeroShowcaseProps) {
  return (
    <section className="w-full bg-black border-b border-zinc-900/60 pb-8 pt-4 px-4 md:px-8 relative overflow-hidden shrink-0 select-none">
      {/* Glowing Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-4 relative">

        {/* Header / Dots Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-mono tracking-widest font-semibold text-amber-400 uppercase bg-amber-950/40 border border-amber-500/20 px-3.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{isDynamicHeroActive ? "Top Curated Discovery Match" : "Trending Masterpieces"}</span>
          </span>

          {/* Slider Dots (Only show dots when rotating static showcases) */}
          {!isDynamicHeroActive && (
            <div className="flex items-center gap-1.5 bg-zinc-950/80 px-2.5 py-1.5 rounded-full border border-zinc-900">
              {spotlights.map((spot, index) => (
                <button
                  key={`spot-dot-${spot.id}`}
                  onClick={() => setActiveSpotlightIdx(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                    activeSpotlightIdx === index ? "w-6 bg-gradient-to-r from-amber-400 to-rose-500" : "w-2 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Immersive Cinematic Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[320px] md:h-[420px] rounded-3xl relative overflow-hidden border border-zinc-900 group/hero shadow-2xl"
          id="hero-spotlight-display"
        >
          {/* Image backdrop (poster or custom backdropUrl) */}
          <AnimatePresence mode="wait">
            <motion.img
              key={isDynamicHeroActive && moodMatchedBaseMovie ? moodMatchedBaseMovie.id : currentActiveSpotlight.id}
              src={heroBackdrop}
              alt={heroTitle}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover transform duration-700 group-hover/hero:scale-[1.015]"
            />
          </AnimatePresence>

          {/* Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-black/40"></div>

          {/* Showcase Info blocks */}
          <div className="absolute inset-y-0 left-0 max-w-lg md:max-w-2xl p-6 md:p-10 flex flex-col justify-between z-10">

            {/* Mood and Rating badges */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-rose-950/80 backdrop-blur-md text-rose-300 border border-rose-500/25 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-lg">
                <MoodIcon id={heroMoodId} className="w-3.5 h-3.5 text-rose-400" />
                <span>{heroMoodName}</span>
              </span>
              <span className="bg-zinc-950/95 backdrop-blur-md border border-zinc-900 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <span>{heroRating.toFixed(1)} Rating</span>
              </span>
            </div>

            {/* Plot text info */}
            <div className="space-y-2 md:space-y-3 pt-6">
              <h3 className="font-display font-extrabold text-xl md:text-3xl text-white tracking-widest leading-none uppercase">
                {heroTitle} <span className="text-zinc-550 text-base md:text-lg font-mono">({heroYear})</span>
              </h3>
              <p className="text-zinc-300 text-xs md:text-sm font-semibold tracking-wide italic leading-relaxed border-l-2 border-rose-500 pl-3 line-clamp-2 md:line-clamp-3">
                "{heroQuote}"
              </p>
              <p className="text-zinc-500 text-xs max-w-md hidden md:block leading-relaxed font-sans line-clamp-3">
                {heroTagline}
              </p>
            </div>

            {/* Play, reviews, favoriting row */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isDynamicHeroActive && moodMatchedBaseMovie ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewSpotlightReviews(moodMatchedBaseMovie)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer text-center focus:outline-none"
                >
                  <Play className="w-3.5 h-3.5 fill-black stroke-none" />
                  <span>Explore Movie Reviews</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleActivateSpotlight(currentActiveSpotlight)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer text-center focus:outline-none"
                  id={`btn-spotlight-match-${currentActiveSpotlight.id}`}
                >
                  <Play className="w-3.5 h-3.5 fill-black stroke-none" />
                  <span>Instant Match Mood</span>
                </motion.button>
              )}

              {!isDynamicHeroActive && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewSpotlightReviews(currentActiveSpotlight)}
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none"
                >
                  View Reviews
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleToggleWatchlist(isDynamicHeroActive && moodMatchedBaseMovie ? moodMatchedBaseMovie.id : currentActiveSpotlight.id)}
                className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
                aria-label="Toggle watchlist"
              >
                <Heart className={`w-4 h-4 ${watchlist.includes(isDynamicHeroActive && moodMatchedBaseMovie ? moodMatchedBaseMovie.id : currentActiveSpotlight.id) ? "fill-rose-500 text-rose-500" : "text-zinc-550"}`} />
              </motion.button>
            </div>

          </div>

          {/* Corner badge */}
          <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-800 text-rose-400 font-mono text-[9px] font-bold tracking-widest select-none uppercase">
            {isDynamicHeroActive ? "Top Selection" : "Premium Showcase"}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
