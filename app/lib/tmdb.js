const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const BASE    = 'https://api.themoviedb.org/3';
export const IMG = 'https://image.tmdb.org/t/p';

async function get(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

export const ENDPOINTS = {
  trending:    '/trending/movie/week',
  popular:     '/movie/popular',
  top_rated:   '/movie/top_rated',
  upcoming:    '/movie/upcoming',
  now_playing: '/movie/now_playing',
};

export async function fetchMovies(category = 'trending', page = 1) {
  return get(ENDPOINTS[category] || ENDPOINTS.trending, { page });
}

export async function searchMovies(query, page = 1) {
  return get('/search/movie', { query, page, include_adult: false });
}

export async function fetchGenres() {
  return get('/genre/movie/list');
}
