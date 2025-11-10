import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

function Navbar({ user, onLogout, toggleSidebar, toggleAiChat }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    onLogout();
  };

  const handleAiChatClick = () => {
    if (toggleAiChat) {
      toggleAiChat();
    }
  };

  const handleShortcutIconClick = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: '/',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button onClick={toggleSidebar} className="sidebar-toggle" title="Toggle Sidebar">
            ☰
          </button>
        )}
        <Link to="/" className="navbar-brand">
          🎓 Unified Learning Lab
        </Link>
      </div>

      <ul className="navbar-nav">
        {/* Navigation links removed - use sidebar instead */}
      </ul>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="navbar-icon-group" aria-label="Quick actions">
              <button
                type="button"
                className="navbar-icon-btn keyboard-shortcuts-btn"
                title="Keyboard shortcuts (Shift + /)"
                aria-label="Keyboard shortcuts"
                onClick={handleShortcutIconClick}
              >
                ⌨️
              </button>
              <button
                className="navbar-icon-btn ai-assistant-btn"
                onClick={handleAiChatClick}
                title="Toggle AI Assistant"
                aria-label="Toggle AI assistant"
                type="button"
              >
                🤖
              </button>
              <button
                className="navbar-icon-btn theme-toggle-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                type="button"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-info" onClick={toggleUserDropdown}>
                <span className="user-icon">👤</span>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">{isUserDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isUserDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-icon">👤</div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { setIsUserDropdownOpen(false); navigate('/dashboard'); }} className="dropdown-item">
                    <span className="dropdown-icon">📊</span>
                    Dashboard
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
