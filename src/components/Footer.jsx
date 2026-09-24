import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-col footer-about">
          <div className="footer-brand">
            <img src="/logo.svg" alt="Testovo logo" className="footer-logo" width="26" height="26" />
            <span>Testovo</span>
          </div>
          <p className="footer-tagline">
            Free online tools and resources for developers and testers — generators, converters,
            encoders, hashes, and text utilities. No signup, nothing uploaded.
          </p>
        </div>

        {/* Product links */}
        <div className="footer-col">
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-links">
            <li><Link to="/temp-address">Address Generator</Link></li>
            <li><Link to="/tools">All Tools</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Popular tools */}
        <div className="footer-col">
          <h4 className="footer-heading">Popular Tools</h4>
          <ul className="footer-links">
            <li><Link to="/tools/random-password-generator">Password Generator</Link></li>
            <li><Link to="/tools/random-uuid-generator">UUID Generator</Link></li>
            <li><Link to="/tools/base64-encoder">Base64 Encoder</Link></li>
            <li><Link to="/tools/json-prettifier">JSON Prettifier</Link></li>
          </ul>
        </div>

        {/* Legal links */}
        <div className="footer-col">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Testovo. All rights reserved.</span>
        <span className="footer-disclaimer">All generated data is fictitious and for testing purposes only.</span>
      </div>
    </footer>
  );
}

export default Footer;
