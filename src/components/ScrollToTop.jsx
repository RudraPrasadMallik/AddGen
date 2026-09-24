import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls the window to the top whenever the route path changes.
// Without this, SPA navigation keeps the previous scroll position, which makes
// a newly opened page appear scrolled down (e.g. opening a tool from the footer).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;
