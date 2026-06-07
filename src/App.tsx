/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterSidebar, { MOODS } from "./components/FilterSidebar";
import MovieGrid from "./components/MovieGrid";
import ReviewDrawer from "./components/ReviewDrawer";
import CinematicRow from "./components/CinematicRow";
import MoodSelector from "./components/MoodSelector";
import HeroShowcase from "./components/HeroShowcase";
import SearchAndFilterTray from "./components/SearchAndFilterTray";
import { fetchFilteredMovies, fetchSpotlightMovies, fetchLandingFeeds, LandingFeeds, PRESET_SPOTLIGHTS } from "./tmdb";
import { Movie, FilterConfig, SpotlightItem, countActiveFilters } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Info, 
  ExternalLink
} from "lucide-react";

// =========================================================================
// 🔑 TMDB (THE MOVIE DATABASE) API KEY LOADED FROM STORAGE OR ENV
// =========================================================================
export const getSavedApiKey = (): string => {
  try {
    const saved = localStorage.getItem("moodmatch_tmdb_api_key");
    if (saved && saved.trim() !== "") {
      return saved.trim();
    }
  } catch {}
  return ((import.meta as any).env.VITE_TMDB_API_KEY || "").trim();
};


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
    era: "all",
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
  const [isMockMode, setIsMockMode] = useState(false); // mock removed
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
          setIsMockMode(false);
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
      era: "all",
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
        <MoodSelector
          filters={filters}
          onSelectMood={(moodId) => {
            setFilters(prev => ({ ...prev, mood: moodId }));
            setDraftFilters(prev => ({ ...prev, mood: moodId }));
          }}
          onResetFilters={handleResetFilters}
          setActiveTab={setActiveTab}
        />
      )}

      {/* =========================================================================
          🔥 DYNAMIC IMAGES / THEATER FEATURED HERO SHOWCASE (TMDB Direct Catalog)
          ========================================================================= */}
      {activeTab === "showcase" && (
        <HeroShowcase
          isDynamicHeroActive={isDynamicHeroActive}
          moodMatchedBaseMovie={moodMatchedBaseMovie}
          currentActiveSpotlight={currentActiveSpotlight}
          heroTitle={heroTitle}
          heroYear={heroYear}
          heroRating={heroRating}
          heroBackdrop={heroBackdrop}
          heroOverview={heroOverview}
          heroQuote={heroQuote}
          heroTagline={heroTagline}
          heroMoodName={heroMoodName}
          heroMoodId={heroMoodId}
          spotlights={spotlights}
          activeSpotlightIdx={activeSpotlightIdx}
          setActiveSpotlightIdx={setActiveSpotlightIdx}
          watchlist={watchlist}
          handleToggleWatchlist={handleToggleWatchlist}
          handleViewSpotlightReviews={handleViewSpotlightReviews}
          handleActivateSpotlight={handleActivateSpotlight}
        />
      )}

      {/* =========================================================================
          🧭 ADVANCED CONTROLS TRAY (Hides Search and Filters neatly together!)
          ========================================================================= */}
      {activeTab === "search" && (
        <SearchAndFilterTray
          isWatchlistOnlyMode={isWatchlistOnlyMode}
          displayedMoviesCount={getDisplayedMovies().length}
          isFilterExpanded={isFilterExpanded}
          setIsFilterExpanded={setIsFilterExpanded}
          filters={filters}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          triggerSearchSubmit={triggerSearchSubmit}
          handleClearSearch={handleClearSearch}
          isMockMode={isMockMode}
          handleResetFilters={handleResetFilters}
          handleApplyFilters={handleApplyFilters}
        />
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
