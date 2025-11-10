import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ user, className = '' }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const isAdmin = user && user.role === 'admin';
  const isCollapsed = className.includes('collapsed');

  return (
    <>
      <div
        className={`sidebar-overlay ${!isCollapsed ? 'active' : ''}`}
        onClick={() => {
          // Close sidebar on overlay click (mobile)
          const sidebarToggle = document.querySelector('.sidebar-toggle');
          if (sidebarToggle) sidebarToggle.click();
        }}
      />
      <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">📚 Learning Modules</h3>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Main</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
                <span className="sidebar-icon">📊</span>
                <span>Dashboard</span>
              </Link>
            </li>
            {isAdmin && (
              <li className="sidebar-menu-item">
                <Link to="/admin" className={`sidebar-link ${isActive('/admin')}`}>
                  <span className="sidebar-icon">🔧</span>
                  <span>Admin Panel</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Data Structures</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/binary-tree" className={`sidebar-link ${isActive('/binary-tree')}`}>
                <span className="sidebar-icon">🌳</span>
                <span>Binary Tree</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/bst" className={`sidebar-link ${isActive('/bst')}`}>
                <span className="sidebar-icon">🌲</span>
                <span>BST</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/stack" className={`sidebar-link ${isActive('/stack')}`}>
                <span className="sidebar-icon">📚</span>
                <span>Stack</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/queue" className={`sidebar-link ${isActive('/queue')}`}>
                <span className="sidebar-icon">🎫</span>
                <span>Queue</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/linked-list" className={`sidebar-link ${isActive('/linked-list')}`}>
                <span className="sidebar-icon">🔗</span>
                <span>Linked List</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/hash-table" className={`sidebar-link ${isActive('/hash-table')}`}>
                <span className="sidebar-icon">🗂️</span>
                <span>Hash Table</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/heap" className={`sidebar-link ${isActive('/heap')}`}>
                <span className="sidebar-icon">🔺</span>
                <span>Heap</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/trie" className={`sidebar-link ${isActive('/trie')}`}>
                <span className="sidebar-icon">🔤</span>
                <span>Trie</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/segment-tree" className={`sidebar-link ${isActive('/segment-tree')}`}>
                <span className="sidebar-icon">🌳</span>
                <span>Segment Tree</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/graph" className={`sidebar-link ${isActive('/graph')}`}>
                <span className="sidebar-icon">🌐</span>
                <span>Graph</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Algorithms</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/sorting" className={`sidebar-link ${isActive('/sorting')}`}>
                <span className="sidebar-icon">📊</span>
                <span>Sorting Algorithms</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/searching" className={`sidebar-link ${isActive('/searching')}`}>
                <span className="sidebar-icon">🔍</span>
                <span>Searching Algorithms</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dynamic-programming" className={`sidebar-link ${isActive('/dynamic-programming')}`}>
                <span className="sidebar-icon">🎯</span>
                <span>Dynamic Programming</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/greedy-algorithms" className={`sidebar-link ${isActive('/greedy-algorithms')}`}>
                <span className="sidebar-icon">💚</span>
                <span>Greedy Algorithms</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/boyer-moore" className={`sidebar-link ${isActive('/boyer-moore')}`}>
                <span className="sidebar-icon">🔤</span>
                <span>Boyer-Moore</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Tests</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Aptitude" className={`sidebar-link ${isActive('/aptitude/Aptitude')}`}>
                <span className="sidebar-icon">🧮</span>
                <span>Aptitude Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Coding" className={`sidebar-link ${isActive('/aptitude/Coding')}`}>
                <span className="sidebar-icon">💻</span>
                <span>Coding Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/DBMS" className={`sidebar-link ${isActive('/aptitude/DBMS')}`}>
                <span className="sidebar-icon">🗄️</span>
                <span>DBMS Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/OS" className={`sidebar-link ${isActive('/aptitude/OS')}`}>
                <span className="sidebar-icon">⚙️</span>
                <span>OS Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Networks" className={`sidebar-link ${isActive('/aptitude/Networks')}`}>
                <span className="sidebar-icon">🌐</span>
                <span>Networks Test</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Artificial Intelligence</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/cnn" className={`sidebar-link ${isActive('/cnn')}`}>
                <span className="sidebar-icon">🧠</span>
                <span>CNN Visualizer</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Skills</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/typing-speed" className={`sidebar-link ${isActive('/typing-speed')}`}>
                <span className="sidebar-icon">⌨️</span>
                <span>Typing Speed</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
    </>
  );
}

export default Sidebar;
