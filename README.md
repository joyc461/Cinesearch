# 🎬 CineSearch

A cinematic movie discovery app built with **Next.js 16**, **TMDB API**, **GSAP** animations, and **Three.js** backgrounds. Includes a full **dark / light theme** switcher.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 Dynamic Search | Debounced live search with instant results |
| 🎥 Categories | Trending, Popular, Top Rated, Upcoming, Now Playing |
| 🌟 Hero Section | Full-viewport featured movie with GSAP staggered reveal |
| 🃏 Movie Cards | Poster, rating, genre pills, overview — animated entrance |
| 🎞 Movie Modal | Full detail view with backdrop, stats, GSAP open/close |
| 🪐 Three.js BG | Floating stars, gold dust, rotating rings — reacts to mouse |
| 🌗 Theme Toggle | Smooth dark ↔ light transition with localStorage persistence |
| 📄 Pagination | Up to 20 pages per category |

---

## 🚀 Quick Start

### 1. Get a free TMDB API key
Sign up at [themoviedb.org](https://www.themoviedb.org/settings/api) → **API → Create → Developer**

### 2. Add it to `.env.local`
```
NEXT_PUBLIC_TMDB_API_KEY=your_key_here
```

### 3. Install & run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗 Project Structure

```
cinesearch/
├── app/
│   ├── components/
│   │   ├── ThreeBackground.js   # Three.js animated canvas
│   │   ├── Navbar.js            # Sticky nav + search + theme toggle
│   │   ├── Hero.js              # Featured movie hero
│   │   ├── MovieCard.js         # Grid card with scroll reveal
│   │   └── MovieModal.js        # Detail modal
│   ├── lib/
│   │   └── tmdb.js              # TMDB API helpers
│   ├── styles/
│   │   └── globals.css          # All styles (no Tailwind)
│   ├── layout.js
│   └── page.js                  # Main orchestrator
├── .env.local                   # ← Add your API key here
└── next.config.mjs
```

---

## 🎨 Design

- **Font**: Bebas Neue (display) + DM Sans (body)
- **Accent**: Cinematic gold `#f5c518` + film-reel red `#e8534b`
- **CSS**: Pure CSS variables, no Tailwind, no UI library
- **Animations**: GSAP for entrance/exit + IntersectionObserver card reveals
- **3D**: Three.js star field, gold dust particles, rotating torus rings
