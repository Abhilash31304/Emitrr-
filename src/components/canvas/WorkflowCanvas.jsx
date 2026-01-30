import React from 'react';
import './WorkflowCanvas.css';

const WorkflowCanvas = ({ children }) => {
  return (
    <div className="workflow-canvas">
      <div className="workflow-canvas__inner">
        {children}
      </div>
    </div>
  );
};

export default WorkflowCanvas;
