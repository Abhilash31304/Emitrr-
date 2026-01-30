import React, { useMemo } from 'react';
import './Edges.css';

/**
 * Get all edges (connections) from the workflow tree
 */
const getEdgesFromWorkflow = (workflow, positions) => {
  const edges = [];
  
  const processNode = (node, parentId = null, branchIndex = null) => {
    if (!node) return;
    
    if (parentId && positions[parentId] && positions[node.id]) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        branchIndex,
      });
    }
    
    if (node.type === 'branch' && Array.isArray(node.children)) {
      node.children.forEach((branch, index) => {
        if (Array.isArray(branch)) {
          branch.forEach((child) => {
            processNode(child, node.id, index);
          });
        }
      });
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        processNode(child, node.id, null);
      });
    }
  };
  
  processNode(workflow);
  return edges;
};

/**
 * Calculate curved path between two nodes
 */
const calculatePath = (sourcePos, targetPos) => {
  const sourceX = sourcePos.x + (sourcePos.width || 280) / 2;
  const sourceY = sourcePos.y + (sourcePos.height || 120);
  const targetX = targetPos.x + (targetPos.width || 280) / 2;
  const targetY = targetPos.y;
  
  // Calculate control points for a smooth curve
  const midY = (sourceY + targetY) / 2;
  const deltaX = Math.abs(targetX - sourceX);
  const curveOffset = Math.min(deltaX * 0.5, 80);
  
  // Use cubic bezier for smooth curves
  if (Math.abs(sourceX - targetX) < 10) {
    // Straight vertical line
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }
  
  // Curved path
  return `M ${sourceX} ${sourceY} 
          C ${sourceX} ${midY}, 
            ${targetX} ${midY}, 
            ${targetX} ${targetY}`;
};

const Edges = ({ workflow, positions }) => {
  const edges = useMemo(() => {
    return getEdgesFromWorkflow(workflow, positions);
  }, [workflow, positions]);

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
        
        const path = calculatePath(sourcePos, targetPos);
        const isTrue = edge.branchIndex === 0;
        const isFalse = edge.branchIndex === 1;
        
        let strokeColor = '#94a3b8';
        let markerId = 'arrowhead';
        
        if (isTrue) {
          strokeColor = '#22c55e';
          markerId = 'arrowhead-true';
        } else if (isFalse) {
          strokeColor = '#ef4444';
          markerId = 'arrowhead-false';
        }
        
        return (
          <g key={edge.id} className="edge-group">
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
            {/* Branch label */}
            {(isTrue || isFalse) && (
              <text
                x={sourcePos.x + (sourcePos.width || 280) / 2 + (isTrue ? -30 : 30)}
                y={sourcePos.y + (sourcePos.height || 120) + 20}
                className={`edge-label ${isTrue ? 'edge-label--true' : 'edge-label--false'}`}
                textAnchor="middle"
              >
                {isTrue ? 'True' : 'False'}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default Edges;
