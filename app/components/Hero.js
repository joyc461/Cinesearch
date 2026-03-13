'use client';
import { useEffect, useRef } from 'react';
import { IMG } from '../lib/tmdb';

function Stars({ rating }) {
  const filled = Math.round(rating / 2);
  return (
    <span style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= filled ? 'var(--gold)' : 'none'}
          stroke="var(--gold)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

export default function Hero({ movie, genres, onOpen }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!movie || !contentRef.current) return;
    (async () => {
      const { default: gsap } = await import('gsap');
      gsap.fromTo(
        [...contentRef.current.children],
        { opacity: 0, x: -48 },
        { opacity: 1, x: 0, stagger: 0.09, duration: 0.85, ease: 'power3.out', delay: 0.55 }
      );
    })();
  }, [movie]);

  if (!movie) return null;

  const year   = movie.release_date?.slice(0, 4) ?? '';
  const rating = (Math.round(movie.vote_average * 10) / 10).toFixed(1);
  const gNames = (movie.genre_ids || []).slice(0,3).map(id => genres[id]).filter(Boolean);

  return (
    <section className="hero">
      <div className="hero-bg">
        {movie.backdrop_path
          ? <img src={`${IMG}/original${movie.backdrop_path}`} alt={movie.title} />
          : <div style={{ width:'100%', height:'100%', background:'var(--bg2)' }} />
        }
      </div>
      <div className="hero-scrim" />
      <div className="hero-content" ref={contentRef}>
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-bar" />
          <span>Featured This Week</span>
        </div>
        <h1 className="hero-title">{movie.title}</h1>
        <div className="hero-meta">
          <span className="rating">★ {rating}</span>
          {year && <span style={{ color:'var(--text2)', fontSize:13 }}>{year}</span>}
          <Stars rating={movie.vote_average} />
          {gNames.map(g => <span key={g} className="genre-pill">{g}</span>)}
        </div>
        <p className="hero-overview">{movie.overview}</p>
        <button className="hero-cta" onClick={() => onOpen(movie)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="m5 3 14 9-14 9V3z"/>
          </svg>
          View Details
        </button>
      </div>
    </section>
  );
}
