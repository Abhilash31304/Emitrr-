import React, { useState } from 'react';
import './NodeActions.css';

const NodeActions = ({ nodeId, nodeType, onAddNode, onDeleteNode, onEditNode }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAddClick = () => {
    setShowMenu(!showMenu);
  };

  const handleSelectNodeType = (type) => {
    onAddNode(nodeId, type);
    setShowMenu(false);
  };

  const canAddChild = nodeType !== 'end';
  const canDelete = nodeType !== 'start';

  return (
    <div className="node-actions">
      {canAddChild && (
        <div className="node-actions__add-wrapper">
          <button 
            className="node-actions__btn node-actions__btn--add"
            onClick={handleAddClick}
            title="Add node"
          >
            +
          </button>
          {showMenu && (
            <div className="node-actions__menu">
              <button onClick={() => handleSelectNodeType('action')}>Action</button>
              <button onClick={() => handleSelectNodeType('branch')}>Branch</button>
              <button onClick={() => handleSelectNodeType('end')}>End</button>
            </div>
          )}
        </div>
      )}
      
      <button 
        className="node-actions__btn node-actions__btn--edit"
        onClick={() => onEditNode(nodeId)}
        title="Edit node"
      >
        ✎
      </button>
      
      {canDelete && (
        <button 
          className="node-actions__btn node-actions__btn--delete"
          onClick={() => onDeleteNode(nodeId)}
          title="Delete node"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default NodeActions;
