import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';
import './LegalPages.css';

function NotFound() {
  useSEO({
    title: 'Page Not Found (404)',
    description: 'The page you are looking for could not be found on Testovo.',
  });

  return (
    <main className="content-page" style={{ textAlign: 'center' }}>
      <h1>404 — Page Not Found</h1>
      <p>
        Sorry, the page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <p style={{ marginTop: '1.2rem' }}>
        Head back to the <Link to="/">home page</Link> or browse{' '}
        <Link to="/tools">all tools</Link>.
      </p>
    </main>
  );
}

export default NotFound;
