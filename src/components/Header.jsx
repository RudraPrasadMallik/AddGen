import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdLocationOn, MdBuild } from 'react-icons/md';
// Icons for disabled features (kept for easy re-enable):
// import { MdEmail, MdHome, MdVpnKey, MdLock, MdWebhook, MdCode } from 'react-icons/md';
import './Header.css';

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Testovo logo" className="logo-img" width="36" height="36" />
          <span className="logo-text">Test<span className="logo-accent">ovo</span></span>
        </Link>
        <nav className="header-nav">
          {/* Only the Temp Address feature is enabled for this phased release */}
          <Link to="/temp-address" className={`nav-link ${isActive('/temp-address') || isActive('/') ? 'active' : ''}`}>
            <MdLocationOn />
            <span>Temp Address</span>
          </Link>
          <Link to="/tools" className={`nav-link ${location.pathname.startsWith('/tools') ? 'active' : ''}`}>
            <MdBuild />
            <span>Tools</span>
          </Link>

          {/* --- Disabled for phased release ---
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <MdHome />
            <span>Home</span>
          </Link>
          <Link to="/temp-mail" className={`nav-link ${isActive('/temp-mail') ? 'active' : ''}`}>
            <MdEmail />
            <span>Temp Mail</span>
          </Link>
          <Link to="/pkce" className={`nav-link ${isActive('/pkce') ? 'active' : ''}`}>
            <MdVpnKey />
            <span>PKCE</span>
          </Link>
          <Link to="/jwt" className={`nav-link ${isActive('/jwt') ? 'active' : ''}`}>
            <MdLock />
            <span>JWT</span>
          </Link>
          <Link to="/webhook" className={`nav-link ${isActive('/webhook') ? 'active' : ''}`}>
            <MdWebhook />
            <span>Webhook</span>
          </Link>
          <Link to="/base64" className={`nav-link ${isActive('/base64') ? 'active' : ''}`}>
            <MdCode />
            <span>Base64</span>
          </Link>
          --- */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
