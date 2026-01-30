import React, { useEffect, useCallback, useRef, useState } from 'react';
import { DraggableNode } from './components/draggable-node';
import { Edges } from './components/edges';
import { Controls } from './components/controls';
import useWorkflow from './hooks/useWorkflow';
import useNodePositions from './hooks/useNodePositions';
import './App.css';

/**
 * Collect all nodes from the workflow tree into a flat array
 */
const flattenWorkflow = (workflow) => {
  const nodes = [];
  
  const processNode = (node) => {
    if (!node) return;
    nodes.push(node);
    
    if (node.type === 'branch' && Array.isArray(node.children)) {
      node.children.forEach((branch) => {
        if (Array.isArray(branch)) {
          branch.forEach(processNode);
        }
      });
    } else if (Array.isArray(node.children)) {
      node.children.forEach(processNode);
    }
  };
  
  processNode(workflow);
  return nodes;
};

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

  const {
    positions,
    updatePosition,
    updateSize,
    initializePositions,
  } = useNodePositions();

  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);

  // Initialize node positions when workflow first loads
  useEffect(() => {
    if (!initialized.current || Object.keys(positions).length === 0) {
      initializePositions(workflow);
      initialized.current = true;
    }
  }, [workflow, initializePositions, positions]);

  // Re-initialize positions when a new node is added
  const prevNodeCount = useRef(0);
  useEffect(() => {
    const nodes = flattenWorkflow(workflow);
    if (nodes.length !== prevNodeCount.current) {
      if (nodes.length > prevNodeCount.current) {
        initializePositions(workflow);
      }
      prevNodeCount.current = nodes.length;
    }
  }, [workflow, initializePositions]);

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

  // Canvas panning
  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-inner')) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y,
      };
    }
  }, [canvasOffset]);

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e) => {
      setCanvasOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  // Canvas zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(2, Math.max(0.25, prev + delta)));
    }
  }, []);

  // Reset view
  const handleResetView = useCallback(() => {
    setCanvasOffset({ x: 0, y: 0 });
    setScale(1);
  }, []);

  // Flatten workflow to get all nodes
  const allNodes = flattenWorkflow(workflow);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <svg className="app-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M3 12h18M8 8l8 8M16 8l-8 8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Workflow Builder
        </div>
        <div className="app-header__controls">
          <div className="zoom-controls">
            <button 
              className="zoom-btn" 
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              title="Zoom in"
            >
              +
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button 
              className="zoom-btn" 
              onClick={() => setScale((s) => Math.max(0.25, s - 0.1))}
              title="Zoom out"
            >
              −
            </button>
            <button 
              className="zoom-btn zoom-btn--reset" 
              onClick={handleResetView}
              title="Reset view"
            >
              ⟲
            </button>
          </div>
          <Controls
            onSave={saveWorkflow}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
      </header>
      
      <div 
        className={`canvas-wrapper ${isPanning ? 'canvas-wrapper--panning' : ''}`}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        ref={canvasRef}
      >
        <div 
          className="canvas-inner"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* SVG Edges Layer */}
          <Edges workflow={workflow} positions={positions} />
          
          {/* Draggable Nodes */}
          {allNodes.map((node) => (
            <DraggableNode
              key={node.id}
              node={node}
              position={positions[node.id] || { x: 100, y: 100, width: 280, height: 120 }}
              onEdit={updateLabel}
              onDelete={deleteNode}
              onAddChild={addNode}
              onPositionChange={updatePosition}
              onSizeChange={updateSize}
            />
          ))}
        </div>

        {/* Canvas instructions */}
        <div className="canvas-instructions">
          <span>🖱️ Drag nodes to move</span>
          <span>↔️ Resize from corner</span>
          <span>Ctrl + Scroll to zoom</span>
          <span>Click canvas to pan</span>
        </div>
      </div>
    </div>
  );
}

export default App;
