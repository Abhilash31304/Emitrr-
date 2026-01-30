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
          title="Undo"
        >
          ↩ Undo
        </button>
        <button 
          className="controls__btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          ↪ Redo
        </button>
      </div>
      
      <div className="controls__group">
        <button 
          className="controls__btn controls__btn--primary"
          onClick={onSave}
          title="Save workflow"
        >
          💾 Save
        </button>
      </div>
    </div>
  );
};

export default Controls;
