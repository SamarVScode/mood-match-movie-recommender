import React from "react";
import { Sparkles } from "lucide-react";
import { FilterConfig } from "../types";
import { MOODS, MoodIcon } from "./FilterSidebar";

interface MoodSelectorProps {
  filters: FilterConfig;
  onSelectMood: (moodId: string | null) => void;
  onResetFilters: () => void;
  setActiveTab: (tab: "showcase" | "search" | "wishlist") => void;
}

export default function MoodSelector({ filters, onSelectMood, onResetFilters, setActiveTab }: MoodSelectorProps) {
  return (
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
              onResetFilters();
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
                  onSelectMood(nextMood);
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
  );
}
