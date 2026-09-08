import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/logo.svg" alt="AddrGen logo" className="footer-logo" width="26" height="26" />
          <span>AddrGen</span>
        </div>
        <p className="footer-text">
          Random addresses & phone numbers for testing and form validation.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
