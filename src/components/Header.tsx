import React, { useState } from "react";
import { Film, Sparkles, Heart, Search, Key, Check } from "lucide-react";

interface HeaderProps {
  watchlistCount: number;
  activeTab: "showcase" | "search" | "wishlist";
  setActiveTab: (tab: "showcase" | "search" | "wishlist") => void;
  apiKey: string;
  onChangeApiKey: (key: string) => void;
  onResetAll: () => void;
}

export default function Header({
  watchlistCount,
  activeTab,
  setActiveTab,
  apiKey,
  onChangeApiKey,
  onResetAll,
}: HeaderProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    onChangeApiKey(tempKey);
    setShowKeyInput(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-b border-zinc-900 z-40 flex items-center justify-between px-4 md:px-8 shadow-2xl">
      
      {/* App Logo */}
      <div 
        onClick={() => {
          onResetAll();
          setActiveTab("showcase");
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
        id="app-branding"
      >
        <div className="bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
          <Film className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-display font-medium text-lg md:text-xl tracking-wide text-white flex items-center gap-1.5 selection:bg-rose-500/30 font-sans">
          <span className="font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">MoodMatch</span>
        </h1>
      </div>

      {/* Navigation Controls */}
      <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <button
          onClick={() => setActiveTab("showcase")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 focus:outline-none cursor-pointer ${
            activeTab === "showcase" 
              ? "bg-zinc-900 text-white border border-zinc-800"
              : "text-zinc-400 hover:text-white"
          }`}
          id="btn-nav-showcase"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Showcase</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 focus:outline-none cursor-pointer ${
            activeTab === "search" 
              ? "bg-zinc-900 text-white border border-zinc-800"
              : "text-zinc-400 hover:text-white"
          }`}
          id="btn-nav-search"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Search</span>
        </button>
        
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`relative px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 text-xs font-bold focus:outline-none cursor-pointer ${
            activeTab === "wishlist"
              ? "bg-zinc-900 text-white border border-zinc-800"
              : "text-zinc-400 hover:text-white"
          }`}
          id="btn-nav-watchlist"
        >
          <Heart className={`w-3.5 h-3.5 ${watchlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-zinc-550"}`} />
          <span>Wishlist</span>
          {watchlistCount > 0 && (
            <span className="bg-rose-600 text-white font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-bold">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Dynamic API Key Badge Selector */}
        <div className="relative">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              apiKey && apiKey.length > 15
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-950/40 text-amber-400 border border-amber-500/20"
            }`}
            id="btn-api-key-config"
          >
            <Key className="w-3 h-3" />
            <span className="hidden md:inline">{apiKey ? "API Key: Active" : "Key Needed"}</span>
          </button>

          {showKeyInput && (
            <div className="absolute right-0 mt-2 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl w-64 z-50 space-y-3">
              <h4 className="text-xs font-mono font-extrabold text-[#ffffff] uppercase tracking-wide">
                TMDB API Gateway Key
              </h4>
              <p className="text-[10px] text-zinc-500">
                Supply your custom TMDB API key to load live streams:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Paste v3 API key..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] px-2.5 py-1.5 focus:outline-none focus:border-zinc-700 text-zinc-200"
                />
                <button
                  onClick={handleSaveKey}
                  className="p-1.5 bg-indigo-600 text-white rounded-lg px-2.5 text-xs font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
