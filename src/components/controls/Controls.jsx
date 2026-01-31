import React, { useState, useEffect, useRef } from 'react';
import './Controls.css';

const HelpPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="help-popup-overlay">
      <div className="help-popup" ref={popupRef}>
        <div className="help-popup__header">
          <h3 className="help-popup__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Quick Start Guide
          </h3>
          <button className="help-popup__close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="help-popup__content">
          <div className="help-popup__item">
            <div className="help-popup__icon help-popup__icon--move">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="5 9 2 12 5 15"></polyline>
                <polyline points="9 5 12 2 15 5"></polyline>
                <polyline points="15 19 12 22 9 19"></polyline>
                <polyline points="19 9 22 12 19 15"></polyline>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
            </div>
            <div className="help-popup__text">
              <span className="help-popup__label">Drag nodes to move</span>
              <span className="help-popup__desc">Click and drag any node to reposition it</span>
            </div>
          </div>
          <div className="help-popup__item">
            <div className="help-popup__icon help-popup__icon--resize">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </div>
            <div className="help-popup__text">
              <span className="help-popup__label">Resize from corner</span>
              <span className="help-popup__desc">Drag the bottom-right corner to resize nodes</span>
            </div>
          </div>
          <div className="help-popup__item">
            <div className="help-popup__icon help-popup__icon--zoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <div className="help-popup__text">
              <span className="help-popup__label">Ctrl + Scroll to zoom</span>
              <span className="help-popup__desc">Hold Ctrl and scroll to zoom in/out</span>
            </div>
          </div>
          <div className="help-popup__item">
            <div className="help-popup__icon help-popup__icon--pan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
              </svg>
            </div>
            <div className="help-popup__text">
              <span className="help-popup__label">Click canvas to pan</span>
              <span className="help-popup__desc">Click and drag empty space to pan around</span>
            </div>
          </div>
        </div>
        <div className="help-popup__footer">
          <button className="help-popup__got-it" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

const Controls = ({ onSave, onUndo, onRedo, canUndo, canRedo }) => {
  const [showHelp, setShowHelp] = useState(false);
  const hasShownInitialHelp = useRef(false);

  // Show help popup on first load
  useEffect(() => {
    if (!hasShownInitialHelp.current) {
      const timer = setTimeout(() => {
        setShowHelp(true);
        hasShownInitialHelp.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div className="controls">
        <div className="controls__group">
          <button 
            className="controls__btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
            <span>Undo</span>
          </button>
          <button 
            className="controls__btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6"></path>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
            </svg>
            <span>Redo</span>
          </button>
        </div>
        
        <div className="controls__divider"></div>
        
        <button 
          className="controls__btn controls__btn--primary"
          onClick={onSave}
          title="Save workflow"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Save</span>
        </button>

        <div className="controls__divider"></div>

        <button 
          className="controls__btn controls__btn--help"
          onClick={() => setShowHelp(true)}
          title="Help"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Help</span>
        </button>
      </div>

      <HelpPopup isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

export default Controls;
