import React, { useState, useRef, useEffect } from 'react';
import './NodeActions.css';

const NodeActions = ({ nodeId, nodeType, onAddNode, onDeleteNode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);
  const deleteTimeoutRef = useRef(null);

  const canAddChild = nodeType !== 'end';
  const canDelete = nodeType !== 'start';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Reset delete confirmation after delay
  useEffect(() => {
    if (confirmDelete) {
      deleteTimeoutRef.current = setTimeout(() => {
        setConfirmDelete(false);
      }, 2000);
    }
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, [confirmDelete]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleSelectNodeType = (type) => {
    onAddNode(nodeId, type);
    setShowMenu(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDeleteNode(nodeId);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="node-actions">
      {canAddChild && (
        <div className="node-actions__wrapper" ref={menuRef}>
          <button 
            className="node-actions__btn node-actions__btn--add"
            onClick={handleAddClick}
            title="Add step"
            aria-label="Add step"
            aria-expanded={showMenu}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          {showMenu && (
            <div className="node-actions__dropdown">
              <div className="node-actions__dropdown-arrow" />
              <div className="node-actions__dropdown-content">
                <div className="node-actions__dropdown-header">Add Step</div>
                
                <button 
                  className="node-actions__dropdown-item"
                  onClick={() => handleSelectNodeType('action')}
                >
                  <div className="node-actions__dropdown-icon node-actions__dropdown-icon--action">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div className="node-actions__dropdown-text">
                    <span className="node-actions__dropdown-title">Action</span>
                    <span className="node-actions__dropdown-desc">Execute a single task</span>
                  </div>
                </button>
                
                <button 
                  className="node-actions__dropdown-item"
                  onClick={() => handleSelectNodeType('branch')}
                >
                  <div className="node-actions__dropdown-icon node-actions__dropdown-icon--branch">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="18" r="3"></circle>
                      <circle cx="6" cy="6" r="3"></circle>
                      <path d="M6 21V9a9 9 0 0 0 9 9"></path>
                    </svg>
                  </div>
                  <div className="node-actions__dropdown-text">
                    <span className="node-actions__dropdown-title">Condition</span>
                    <span className="node-actions__dropdown-desc">Branch based on logic</span>
                  </div>
                </button>
                
                <button 
                  className="node-actions__dropdown-item"
                  onClick={() => handleSelectNodeType('end')}
                >
                  <div className="node-actions__dropdown-icon node-actions__dropdown-icon--end">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <rect x="8" y="8" width="8" height="8"></rect>
                    </svg>
                  </div>
                  <div className="node-actions__dropdown-text">
                    <span className="node-actions__dropdown-title">End</span>
                    <span className="node-actions__dropdown-desc">Terminate workflow</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {canDelete && (
        <button 
          className={`node-actions__btn node-actions__btn--delete ${confirmDelete ? 'node-actions__btn--confirm' : ''}`}
          onClick={handleDeleteClick}
          onMouseLeave={() => setConfirmDelete(false)}
          title={confirmDelete ? 'Click again to confirm' : 'Delete node'}
          aria-label={confirmDelete ? 'Confirm delete' : 'Delete node'}
        >
          {confirmDelete ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default NodeActions;
