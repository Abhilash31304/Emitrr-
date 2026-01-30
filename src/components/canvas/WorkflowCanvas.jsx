import React from 'react';
import './WorkflowCanvas.css';

const WorkflowCanvas = ({ children }) => {
  return (
    <div className="workflow-canvas">
      {children}
    </div>
  );
};

export default WorkflowCanvas;
