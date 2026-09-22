import React, { useEffect, useRef } from 'react';
import './AdSlot.css';

/**
 * AdSlot — a network-agnostic ad placeholder.
 *
 * HOW IT WORKS NOW (pre-launch):
 *   - Renders a labeled, bordered placeholder box so the layout reserves space
 *     for ads without loading any ad network. Nothing is fetched or tracked.
 *
 * HOW TO GO LIVE LATER (after you buy a domain + get approved):
 *   1. Google AdSense:
 *      - Add the AdSense loader script ONCE in index.html <head>:
 *        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossorigin="anonymous"></script>
 *      - Set AD_CLIENT below to your "ca-pub-XXXXXXXX" value.
 *      - For each slot, pass a `slot="1234567890"` prop (the Ad unit ID from AdSense).
 *      - Flip AD_ENABLED to true. Every <AdSlot> on the site activates automatically.
 *   2. Any other network (Adsterra/Ezoic/etc.):
 *      - Replace the ins/adsbygoogle block below with that network's snippet.
 *
 * Until AD_ENABLED is true, only the placeholder shows — safe to ship to prod.
 */

// ---- Config (single source of truth) ----
const AD_ENABLED = false;                 // flip to true once approved + script added
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // your AdSense publisher ID (replace later)

function AdSlot({ slot = '', format = 'auto', label = 'Advertisement', className = '', style = {} }) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!AD_ENABLED) return;
    try {
      // Ask AdSense to fill this slot once it's mounted.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ad blockers or missing script — fail silently, never break the page.
      // eslint-disable-next-line no-console
      console.warn('AdSlot: ad push skipped', err?.message || err);
    }
  }, []);

  // Live ad markup (only rendered once enabled).
  if (AD_ENABLED) {
    return (
      <div className={`ad-slot ${className}`} style={style}>
        <span className="ad-slot-label">{label}</span>
        <ins
          ref={insRef}
          className="adsbygoogle ad-slot-ins"
          style={{ display: 'block' }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Pre-launch placeholder.
  return (
    <div className={`ad-slot ad-slot--placeholder ${className}`} style={style} aria-hidden="true">
      <span className="ad-slot-label">{label}</span>
      <span className="ad-slot-hint">Ad space</span>
    </div>
  );
}

export default AdSlot;
