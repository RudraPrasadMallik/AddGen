import { useEffect } from 'react';

// Brand suffix appended to page titles.
const BRAND = 'TestNest';
// Default document title used when a page does not provide its own.
const DEFAULT_TITLE = 'Random Address Generator | Free Fake Address & Phone Number Tool';

/**
 * Updates document title and meta description/OG tags for each page.
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | ${BRAND}` : DEFAULT_TITLE;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', `${title} | ${BRAND}`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);
}
