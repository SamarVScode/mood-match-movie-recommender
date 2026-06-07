import React from "react";
import { Film, Sparkles, Heart } from "lucide-react";

interface HeaderProps {
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onResetAll: () => void;
}

export default function Header({ watchlistCount, onOpenWatchlist, onResetAll }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-b border-zinc-900 z-40 flex items-center justify-between px-4 md:px-8 shadow-2xl">
      
      {/* App Logo */}
      <div 
        onClick={onResetAll}
        className="flex items-center gap-2.5 cursor-pointer group"
        id="app-branding"
      >
        <div className="bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
          <Film className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-display font-medium text-lg md:text-xl tracking-wide text-white flex items-center gap-1.5 selection:bg-rose-500/30">
          <span className="font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">MoodMatch</span>
        </h1>
      </div>

      {/* Navigation Controls */}
      <nav className="flex items-center gap-4 md:gap-6">
        <button
          onClick={onResetAll}
          className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer"
          id="btn-nav-home"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Discover</span>
        </button>
        
        <button
          onClick={onOpenWatchlist}
          className="relative px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-full transition-all duration-300 flex items-center gap-2 text-xs font-bold text-zinc-350 hover:text-white focus:outline-none cursor-pointer active:scale-95"
          id="btn-nav-watchlist"
        >
          <Heart className={`w-4 h-4 ${watchlistCount > 0 ? "fill-rose-500 text-rose-500 animate-pulse" : "text-zinc-500"}`} />
          <span>Watchlist</span>
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-bold">
              {watchlistCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
