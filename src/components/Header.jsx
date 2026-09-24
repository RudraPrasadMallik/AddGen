import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdBuild } from 'react-icons/md';
import './Header.css';

function Header() {
  const location = useLocation();
  const onTools = location.pathname.startsWith('/tools');

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Testovo logo" className="logo-img" width="36" height="36" />
          <span className="logo-text">Test<span className="logo-accent">ovo</span></span>
        </Link>
        <nav className="header-nav">
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
