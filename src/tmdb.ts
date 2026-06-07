import { Movie, Review, FilterConfig, SpotlightItem, countActiveFilters } from "./types";

export const LOCAL_FALLBACK_MOVIES: Movie[] = [
  {
    id: 157336,
    title: "Interstellar",
    original_language: "en",
    release_date: "2014-11-05",
    vote_average: 8.4,
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 878, 12],
    popularity: 910
  },
  {
    id: 579974,
    title: "RRR",
    original_language: "hi",
    release_date: "2022-03-24",
    vote_average: 7.8,
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    poster_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=500",
    genre_ids: [28, 12, 18],
    popularity: 880
  },
  {
    id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    original_language: "hi",
    release_date: "1995-10-20",
    vote_average: 8.5,
    overview: "Raj and Simran meet on a European holiday and fall in love. When Simran is taken back to India for an arranged marriage, Raj follows to win over her traditional family.",
    poster_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=500",
    genre_ids: [10749, 18, 35],
    popularity: 850
  },
  {
    id: 28,
    title: "The Dark Knight",
    original_language: "en",
    release_date: "2008-07-18",
    vote_average: 8.5,
    overview: "Batman raises the stakes in his war on crime. With the help of Gordon and Dent, Batman sets out to dismantle the remaining crime organizations.",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=500",
    genre_ids: [28, 80, 18],
    popularity: 950
  },
  {
    id: 501,
    title: "Fifty Shades of Grey",
    original_language: "en",
    release_date: "2015-02-11",
    vote_average: 6.8,
    overview: "Literature student Anastasia Steele's life changes forever when she meets handsome, yet tormented billionaire Christian Grey and is introduced to his intense, sexually explicit BDSM world.",
    poster_path: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=500",
    genre_ids: [10749, 18],
    popularity: 820
  },
  {
    id: 502,
    title: "Eyes Wide Shut",
    original_language: "en",
    release_date: "1999-07-16",
    vote_average: 8.0,
    overview: "After his wife admits to having sexual fantasies about another man, a New York City doctor embarks on a night-long odyssey of sexual discovery, leading him to a secretive, masked elite party.",
    poster_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 9648],
    popularity: 790
  },
  {
    id: 503,
    title: "Basic Instinct",
    original_language: "en",
    release_date: "1992-03-20",
    vote_average: 7.7,
    overview: "A police detective investigates a brutal murder where a seductive novelist becomes the prime suspect. As they engage in an intense, sexually charged affair, the line between hunter and prey blurs.",
    poster_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=500",
    genre_ids: [53, 9648],
    popularity: 810
  },
  {
    id: 506,
    title: "Lust, Caution",
    original_language: "hi",
    release_date: "2007-08-30",
    vote_average: 7.8,
    overview: "During World War II, a young woman becomes part of a play to seduce and assassinate a powerful official, leading to a dangerous, highly explicit sexual relationship.",
    poster_path: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 10749, 53],
    popularity: 755
  }
];

export const LOCAL_FALLBACK_REVIEWS: Record<number, Review[]> = {
  157336: [
    { author: "AstronomyBuff", content: "Visually spectacular and emotionally profound. Nolan is at his absolute pinnacle of science fiction storytelling." },
    { author: "Cinephile92", content: "A thrilling ride across space and time. Hans Zimmer's organ-heavy soundtrack is an absolute masterpiece." }
  ],
  579974: [
    { author: "ActionJunkie", content: "The absolute peak of action epic drama! Unbelievable choreographies, raw animal energy, and supreme emotional power." }
  ],
  19404: [
    { author: "BollywoodLover", content: "The ultimate golden standard of romance. No movie matches the chemistry, songs, and emotional peak of Raj and Simran." }
  ],
  501: [
    { author: "EroticCine", content: "A sleek, highly stylized exploration of fantasy and control. The lighting and visual luxury create an intense atmosphere that focuses heavily on intimacy." },
    { author: "SensualReads", content: "While some plotlines are simple, the chemical attraction between the leads is electric and memorable." }
  ],
  502: [
    { author: "KubrickScholar", content: "Kubrick's ultimate look into the secrets of elite marriage, temptation, and raw physical desire. A brilliant, tense, and deeply atmospheric masterpiece." }
  ],
  503: [
    { author: "NoirExpert", content: "The absolute gold standard of the 1990s erotic thriller. Sharon Stone delivers a legendary, highly seductive, and intensely explicit performance." }
  ],
  506: [
    { author: "AsiaCinema", content: "Ang Lee's spycraft masterpiece. The intense relationships are deeply psychological, acting as the absolute emotional core of the tragedy." }
  ]
};

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
    case "family":
      return [10751, 16]; // Family or Animation
    case "mystery":
      return [9648, 80]; // Mystery or Crime
    case "documentary":
      return [99]; // Documentary
    case "adult":
      return [10749, 18, 53]; // Romance (10749), Drama (18), Thriller (53) - pillars of steamy/erotic cinema
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
    let filtered = [...LOCAL_FALLBACK_MOVIES];

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

    // Filter by Mood Genres and prevent leakage of sexually explicit/adult-only content
    if (config.mood) {
      if (config.mood === "adult") {
        filtered = filtered.filter(m => [501, 502, 503, 506].includes(m.id));
      } else {
        const genres = mapMoodToGenres(config.mood);
        filtered = filtered.filter(m => 
          ![501, 502, 503, 506].includes(m.id) &&
          m.genre_ids.some(gId => genres.includes(gId))
        );
      }
    } else {
      // By default when no mood is active, hide adult-only content
      filtered = filtered.filter(m => ![501, 502, 503, 506].includes(m.id));
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

    // Slice to exactly Top 24 movies
    const finalSelection = filtered.slice(0, 24);

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
    const activeCount = countActiveFilters(config);
    const isDefaultOverview = activeCount === 0 && !hasSearchQuery;

    // 1. HOME SCREEN MIX: When no filters are selected, pull & interleave standard trending/imdb feeds
    if (isDefaultOverview) {
      try {
        const urls = [
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey.trim()}&language=en-US&page=1`,
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey.trim()}&language=en-US&page=1`,
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey.trim()}&language=en-US&page=1`
        ];
        const responses = await Promise.all(urls.map(u => fetch(u).then(res => res.ok ? res.json() : null)));
        
        const topRated = responses[0]?.results || [];
        const popular = responses[1]?.results || [];
        const nowPlaying = responses[2]?.results || [];

        // Interleave feeds to match user requested "mix of featured movies list given by IMDb"
        const mixed: any[] = [];
        const maxLength = Math.max(nowPlaying.length, topRated.length, popular.length);
        const seenIds = new Set<number>();

        for (let i = 0; i < maxLength; i++) {
          if (topRated[i] && !seenIds.has(topRated[i].id)) {
            mixed.push(topRated[i]);
            seenIds.add(topRated[i].id);
          }
          if (popular[i] && !seenIds.has(popular[i].id)) {
            mixed.push(popular[i]);
            seenIds.add(popular[i].id);
          }
          if (nowPlaying[i] && !seenIds.has(nowPlaying[i].id)) {
            mixed.push(nowPlaying[i]);
            seenIds.add(nowPlaying[i].id);
          }
          if (mixed.length >= 24) break;
        }

        const moviesList: Movie[] = mixed.slice(0, 24).map((m: any) => ({
          id: m.id,
          title: m.title,
          original_language: m.original_language || "en",
          release_date: m.release_date || "",
          vote_average: m.vote_average || 0.0,
          overview: m.overview || "No plot overview provided.",
          poster_path: m.poster_path 
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500",
          genre_ids: m.genre_ids || [],
          popularity: m.popularity || 0
        }));

        return {
          movies: moviesList,
          isMock: false
        };
      } catch (mixError) {
        console.warn("Failed to compose parallel IMDb feed mix, sliding back to Discovery endpoint...", mixError);
      }
    }

    // 2. DISCOVER & FILTRATION ENGINE (Standard parameter builds)
    let finalUrl = "";
    const params = new URLSearchParams();

    params.append("api_key", apiKey.trim());

    if (hasSearchQuery) {
      // Use Live TMDB Search API (requires query string)
      finalUrl = "https://api.themoviedb.org/3/search/movie";
      params.append("query", config.searchQuery!.trim());
      // Handle adult filtering for search as well
      params.append("include_adult", config.mood === "adult" ? "true" : "false");
    } else {
      // Use premium TMDB Discover Service
      finalUrl = "https://api.themoviedb.org/3/discover/movie";
      params.append("sort_by", config.sortBy);
      
      // Strict thresholds to avoid obscure movies; lower requirements for Bollywood releases
      if (config.industry === "hi") {
        params.append("vote_count.gte", "15");
      } else if (config.sortBy === "vote_average.desc") {
        params.append("vote_count.gte", "1000"); // Standard high-rated criteria
      } else {
        params.append("vote_count.gte", "100"); // General baseline
      }

      // Adult content parameter
      params.append("include_adult", config.mood === "adult" ? "true" : "false");
      
      // Bollywood and Hollywood Origin Specifications
      if (config.industry === "hi") {
        params.append("with_original_language", "hi");
        params.append("with_origin_country", "IN"); // Bollywood combination
      } else if (config.industry === "en") {
        params.append("with_original_language", "en");
        params.append("with_origin_country", "US"); // Hollywood combination
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
        if (config.mood === "adult") {
          const genres = [10749, 18, 53]; // Romance, Drama, Thriller
          params.append("with_genres", genres.join("|"));
          params.append("with_keywords", "9748|254884|12241|12242|170707"); // Eroticism, Erotic Film, Nudity (female & male), Sensual
          params.append("without_genres", "27,16,14,10751"); // Explicitly block Horror, Animation, Fantasy, Family
        } else {
          const genres = mapMoodToGenres(config.mood);
          params.append("with_genres", genres.join("|")); // Use vertical bar/pipe separated format for logical OR matching!
        }
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
          if (config.mood === "adult") {
            // Sexually explicit client-side search check: Must match Romance, Drama, or Thriller, with NO Horror
            const hasAdultGenre = mGenreIds.some((gId: number) => genres.includes(gId));
            const hasHorror = mGenreIds.includes(27);
            return hasAdultGenre && !hasHorror;
          }
          return mGenreIds.some((gId: number) => genres.includes(gId));
        });
      }
    }

    // Convert and slice to exactly the top 24 movies
    const moviesList: Movie[] = results.slice(0, 24).map((m: any) => ({
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
    console.info("Live TMDB Gateway fetch info, falling back to mock movie grid.");
    return fetchFilteredMovies("MOCK", config);
  }
}

/**
 * Fetches premium spotlight/featured movies directly from TMDB, using ID registries, with full metadata fallback.
 */
export async function fetchSpotlightMovies(apiKey: string): Promise<SpotlightItem[]> {
  const isKeyValid = isValidApiKey(apiKey);
  
  const fallbackSpotlights: SpotlightItem[] = [
    {
      id: 157336, // Interstellar
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
      id: 579974, // RRR
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
      id: 19404, // Dilwale Dulhania Le Jayenge
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

  if (!isKeyValid) {
    return fallbackSpotlights;
  }

  try {
    const ids = [157336, 579974, 19404];
    const moods = ["thoughtful", "adrenaline", "feelgood"];
    const moodNames = ["Drama & Sci-Fi", "Action & Thriller", "Romance & Feel-Good"];
    const quotes = [
      "Mankind was born on Earth. It was never meant to die here.",
      "Fire and Water collide to forge an unbreakable bond.",
      "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain."
    ];

    const results: SpotlightItem[] = [];

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey.trim()}`;
      const response = await fetch(url);
      if (response.ok) {
        const m = await response.json();
        // TMDB returns backdrop_path; format as standard w1280 image URL
        const bgUrl = m.backdrop_path 
          ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
          : fallbackSpotlights[i].backdropUrl;
        
        results.push({
          id: m.id,
          title: m.title || fallbackSpotlights[i].title,
          year: m.release_date ? new Date(m.release_date).getFullYear().toString() : fallbackSpotlights[i].year,
          rating: m.vote_average || fallbackSpotlights[i].rating,
          moodId: moods[i],
          moodName: moodNames[i],
          quote: m.tagline || quotes[i],
          tagline: m.tagline || m.overview || fallbackSpotlights[i].tagline,
          backdropUrl: bgUrl,
          industry: m.original_language === "hi" ? "hi" : "en",
          genreIds: m.genres ? m.genres.map((g: any) => g.id) : fallbackSpotlights[i].genreIds,
          overview: m.overview || fallbackSpotlights[i].overview
        });
      } else {
        results.push(fallbackSpotlights[i]);
      }
    }
    return results;
  } catch (error) {
    console.info("Failed to fetch spotlight movies from TMDB, using fallback spotlights.");
    return fallbackSpotlights;
  }
}

/**
 * Fetches reviews from TMDB API or falls back to custom high-fidelity reviews
 */
export async function getMovieReviews(apiKey: string, movieId: number, movieTitle: string): Promise<Review[]> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    if (LOCAL_FALLBACK_REVIEWS[movieId]) {
      return LOCAL_FALLBACK_REVIEWS[movieId];
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
    console.info(`Live TMDB Reviews Fetch Info or Fallback for Movie ID ${movieId}.`);
    return [
      {
        author: "CineCritique",
        content: `Could not reach TMDB reviews servers directly. However, ${movieTitle} is highly regarded for its beautiful dialogue and emotional depth.`
      }
    ];
  }
}

export interface LandingFeeds {
  bollywood: Movie[];
  hollywood: Movie[];
  adult18: Movie[];
  highestRatedAction: Movie[];
  isMock: boolean;
}

/**
 * Dynamic landing feeds for Bollywood, Hollywood, 18+ adult, and Highest Rated Action using Discovery engine
 */
export async function fetchLandingFeeds(apiKey: string): Promise<LandingFeeds> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    const mockMovies = [...LOCAL_FALLBACK_MOVIES];
    return {
      bollywood: mockMovies.filter(m => m.original_language === "hi"),
      hollywood: mockMovies.filter(m => m.original_language === "en"),
      adult18: mockMovies.filter(m => [501, 502, 503, 506].includes(m.id)),
      highestRatedAction: mockMovies.filter(m => m.genre_ids.includes(28)),
      isMock: true
    };
  }

  // Pure discovery engine endpoints as requested by the user
  const bollywoodUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.trim()}&with_original_language=hi&with_origin_country=IN&sort_by=popularity.desc`;
  const hollywoodUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.trim()}&with_original_language=en&with_origin_country=US&sort_by=popularity.desc`;
  const adult18Url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.trim()}&include_adult=true&sort_by=popularity.desc`;
  const highestRatedActionUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey.trim()}&with_genres=28&sort_by=vote_average.desc&vote_count.gte=100`;

  try {
    const [bollyRes, hollyRes, adultRes, actionRes] = await Promise.all([
      fetch(bollywoodUrl).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
      fetch(hollywoodUrl).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
      fetch(adult18Url).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
      fetch(highestRatedActionUrl).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
    ]);

    const mapper = (results: any[]) => (results || []).slice(0, 16).map((m: any) => ({
      id: m.id,
      title: m.title || "Untitled",
      original_language: m.original_language || "en",
      release_date: m.release_date || "",
      vote_average: m.vote_average || 0.0,
      overview: m.overview || "No plot overview provided.",
      poster_path: m.poster_path 
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500",
      genre_ids: m.genre_ids || [],
      popularity: m.popularity || 0
    }));

    const rawAdult = mapper(adultRes.results || []);
    // Filter only sexually explicit/erotic items, ensuring no horror, family, cartoon, or fantasy elements
    const adult18 = rawAdult.filter(m => {
      const badGenres = [27, 16, 14, 10751]; // Horror, Animation, Fantasy, Family
      const hasBadGenre = m.genre_ids && m.genre_ids.some(g => badGenres.includes(g));
      return !hasBadGenre;
    });

    const bollywoodList = mapper(bollyRes.results || []);
    const hollywoodList = mapper(hollyRes.results || []);
    const actionList = mapper(actionRes.results || []);

    if (bollywoodList.length === 0 && hollywoodList.length === 0 && actionList.length === 0) {
      console.warn("All live landing feeds are empty, falling back to mock catalog.");
      return fetchLandingFeeds("MOCK");
    }

    return {
      bollywood: bollywoodList,
      hollywood: hollywoodList,
      adult18: adult18.length > 0 ? adult18 : rawAdult,
      highestRatedAction: actionList,
      isMock: false
    };

  } catch (error) {
    console.info("Failed to load landing feeds from TMDB, using local fallback catalog.");
    const mockMovies = [...LOCAL_FALLBACK_MOVIES];
    return {
      bollywood: mockMovies.filter(m => m.original_language === "hi"),
      hollywood: mockMovies.filter(m => m.original_language === "en"),
      adult18: mockMovies.filter(m => [501, 502, 503, 506].includes(m.id)),
      highestRatedAction: mockMovies.filter(m => m.genre_ids.includes(28)),
      isMock: true
    };
  }
}
