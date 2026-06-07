import React, { useEffect, useState } from "react";
import { Movie, Review, CastMember } from "../types";
import { getMovieReviews, getMovieDetails } from "../tmdb";
import { X, MessageSquare, Star, Sparkles, User, AlertCircle, Clock, Info, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export default function ReviewDrawer({ movie, isOpen, onClose, apiKey }: ReviewDrawerProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [runtime, setRuntime] = useState<number>(0);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  useEffect(() => {
    if (!isOpen || !movie) return;

    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reviewsList, detailsData] = await Promise.all([
          getMovieReviews(apiKey, movie.id, movie.title).catch(() => []),
          getMovieDetails(apiKey, movie.id).catch(() => ({ cast: [], runtime: 0, genres: [] }))
        ]);

        if (active) {
          setReviews(reviewsList);
          setCast(detailsData.cast);
          setRuntime(detailsData.runtime);
          setGenres(detailsData.genres);
        }
      } catch (error) {
        console.info("Info handling loaded details/reviews inside drawer fallback:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [movie, isOpen, apiKey]);

  // Handle ESC close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && movie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay with fade-in */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
            id="review-modal-backdrop"
          />

          {/* Dialog Frame - springing rising scaling with Decelerated Ease */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[85vh] relative z-10"
            onClick={(e) => e.stopPropagation()}
            id="review-modal-card"
          >
            {/* Modal Header */}
            <div className="p-5 md:p-6 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/5 p-2.5 rounded-xl text-amber-400 border border-amber-500/10">
                  <Info className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[#f3f4f6] tracking-wide">
                    Movie Dossier
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider uppercase mt-1 line-clamp-1">
                    {movie.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:flex bg-zinc-900 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'details' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'reviews' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Reviews <span className="bg-zinc-950 text-[9px] px-1.5 py-0.5 rounded text-amber-500">{reviews.length}</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-all focus:outline-none cursor-pointer border border-zinc-800 bg-zinc-900/50"
                  aria-label="Close dialog"
                  id="btn-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="sm:hidden flex bg-zinc-900/50 border-b border-zinc-900">
              <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${activeTab === 'details' ? 'border-amber-500 text-white bg-zinc-900' : 'border-transparent text-zinc-500'}`}
              >
                Cast & Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex justify-center items-center gap-1.5 ${activeTab === 'reviews' ? 'border-amber-500 text-white bg-zinc-900' : 'border-transparent text-zinc-500'}`}
              >
                Reviews <span className="bg-zinc-950 text-[9px] px-1.5 py-0.5 rounded text-amber-500 border border-zinc-800">{reviews.length}</span>
              </button>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              
              {/* Quick Movie Highlight card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-black border border-zinc-900 p-4 rounded-2xl select-none">
                {/* Miniature Poster cover */}
                <div className="h-44 sm:h-auto rounded-xl overflow-hidden bg-zinc-900">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    referrerPolicy="no-referrer"
                    loading="lazy" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Quick specifications */}
                <div className="sm:col-span-2 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm md:text-base text-[#f3f4f6]">{movie.title}</h3>
                      <div className="px-2 py-0.5 rounded font-mono text-[10px] font-extrabold shrink-0 bg-amber-950/60 text-amber-400 border border-amber-500/10">
                        ★ {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 font-semibold">Theatrical Release: {movie.release_date || "N/A"}</p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed italic font-sans border-l-2 border-zinc-800 pl-3">
                    {movie.overview}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'details' ? (
                  <motion.div
                    key="tab-details"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Extended Details */}
                    {loading ? (
                       <div className="space-y-4 py-8 text-center">
                         <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
                       </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "Runtime N/A"}</span>
                          </div>
                          {genres.length > 0 && (
                            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 text-xs font-semibold">
                              <span className="text-zinc-500 font-mono text-[10px]">GENRES:</span>
                              <span>{genres.map(g => g.name).join(", ")}</span>
                            </div>
                          )}
                        </div>

                        {/* Cast Section */}
                        <div className="space-y-3">
                          <h4 className="font-display font-bold text-xs text-zinc-400 tracking-wider uppercase flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-rose-400" />
                            <span>Top Cast</span>
                          </h4>

                          {cast.length === 0 ? (
                            <p className="text-zinc-500 text-xs italic">No cast information available.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                              {cast.slice(0, 5).map((actor) => (
                                <div key={actor.id} className="bg-black border border-zinc-900 rounded-xl overflow-hidden flex flex-col items-center p-2 text-center">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-900 mb-2 border border-zinc-800 shrink-0">
                                    {actor.profile_path ? (
                                      <img src={actor.profile_path} alt={actor.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-zinc-700" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-zinc-200 text-xs font-bold line-clamp-1 w-full">{actor.name}</p>
                                  <p className="text-zinc-500 text-[9px] line-clamp-1 w-full mt-0.5">{actor.character}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-reviews"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="font-display font-bold text-xs text-zinc-400 tracking-wider uppercase flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Verified Critiques ({loading ? "..." : reviews.length})</span>
                    </h4>

                    {loading ? (
                      <div className="space-y-4 py-12 text-center bg-black p-6 rounded-2xl border border-dashed border-zinc-900">
                        <div className="relative inline-flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold tracking-wide">Syncing critiques from server journals...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="py-10 text-center bg-black border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-zinc-650 mb-2.5" />
                        <h5 className="text-xs font-bold uppercase tracking-wide text-zinc-400">No community reviews found</h5>
                        <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">Be the first to leave a critique on the TMDB master registries!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((rev, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.05 }}
                            className="p-4 bg-black border border-zinc-900 rounded-2xl space-y-3 hover:border-zinc-850 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-850">
                                  <User className="w-3.5 h-3.5 text-zinc-400" />
                                </div>
                                <span className="text-xs font-bold text-zinc-300 font-mono">@{rev.author}</span>
                              </div>
                              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded uppercase font-mono tracking-wider border border-indigo-500/10 select-none">
                                Critic
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed max-h-40 overflow-y-auto pr-1 whitespace-pre-line font-sans">
                              {rev.content}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all focus:outline-none"
                id="btn-modal-close-footer"
              >
                Close View
              </button>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
