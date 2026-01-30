import React from 'react';
import { WorkflowCanvas } from './components/canvas';
import { WorkflowNode } from './components/node';
import { Controls } from './components/controls';
import useWorkflow from './hooks/useWorkflow';
import './App.css';

function App() {
  const { 
    workflow, 
    addNode, 
    deleteNode, 
    updateLabel, 
    saveWorkflow 
  } = useWorkflow();

  const renderNode = (node, depth = 0) => {
    if (!node) return null;

    return (
      <div key={node.id} className="node-container">
        <WorkflowNode
          node={node}
          onEdit={updateLabel}
          onDelete={deleteNode}
          onAddChild={addNode}
        />
        
        {node.type === 'branch' && node.children && (
          <div className="branch-container">
            {node.children.map((branch, index) => (
              <div key={`branch-${index}`} className="branch">
                <div className="branch-label">
                  {index === 0 ? 'True' : 'False'}
                </div>
                <div className="branch-nodes">
                  {branch.map((child) => renderNode(child, depth + 1))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {node.type !== 'branch' && node.children && node.children.length > 0 && (
          <div className="children-container">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <Controls
        onSave={saveWorkflow}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
      />
      
      <WorkflowCanvas>
        {renderNode(workflow)}
      </WorkflowCanvas>
    </div>
  );
}

export default App;
