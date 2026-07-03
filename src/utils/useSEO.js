import { useEffect } from 'react';

/**
 * Updates document title and meta description for each page
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | TestNest` : 'TestNest - Free Temp Mail, Address & Developer Tools';

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', `${title} | TestNest`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);
}
