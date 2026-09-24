import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdLocationOn, MdBuild } from 'react-icons/md';
// Icons for disabled features (kept for easy re-enable):
// import { MdEmail, MdHome, MdVpnKey, MdLock, MdWebhook, MdCode } from 'react-icons/md';
import './Header.css';

function Header() {
  const location = useLocation();
  const path = location.pathname;

  const onTempAddress = path === '/' || path === '/temp-address';
  const onTools = path.startsWith('/tools');

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Testovo logo" className="logo-img" width="36" height="36" />
          <span className="logo-text">Test<span className="logo-accent">ovo</span></span>
        </Link>
        <nav className="header-nav">
          <Link to="/temp-address" className={`nav-link ${onTempAddress ? 'active' : ''}`}>
            <MdLocationOn />
            <span>Temp Address</span>
          </Link>
          <Link to="/tools" className={`nav-btn ${onTools ? 'active' : ''}`}>
            <MdBuild />
            <span>All Tools</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
