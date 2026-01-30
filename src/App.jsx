import React, { useEffect } from 'react';
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
    saveWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflow();

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const renderNode = (node, depth = 0, isFirst = false) => {
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
                <span className={`branch-label ${index === 0 ? 'branch-label--true' : 'branch-label--false'}`}>
                  {index === 0 ? 'True' : 'False'}
                </span>
                <div className="branch-nodes">
                  {branch.map((child, childIndex) => renderNode(child, depth + 1, childIndex === 0))}
                  {branch.length === 0 && (
                    <button 
                      className="add-node-btn add-node-btn--empty"
                      onClick={() => addNode(node.id, 'action', index)}
                      title="Add node to this branch"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {node.type !== 'branch' && node.type !== 'end' && node.children && node.children.length > 0 && (
          <div className="children-container">
            {node.children.map((child, index) => renderNode(child, depth + 1, index === 0))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <svg className="app-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M3 12h18M8 8l8 8M16 8l-8 8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Workflow Builder
        </div>
        <Controls
          onSave={saveWorkflow}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </header>
      
      <div className="canvas-wrapper">
        <WorkflowCanvas>
          <div className="node-tree">
            {renderNode(workflow, 0, true)}
          </div>
        </WorkflowCanvas>
      </div>
    </div>
  );
}

export default App;
