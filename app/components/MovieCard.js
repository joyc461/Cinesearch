'use client';
import { useEffect, useRef, useState } from 'react';
import { IMG } from '../lib/tmdb';

function Stars({ rating }) {
  const filled = Math.round(rating / 2);
  return (
    <div className="card-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
          fill={i <= filled ? 'var(--gold)' : 'none'}
          stroke="var(--gold)" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function MovieCard({ movie, index, genres, onOpen }) {
  const cardRef = useRef(null);
  const [imgOk,  setImgOk]  = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const delay = (index % 10) * 55;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('visible'), delay);
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const year   = movie.release_date?.slice(0,4) ?? '';
  const rating = (Math.round(movie.vote_average * 10) / 10).toFixed(1);
  const gNames = (movie.genre_ids || []).slice(0,2).map(id => genres[id]).filter(Boolean);

  return (
    <article
      className="movie-card"
      ref={cardRef}
      onClick={() => onOpen(movie)}
      tabIndex={0}
      role="button"
      onKeyDown={e => e.key === 'Enter' && onOpen(movie)}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="card-poster">
        {!imgOk && !imgErr && <div className="skeleton" />}
        {movie.poster_path && !imgErr ? (
          <img
            src={`${IMG}/w500${movie.poster_path}`}
            alt={movie.title}
            onLoad={() => setImgOk(true)}
            onError={() => setImgErr(true)}
            style={{ opacity: imgOk ? 1 : 0, transition: 'opacity 0.4s' }}
          />
        ) : imgErr && (
          <div className="card-poster-fallback">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <path d="M7 2v20M17 2v20M2 12h20"/>
            </svg>
            <span>No Poster</span>
          </div>
        )}
        <div className="card-poster-overlay" />
        <div className="card-poster-rating">
          <span className="rating">★ {rating}</span>
        </div>
        <div className="card-poster-genres">
          {gNames.map(g => (
            <span key={g} className="genre-pill" style={{ fontSize:'9px', padding:'2px 7px' }}>{g}</span>
          ))}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        {year && <p className="card-year">{year}</p>}
        <Stars rating={movie.vote_average} />
        <p className="card-overview">{movie.overview || 'No description available.'}</p>
      </div>
    </article>
  );
}
