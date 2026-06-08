import { Movie, Review, FilterConfig, SpotlightItem, countActiveFilters } from "./types";

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

function getAuthOptions(apiKey: string, url: string): { url: string, options: any } {
  const token = apiKey.trim();
  if (token.length > 50) {
    // Looks like a v4 Read Access Token
    return {
      url,
      options: {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    };
  } else {
    // Looks like a v3 API Key
    const separator = url.includes('?') ? '&' : '?';
    return {
      url: `${url}${separator}api_key=${token}`,
      options: {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    };
  }
}

export function isValidApiKey(key: string): boolean {
  if (!key) return false;
  const tidied = key.trim();
  if (tidied === "" || tidied.includes("PASTE_YOUR_TMDB_API_KEY_HERE") || tidied.includes("MY_") || tidied.length < 15) {
    return false;
  }
  return true;
}

/**
 * Fetches filtered results from TMDB
 */
export async function fetchFilteredMovies(apiKey: string, config: FilterConfig): Promise<{ movies: Movie[] }> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    throw new Error("Invalid TMDB API key");
  }

  const hasSearchQuery = config.searchQuery && config.searchQuery.trim() !== "";
  const activeCount = countActiveFilters(config);
  const isDefaultOverview = activeCount === 0 && !hasSearchQuery;

  // 1. HOME SCREEN MIX: When no filters are selected, pull & interleave standard trending/imdb feeds
  if (isDefaultOverview) {
    const urls = [
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`
    ];
    const responses = await Promise.all(urls.map(u => {
      const auth = getAuthOptions(apiKey, u);
      return fetch(auth.url, auth.options).then(res => res.ok ? res.json() : null);
    }));

    const topRated = responses[0]?.results || [];
    const popular = responses[1]?.results || [];
    const nowPlaying = responses[2]?.results || [];

    // Interleave feeds
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

    return { movies: moviesList };
  }

  // 2. DISCOVER & FILTRATION ENGINE
  let finalUrl = "";
  const params = new URLSearchParams();

  params.append("api_key", apiKey.trim());

  if (hasSearchQuery) {
    finalUrl = "https://api.themoviedb.org/3/search/movie";
    params.append("query", config.searchQuery!.trim());
    params.append("include_adult", config.mood === "adult" ? "true" : "false");
  } else {
    finalUrl = "https://api.themoviedb.org/3/discover/movie";
    params.append("sort_by", config.sortBy);

    if (config.industry === "hi") {
      params.append("vote_count.gte", "15");
    } else if (config.sortBy === "vote_average.desc") {
      params.append("vote_count.gte", "1000");
    } else {
      params.append("vote_count.gte", "100");
    }

    params.append("include_adult", config.mood === "adult" ? "true" : "false");

    if (config.industry === "hi") {
      params.append("with_original_language", "hi");
      params.append("with_origin_country", "IN");
    } else if (config.industry === "en") {
      params.append("with_original_language", "en");
      params.append("with_origin_country", "US");
    }

    params.append("vote_average.gte", config.minRating.toString());

    if (config.exactYear && config.exactYear !== "any") {
      params.append("primary_release_year", config.exactYear);
    } else {
      const currentYear = 2026;
      if (config.era === "all") {
        // no date constraints
      } else if (config.era === "latest") {
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

    if (config.mood) {
      if (config.mood === "adult") {
        const genres = [10749, 18, 53];
        params.append("with_genres", genres.join("|"));
        params.append("with_keywords", "9748|254884|12241|12242|170707");
        params.append("without_genres", "27,16,14,10751");
      } else {
        const genres = mapMoodToGenres(config.mood);
        params.append("with_genres", genres.join("|"));
      }
    }

    if (config.minRuntime > 0) {
      params.append("with_runtime.gte", config.minRuntime.toString());
    }
  }

  const auth = getAuthOptions(apiKey, `${finalUrl}?${params.toString()}`);
  const response = await fetch(auth.url, auth.options);
  if (!response.ok) {
    throw new Error(`TMDB HTTP failure: Status code ${response.status}`);
  }

  const data = await response.json();
  let results = data.results || [];

  if (hasSearchQuery) {
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
          const hasAdultGenre = mGenreIds.some((gId: number) => genres.includes(gId));
          const hasHorror = mGenreIds.includes(27);
          return hasAdultGenre && !hasHorror;
        }
        return mGenreIds.some((gId: number) => genres.includes(gId));
      });
    }
  }

  const moviesList: Movie[] = results.slice(0, 24).map((m: any) => ({
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

  return { movies: moviesList };
}

/**
 * Fetches premium spotlight/featured movies directly from TMDB
 */
/**
 * Fetches movie details and cast
 */
export async function getMovieDetails(apiKey: string, movieId: number): Promise<{ cast: any[], runtime: number, genres: any[] }> {
  const isKeyValid = isValidApiKey(apiKey);
  if (!isKeyValid) throw new Error("Invalid TMDB API key");

  const auth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`);
  const response = await fetch(auth.url, auth.options);

  if (!response.ok) {
    throw new Error(`TMDB Movie Details error ${response.status}`);
  }

  const data = await response.json();

  const cast = (data.credits?.cast || []).slice(0, 10).map((c: any) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
  }));

  return {
    cast,
    runtime: data.runtime || 0,
    genres: data.genres || []
  };
}

export async function fetchSpotlightMovies(apiKey: string): Promise<SpotlightItem[]> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    throw new Error("Invalid TMDB API key");
  }

  const results: SpotlightItem[] = [];
  const auth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/trending/movie/day`);
  const response = await fetch(auth.url, auth.options);
  if (response.ok) {
    const data = await response.json();
    const topMovies = data.results.slice(0, 3);
    const moods = ["trending", "popular", "hot"];
    const moodNames = ["Trending Now", "Popular Choice", "Hot Release"];

    for (let i = 0; i < topMovies.length; i++) {
      const m = topMovies[i];
      const bgUrl = m.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
        : "";

      results.push({
        id: m.id,
        title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear().toString() : "",
        rating: m.vote_average,
        moodId: moods[i],
        moodName: moodNames[i],
        quote: m.overview.length > 80 ? `${m.overview.substring(0, 80)}...` : m.overview,
        tagline: m.overview,
        backdropUrl: bgUrl,
        industry: m.original_language === "hi" ? "hi" : "en",
        genreIds: m.genre_ids || [],
        overview: m.overview
      });
    }
  }

  if (results.length === 0) {
      throw new Error("Failed to fetch spotlight movies from TMDB");
  }

  return results;
}

/**
 * Fetches reviews from TMDB API
 */
export async function getMovieReviews(apiKey: string, movieId: number, movieTitle: string): Promise<Review[]> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    throw new Error("Invalid TMDB API key");
  }

  const auth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/movie/${movieId}/reviews`);
  const response = await fetch(auth.url, auth.options);
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
}

export interface LandingFeeds {
  featured: Movie[];
  bollywood: Movie[];
  hollywood: Movie[];
  adult18: Movie[];
  highestRatedAction: Movie[];
  isMock?: boolean;
}

/**
 * Dynamic landing feeds for Featured, Bollywood, Hollywood, 18+ adult, and Highest Rated Action using Discovery engine
 */
export async function fetchLandingFeeds(apiKey: string): Promise<LandingFeeds> {
  const isKeyValid = isValidApiKey(apiKey);

  if (!isKeyValid) {
    throw new Error("Invalid TMDB API key");
  }

  // Discovery engine endpoints
  const featuredAuth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&vote_count.gte=1000`);
  const bollywoodAuth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&with_origin_country=IN&sort_by=popularity.desc`);
  const hollywoodAuth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_origin_country=US&sort_by=popularity.desc`);
  const adult18Auth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/discover/movie?include_adult=true&sort_by=popularity.desc&with_genres=10749|18|53&with_keywords=9748|254884|12241|12242|170707&without_genres=27,16,14,10751`);
  const actionAuth = getAuthOptions(apiKey, `https://api.themoviedb.org/3/discover/movie?with_genres=28&sort_by=vote_average.desc&vote_count.gte=100`);

  const [featuredRes, bollyRes, hollyRes, adultRes, actionRes] = await Promise.all([
    fetch(featuredAuth.url, featuredAuth.options).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
    fetch(bollywoodAuth.url, bollywoodAuth.options).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
    fetch(hollywoodAuth.url, hollywoodAuth.options).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
    fetch(adult18Auth.url, adult18Auth.options).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
    fetch(actionAuth.url, actionAuth.options).then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
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
  const adult18 = rawAdult.filter(m => {
    const badGenres = [27, 16, 14, 10751];
    const hasBadGenre = m.genre_ids && m.genre_ids.some(g => badGenres.includes(g));
    return !hasBadGenre;
  });

  const featuredList = mapper(featuredRes.results || []);
  const bollywoodList = mapper(bollyRes.results || []);
  const hollywoodList = mapper(hollyRes.results || []);
  const actionList = mapper(actionRes.results || []);

  if (featuredList.length === 0 && bollywoodList.length === 0 && hollywoodList.length === 0 && actionList.length === 0) {
    throw new Error("All live landing feeds are empty.");
  }

  return {
    featured: featuredList,
    bollywood: bollywoodList,
    hollywood: hollywoodList,
    adult18: adult18.length > 0 ? adult18 : rawAdult,
    highestRatedAction: actionList,
  };
}
