import React, { useMemo, useState } from 'react';
import './Edges.css';

/**
 * Get all edges (connections) from the workflow tree
 */
const getEdgesFromWorkflow = (workflow, positions) => {
  const edges = [];
  
  const processNode = (node, parentId = null, branchIndex = null, parentType = null) => {
    if (!node) return;
    
    if (parentId && positions[parentId] && positions[node.id]) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        targetNodeId: node.id,
        branchIndex,
        parentType,
      });
    }
    
    if (node.type === 'branch' && Array.isArray(node.children)) {
      node.children.forEach((branch, index) => {
        if (Array.isArray(branch)) {
          branch.forEach((child) => {
            processNode(child, node.id, index, 'branch');
          });
        }
      });
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        processNode(child, node.id, null, node.type);
      });
    }
  };
  
  processNode(workflow);
  return edges;
};

/**
 * Calculate curved path between two nodes
 * For branch nodes: left (0), bottom (1), right (2) exit points
 */
const calculatePath = (sourcePos, targetPos, branchIndex = null, parentType = null) => {
  const sourceWidth = sourcePos.width || 280;
  const sourceHeight = sourcePos.height || 120;
  const targetWidth = targetPos.width || 280;
  
  let sourceX, sourceY;
  
  // For branch nodes, use different exit points for 3 branches
  // Diamond is 120x120 rotated 45deg, centered in 160x160 container
  // The diamond corners (after rotation) are at the center +/- ~60px (half of 120)
  if (parentType === 'branch') {
    const centerX = sourcePos.x + sourceWidth / 2;
    const centerY = sourcePos.y + sourceHeight / 2;
    const diamondOffset = 60; // Half of 120px diamond
    
    if (branchIndex === 0) {
      // Left branch - exit from left corner of diamond
      sourceX = centerX - diamondOffset;
      sourceY = centerY;
    } else if (branchIndex === 1) {
      // Bottom branch - exit from bottom corner of diamond
      sourceX = centerX;
      sourceY = centerY + diamondOffset;
    } else {
      // Right branch - exit from right corner of diamond
      sourceX = centerX + diamondOffset;
      sourceY = centerY;
    }
  } else {
    // Normal nodes - exit from bottom center
    sourceX = sourcePos.x + sourceWidth / 2;
    sourceY = sourcePos.y + sourceHeight;
  }
  
  const targetX = targetPos.x + targetWidth / 2;
  const targetY = targetPos.y;
  
  // Calculate control points for a smooth curve
  const midY = (sourceY + targetY) / 2;

  // Use cubic bezier for smooth curves
  if (Math.abs(sourceX - targetX) < 10) {
    // Straight vertical line
    return { 
      path: `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`,
      midPoint: { x: sourceX, y: midY }
    };
  }
  
  // Curved path
  return { 
    path: `M ${sourceX} ${sourceY} 
          C ${sourceX} ${midY}, 
            ${targetX} ${midY}, 
            ${targetX} ${targetY}`,
    midPoint: { x: (sourceX + targetX) / 2, y: midY }
  };
};

const Edges = ({ workflow, positions, onInsertNode }) => {
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [showInsertMenu, setShowInsertMenu] = useState(null);

  const edges = useMemo(() => {
    return getEdgesFromWorkflow(workflow, positions);
  }, [workflow, positions]);

  const handleInsertNode = (edge, nodeType) => {
    if (onInsertNode) {
      onInsertNode(edge.source, edge.targetNodeId, nodeType, edge.branchIndex);
    }
    setShowInsertMenu(null);
  };

  return (
    <svg className="edges-container">
      <defs>
        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
        <marker
          id="arrowhead-true"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
        </marker>
        <marker
          id="arrowhead-false"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
        </marker>
      </defs>
      
      {edges.map((edge) => {
        const sourcePos = positions[edge.source];
        const targetPos = positions[edge.target];
        
        if (!sourcePos || !targetPos) return null;
        
        const { path, midPoint } = calculatePath(sourcePos, targetPos, edge.branchIndex, edge.parentType);
        const isEdgeHovered = hoveredEdge === edge.id;
        const isMenuOpen = showInsertMenu === edge.id;
        
        // Use neutral colors for all edges
        let strokeColor = '#94a3b8';
        let markerId = 'arrowhead';
        
        return (
          <g 
            key={edge.id} 
            className={`edge-group ${isEdgeHovered ? 'edge-group--hovered' : ''}`}
            onMouseEnter={() => setHoveredEdge(edge.id)}
            onMouseLeave={() => {
              if (!isMenuOpen) {
                setHoveredEdge(null);
              }
            }}
          >
            {/* Invisible wider path for easier hover */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="20"
              strokeLinecap="round"
              style={{ cursor: 'pointer' }}
            />
            {/* Shadow/glow effect */}
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeOpacity="0.2"
              strokeLinecap="round"
            />
            {/* Main edge */}
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
              className="edge-path"
            />
          </g>
        );
      })}
    </svg>
  );
};

// Separate component for insert buttons (rendered as HTML overlay)
export const EdgeInsertButtons = ({ workflow, positions, onInsertNode }) => {
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [showInsertMenu, setShowInsertMenu] = useState(null);

  const edges = useMemo(() => {
    return getEdgesFromWorkflow(workflow, positions);
  }, [workflow, positions]);

  const handleInsertNode = (edge, nodeType) => {
    if (onInsertNode) {
      onInsertNode(edge.source, edge.targetNodeId, nodeType, edge.branchIndex);
    }
    setShowInsertMenu(null);
    setHoveredEdge(null);
  };

  return (
    <div className="edge-insert-buttons">
      {edges.map((edge) => {
        const sourcePos = positions[edge.source];
        const targetPos = positions[edge.target];
        
        if (!sourcePos || !targetPos) return null;
        
        const { midPoint } = calculatePath(sourcePos, targetPos, edge.branchIndex, edge.parentType);
        const isEdgeHovered = hoveredEdge === edge.id;
        const isMenuOpen = showInsertMenu === edge.id;
        
        return (
          <div
            key={edge.id}
            className="edge-insert-area"
            style={{
              left: midPoint.x - 40,
              top: midPoint.y - 20,
              width: 80,
              height: 40,
            }}
            onMouseEnter={() => setHoveredEdge(edge.id)}
            onMouseLeave={() => {
              if (!isMenuOpen) {
                setHoveredEdge(null);
              }
            }}
          >
            <button
              className={`edge-insert-btn ${isEdgeHovered || isMenuOpen ? 'edge-insert-btn--visible' : ''}`}
              onClick={() => setShowInsertMenu(isMenuOpen ? null : edge.id)}
              title="Insert node here"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {isMenuOpen && (
              <div className="edge-insert-menu">
                <div className="edge-insert-menu__header">Insert node</div>
                <button 
                  className="edge-insert-menu__item edge-insert-menu__item--action"
                  onClick={() => handleInsertNode(edge, 'action')}
                >
                  <span className="edge-insert-menu__icon">⚡</span>
                  Action
                </button>
                <button 
                  className="edge-insert-menu__item edge-insert-menu__item--branch"
                  onClick={() => handleInsertNode(edge, 'branch')}
                >
                  <span className="edge-insert-menu__icon">◇</span>
                  Condition
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Edges;
