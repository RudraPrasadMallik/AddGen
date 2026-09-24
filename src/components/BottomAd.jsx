import React from 'react';
import { useLocation } from 'react-router-dom';
import AdSlot from './AdSlot';

// Routes where we do NOT show the bottom banner ad. AdSense (and good UX)
// discourage ads on thin/legal/utility pages.
const EXCLUDED_EXACT = ['/privacy-policy', '/terms', '/contact'];

function BottomAd() {
  const { pathname } = useLocation();
  if (EXCLUDED_EXACT.includes(pathname)) return null;

  return (
    <div className="bottom-ad-wrap">
      <AdSlot label="Advertisement" className="bottom-ad" />
    </div>
  );
}

export default BottomAd;
