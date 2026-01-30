import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NodeActions } from '../node-actions';
import './DraggableNode.css';

const NODE_CONFIG = {
  start: {
    label: 'Start',
    description: 'Workflow begins here',
  },
  action: {
    label: 'Action',
    description: 'Execute a task',
  },
  branch: {
    label: 'Condition',
    description: 'Decision point',
  },
  end: {
    label: 'End',
    description: 'Workflow ends',
  },
};

const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;
const MAX_WIDTH = 500;
const MAX_HEIGHT = 300;

const DraggableNode = ({ 
  node, 
  position, 
  onEdit, 
  onDelete, 
  onAddChild,
  onPositionChange,
  onSizeChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  
  const config = NODE_CONFIG[node.type] || NODE_CONFIG.action;

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close add menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setShowAddMenu(false);
      }
    };
    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddMenu]);

  // Handle drag start
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.node-actions') || 
        e.target.closest('.draggable-node__input') ||
        e.target.closest('.draggable-node__resize-handle') ||
        e.target.closest('.draggable-node__add-btn') ||
        e.target.closest('.draggable-node__quick-menu')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      onPositionChange(node.id, Math.max(0, newX), Math.max(0, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, node.id, onPositionChange]);

  // Handle resize start
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      width: position.width || 280,
      height: position.height || 120,
      x: e.clientX,
      y: e.clientY,
    };
  }, [position]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, resizeStartRef.current.width + deltaX));
      const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, resizeStartRef.current.height + deltaY));
      
      onSizeChange(node.id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, node.id, onSizeChange]);

  // Edit handlers
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(node.label);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== node.label) {
      onEdit(node.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(node.label);
      setIsEditing(false);
    }
  };

  const handleAddFromConnector = (type) => {
    onAddChild(node.id, type);
    setShowAddMenu(false);
  };

  const canAddChild = node.type !== 'end';

  return (
    <div
      ref={nodeRef}
      className={`draggable-node draggable-node--${node.type} ${isDragging ? 'draggable-node--dragging' : ''} ${isResizing ? 'draggable-node--resizing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width || 280,
        height: position.height || 120,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Top accent bar */}
      <div className={`draggable-node__accent draggable-node__accent--${node.type}`} />
      
      {/* Card content */}
      <div className="draggable-node__body">
        {/* Header row: Badge + Actions */}
        <div className="draggable-node__header">
          <span className={`draggable-node__badge draggable-node__badge--${node.type}`}>
            {config.label}
          </span>
          
          <div className="draggable-node__actions">
            <NodeActions
              nodeId={node.id}
              nodeType={node.type}
              onAddNode={onAddChild}
              onDeleteNode={onDelete}
            />
          </div>
        </div>
        
        {/* Title - Click to edit */}
        <div className="draggable-node__content">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="draggable-node__input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="Enter node name..."
            />
          ) : (
            <button 
              className="draggable-node__title-btn"
              onClick={handleStartEdit}
              title="Click to edit"
            >
              <span className="draggable-node__title">{node.label}</span>
              <span className="draggable-node__edit-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Footer with description */}
        <div className="draggable-node__footer">
          <span className="draggable-node__description">{config.description}</span>
        </div>
      </div>

      {/* Connection point with Add button */}
      {canAddChild && (
        <div 
          className={`draggable-node__connector ${showAddMenu ? 'draggable-node__connector--active' : ''}`}
          ref={addMenuRef}
        >
          <button
            className="draggable-node__add-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
            title="Add next step"
            aria-label="Add next step"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          {/* Quick Add Menu */}
          {showAddMenu && (
            <div className="draggable-node__quick-menu">
              <button 
                className="draggable-node__quick-item draggable-node__quick-item--action"
                onClick={() => handleAddFromConnector('action')}
              >
                <span className="draggable-node__quick-icon">⚡</span>
                Action
              </button>
              <button 
                className="draggable-node__quick-item draggable-node__quick-item--branch"
                onClick={() => handleAddFromConnector('branch')}
              >
                <span className="draggable-node__quick-icon">◇</span>
                Condition
              </button>
              <button 
                className="draggable-node__quick-item draggable-node__quick-item--end"
                onClick={() => handleAddFromConnector('end')}
              >
                <span className="draggable-node__quick-icon">■</span>
                End
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resize handle */}
      <div 
        className="draggable-node__resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Drag indicator */}
      <div className="draggable-node__drag-indicator">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5"/>
          <circle cx="15" cy="5" r="1.5"/>
          <circle cx="9" cy="12" r="1.5"/>
          <circle cx="15" cy="12" r="1.5"/>
          <circle cx="9" cy="19" r="1.5"/>
          <circle cx="15" cy="19" r="1.5"/>
        </svg>
      </div>
    </div>
  );
};

export default DraggableNode;
