import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">TN</div>
          <span>TestNest</span>
        </div>
        <p className="footer-text">
          Temporary data for testing and privacy. All data auto-expires.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
