import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MdLocationOn, MdBuild, MdBolt, MdLockOutline, MdCloudOff, MdArrowForward,
} from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import { TOOLS, CATEGORIES, TOOLS_BY_SLUG } from '../tools/registry';
import AdSlot from '../components/AdSlot';
import './Home.css';

// Slugs of a few high-value tools to feature on the landing page.
const POPULAR_SLUGS = [
  'random-password-generator',
  'random-uuid-generator',
  'base64-encoder',
  'json-prettifier',
  'lorem-ipsum-generator',
  'md5-hash-calculator',
];

function Home() {
  useSEO({
    title: 'Testovo — Free Online Tools for Developers & Testers',
    description: 'Testovo is a free collection of browser-based tools for developers and testers: random data generators, converters, encoders/decoders, minifiers, hash calculators, and text utilities. No signup, nothing uploaded.',
    rawTitle: true,
  });

  const popular = useMemo(
    () => POPULAR_SLUGS.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean),
    []
  );

  const countsByCategory = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) map[cat] = 0;
    for (const t of TOOLS) map[t.category] = (map[t.category] || 0) + 1;
    return map;
  }, []);



  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">
          Free Online Tools for <span className="hero-accent">Developers &amp; Testers</span>
        </h1>
        <p className="hero-subtitle">
          Testovo brings together {TOOLS.length}+ fast, privacy-friendly utilities — generators,
          converters, encoders, hash calculators, and text tools. No signup. Nothing uploaded.
          Everything runs right in your browser.
        </p>
        <div className="hero-cta">
          <Link to="/tools" className="btn btn-primary"><MdBuild /> Browse All Tools</Link>
          <Link to="/temp-address" className="btn btn-secondary"><MdLocationOn /> Address Generator</Link>
        </div>
      </section>

      {/* Popular tools */}
      <section className="home-section">
        <h2 className="home-h2">Popular Tools</h2>
        <div className="home-grid">
          {/* Featured: Temp Address (lives outside the tools registry) */}
          <Link to="/temp-address" className="home-card featured">
            <span className="home-card-badge">Featured</span>
            <span className="home-card-name">Random Address Generator</span>
            <span className="home-card-desc">Generate fake addresses for any city, export as JSON or SQL.</span>
          </Link>
          {popular.map((t) => (
            <Link key={t.slug} to={`/tools/${t.slug}`} className="home-card">
              <span className="home-card-name">{t.name}</span>
              <span className="home-card-desc">{t.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mid-content ad */}
      <section className="home-section">
        <AdSlot label="Advertisement" />
      </section>

      {/* Categories */}
      <section className="home-section">
        <h2 className="home-h2">Browse by Category</h2>
        <div className="home-cats">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/tools?category=${encodeURIComponent(cat)}`} className="home-cat">
              <span className="home-cat-name">{cat}</span>
              <span className="home-cat-count">{countsByCategory[cat]} tools</span>
              <MdArrowForward className="home-cat-arrow" />
            </Link>
          ))}
        </div>
        <div className="home-allcta">
          <Link to="/tools" className="btn btn-primary"><MdBuild /> See All Tools</Link>
        </div>
      </section>

      {/* Why Testovo */}
      <section className="home-section">
        <h2 className="home-h2">Why Testovo?</h2>
        <div className="home-why">
          <div className="why-item">
            <MdBolt className="why-icon" />
            <h3>Instant &amp; free</h3>
            <p>No signup, no limits, no cost. Open a tool and use it immediately.</p>
          </div>
          <div className="why-item">
            <MdCloudOff className="why-icon" />
            <h3>Runs in your browser</h3>
            <p>Every tool works locally. Your input is never uploaded to a server.</p>
          </div>
          <div className="why-item">
            <MdLockOutline className="why-icon" />
            <h3>Privacy-friendly</h3>
            <p>Nothing you type is logged or stored. Close the tab and it's gone.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
