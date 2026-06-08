import React from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FilterConfig, countActiveFilters } from "../types";
import FilterSidebar from "./FilterSidebar";

interface SearchAndFilterTrayProps {
  isWatchlistOnlyMode: boolean;
  displayedMoviesCount: number;
  isFilterExpanded: boolean;
  setIsFilterExpanded: (expanded: boolean) => void;
  filters: FilterConfig;
  draftFilters: FilterConfig;
  setDraftFilters: (config: FilterConfig) => void;
  searchVal: string;
  setSearchVal: (val: string) => void;
  triggerSearchSubmit: (e?: React.FormEvent) => void;
  handleClearSearch: () => void;
  isMockMode: boolean;
  handleResetFilters: () => void;
  handleApplyFilters: () => void;
}

export default function SearchAndFilterTray({
  isWatchlistOnlyMode,
  displayedMoviesCount,
  isFilterExpanded,
  setIsFilterExpanded,
  filters,
  draftFilters,
  setDraftFilters,
  searchVal,
  setSearchVal,
  triggerSearchSubmit,
  handleClearSearch,
  isMockMode,
  handleResetFilters,
  handleApplyFilters
}: SearchAndFilterTrayProps) {
  return (
    <section className="bg-black py-4 px-4 md:px-8 border-b border-zinc-900/60 shrink-0 select-none">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header Bar representing matched catalog details and search toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-900 px-5 py-4 rounded-3xl shadow-xl">

          {/* Catalog Info Status */}
          <div>
            <h2 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <span>{isWatchlistOnlyMode ? "Saved Masterpieces" : "Sensory Discovery Catalog"}</span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-full">
                {displayedMoviesCount} movies
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

                {/* Inline Collapsible Search Form */}
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
  );
}
