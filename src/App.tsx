/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterSidebar, { MOODS, MoodIcon } from "./components/FilterSidebar";
import MovieGrid from "./components/MovieGrid";
import ReviewDrawer from "./components/ReviewDrawer";
import { fetchFilteredMovies, fetchSpotlightMovies, fetchLandingFeeds, LandingFeeds } from "./tmdb";
import { Movie, FilterConfig, SpotlightItem, countActiveFilters } from "./types";
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
  Eye,
  Award,
  Calendar,
  Languages,
  Clock,
  Star
} from "lucide-react";

// =========================================================================
// 🔑 TMDB (THE MOVIE DATABASE) API KEY LOADED FROM STORAGE OR ENV
// =========================================================================
const getSavedApiKey = (): string => {
  try {
    const saved = localStorage.getItem("moodmatch_tmdb_api_key");
    if (saved && saved.trim() !== "") {
      return saved.trim();
    }
  } catch {}
  return ((import.meta as any).env.VITE_TMDB_API_KEY || "").trim();
};

const PRESET_SPOTLIGHTS: SpotlightItem[] = [
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    rating: 8.4,
    moodId: "thoughtful",
    moodName: "Drama & Sci-Fi",
    quote: "Mankind was born on Earth. It was never meant to die here.",
    tagline: "The end of Earth will not be the end of us. A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    industry: "en",
    genreIds: [18, 878],
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel."
  },
  {
    id: 579974,
    title: "RRR",
    year: "2022",
    rating: 7.8,
    moodId: "adrenaline",
    moodName: "Action & Thriller",
    quote: "Fire and Water collide to forge an unbreakable bond.",
    tagline: "Rise, Roar, Revolt. Experience the absolute summit of action choreography and cinematic brotherhood.",
    backdropUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
    industry: "hi",
    genreIds: [28, 12, 18],
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s."
  },
  {
    id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    year: "1995",
    rating: 8.5,
    moodId: "feelgood",
    moodName: "Romance & Feel-Good",
    quote: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain.",
    tagline: "The legendary, longest-running golden standard of Indian romantic cinema.",
    backdropUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    industry: "hi",
    genreIds: [35, 18, 10749],
    overview: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of a traditional, conservative NRI. They meet on a European vacation and fall in love."
  }
];

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

function CinematicRow({
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
          {movies.map((movie, index) => {
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

  // Dynamic state for active navigation tab
  const [activeTab, setActiveTab] = useState<"showcase" | "search" | "wishlist">("showcase");

  // Dynamic API key state
  const [apiKey, setApiKey] = useState<string>(getSavedApiKey);

  const handleUpdateApiKey = (newKey: string) => {
    try {
      localStorage.setItem("moodmatch_tmdb_api_key", newKey.trim());
    } catch {}
    setApiKey(newKey.trim());
  };

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

  const [draftFilters, setDraftFilters] = useState<FilterConfig>({ ...filters });

  // Dynamic Spotlights fetched from TMDB
  const [spotlights, setSpotlights] = useState<SpotlightItem[]>(PRESET_SPOTLIGHTS);

  // Dynamic search input box state (prevents slow re-renders of list on each key event)
  const [searchVal, setSearchVal] = useState("");

  // Movie Query Output States
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cinematic Landing Page Feeds States
  const [landingFeeds, setLandingFeeds] = useState<LandingFeeds | null>(null);
  const [loadingLanding, setLoadingLanding] = useState(true);

  // Expanded/Collapsed Search and Filters Tray
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isWatchlistOnlyMode, setIsWatchlistOnlyMode] = useState(false);
  const [selectedMovieForReviews, setSelectedMovieForReviews] = useState<Movie | null>(null);

  // Active spotlight highlight index on landing deck slideshow
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

  // Fetch real spotlight movies from TMDB on API key trigger
  useEffect(() => {
    let active = true;
    async function loadDynamicSpotlights() {
      try {
        const dynamicItems = await fetchSpotlightMovies(apiKey);
        if (active) {
          setSpotlights(dynamicItems);
        }
      } catch (err) {
        console.info("Failed to load dynamic showcases (using fallback):", err);
      }
    }
    loadDynamicSpotlights();
    return () => {
      active = false;
    };
  }, [apiKey]);

  // Fetch parallel landing sub-categories on API key trigger
  useEffect(() => {
    let active = true;
    async function loadHomeLandingFeeds() {
      setLoadingLanding(true);
      try {
        const feeds = await fetchLandingFeeds(apiKey);
        if (active) {
          setLandingFeeds(feeds);
        }
      } catch (err) {
        console.info("Failed loading home landing feeds (using fallback):", err);
      } finally {
        if (active) {
          setLoadingLanding(false);
        }
      }
    }
    loadHomeLandingFeeds();
    return () => {
      active = false;
    };
  }, [apiKey]);

  // Main Coordinator: Fetches movies upon Filter modifications using Environment Key
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchFilteredMovies(apiKey, filters);
        if (active) {
          setIsMockMode(result.isMock);
          setMoviesList(result.movies);
        }
      } catch (err: any) {
        if (active) {
          console.info("Discovery engine fallback logic:", err);
          setErrorMessage(err.message || "Request failed. Check API key validity in your local environment setup.");
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
  }, [filters, apiKey]);

  // Keep draftFilters and searchVal synced to active filters if filters are changed globally / reset
  useEffect(() => {
    setDraftFilters(filters);
    if (filters.searchQuery !== undefined) {
      setSearchVal(filters.searchQuery);
    }
  }, [filters]);

  // ---------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------

  const handleApplyFilters = () => {
    setFilters({
      ...draftFilters,
      searchQuery: searchVal,
    });
  };

  const triggerSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleApplyFilters();
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
  const handleViewSpotlightReviews = (item: SpotlightItem | Movie) => {
    if ("original_language" in item) {
      setSelectedMovieForReviews(item as Movie);
    } else {
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
    }
  };

  // Filter list down client-side for watchlisted mode
  const getDisplayedMovies = () => {
    if (isWatchlistOnlyMode) {
      return moviesList.filter(m => watchlist.includes(m.id));
    }
    return moviesList;
  };

  // Determine what movie to showcase in the Hero frame
  const moodMatchedBaseMovie = (filters.mood !== null && moviesList.length > 0) ? moviesList[0] : null;

  const isDynamicHeroActive = moodMatchedBaseMovie !== null;
  const currentActiveSpotlight = spotlights[activeSpotlightIdx] || PRESET_SPOTLIGHTS[activeSpotlightIdx];

  const heroTitle = isDynamicHeroActive ? moodMatchedBaseMovie.title : currentActiveSpotlight.title;
  const heroYear = isDynamicHeroActive 
    ? (moodMatchedBaseMovie.release_date ? new Date(moodMatchedBaseMovie.release_date).getFullYear().toString() : "N/A") 
    : currentActiveSpotlight.year;
  const heroRating = isDynamicHeroActive ? moodMatchedBaseMovie.vote_average : currentActiveSpotlight.rating;
  const heroBackdrop = isDynamicHeroActive ? moodMatchedBaseMovie.poster_path : currentActiveSpotlight.backdropUrl;
  const heroOverview = isDynamicHeroActive ? moodMatchedBaseMovie.overview : currentActiveSpotlight.overview;
  
  const heroQuote = isDynamicHeroActive 
    ? "Sensory Aligned Top Match" 
    : currentActiveSpotlight.quote;
    
  const heroTagline = isDynamicHeroActive 
    ? moodMatchedBaseMovie.overview 
    : currentActiveSpotlight.tagline;

  const heroMoodName = isDynamicHeroActive 
    ? (MOODS.find(m => m.id === filters.mood)?.label || "Matched Mood") 
    : currentActiveSpotlight.moodName;

  const heroMoodId = isDynamicHeroActive 
    ? (filters.mood || "thoughtful") 
    : currentActiveSpotlight.moodId;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans selection:bg-rose-500/20 antialiased overflow-x-hidden">
      
      {/* 1. BRANDING HEADER */}
      <Header 
        watchlistCount={watchlist.length} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiKey={apiKey}
        onChangeApiKey={handleUpdateApiKey}
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
          🎨 SENSORY MOOD SELECTOR ON TOP (Always accessible)
          ========================================================================= */}
      {activeTab !== "wishlist" && (
        <section className="w-full bg-black pt-20 pb-4 px-4 md:px-8 shrink-0 select-none border-b border-zinc-900/40">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest font-extrabold text-rose-500 uppercase">
                  Sensory Frequencies
                </span>
                <h2 className="font-display font-extrabold text-base md:text-lg text-white tracking-wide uppercase">
                  Explore Curated Moods
                </h2>
              </div>
              <p className="text-zinc-500 text-[11px] hidden sm:block">
                Tap on any sensory mood frequency to filter real-time catalogs instantly.
              </p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => {
                  handleResetFilters();
                  setActiveTab("search");
                }}
                className={`flex items-center gap-1.5 px-4 md:px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all active:scale-95 cursor-pointer ${
                  filters.mood === null
                    ? "bg-zinc-900 border-zinc-700 text-white shadow-xl font-black"
                    : "bg-zinc-950/75 border-zinc-900 text-zinc-550 hover:text-zinc-300"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>All Masterpieces</span>
              </button>

              {MOODS.map((m) => {
                const isSelected = filters.mood === m.id;
                return (
                  <button
                    key={`top-mood-${m.id}`}
                    onClick={() => {
                      const nextMood = filters.mood === m.id ? null : m.id;
                      setFilters(prev => ({ ...prev, mood: nextMood }));
                      setDraftFilters(prev => ({ ...prev, mood: nextMood }));
                      setActiveTab("search");
                    }}
                    className={`flex items-center gap-2.5 px-4.5 md:px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all active:scale-95 cursor-pointer tracking-wide ${
                      isSelected
                        ? m.activeBorder + " text-white border-2"
                        : "bg-zinc-950/75 border-zinc-900 text-zinc-550 hover:text-zinc-350 hover:border-zinc-800"
                    }`}
                  >
                    <MoodIcon id={m.id} className="w-4 h-4 text-zinc-400" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          🔥 DYNAMIC IMAGES / THEATER FEATURED HERO SHOWCASE (TMDB Direct Catalog)
          ========================================================================= */}
      {activeTab === "showcase" && (
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
                  key={isDynamicHeroActive ? moodMatchedBaseMovie.id : currentActiveSpotlight.id}
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
                  {isDynamicHeroActive ? (
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
                    onClick={() => handleToggleWatchlist(isDynamicHeroActive ? moodMatchedBaseMovie.id : currentActiveSpotlight.id)}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
                    aria-label="Toggle watchlist"
                  >
                    <Heart className={`w-4 h-4 ${watchlist.includes(isDynamicHeroActive ? moodMatchedBaseMovie.id : currentActiveSpotlight.id) ? "fill-rose-500 text-rose-500" : "text-zinc-550"}`} />
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
      )}

      {/* =========================================================================
          🧭 ADVANCED CONTROLS TRAY (Hides Search and Filters neatly together!)
          ========================================================================= */}
      {activeTab === "search" && (
        <section className="bg-black py-4 px-4 md:px-8 border-b border-zinc-900/60 shrink-0 select-none">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Header Bar representing matched catalog details and search toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-900 px-5 py-4 rounded-3xl shadow-xl">
            
            {/* Catalog Info Status */}
            <div>
              <h2 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-2">
                <span>{isWatchlistOnlyMode ? "Saved Masterpieces" : "Sensory Discovery Catalog"}</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-full">
                  {getDisplayedMovies().length} movies
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
                {isWatchlistOnlyMode 
                  ? "Browsing your private saved watchlist archive." 
                  : "Explore curated movies aligned with your emotional filters."}
              </p>
            </div>

            {/* Action controls button (Collapsible Refinement Box Toggle) */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              
              {/* Expanding Toggle */}
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer focus:outline-none ${
                  isFilterExpanded
                    ? "bg-rose-950/35 border-rose-500/30 text-rose-400 font-extrabold shadow-md shadow-rose-500/5"
                    : "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-white"
                }`}
                id="btn-desktop-filters-toggle"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Search & Filters</span>
                
                {/* Indicator bubble showing how many filters are currently modified */}
                {countActiveFilters(filters) > 0 && (
                  <span className="bg-rose-500 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {countActiveFilters(filters)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Refinements Content panel */}
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-6 shadow-2xl relative">
                  
                  {/* Inline Collapsible Search Form (Not shown directly) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-rose-500" />
                      <span>Search By Keyword</span>
                    </label>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        triggerSearchSubmit(e);
                      }} 
                      className="relative flex items-center w-full"
                    >
                      <div className="absolute left-4.5 text-zinc-550 pointer-events-none">
                        <Search className="w-4 h-4" />
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Type movie titles, plot words, actor keywords..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-16 py-4 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-750 transition-all font-sans"
                        id="main-search-input"
                      />

                      {/* Clear Button */}
                      {searchVal && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-16 p-2 text-zinc-500 hover:text-zinc-300 rounded-full transition-colors focus:outline-none cursor-pointer"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      )}

                      <button
                        type="submit"
                        className="absolute right-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer focus:outline-none active:scale-[0.98]"
                      >
                        Search
                      </button>
                    </form>
                  </div>

                  {/* Filter Sidebar Elements injected directly inside the tray */}
                  <div className="pt-4 border-t border-zinc-900/60">
                    <FilterSidebar 
                      config={draftFilters}
                      onChange={setDraftFilters}
                      isMockMode={isMockMode}
                      onReset={handleResetFilters}
                      onApply={handleApplyFilters}
                    />
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
      )}

      {/* =========================================================================
          🎬 MAIN CATALOG VIEW (Expands full screen on desktop - zero sidebar waste)
          ========================================================================= */}
      <span id="discover-feed-anchor" />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 relative select-none">
        
        {/* Core Movie Grid display list (Full-screen width layout!) */}
        <div className="space-y-12">
          
          {activeTab === "showcase" ? (
            // Immersive Landing Page: Curated Categories
            loadingLanding ? (
              <div className="space-y-14">
                {[1, 2, 3, 4].map((rowIdx) => (
                  <div key={rowIdx} className="space-y-4">
                    <div className="h-5 bg-zinc-900 rounded-md w-1/4 animate-pulse"></div>
                    <div className="flex gap-6 overflow-hidden">
                      {[1, 2, 3, 4].map((colIdx) => (
                        <div key={colIdx} className="bg-zinc-950 border border-zinc-900 w-[250px] md:w-[280px] h-[340px] rounded-3xl shrink-0 p-4 flex flex-col justify-between animate-pulse">
                          <div className="h-40 bg-zinc-900 rounded-2xl w-full"></div>
                          <div className="h-4 bg-zinc-900 rounded-lg w-3/4 mt-4"></div>
                          <div className="h-3 bg-zinc-900/50 rounded-lg w-1/2 mt-2"></div>
                          <div className="h-9 bg-zinc-900 rounded-xl w-full mt-4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : landingFeeds ? (
              <div className="space-y-14">
                {/* Row 1: Featured Masterpieces */}
                <CinematicRow 
                  title="Featured Masterpieces"
                  subtitle="🔥 Critic's Choice Highlights"
                  movies={landingFeeds.featured}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenReviews={handleViewSpotlightReviews}
                  accentColor="text-indigo-400"
                />

                {/* Row 2: Bollywood Blockbusters (Custom Discovery: Bollywood Movies Feed) */}
                <CinematicRow 
                  title="Bollywood Movies Feed"
                  subtitle="🌟 Discover Indian Blockbusters & Masala Sagas"
                  movies={landingFeeds.bollywood}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenReviews={handleViewSpotlightReviews}
                  accentColor="text-amber-400"
                />

                {/* Row 3: Hollywood Legends (Custom Discovery: Hollywood Movies Feed) */}
                <CinematicRow 
                  title="Hollywood Movies Feed"
                  subtitle="🎬 Major League Studio Classics & Sci-Fi"
                  movies={landingFeeds.hollywood}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenReviews={handleViewSpotlightReviews}
                  accentColor="text-blue-400"
                />

                {/* Row 4: 18+ Steamy & Erotic content (Custom Discovery: 18+ Adult Content Feed) */}
                <div className="relative p-6 px-1 md:px-6 rounded-3xl bg-gradient-to-r from-red-950/15 via-[#020202] to-transparent border border-red-950/30 overflow-hidden shadow-2xl">
                  <CinematicRow 
                    title="18+ Adult Content Feed"
                    subtitle="🔞 Sexually Explicit & Erotic Romances Only (No horror)"
                    movies={landingFeeds.adult18}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                    onOpenReviews={handleViewSpotlightReviews}
                    accentColor="text-red-500 font-extrabold animate-pulse"
                    isMature={true}
                  />
                </div>

                {/* Row 5: Highest Rated Action Movies (Custom Discovery) */}
                <CinematicRow 
                  title="Highest Rated Action Movies"
                  subtitle="💥 High Octane Speed, Combat & Survival Thrillers"
                  movies={landingFeeds.highestRatedAction}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenReviews={handleViewSpotlightReviews}
                  accentColor="text-rose-400"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-550 text-xs">Failed to populate landing layout. Check TMDB credentials.</p>
              </div>
            )
          ) : activeTab === "wishlist" ? (
            // Watchlisted screenings view
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-display font-extrabold text-[#ffffff] tracking-wider text-base md:text-lg uppercase">
                  My Saved Screenings Wishlist
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Displaying movies saved for your personal watchlist queue.
                </p>
              </div>

              {watchlist.length === 0 ? (
                <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-3xl text-center space-y-4 max-w-md mx-auto">
                  <Heart className="w-8 h-8 text-rose-500/30 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Your Saved screenings watchlist is empty. Go back and tap the heart icon on any movie card to include it.
                  </p>
                  <button
                    onClick={() => setActiveTab("showcase")}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Explore Curated Showcase
                  </button>
                </div>
              ) : (
                <MovieGrid 
                  movies={moviesList.filter(m => watchlist.includes(m.id))}
                  loading={loading}
                  onOpenReviews={setSelectedMovieForReviews}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onReset={handleResetFilters}
                />
              )}
            </div>
          ) : (
            // Search / Filter discoveries view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-[#ffffff] tracking-wider text-base md:text-lg uppercase">
                    Sensory Discovery Coordinates
                  </h3>
                  <p className="text-zinc-405 text-xs mt-0.5 font-sans">
                    Displaying matching live results with exact sensory emotional filters.
                  </p>
                </div>
                {countActiveFilters(filters) > 0 && (
                  <button 
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-rose-500 hover:text-white transition-colors underline cursor-pointer focus:outline-none"
                  >
                    Clear Filter Coordinates
                  </button>
                )}
              </div>

              {errorMessage ? (
                <div className="p-12 bg-zinc-950 border border-zinc-900 text-slate-400 text-center rounded-3xl space-y-4 max-w-lg mx-auto">
                  <p className="text-sm font-semibold leading-relaxed">{errorMessage}</p>
                  <button 
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs rounded-xl font-bold cursor-pointer transition-all"
                  >
                    Reset Discoveries parameters
                  </button>
                </div>
              ) : (
                <MovieGrid 
                  movies={moviesList}
                  loading={loading}
                  onOpenReviews={setSelectedMovieForReviews}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onReset={handleResetFilters}
                />
              )}
            </div>
          )}

          {/* Informational Footer */}
          <div className="pt-8 text-center text-[10px] text-zinc-650 font-mono flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900/60 font-sans">
            <span>Powered by TMDB Metadata Protocols</span>
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
        </div>
      </main>

      {/* -------------------------------------------------------------
          D. THE COMMUNITY REVIEWS DRAWER MODAL TARGET
          ------------------------------------------------------------- */}
      <ReviewDrawer 
        movie={selectedMovieForReviews}
        isOpen={selectedMovieForReviews !== null}
        onClose={() => setSelectedMovieForReviews(null)}
        apiKey={apiKey}
      />

    </div>
  );
}
