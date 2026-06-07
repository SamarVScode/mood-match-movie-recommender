/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterSidebar, { MOODS, MoodIcon } from "./components/FilterSidebar";
import MovieGrid from "./components/MovieGrid";
import ReviewDrawer from "./components/ReviewDrawer";
import { FilterConfig, fetchFilteredMovies } from "./tmdb";
import { Movie } from "./mockData";
import { motion, AnimatePresence } from "motion/react";
import { 
  SlidersHorizontal, 
  Sparkles, 
  Heart, 
  TrendingUp, 
  X, 
  Info, 
  ExternalLink,
  Search,
  Play,
  Tv,
  Award,
  Calendar,
  Languages,
  Clock,
  Star
} from "lucide-react";

// =========================================================================
// 🔑 TMDB (THE MOVIE DATABASE) API KEY LOADED FROM ENV (VITE_TMDB_API_KEY)
// =========================================================================
const TMDB_API_KEY = ((import.meta as any).env.VITE_TMDB_API_KEY || "").trim();

// Curated Premium Spotlights to display on the landing page header
interface SpotlightItem {
  id: number;
  title: string;
  year: string;
  rating: number;
  moodId: string;
  moodName: string;
  quote: string;
  tagline: string;
  backdropUrl: string;
  industry: "en" | "hi";
  genreIds: number[];
  overview: string;
}

const PRESET_SPOTLIGHTS: SpotlightItem[] = [
  {
    id: 102,
    title: "Interstellar",
    year: "2014",
    rating: 8.7,
    moodId: "thoughtful",
    moodName: "Deep & Thoughtful",
    quote: "Mankind was born on Earth. It was never meant to die here.",
    tagline: "Unravel gravity, time, and human endurance in Nolan's cosmic masterpiece.",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    industry: "en",
    genreIds: [18, 878],
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: 107,
    title: "RRR",
    year: "2022",
    rating: 8.1,
    moodId: "adrenaline",
    moodName: "Adrenaline Rush",
    quote: "Fire and Water collide to forge an unbreakable bond.",
    tagline: "Experience the absolute summit of action choreography and cinematic brotherhood.",
    backdropUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
    industry: "hi",
    genreIds: [28, 18],
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s."
  },
  {
    id: 108,
    title: "Dilwale Dulhania Le Jayenge",
    year: "1995",
    rating: 8.5,
    moodId: "feelgood",
    moodName: "Feel-Good Vibes",
    quote: "Come, fall in love all over again.",
    tagline: "The legendary, longest-running golden standard of Indian romantic cinema.",
    backdropUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    industry: "hi",
    genreIds: [10749, 35],
    overview: "A carefree young man and a structured traditional woman fall head over heels during a whirlwind European summer holiday."
  }
];

export default function App() {
  // ---------------------------------------------------------
  // State Hook Initialization
  // ---------------------------------------------------------

  // Watchlist array state
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("moodmatch_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Advanced Filters State
  const [filters, setFilters] = useState<FilterConfig>({
    industry: "all",
    era: "latest",
    minRating: 5.0,
    mood: null,
    exactYear: "any",
    sortBy: "popularity.desc",
    minRuntime: 0,
    searchQuery: "",
  });

  // Dynamic search input box state (prevents slow re-renders of list on each key event)
  const [searchVal, setSearchVal] = useState("");

  // Movie Query Output States
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active View States & Slide sheets
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isWatchlistOnlyMode, setIsWatchlistOnlyMode] = useState(false);
  const [selectedMovieForReviews, setSelectedMovieForReviews] = useState<Movie | null>(null);

  // Active spotlight highlight index on landing deck
  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);

  // Tooltip toast tracker
  const [showWatchlistTooltip, setShowWatchlistTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  // ---------------------------------------------------------
  // Side Effects
  // ---------------------------------------------------------

  // Save watchlist updates to LocalStorage
  useEffect(() => {
    localStorage.setItem("moodmatch_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Main Coordinator: Fetches movies upon Filter modifications using Environment Key
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchFilteredMovies(TMDB_API_KEY, filters);
        if (active) {
          setIsMockMode(result.isMock);
          setMoviesList(result.movies);
        }
      } catch (err: any) {
        if (active) {
          console.error("Discovery engine crashed:", err);
          setErrorMessage(err.message || "TMDB request failed. Check API key validity in your .env configuration.");
          setMoviesList([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [filters]);

  // Sync filters.searchQuery to searchVal if filters gets reset
  useEffect(() => {
    if (filters.searchQuery === "") {
      setSearchVal("");
    }
  }, [filters.searchQuery]);

  // ---------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------

  const triggerSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: searchVal }));
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setFilters(prev => ({ ...prev, searchQuery: "" }));
  };

  // Toggles item inclusion in user watchlist
  const handleToggleWatchlist = (movieId: number) => {
    setWatchlist((prev) => {
      const exists = prev.includes(movieId);
      if (!exists) {
        setTooltipText("Saved to Watchlist!");
        setShowWatchlistTooltip(true);
        setTimeout(() => setShowWatchlistTooltip(false), 2500);
        return [...prev, movieId];
      } else {
        setTooltipText("Removed from Watchlist.");
        setShowWatchlistTooltip(true);
        setTimeout(() => setShowWatchlistTooltip(false), 2500);
        return prev.filter((id) => id !== movieId);
      }
    });
  };

  // Completely resets filters
  const handleResetFilters = () => {
    setFilters({
      industry: "all",
      era: "latest",
      minRating: 5.0,
      mood: null,
      exactYear: "any",
      sortBy: "popularity.desc",
      minRuntime: 0,
      searchQuery: "",
    });
    setSearchVal("");
    setIsWatchlistOnlyMode(false);
  };

  const handleRemoveActiveMood = () => {
    setFilters((prev) => ({ ...prev, mood: null }));
  };

  // Watchlist mode toggler
  const handleOpenWatchlistTab = () => {
    if (watchlist.length === 0) {
      setTooltipText("Watchlist is empty. Tap the heart icon on any movie card to save!");
      setShowWatchlistTooltip(true);
      setTimeout(() => setShowWatchlistTooltip(false), 3500);
      return;
    }
    setIsWatchlistOnlyMode(!isWatchlistOnlyMode);
  };

  // Activates a high-fidelity recommended spotlight directly in the filter deck
  const handleActivateSpotlight = (item: SpotlightItem) => {
    setFilters(prev => ({
      ...prev,
      industry: item.industry === "hi" ? "hi" : "en",
      mood: item.moodId,
      exactYear: item.year,
      minRating: 5.0,
      searchQuery: "",
    }));
    setSearchVal("");
    // Scroll down directly to the Grid section so they feel the instant match!
    const targetElement = document.getElementById("discover-feed-anchor");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Convert spotlight to mock movie for direct reviews popup
  const handleViewSpotlightReviews = (item: SpotlightItem) => {
    const movieObj: Movie = {
      id: item.id,
      title: item.title,
      original_language: item.industry,
      release_date: `${item.year}-06-01`,
      vote_average: item.rating,
      overview: item.overview,
      poster_path: item.backdropUrl,
      genre_ids: item.genreIds,
      popularity: 900
    };
    setSelectedMovieForReviews(movieObj);
  };

  // Filter list down client-side for watchlisted mode
  const getDisplayedMovies = () => {
    if (isWatchlistOnlyMode) {
      return moviesList.filter(m => watchlist.includes(m.id));
    }
    return moviesList;
  };

  const currentMood = MOODS.find((m) => m.id === filters.mood);
  const activeSpotlight = PRESET_SPOTLIGHTS[activeSpotlightIdx];

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans selection:bg-rose-500/20 antialiased overflow-x-hidden">
      
      {/* 1. BRANDING HEADER */}
      <Header 
        watchlistCount={watchlist.length} 
        onOpenWatchlist={handleOpenWatchlistTab}
        onResetAll={handleResetFilters}
      />

      {/* Floating Watchlist Alerts / Action Toasts */}
      <AnimatePresence>
        {showWatchlistTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-4 md:right-8 bg-zinc-950 border border-zinc-900 text-amber-400 font-bold px-4.5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5"
          >
            <Info className="w-4.5 h-4.5 shrink-0 text-amber-500" />
            <span className="text-xs">{tooltipText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          🔥 ULTRA PREMIUM LANDING PAGE HERO / SPOTLIGHT FEATURE SLIDESHOW
          ========================================================================= */}
      {!isWatchlistOnlyMode && filters.searchQuery === "" && (
        <section className="w-full bg-black border-b border-zinc-900 pt-20 pb-10 px-4 md:px-8 relative overflow-hidden shrink-0 select-none">
          {/* Glowing Ambient Spotlight Background lights */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto space-y-6 relative">
            
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest font-bold text-amber-400 uppercase bg-amber-950/40 border border-amber-500/25 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                  <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Cinematic Masterpieces</span>
                </span>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-widest uppercase">
                  Featured Showcases
                </h2>
                <p className="text-zinc-500 text-xs md:text-sm">
                  Hand-selected visual highlights matching custom sensory modes list. Select one to match!
                </p>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 bg-zinc-950/80 px-3 py-1.5 rounded-full border border-zinc-900">
                {PRESET_SPOTLIGHTS.map((spot, index) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveSpotlightIdx(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                      activeSpotlightIdx === index ? "w-8 bg-gradient-to-r from-amber-400 to-rose-500" : "w-2.5 bg-zinc-800 hover:bg-zinc-700"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Premium Interactive Hero Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full h-[320px] md:h-[400px] rounded-3xl relative overflow-hidden border border-zinc-900 group/hero shadow-2xl"
              id="hero-spotlight-display"
            >
              {/* Animating transition backdrop poster */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeSpotlight.id}
                  src={activeSpotlight.backdropUrl} 
                  alt={activeSpotlight.title}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover transform duration-700 group-hover/hero:scale-[1.02]"
                />
              </AnimatePresence>

              {/* Overlay Shadow Gradients representing dramatic theater contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-black/30"></div>

              {/* Content Card Body */}
              <div className="absolute inset-y-0 left-0 max-w-lg md:max-w-xl p-6 md:p-10 flex flex-col justify-between z-10">
                
                {/* Mood Tag Badge */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-rose-950/60 backdrop-blur-md text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full text-[11px] font-extrabold select-none">
                    <MoodIcon id={activeSpotlight.moodId} className="w-3.5 h-3.5" />
                    <span>{activeSpotlight.moodName}</span>
                  </span>
                  <span className="bg-zinc-950/80 backdrop-blur-md border border-zinc-900 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{activeSpotlight.rating} Rated</span>
                  </span>
                </div>

                {/* Core description block */}
                <div className="space-y-2 md:space-y-3 pt-4">
                  <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-widest leading-none uppercase">
                    {activeSpotlight.title}
                  </h3>
                  <p className="text-zinc-350 text-xs md:text-sm font-semibold tracking-wide italic leading-relaxed border-l-2 border-rose-500 pl-3">
                    "{activeSpotlight.quote}"
                  </p>
                  <p className="text-zinc-500 text-xs max-w-md hidden sm:block leading-relaxed font-sans">
                    {activeSpotlight.tagline}
                  </p>
                </div>

                {/* Showcase Interactive Action Row */}
                <div className="flex flex-wrap items-center gap-3 pt-4 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleActivateSpotlight(activeSpotlight)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer text-center focus:outline-none"
                    id={`btn-spotlight-match-${activeSpotlight.id}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-black stroke-none" />
                    <span>Instant Match Mood</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleViewSpotlightReviews(activeSpotlight)}
                    className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none"
                  >
                    View Reviews
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleWatchlist(activeSpotlight.id)}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
                    aria-label="Toggle watchlist"
                  >
                    <Heart className={`w-4 h-4 ${watchlist.includes(activeSpotlight.id) ? "fill-rose-500 text-rose-500" : "text-zinc-550"}`} />
                  </motion.button>
                </div>

              </div>

              {/* Side Rank Ribbon */}
              <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-800 text-zinc-400 font-mono text-[9px] font-bold tracking-widest select-none uppercase">
                Premium Pick
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* =========================================================================
          🟢 PRIMARY CORE SEARCH PANEL (The Engine Control Zone)
          ========================================================================= */}
      <section className="bg-black border-b border-zinc-900 py-6 px-4 md:px-8 shrink-0 select-none">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Welcome Text block */}
            <div className="space-y-0.5 self-start sm:self-center">
              <h1 className="font-display font-medium text-base text-[#f3f4f6] flex items-center gap-2">
                <Tv className="w-4.5 h-4.5 text-zinc-400" />
                <span>Canvas Direct Console</span>
              </h1>
              <p className="text-[10px] font-mono text-zinc-600">
                Narrow discoveries via freeform metadata search.
              </p>
            </div>

            {/* Combined Search & Filter Controls with Proper Positioning */}
            <div className="w-full md:max-w-md flex items-center gap-2">
              <form 
                onSubmit={triggerSearchSubmit} 
                className="flex-1 relative flex items-center"
                id="discover-feed-search-form"
              >
                <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl pl-10 pr-12 py-3.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-800 transition-all font-sans"
                  id="main-search-input"
                />

                {/* Clear Text button */}
                {searchVal && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-full transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Action Trigger sign */}
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 bg-black text-zinc-400 font-bold hover:text-white rounded-xl text-[10px] border border-zinc-900 tracking-wider hover:border-zinc-850 focus:outline-none transition-all cursor-pointer"
                >
                  Go
                </button>
              </form>

              {/* Mobile Refine Filters Button next to Search */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center justify-center p-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-2xl text-rose-500 transition-all cursor-pointer focus:outline-none active:scale-95"
                id="btn-mobile-filters-trigger-inline"
              >
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>

          {/* Quick-Scrollable Mood Carousel Ribbon (Cinematic Sensory Selects) */}
          <div className="block md:hidden pt-1">
            <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-wider block mb-2 px-0.5">Quick Sensory Moods</span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 scroll-smooth">
              {MOODS.map((m) => {
                const isSelected = filters.mood === m.id;
                return (
                  <button
                    key={`quick-mood-${m.id}`}
                    onClick={() => setFilters(prev => ({ ...prev, mood: prev.mood === m.id ? null : m.id }))}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-all active:scale-95 ${
                      isSelected
                        ? "bg-zinc-900 border-zinc-700 text-white shadow-md font-bold"
                        : "bg-zinc-950/70 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <MoodIcon id={m.id} className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Layout */}
      <span id="discover-feed-anchor" />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-8 relative select-none">
        
        {/* -------------------------------------------------------------
            A. DESKTOP FILTER SIDEBAR Layout (Persistent on lg screens)
            ------------------------------------------------------------- */}
        <div className="hidden md:block w-80 shrink-0 h-[calc(100vh-140px)] sticky top-24 self-start">
          <FilterSidebar 
            config={filters}
            onChange={setFilters}
            isMockMode={isMockMode}
            onReset={handleResetFilters}
          />
        </div>

        {/* -------------------------------------------------------------
            B. MAIN CONTENT FEED ZONE (The Grid Top 10)
            ------------------------------------------------------------- */}
        <section className="flex-1 space-y-6">
          
          {/* Top Info Banner & Active Badges Stripe */}
          <div className="bg-zinc-950/45 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-lg md:text-xl text-white tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                  <span>{isWatchlistOnlyMode ? "Saved Archive" : filters.searchQuery ? `Discovered: "${filters.searchQuery}"` : "Matched Returns (Top 10)"}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-indigo-400 rounded">
                    {getDisplayedMovies().length} Match
                  </span>
                </h2>
                <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed font-sans">
                  Targeted sensory indices showing exactly matching returns sorted descending.
                </p>
              </div>

              {/* Real-time status sync tracker */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#a1a1aa] bg-black px-2.5 py-1 rounded-lg border border-zinc-900 shadow-inner">
                  {isMockMode ? "Curated Index Active" : "TMDB Link Synchronized"}
                </span>
                {isWatchlistOnlyMode && (
                  <button
                    onClick={() => setIsWatchlistOnlyMode(false)}
                    className="text-xs text-rose-400 hover:text-white bg-rose-950/10 border border-rose-500/15 px-3 py-1 rounded-lg transition-all"
                  >
                    All Discoveries
                  </button>
                )}
              </div>
            </div>

            {/* Render Active Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-900/60">
              
              {/* Region origin */}
              <span className="bg-black border border-zinc-900 text-zinc-500 text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase flex items-center gap-1">
                <Languages className="w-3 h-3" />
                <span>Industry: {filters.industry === "all" ? "All" : filters.industry === "en" ? "Hollywood" : "Bollywood"}</span>
              </span>

              {/* Exact Year badge */}
              {filters.exactYear !== "any" ? (
                <span className="bg-black border border-zinc-900 text-zinc-400 text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Year: {filters.exactYear}</span>
                </span>
              ) : (
                <span className="bg-black border border-zinc-900 text-zinc-400 text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Era: {filters.era === "latest" ? "Latest" : filters.era === "2010s" ? "2010s" : filters.era === "2000s" ? "2000s" : "Classic"}</span>
                </span>
              )}

              {/* Score badge */}
              <span className="bg-black border border-zinc-900 text-amber-400 text-[10px] px-2.5 py-1 rounded-lg font-mono font-semibold">
                ★ {filters.minRating.toFixed(1)}+
              </span>

              {/* Minimum Runtime badge key */}
              {filters.minRuntime > 0 && (
                <span className="bg-black border border-zinc-900 text-indigo-400 text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{filters.minRuntime}+ Mins</span>
                </span>
              )}

              {/* Keyword query banner tag */}
              {filters.searchQuery && (
                <span className="bg-black border border-rose-900/30 text-rose-400 text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold">
                  <span>Query: "{filters.searchQuery}"</span>
                  <button onClick={handleClearSearch} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Active Mood */}
              {currentMood ? (
                <button
                  onClick={handleRemoveActiveMood}
                  className="flex items-center gap-1.5 bg-zinc-900 hover:bg-black border border-zinc-800 text-zinc-200 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 group shrink-0"
                  title="Remove mood filter"
                >
                  <span className="flex items-center gap-1">
                    <span>Mood:</span>
                    <MoodIcon id={currentMood.id} className="w-3.5 h-3.5" />
                    <span>{currentMood.label}</span>
                  </span>
                  <X className="w-3 h-3 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                </button>
              ) : (
                <span className="text-zinc-650 text-xs italic font-medium pl-1.5">Configure sensory details inside sidebar...</span>
              )}
            </div>

          </div>

          {/* Core Movie Grid display list */}
          {errorMessage ? (
            <div className="p-8 bg-zinc-950 border border-zinc-900 text-slate-400 text-center rounded-3xl space-y-4">
              <p className="text-sm font-semibold">{errorMessage}</p>
              <button 
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs rounded-xl font-bold cursor-pointer transition-all"
              >
                Reset Canvas Filters
              </button>
            </div>
          ) : (
            <MovieGrid 
              movies={getDisplayedMovies()}
              loading={loading}
              onOpenReviews={setSelectedMovieForReviews}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onReset={handleResetFilters}
            />
          )}

          {/* Informational Footer */}
          <div className="pt-8 text-center text-[10px] text-zinc-600 font-mono flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900">
            <span>Powered by Env Synced TMDB Pipelines & Fine Fallbacks</span>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-zinc-400 flex items-center gap-1 transition-colors"
              >
                <span>TMDB Registry</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span>© {new Date().getFullYear()} MoodMatch™</span>
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------
          C. MOBILE FLOATING ACTION FILTER DRAWER
          ------------------------------------------------------------- */}

      {/* Mobile Slide-Up Drawer Overlay Sheet */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-end transition-all"
          onClick={() => setIsMobileFilterOpen(false)}
          id="mobile-drawer-backdrop"
        >
          <div 
            className="w-full bg-black border-t border-zinc-900 rounded-t-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            id="mobile-drawer-sheet"
          >
            {/* Grab handle bar */}
            <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                <h3 className="font-display font-bold text-sm text-white">Console Matching</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-all focus:outline-none"
                id="btn-close-mobile-drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 pb-24 bg-black">
              <FilterSidebar 
                config={filters}
                onChange={(cf) => {
                  setFilters(cf);
                }}
                isMockMode={isMockMode}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
            
            {/* Apply Action bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="text-xs text-zinc-400 hover:text-white font-bold"
              >
                Wipe Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl text-center active:scale-95 transition-transform cursor-pointer"
                id="btn-mobile-drawer-apply"
              >
                Apply ({moviesList.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          D. THE COMMUNITY REVIEWS DRAWER MODAL TARGET
          ------------------------------------------------------------- */}
      <ReviewDrawer 
        movie={selectedMovieForReviews}
        isOpen={selectedMovieForReviews !== null}
        onClose={() => setSelectedMovieForReviews(null)}
        apiKey={TMDB_API_KEY}
      />

    </div>
  );
}
