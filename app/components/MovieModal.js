'use client';
import { useEffect, useRef } from 'react';
import { IMG } from '../lib/tmdb';

export default function MovieModal({ movie, genres, onClose }) {
  const backdropRef = useRef(null);
  const boxRef      = useRef(null);

  useEffect(() => {
    if (!movie) return;
    document.body.style.overflow = 'hidden';
    (async () => {
      const { default: gsap } = await import('gsap');
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(boxRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' });
    })();
    return () => { document.body.style.overflow = ''; };
  }, [movie]);

  const handleClose = async () => {
    const { default: gsap } = await import('gsap');
    await gsap.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' });
    onClose();
  };

  if (!movie) return null;
  const year   = movie.release_date?.slice(0,4) ?? '—';
  const rating = (Math.round(movie.vote_average * 10) / 10).toFixed(1);
  const gNames = (movie.genre_ids || []).map(id => genres[id]).filter(Boolean);
  const votes  = movie.vote_count?.toLocaleString() ?? '—';
  const pop    = Math.round(movie.popularity);

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={e => e.target === backdropRef.current && handleClose()}
    >
      <div className="modal-box" ref={boxRef}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {movie.backdrop_path && (
          <div className="modal-backdrop-img">
            <img src={`${IMG}/w1280${movie.backdrop_path}`} alt={movie.title} />
          </div>
        )}

        <div className="modal-inner">
          {movie.poster_path && (
            <div className="modal-poster">
              <img src={`${IMG}/w342${movie.poster_path}`} alt={movie.title} />
            </div>
          )}
          <div className="modal-details">
            <h2 className="modal-title">{movie.title}</h2>
            <div className="modal-meta">
              <span className="rating" style={{ fontSize:13 }}>★ {rating}</span>
              <span style={{ color:'var(--text3)', fontSize:12 }}>{votes} votes</span>
              {year && <span style={{ color:'var(--text2)', fontSize:12 }}>{year}</span>}
            </div>
            {gNames.length > 0 && (
              <div className="modal-genres">
                {gNames.map(g => <span key={g} className="genre-pill">{g}</span>)}
              </div>
            )}
            <p className="modal-overview">{movie.overview || 'No description available.'}</p>
            <div className="modal-stats">
              {[
                { label:'Rating',     value:`${rating} / 10` },
                { label:'Year',       value: year },
                { label:'Popularity', value: pop },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
