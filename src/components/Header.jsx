import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdEmail, MdLocationOn, MdHome, MdVpnKey, MdLock, MdWebhook, MdCode } from 'react-icons/md';
import './Header.css';

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon-wrap">
            <span className="logo-nest">TN</span>
          </div>
          <span className="logo-text">Test<span className="logo-accent">Nest</span></span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <MdHome />
            <span>Home</span>
          </Link>
          <Link to="/temp-mail" className={`nav-link ${isActive('/temp-mail') ? 'active' : ''}`}>
            <MdEmail />
            <span>Temp Mail</span>
          </Link>
          <Link to="/temp-address" className={`nav-link ${isActive('/temp-address') ? 'active' : ''}`}>
            <MdLocationOn />
            <span>Temp Address</span>
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
