import React, { useState, useRef, useEffect } from 'react';
import { NodeActions } from '../node-actions';
import './WorkflowNode.css';

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

const WorkflowNode = ({ node, onEdit, onDelete, onAddChild }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [isHovered, setIsHovered] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTrueBranchMenu, setShowTrueBranchMenu] = useState(false);
  const [showFalseBranchMenu, setShowFalseBranchMenu] = useState(false);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const trueBranchMenuRef = useRef(null);
  const falseBranchMenuRef = useRef(null);
  const config = NODE_CONFIG[node.type] || NODE_CONFIG.action;

  // Focus and select input when editing starts
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
      if (trueBranchMenuRef.current && !trueBranchMenuRef.current.contains(e.target)) {
        setShowTrueBranchMenu(false);
      }
      if (falseBranchMenuRef.current && !falseBranchMenuRef.current.contains(e.target)) {
        setShowFalseBranchMenu(false);
      }
    };
    if (showAddMenu || showTrueBranchMenu || showFalseBranchMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddMenu, showTrueBranchMenu, showFalseBranchMenu]);

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

  // Handle adding to a specific branch (for branch nodes)
  const handleAddToBranch = (type, branchIndex) => {
    onAddChild(node.id, type, branchIndex);
    setShowAddMenu(false);
    setShowTrueBranchMenu(false);
    setShowFalseBranchMenu(false);
  };

  // Render diamond shape for branch/condition nodes
  if (node.type === 'branch') {
    return (
      <div 
        className={`workflow-node workflow-node--branch ${isHovered ? 'workflow-node--hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTrueBranchMenu(false);
          setShowFalseBranchMenu(false);
        }}
      >
        <div className="workflow-node__diamond">
          <div className="workflow-node__diamond-inner">
            <div className={`workflow-node__actions ${isHovered ? 'workflow-node__actions--visible' : ''}`}>
              <NodeActions
                nodeId={node.id}
                nodeType={node.type}
                onAddNode={onAddChild}
                onDeleteNode={onDelete}
              />
            </div>
            <span className="workflow-node__diamond-label">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="workflow-node__diamond-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  placeholder="Condition..."
                />
              ) : (
                <button 
                  className="workflow-node__diamond-edit-btn"
                  onClick={handleStartEdit}
                  title="Click to edit"
                >
                  {node.label}
                </button>
              )}
            </span>
            <span className="workflow-node__diamond-type">Condition</span>
          </div>
        </div>

        {/* Branch connectors - True (bottom) and False (right) */}
        <div className="workflow-node__branch-connectors">
          {/* True Branch - Bottom */}
          <div 
            className={`workflow-node__branch-connector workflow-node__branch-connector--true ${showTrueBranchMenu ? 'workflow-node__branch-connector--active' : ''}`}
            ref={trueBranchMenuRef}
          >
            <span className="workflow-node__branch-label workflow-node__branch-label--true">Yes</span>
            <button
              className={`workflow-node__add-btn workflow-node__add-btn--true ${isHovered || showTrueBranchMenu ? 'workflow-node__add-btn--visible' : ''}`}
              onClick={() => {
                setShowTrueBranchMenu(!showTrueBranchMenu);
                setShowFalseBranchMenu(false);
              }}
              title="Add step to 'Yes' branch"
              aria-label="Add step to Yes branch"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {/* True Branch Quick Add Menu */}
            {showTrueBranchMenu && (
              <div className="workflow-node__quick-menu workflow-node__quick-menu--branch">
                <div className="workflow-node__quick-menu-header">Add to 'Yes' branch</div>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--action"
                  onClick={() => handleAddToBranch('action', 0)}
                >
                  <span className="workflow-node__quick-icon">⚡</span>
                  Action
                </button>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--branch"
                  onClick={() => handleAddToBranch('branch', 0)}
                >
                  <span className="workflow-node__quick-icon">◇</span>
                  Condition
                </button>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--end"
                  onClick={() => handleAddToBranch('end', 0)}
                >
                  <span className="workflow-node__quick-icon">■</span>
                  End
                </button>
              </div>
            )}
          </div>

          {/* False Branch - Right */}
          <div 
            className={`workflow-node__branch-connector workflow-node__branch-connector--false ${showFalseBranchMenu ? 'workflow-node__branch-connector--active' : ''}`}
            ref={falseBranchMenuRef}
          >
            <span className="workflow-node__branch-label workflow-node__branch-label--false">No</span>
            <button
              className={`workflow-node__add-btn workflow-node__add-btn--false ${isHovered || showFalseBranchMenu ? 'workflow-node__add-btn--visible' : ''}`}
              onClick={() => {
                setShowFalseBranchMenu(!showFalseBranchMenu);
                setShowTrueBranchMenu(false);
              }}
              title="Add step to 'No' branch"
              aria-label="Add step to No branch"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {/* False Branch Quick Add Menu */}
            {showFalseBranchMenu && (
              <div className="workflow-node__quick-menu workflow-node__quick-menu--branch workflow-node__quick-menu--right">
                <div className="workflow-node__quick-menu-header">Add to 'No' branch</div>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--action"
                  onClick={() => handleAddToBranch('action', 1)}
                >
                  <span className="workflow-node__quick-icon">⚡</span>
                  Action
                </button>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--branch"
                  onClick={() => handleAddToBranch('branch', 1)}
                >
                  <span className="workflow-node__quick-icon">◇</span>
                  Condition
                </button>
                <button 
                  className="workflow-node__quick-item workflow-node__quick-item--end"
                  onClick={() => handleAddToBranch('end', 1)}
                >
                  <span className="workflow-node__quick-icon">■</span>
                  End
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`workflow-node workflow-node--${node.type} ${isHovered ? 'workflow-node--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!showAddMenu) setShowAddMenu(false);
      }}
    >
      {/* Top accent bar */}
      <div className={`workflow-node__accent workflow-node__accent--${node.type}`} />
      
      {/* Card content */}
      <div className="workflow-node__body">
        {/* Header row: Badge + Actions */}
        <div className="workflow-node__header">
          <span className={`workflow-node__badge workflow-node__badge--${node.type}`}>
            {config.label}
          </span>
          
          <div className={`workflow-node__actions ${isHovered ? 'workflow-node__actions--visible' : ''}`}>
            <NodeActions
              nodeId={node.id}
              nodeType={node.type}
              onAddNode={onAddChild}
              onDeleteNode={onDelete}
            />
          </div>
        </div>
        
        {/* Title - Click to edit */}
        <div className="workflow-node__content">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="workflow-node__input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="Enter node name..."
            />
          ) : (
            <button 
              className="workflow-node__title-btn"
              onClick={handleStartEdit}
              title="Click to edit"
            >
              <span className="workflow-node__title">{node.label}</span>
              <span className="workflow-node__edit-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Footer with description */}
        <div className="workflow-node__footer">
          <span className="workflow-node__description">{config.description}</span>
        </div>
      </div>

      {/* Connection point with Add button */}
      {canAddChild && (
        <div 
          className={`workflow-node__connector workflow-node__connector--bottom ${showAddMenu ? 'workflow-node__connector--active' : ''}`}
          ref={addMenuRef}
        >
          <button
            className={`workflow-node__add-btn ${isHovered || showAddMenu ? 'workflow-node__add-btn--visible' : ''}`}
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
            <div className="workflow-node__quick-menu">
              <button 
                className="workflow-node__quick-item workflow-node__quick-item--action"
                onClick={() => handleAddFromConnector('action')}
              >
                <span className="workflow-node__quick-icon">⚡</span>
                Action
              </button>
              <button 
                className="workflow-node__quick-item workflow-node__quick-item--branch"
                onClick={() => handleAddFromConnector('branch')}
              >
                <span className="workflow-node__quick-icon">◇</span>
                Condition
              </button>
              <button 
                className="workflow-node__quick-item workflow-node__quick-item--end"
                onClick={() => handleAddFromConnector('end')}
              >
                <span className="workflow-node__quick-icon">■</span>
                End
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;
