import { useEffect } from 'react';

// Brand name used in titles and OG site name.
const BRAND = 'AddrGen';
// Default document title used when a page does not provide its own.
const DEFAULT_TITLE = 'AddrGen — Random Address Generator | Free Fake Address & Phone Number';

function setMeta(selector, attr, value) {
  if (!value) return;
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Updates the document title and SEO meta tags (description, keywords,
 * Open Graph, and Twitter) for the current page.
 *
 * @param {object}  opts
 * @param {string}  opts.title        Page title (brand is appended automatically).
 * @param {string}  opts.description  Meta description.
 * @param {string} [opts.keywords]    Comma-separated keywords.
 * @param {boolean} [opts.rawTitle]   If true, use title as-is without the brand suffix.
 */
export function useSEO({ title, description, keywords, rawTitle = false }) {
  useEffect(() => {
    const fullTitle = title
      ? (rawTitle ? title : `${title} | ${BRAND}`)
      : DEFAULT_TITLE;

    // Title
    document.title = fullTitle;

    // Standard meta
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="keywords"]', 'content', keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [title, description, keywords, rawTitle]);
}
