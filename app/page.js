'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar     from './components/Navbar';
import Hero       from './components/Hero';
import MovieCard  from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { fetchMovies, searchMovies, fetchGenres } from './lib/tmdb';

const ThreeBackground = dynamic(() => import('./components/ThreeBackground'), { ssr: false });

const CATS = [
  { id: 'trending',    label: 'Trending'    },
  { id: 'popular',     label: 'Popular'     },
  { id: 'top_rated',   label: 'Top Rated'   },
  { id: 'upcoming',    label: 'Upcoming'    },
  { id: 'now_playing', label: 'Now Playing' },
];

export default function Page() {
  const [theme,       setTheme]       = useState('dark');
  const [genres,      setGenres]      = useState({});
  const [movies,      setMovies]      = useState([]);
  const [featured,    setFeatured]    = useState(null);
  const [searchResult,setSearchResult]= useState([]);
  const [category,    setCategory]    = useState('trending');
  const [query,       setQuery]       = useState('');
  const [isSearch,    setIsSearch]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [selected,    setSelected]    = useState(null);

  const searchTimer = useRef(null);
  const gridRef     = useRef(null);

  /* Theme init */
  useEffect(() => {
    const saved = localStorage.getItem('cs-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  /* Genres */
  useEffect(() => {
    fetchGenres().then(d => {
      const map = {};
      d.genres?.forEach(g => { map[g.id] = g.name; });
      setGenres(map);
    }).catch(console.error);
  }, []);

  /* Load category */
  const loadCategory = useCallback(async (cat, pg) => {
    setLoading(true);
    try {
      const d = await fetchMovies(cat, pg);
      setMovies(d.results || []);
      setTotalPages(Math.min(d.total_pages || 1, 20));
      if (pg === 1 && d.results?.length) {
        setFeatured(d.results.find(m => m.backdrop_path) || d.results[0]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isSearch) loadCategory(category, page);
  }, [category, page, isSearch, loadCategory]);

  /* Search */
  const handleQuery = useCallback(val => {
    setQuery(val);
    clearTimeout(searchTimer.current);
    if (!val.trim()) { setIsSearch(false); setSearchResult([]); return; }
    setIsSearch(true);
    searchTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const d = await searchMovies(val);
        setSearchResult(d.results || []);
        setTotalPages(Math.min(d.total_pages || 1, 20));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 420);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cs-theme', next);
  };

  const changeCategory = cat => { setCategory(cat); setPage(1); setIsSearch(false); setQuery(''); };

  const changePage = pg => {
    setPage(pg);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pageRange = () => {
    const arr = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) arr.push(i); }
    else {
      arr.push(1);
      if (page > 3) arr.push('…');
      for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) arr.push(i);
      if (page < totalPages - 2) arr.push('…');
      arr.push(totalPages);
    }
    return arr;
  };

  const display = isSearch ? searchResult : movies;

  return (
    <>
      <ThreeBackground theme={theme} />

      <div className="app-wrapper">
        <Navbar theme={theme} onToggleTheme={toggleTheme} query={query} onQuery={handleQuery} />

        {!isSearch && page === 1 && (
          <Hero movie={featured} genres={genres} onOpen={setSelected} />
        )}

        <main className="main" style={{ paddingTop: (isSearch || page > 1) ? 90 : 48 }}>
          <div className="section-header" ref={gridRef}>
            <div>
              <h2 className="section-title">
                {isSearch ? 'Search Results' : CATS.find(c => c.id === category)?.label}
              </h2>
              <p className="section-sub">
                {loading
                  ? 'Loading…'
                  : isSearch
                    ? `${searchResult.length} result${searchResult.length !== 1 ? 's' : ''} for "${query}"`
                    : `Page ${page} of ${totalPages}`}
              </p>
            </div>
            {!isSearch && (
              <div className="cat-tabs">
                {CATS.map(c => (
                  <button
                    key={c.id}
                    className={`cat-tab${category === c.id ? ' active' : ''}`}
                    onClick={() => changeCategory(c.id)}
                  >{c.label}</button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div className="state-center">
              <div className="spinner" />
              <p style={{ color:'var(--text3)', fontSize:13 }}>Fetching films…</p>
            </div>
          )}

          {!loading && display.length === 0 && (
            <div className="state-center">
              <span className="state-icon">🎬</span>
              <h3 className="state-title">No Movies Found</h3>
              <p className="state-sub">
                {isSearch
                  ? `Nothing matched "${query}". Try a different title.`
                  : 'Add your TMDB API key to .env.local to load movies.'}
              </p>
            </div>
          )}

          {!loading && display.length > 0 && (
            <div className="movies-grid">
              {display.map((m, i) => (
                <MovieCard key={`${m.id}-${i}`} movie={m} index={i} genres={genres} onOpen={setSelected} />
              ))}
            </div>
          )}

          {!loading && !isSearch && totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button className="pg-btn" onClick={() => changePage(page-1)} disabled={page===1} aria-label="Previous">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              {pageRange().map((p,i) =>
                p === '…'
                  ? <span key={`e${i}`} className="pg-ellipsis">…</span>
                  : <button key={p} className={`pg-btn${page===p?' active':''}`} onClick={() => changePage(p)} aria-current={page===p?'page':undefined}>{p}</button>
              )}
              <button className="pg-btn" onClick={() => changePage(page+1)} disabled={page===totalPages} aria-label="Next">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </nav>
          )}
        </main>

        <footer className="footer">
          <p>
            <strong style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold)', letterSpacing:'0.1em' }}>CINESEARCH</strong>
            {' '}· Powered by{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>
            {' '}· Built with Next.js 16, GSAP &amp; Three.js
          </p>
        </footer>
      </div>

      {selected && <MovieModal movie={selected} genres={genres} onClose={() => setSelected(null)} />}
    </>
  );
}
