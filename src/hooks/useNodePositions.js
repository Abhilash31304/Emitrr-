import { useState, useCallback } from 'react';

/**
 * Hook to manage node positions for drag-and-drop functionality
 */
const useNodePositions = (initialPositions = {}) => {
  const [positions, setPositions] = useState(initialPositions);

  const updatePosition = useCallback((nodeId, x, y) => {
    setPositions((prev) => ({
      ...prev,
      [nodeId]: { x, y },
    }));
  }, []);

  const updateSize = useCallback((nodeId, width, height) => {
    setPositions((prev) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        width,
        height,
      },
    }));
  }, []);

  const getPosition = useCallback((nodeId) => {
    return positions[nodeId] || { x: 0, y: 0, width: 280, height: 120 };
  }, [positions]);

  const initializePositions = useCallback((workflow) => {
    const newPositions = {};
    let yOffset = 80;
    
    const processNode = (node, x = 400, y = yOffset, branchIndex = null) => {
      if (!node) return y;
      
      newPositions[node.id] = {
        x: x - 140, // Center the node (assuming 280px width)
        y,
        width: 280,
        height: 120,
      };
      
      let nextY = y + 160; // Gap between nodes
      
      if (node.type === 'branch' && Array.isArray(node.children)) {
        // Handle branch children (True/False paths)
        const branchSpacing = 320;
        node.children.forEach((branch, index) => {
          const branchX = x + (index === 0 ? -branchSpacing / 2 : branchSpacing / 2);
          let branchY = nextY;
          
          if (Array.isArray(branch)) {
            branch.forEach((child) => {
              branchY = processNode(child, branchX, branchY, index);
            });
          }
          nextY = Math.max(nextY, branchY);
        });
      } else if (Array.isArray(node.children)) {
        // Handle regular children
        node.children.forEach((child) => {
          nextY = processNode(child, x, nextY);
        });
      }
      
      return nextY;
    };
    
    processNode(workflow);
    setPositions(newPositions);
  }, []);

  return {
    positions,
    updatePosition,
    updateSize,
    getPosition,
    initializePositions,
    setPositions,
  };
};

export default useNodePositions;
