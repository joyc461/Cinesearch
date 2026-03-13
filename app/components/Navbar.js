'use client';
import { useEffect, useRef, useState } from 'react';

export default function Navbar({ theme, onToggleTheme, query, onQuery }) {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import('gsap');
      gsap.fromTo(navRef.current,
        { y: -72, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)', delay: 0.15 }
      );
    })();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); onQuery(''); }}>
        <span className="nav-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
          </svg>
        </span>
        <span className="nav-logo-text">CineSearch</span>
      </a>

      <div className="nav-search">
        <span className="search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search movies, actors…"
          value={query}
          onChange={e => onQuery(e.target.value)}
          spellCheck={false}
        />
        {query && (
          <button className="clear-btn" onClick={() => onQuery('')} aria-label="Clear search">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <div className="theme-toggle">
        <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
        <button className="toggle-track" onClick={onToggleTheme} aria-label="Toggle theme" />
      </div>
    </nav>
  );
}
