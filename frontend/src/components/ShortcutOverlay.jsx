import React from 'react';
import PropTypes from 'prop-types';
import './ShortcutOverlay.css';

function ShortcutOverlay({ isOpen, onClose, sections }) {
  if (!isOpen) {
    return null;
  }

  const handleInnerClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="shortcut-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcut reference"
      onClick={onClose}
    >
      <div className="shortcut-overlay-panel" onClick={handleInnerClick}>
        <header className="shortcut-overlay-header">
          <div>
            <h2>Keyboard Shortcuts</h2>
            <p>Speed up your workflow with these handy commands.</p>
          </div>
          <button
            type="button"
            className="shortcut-overlay-close"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
          >
            ×
          </button>
        </header>
        <div className="shortcut-overlay-body">
          {sections.map((section) => (
            <section key={section.id} className="shortcut-section">
              <h3 className="shortcut-section-title">{section.title}</h3>
              <ul className="shortcut-list">
                {section.shortcuts.map((shortcut) => (
                  <li key={shortcut.id} className="shortcut-item">
                    <div className="shortcut-keys" aria-hidden="true">
                      {shortcut.keys.map((key) => (
                        <kbd key={key}>{key}</kbd>
                      ))}
                    </div>
                    <div className="shortcut-description">
                      <p>{shortcut.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <footer className="shortcut-overlay-footer">
          <span className="shortcut-footer-hint">
            Press <kbd>Esc</kbd> to close
          </span>
        </footer>
      </div>
    </div>
  );
}

ShortcutOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      shortcuts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          keys: PropTypes.arrayOf(PropTypes.string).isRequired,
          description: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default ShortcutOverlay;
