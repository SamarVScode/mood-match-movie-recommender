import { Movie, Review, MOCK_MOVIES, MOCK_REVIEWS } from "./mockData";

export interface FilterConfig {
  industry: "all" | "en" | "hi";
  era: "all" | "latest" | "2010s" | "2000s" | "classic";
  minRating: number;
  mood: string | null;
  exactYear: string; // "any" or 4-digit string like "2024"
  sortBy: "popularity.desc" | "vote_average.desc" | "primary_release_date.desc" | "revenue.desc";
  minRuntime: number; // 0, 90, 120, 150
  searchQuery?: string;
}

// Map the abstract Mood tags to TMDB genre ID arrays
export function mapMoodToGenres(mood: string | null): number[] {
  if (!mood) return [];
  switch (mood) {
    case "comedy":
      return [35]; // Comedy
    case "adrenaline":
      return [28, 53]; // Action (28) or Thriller (53)
    case "horror":
      return [27, 9648]; // Horror (27) or Mystery (9648)
    case "thoughtful":
      return [18, 878]; // Drama (18) or Sci-Fi (878)
    case "feelgood":
      return [10749, 10751]; // Romance (10749) or Family (10751)
    default:
      return [];
  }
}

/**
 * Checks if a TMDB API Key looks valid
 */
export function isValidApiKey(key: string): boolean {
  if (!key) return false;
  const tidied = key.trim();
  if (tidied === "" || tidied.includes("PASTE_YOUR_TMDB_API_KEY_HERE") || tidied.includes("MY_") || tidied.length < 15) {
    return false;
  }
  return true;
}

/**
 * Fetches filtered results from TMDB, or falls back to mock filtering if key is missing/invalid
 */
export async function fetchFilteredMovies(apiKey: string, config: FilterConfig): Promise<{ movies: Movie[]; isMock: boolean }> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    // --- Mock Client-Side Engine with high-fidelity outputs ---
    let filtered = [...MOCK_MOVIES];

    // Filter by search text query
    if (config.searchQuery && config.searchQuery.trim() !== "") {
      const q = config.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.overview.toLowerCase().includes(q)
      );
    }

    // Filter by Industry (Original Language)
    if (config.industry === "en") {
      filtered = filtered.filter(m => m.original_language === "en");
    } else if (config.industry === "hi") {
      filtered = filtered.filter(m => m.original_language === "hi");
    }

    // Filter by Rating
    filtered = filtered.filter(m => m.vote_average >= config.minRating);

    // Filter by Mood Genres
    if (config.mood) {
      const genres = mapMoodToGenres(config.mood);
      filtered = filtered.filter(m => 
        m.genre_ids.some(gId => genres.includes(gId))
      );
    }

    // Filter by Exact Year
    if (config.exactYear && config.exactYear !== "any") {
      filtered = filtered.filter(m => {
        const releaseYear = new Date(m.release_date).getFullYear().toString();
        return releaseYear === config.exactYear;
      });
    } else {
      // Filter by broad Release Era (only if exactYear is "any")
      const currentYear = 2026;
      filtered = filtered.filter(m => {
        const releaseYear = new Date(m.release_date).getFullYear();
        if (isNaN(releaseYear)) return true;
        
        switch (config.era) {
          case "latest":
            return releaseYear >= currentYear - 3; // 2023 - 2026
          case "2010s":
            return releaseYear >= 2010 && releaseYear <= 2019;
          case "2000s":
            return releaseYear >= 2000 && releaseYear <= 2009;
          case "classic":
            return releaseYear < 2000;
          default:
            return true;
        }
      });
    }

    // Filter by Minimum Runtime
    if (config.minRuntime > 0) {
      filtered = filtered.filter(m => {
        // Mock dataset runs are assumed default if not specified
        const mockRuntime = m.id % 2 === 0 ? 138 : 105; 
        return mockRuntime >= config.minRuntime;
      });
    }

    // Global sorting logic based on config
    filtered.sort((a, b) => {
      if (config.sortBy === "vote_average.desc") {
        return b.vote_average - a.vote_average;
      }
      if (config.sortBy === "primary_release_date.desc") {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      }
      // Default: sort by popularity desc
      return b.popularity - a.popularity;
    });

    // Slice to exactly Top 10 movies
    const finalSelection = filtered.slice(0, 10);

    // Dynamic loader simulation delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      movies: finalSelection,
      isMock: true
    };
  }

  // --- Real Live TMDB API Gateway with Search & Discover Fallbacks ---
  try {
    const hasSearchQuery = config.searchQuery && config.searchQuery.trim() !== "";
    let finalUrl = "";
    const params = new URLSearchParams();

    params.append("api_key", apiKey.trim());

    if (hasSearchQuery) {
      // Use Live TMDB Search API (requires query string)
      finalUrl = "https://api.themoviedb.org/3/search/movie";
      params.append("query", config.searchQuery!.trim());
      params.append("include_adult", "false");
    } else {
      // Use premium TMDB Discover Service
      finalUrl = "https://api.themoviedb.org/3/discover/movie";
      params.append("sort_by", config.sortBy);
      params.append("vote_count.gte", "50"); // Relieved fallback threshold for dynamic filters
      
      // Industry/language limits
      if (config.industry === "en") {
        params.append("with_original_language", "en");
      } else if (config.industry === "hi") {
        params.append("with_original_language", "hi");
      }

      // Rating score
      params.append("vote_average.gte", config.minRating.toString());

      // Exact Year or Era Bounds
      if (config.exactYear && config.exactYear !== "any") {
        params.append("primary_release_year", config.exactYear);
      } else {
        const currentYear = 2026;
        if (config.era === "latest") {
          params.append("primary_release_date.gte", `${currentYear - 3}-01-01`);
          params.append("primary_release_date.lte", `${currentYear}-12-31`);
        } else if (config.era === "2010s") {
          params.append("primary_release_date.gte", "2010-01-01");
          params.append("primary_release_date.lte", "2019-12-31");
        } else if (config.era === "2000s") {
          params.append("primary_release_date.gte", "2000-01-01");
          params.append("primary_release_date.lte", "2009-12-31");
        } else if (config.era === "classic") {
          params.append("primary_release_date.lte", "1999-12-31");
        }
      }

      // Mood mapped to explicit TMDB Genre code lists
      if (config.mood) {
        const genres = mapMoodToGenres(config.mood);
        params.append("with_genres", genres.join(","));
      }

      // Min Runtime TMDB code parameter
      if (config.minRuntime > 0) {
        params.append("with_runtime.gte", config.minRuntime.toString());
      }
    }

    const response = await fetch(`${finalUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`TMDB HTTP failure: Status code ${response.status}`);
    }

    const data = await response.json();
    let results = data.results || [];

    // If we fetched via keyword search, let's filter client-side to keep mood & active states!
    if (hasSearchQuery) {
      // client-side filter parameters over keyword returns
      if (config.industry === "en") {
        results = results.filter((m: any) => m.original_language === "en");
      } else if (config.industry === "hi") {
        results = results.filter((m: any) => m.original_language === "hi");
      }

      if (config.minRating > 1) {
        results = results.filter((m: any) => (m.vote_average || 0) >= config.minRating);
      }

      if (config.exactYear && config.exactYear !== "any") {
        results = results.filter((m: any) => {
          const year = m.release_date ? new Date(m.release_date).getFullYear().toString() : "";
          return year === config.exactYear;
        });
      }

      if (config.mood) {
        const genres = mapMoodToGenres(config.mood);
        results = results.filter((m: any) => {
          const mGenreIds = m.genre_ids || [];
          return mGenreIds.some((gId: number) => genres.includes(gId));
        });
      }
    }

    // Convert and slice to exactly the top 10 movies
    const moviesList: Movie[] = results.slice(0, 10).map((m: any) => ({
      id: m.id,
      title: m.title,
      original_language: m.original_language || "en",
      release_date: m.release_date || "",
      vote_average: m.vote_average || 0.0,
      overview: m.overview || "No plot overview provided.",
      poster_path: m.poster_path 
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500", // Fallback poster
      genre_ids: m.genre_ids || [],
      popularity: m.popularity || 0
    }));

    return {
      movies: moviesList,
      isMock: false
    };

  } catch (error) {
    console.error("Live TMDB Gateway fetch failure:", error);
    throw error;
  }
}

/**
 * Fetches reviews from TMDB API or falls back to custom high-fidelity reviews
 */
export async function getMovieReviews(apiKey: string, movieId: number, movieTitle: string): Promise<Review[]> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    if (MOCK_REVIEWS[movieId]) {
      return MOCK_REVIEWS[movieId];
    }
    return [
      {
        author: "ScreenGrader",
        content: `"${movieTitle}" is a sparkling example of elite cinema. Outstanding cinematography, wonderful script pacing, and a fantastic score that stays with you.`
      },
      {
        author: "CineWanderer",
        content: `Highly recommended! Some subplots were slightly condensed, but the absolute performance levels make up for any narrative shortcomings.`
      }
    ];
  }

  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey.trim()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB Reviews error ${response.status}`);
    }
    const data = await response.json();
    const results = data.results || [];
    
    if (results.length === 0) {
      return [];
    }

    return results.slice(0, 3).map((r: any) => ({
      author: r.author || "Anonymous Critic",
      content: r.content ? r.content : "This reviewer did not write any body content."
    }));

  } catch (err) {
    console.error(`Live TMDB Reviews Fetch Error for Movie ID ${movieId}:`, err);
    return [
      {
        author: "CineCritique",
        content: `Could not reach TMDB reviews servers directly. However, ${movieTitle} is highly regarded for its beautiful dialogue and emotional depth.`
      }
    ];
  }
}
