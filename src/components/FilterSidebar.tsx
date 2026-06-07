import React from "react";
import { FilterConfig, countActiveFilters } from "../types";
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Calendar, 
  ArrowDownAz, 
  Sliders, 
  Languages, 
  Tv2,
  Laugh,
  Flame,
  Ghost,
  Brain,
  Heart,
  Smile,
  Users,
  Glasses,
  Compass,
  Lock,
  Skull
} from "lucide-react";
import { motion } from "motion/react";

interface FilterSidebarProps {
  config: FilterConfig;
  onChange: (newConfig: FilterConfig) => void;
  isMockMode: boolean;
  onReset: () => void;
  onApply?: () => void;
}

export const MOODS = [
  { id: "comedy", label: "Comedy & Satire", activeBorder: "border-amber-500/60 text-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/5", activeIndicator: "bg-amber-400" },
  { id: "adrenaline", label: "Action & Thriller", activeBorder: "border-rose-500/100 text-rose-400 bg-rose-950/30 shadow-lg shadow-rose-500/10", activeIndicator: "bg-rose-500" },
  { id: "horror", label: "Horror & Suspense", activeBorder: "border-purple-500/60 text-purple-400 bg-purple-950/20 shadow-lg shadow-purple-500/5", activeIndicator: "bg-purple-500" },
  { id: "thoughtful", label: "Drama & Sci-Fi", activeBorder: "border-blue-500/60 text-blue-400 bg-blue-950/20 shadow-lg shadow-blue-500/5", activeIndicator: "bg-blue-500" },
  { id: "feelgood", label: "Romance & Feel-Good", activeBorder: "border-pink-500/60 text-pink-400 bg-pink-950/20 shadow-lg shadow-pink-500/5", activeIndicator: "bg-pink-500" },
  { id: "family", label: "Kids & Family", activeBorder: "border-emerald-500/60 text-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/5", activeIndicator: "bg-emerald-400" },
  { id: "mystery", label: "Mystery & Crime", activeBorder: "border-sky-500/60 text-sky-400 bg-sky-950/20 shadow-lg shadow-sky-500/5", activeIndicator: "bg-sky-400" },
  { id: "documentary", label: "Real & Documentary", activeBorder: "border-teal-500/60 text-teal-400 bg-teal-950/20 shadow-lg shadow-teal-500/5", activeIndicator: "bg-teal-400" },
  { id: "adult", label: "Intense & Steamy (18+)", activeBorder: "border-red-500/100 text-red-500 bg-red-950/40 shadow-xl shadow-red-500/20 animate-pulse", activeIndicator: "bg-red-500" },
];

export const MoodIcon = ({ id, className }: { id: string; className?: string }) => {
  switch (id) {
    case "comedy":
      return <Laugh className={className} />;
    case "adrenaline":
      return <Flame className={className} />;
    case "horror":
      return <Ghost className={className} />;
    case "thoughtful":
      return <Brain className={className} />;
    case "feelgood":
      return <Heart className={className} />;
    case "family":
      return <Users className={className} />;
    case "mystery":
      return <Skull className={className} />;
    case "documentary":
      return <Compass className={className} />;
    case "adult":
      return <Lock className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

const SELECTABLE_YEARS = [
  "any", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019",
  "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009",
  "2008", "2007", "2006", "2005", "2003", "2000", "1998", "1995", "1990", "1985",
  "1980", "1975", "1970", "1960"
];

export default function FilterSidebar({
  config,
  onChange,
  isMockMode,
  onReset,
  onApply,
}: FilterSidebarProps) {

  const activeFiltersCount = countActiveFilters(config);

  const handleIndustryChange = (industry: "all" | "en" | "hi") => {
    onChange({ ...config, industry });
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...config, era: e.target.value as any });
  };

  const handleExactYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({ ...config, exactYear: val });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...config, sortBy: e.target.value as any });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, minRating: parseFloat(e.target.value) });
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, minRuntime: parseInt(e.target.value, 10) });
  };

  const handleMoodSelect = (moodId: string) => {
    onChange({ ...config, mood: config.mood === moodId ? null : moodId });
  };

  return (
    <aside className="w-full h-full bg-black/90 border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-6 select-none relative group">
      
      {/* Background soft glow indicator */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-zinc-800/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-zinc-800/15 transition-all duration-700"></div>

      <div className="space-y-6 relative z-10">
        
        {/* Header Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-rose-500" />
            <h3 className="font-display font-bold text-xs tracking-widest text-zinc-300 uppercase">Filter Console</h3>
          </div>
          {activeFiltersCount > 0 && (
            <span className="bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-rose-500/20">
              {activeFiltersCount} Active
            </span>
          )}
        </div>

        {/* Cinematic Environmental Status card */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-2.5 relative overflow-hidden group/status shadow-inner"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-800/5 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-500">
              Gateway Integration
            </span>
            <span className="relative flex h-20 w-20 items-center justify-end">
              <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${isMockMode ? "bg-amber-500/60" : "bg-emerald-500/60"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isMockMode ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            {isMockMode ? (
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">
                {isMockMode ? "Curated Demo Mode" : "Live TMDB Synced"}
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                {isMockMode 
                  ? "Streaming local high-fidelity Hollywood & Bollywood reels. Set VITE_TMDB_API_KEY in .env to unlock real-time global databases."
                  : "API connection active. Sourcing direct catalogs from cloud registers."
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* 1. Sort Order Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <ArrowDownAz className="w-3.5 h-3.5 text-rose-500" />
            <span>Sort Strategy</span>
          </label>
          <div className="relative">
            <select
              value={config.sortBy}
              onChange={handleSortChange}
              className="w-full text-xs font-semibold bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-3 text-zinc-200 focus:outline-none hover:border-zinc-800 cursor-pointer appearance-none transition-colors"
              id="sort-selector"
            >
              <option value="popularity.desc">Box Office Buzz</option>
              <option value="vote_average.desc">Critical Consensus</option>
              <option value="primary_release_date.desc">Theatrical Freshness</option>
              <option value="revenue.desc">Commercial Yield</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-650 text-[10px] font-bold">
              ▼
            </div>
          </div>
        </div>

        {/* 2. Industry Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>Regional Origin</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900">
            {(["all", "en", "hi"] as const).map((industryOption) => {
              const isActive = config.industry === industryOption;
              const labels = {
                all: "All",
                en: "Hollywood",
                hi: "Bollywood",
              };
              return (
                <button
                  key={industryOption}
                  onClick={() => handleIndustryChange(industryOption)}
                  className={`text-xs py-2 rounded-lg font-bold transition-all duration-200 focus:outline-none cursor-pointer ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-md"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                  }`}
                  id={`industry-${industryOption}`}
                >
                  {labels[industryOption]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Exact Release Year Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Theatrical Release Year</span>
          </label>
          <div className="relative">
            <select
              value={config.exactYear}
              onChange={handleExactYearChange}
              className="w-full text-xs font-semibold bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-3 text-zinc-200 focus:outline-none hover:border-zinc-800 cursor-pointer appearance-none transition-colors"
              id="exact-year-selector"
            >
              {SELECTABLE_YEARS.map(yr => (
                <option key={yr} value={yr}>
                  {yr === "any" ? "Any Year (Broad Era matching enabled)" : `Year: ${yr}`}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-650 text-[10px] font-bold">
              ▼
            </div>
          </div>
        </div>

        {/* 4. Release Era Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Tv2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Broad Era</span>
            </label>
            {config.exactYear !== "any" && (
              <span className="text-[8px] font-mono font-bold text-amber-400 uppercase bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 select-none">
                Overridden
              </span>
            )}
          </div>
          <div className="relative">
            <select
              disabled={config.exactYear !== "any"}
              value={config.era}
              onChange={handleEraChange}
              className={`w-full text-xs font-semibold bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-3 text-zinc-200 focus:outline-none appearance-none transition-all ${
                config.exactYear !== "any" ? "opacity-30 cursor-not-allowed select-none" : "hover:border-zinc-800 cursor-pointer"
              }`}
              id="era-selector"
            >
              <option value="all">Any Era (All Time)</option>
              <option value="latest">Latest Releases (2023 - 2026)</option>
              <option value="2010s">2010s Mid-Era (2010 - 2019)</option>
              <option value="2000s">Y2K Nostalgia (2000 - 2009)</option>
              <option value="classic">Cinematic Classics (Pre-2000)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-650 text-[10px] font-bold">
              ▼
            </div>
          </div>
        </div>

        {/* 5. Runtime Filter Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Playtime Limit</span>
            </label>
            <span className="font-mono text-xs font-extrabold text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-500/10">
              {config.minRuntime === 0 ? "Any Playtime" : `${config.minRuntime}+ Mins`}
            </span>
          </div>
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="180"
              step="15"
              value={config.minRuntime}
              onChange={handleRuntimeChange}
              className="w-full accent-indigo-500 h-1 bg-zinc-900 rounded-lg cursor-pointer hover:accent-indigo-400 focus:outline-none transition-transform"
              id="runtime-slider"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-1 font-bold">
              <span>Any</span>
              <span>90m</span>
              <span>120m</span>
              <span>180m</span>
            </div>
          </div>
        </div>

        {/* 6. Minimum Rating Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Minimum Rating</span>
            </label>
            <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-950/40 border border-amber-500/10 px-2.5 py-0.5 rounded-lg">
              ★ {config.minRating.toFixed(1)} / 10
            </span>
          </div>
          <div className="space-y-1">
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.minRating}
              onChange={handleRatingChange}
              className="w-full accent-amber-500 h-1 bg-zinc-900 rounded-lg cursor-pointer hover:accent-amber-400 focus:outline-none"
              id="rating-slider"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-1 font-bold">
              <span>Aesthetic: 1.0</span>
              <span>Mid: 5.5</span>
              <span>Perfect: 10.0</span>
            </div>
          </div>
        </div>

        {/* 7. Mood Filter Badges */}
        <div className="space-y-3 pt-1">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Select Sensory Mood</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const isSelected = config.mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold select-none cursor-pointer border relative transition-all active:scale-95 duration-300 focus:outline-none ${
                    isSelected
                      ? `${m.activeBorder}`
                      : "bg-zinc-950/40 hover:bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                  }`}
                  id={`mood-badge-${m.id}`}
                >
                  <MoodIcon id={m.id} className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-current" : "text-zinc-500"}`} />
                  <span>{m.label}</span>
                  {isSelected && (
                    <span className={`w-1.5 h-1.5 rounded-full ${m.activeIndicator} ml-auto shrink-0`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Action buttons row */}
      <div className="flex items-center gap-3 mt-4 shrink-0 relative z-10">
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 duration-200 focus:outline-none"
          id="btn-sidebar-reset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>Reset</span>
        </button>
        {onApply && (
          <button
            onClick={onApply}
            className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 duration-200 focus:outline-none shadow-lg shadow-amber-500/10"
            id="btn-sidebar-apply"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Apply Filters</span>
          </button>
        )}
      </div>
    </aside>
  );
}
