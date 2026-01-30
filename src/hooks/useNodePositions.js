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
    
    const processNode = (node, x = 500, y = 80, siblingIndex = 0, totalSiblings = 1) => {
      if (!node) return { maxY: y, maxX: x };
      
      const nodeWidth = 280;
      const nodeHeight = 120;
      const verticalGap = 160;
      const horizontalGap = 320;
      
      newPositions[node.id] = {
        x: x - nodeWidth / 2,
        y,
        width: nodeWidth,
        height: nodeHeight,
      };
      
      let nextY = y + nodeHeight + verticalGap - 80;
      let maxY = nextY;
      let maxX = x;
      
      if (node.type === 'branch' && Array.isArray(node.children)) {
        // Handle branch children (True/False paths)
        const numBranches = node.children.length;
        const totalWidth = (numBranches - 1) * horizontalGap;
        const startX = x - totalWidth / 2;
        
        node.children.forEach((branch, branchIdx) => {
          const branchX = startX + branchIdx * horizontalGap;
          let branchY = nextY;
          
          if (Array.isArray(branch) && branch.length > 0) {
            branch.forEach((child, childIdx) => {
              const result = processNode(child, branchX, branchY, childIdx, branch.length);
              branchY = result.maxY;
              maxX = Math.max(maxX, result.maxX);
            });
          }
          maxY = Math.max(maxY, branchY);
        });
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        // Handle multiple children - spread horizontally
        const numChildren = node.children.length;
        
        if (numChildren === 1) {
          // Single child - place directly below
          const result = processNode(node.children[0], x, nextY, 0, 1);
          maxY = result.maxY;
          maxX = Math.max(maxX, result.maxX);
        } else {
          // Multiple children - spread horizontally
          const totalWidth = (numChildren - 1) * horizontalGap;
          const startX = x - totalWidth / 2;
          
          node.children.forEach((child, childIdx) => {
            const childX = startX + childIdx * horizontalGap;
            const result = processNode(child, childX, nextY, childIdx, numChildren);
            maxY = Math.max(maxY, result.maxY);
            maxX = Math.max(maxX, result.maxX);
          });
        }
      }
      
      return { maxY, maxX };
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
