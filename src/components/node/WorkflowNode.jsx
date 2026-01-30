import React from 'react';
import './WorkflowNode.css';

const WorkflowNode = ({ node, onEdit, onDelete, onAddChild }) => {
  const getNodeClassName = () => {
    return `workflow-node workflow-node--${node.type}`;
  };

  return (
    <div className={getNodeClassName()}>
      <div className="workflow-node__header">
        <span className="workflow-node__type">{node.type}</span>
      </div>
      <div className="workflow-node__content">
        <span className="workflow-node__label">{node.label}</span>
      </div>
      <div className="workflow-node__actions">
        {/* Node action buttons will go here */}
      </div>
    </div>
  );
};

export default WorkflowNode;
