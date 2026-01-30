import React from 'react';
import './Controls.css';

const Controls = ({ onSave, onUndo, onRedo, canUndo, canRedo }) => {
  return (
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
    </div>
  );
};

export default Controls;
