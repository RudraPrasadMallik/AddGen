import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import { TOOLS, CATEGORIES } from '../tools/registry';
import AdSlot from '../components/AdSlot';
import './ToolsDirectory.css';

function ToolsDirectory() {
  useSEO({
    title: 'Free Online Developer Tools & Generators',
    description: 'A free collection of browser-based developer tools: generators, converters, minifiers, encoders/decoders, hash calculators, and text utilities. No signup, runs entirely in your browser.',
  });

  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  // Optional category filter from the URL (e.g. /tools?category=Converters).
  const categoryParam = searchParams.get('category');
  const activeCategory = CATEGORIES.includes(categoryParam) ? categoryParam : null;

  const visibleCategories = activeCategory ? [activeCategory] : CATEGORIES;

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = {};
    for (const cat of CATEGORIES) map[cat] = [];
    for (const t of TOOLS) {
      if (activeCategory && t.category !== activeCategory) continue;
      if (q && !(`${t.name} ${t.description}`.toLowerCase().includes(q))) continue;
      (map[t.category] = map[t.category] || []).push(t);
    }
    return map;
  }, [query, activeCategory]);

  const totalMatches = useMemo(
    () => Object.values(grouped).reduce((n, arr) => n + arr.length, 0),
    [grouped]
  );

  // The Random Address Generator is a rich standalone tool (not in the registry).
  // Show it as a featured entry when it matches the current search and no
  // specific category filter is active.
  const q = query.trim().toLowerCase();
  const showAddress = !activeCategory && (!q || 'random address generator fake address for any city'.includes(q));

  return (
    <main className="tools-dir">
      <div className="tools-dir-header">
        <h1>Free Online Developer Tools</h1>
        <p>
          A growing collection of fast, privacy-friendly tools that run entirely in your browser —
          no signup, nothing uploaded. Generators, converters, encoders, hashes, and text utilities.
        </p>
        <div className="tools-search">
          <MdSearch className="tools-search-icon" />
          <input
            type="text"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {totalMatches === 0 && !showAddress && (
        <p className="tools-empty">No tools match “{query}”.</p>
      )}

      {/* Top banner ad */}
      <AdSlot label="Advertisement" />

      {showAddress && (
        <section className="tools-cat">
          <h2 className="tools-cat-title">Featured</h2>
          <div className="tools-grid">
            <Link to="/temp-address" className="tool-card">
              <span className="tool-card-name">Random Address Generator</span>
              <span className="tool-card-desc">Generate fake addresses for any city and export as JSON or SQL.</span>
            </Link>
          </div>
        </section>
      )}

      {visibleCategories.map((cat) => (
        grouped[cat] && grouped[cat].length > 0 && (
          <section key={cat} className="tools-cat">
            <h2 className="tools-cat-title">{cat}</h2>
            <div className="tools-grid">
              {grouped[cat].map((t) => (
                <Link key={t.slug} to={`/tools/${t.slug}`} className="tool-card">
                  <span className="tool-card-name">{t.name}</span>
                  <span className="tool-card-desc">{t.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )
      ))}
    </main>
  );
}

export default ToolsDirectory;
