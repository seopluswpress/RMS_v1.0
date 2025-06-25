import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import "../custom.css";



function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar-custom">
        <Link className="navbar-title" to="/">
        <img src="/assets/images/logo.png" alt="RMS Logo" style={{ height: '72px', verticalAlign: 'middle', marginTop: '-12px', marginBottom: '-12px' }} />
      </Link>
        
      <div className="navbar-btn-group">
        <SignedOut>
          {location.pathname !== '/signin' && (
            <Link className="navbar-btn" to="/signin">Sign In</Link>
          )}
          {location.pathname !== '/signup' && (
            <Link className="navbar-btn" to="/signup">Sign Up</Link>
          )}
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <button className="navbar-btn" style={{ color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Sign Out</button>
          </SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
