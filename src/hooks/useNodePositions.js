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
      
      const nodeWidth = node.type === 'branch' ? 160 : 280;
      const nodeHeight = node.type === 'branch' ? 160 : 120;
      const verticalGap = node.type === 'branch' ? 200 : 160;
      const horizontalGap = 350;
      
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
        // Handle branch children (3 paths: left, bottom, right)
        const leftChildren = node.children[0] || [];
        const bottomChildren = node.children[1] || [];
        const rightChildren = node.children[2] || [];
        
        // Left branch - to the left
        const leftX = x - horizontalGap;
        let branchY = nextY;
        if (leftChildren.length > 0) {
          leftChildren.forEach((child) => {
            const result = processNode(child, leftX, branchY, 0, 1);
            branchY = result.maxY;
            maxX = Math.max(maxX, result.maxX);
          });
          maxY = Math.max(maxY, branchY);
        }
        
        // Bottom branch - directly below
        branchY = nextY;
        if (bottomChildren.length > 0) {
          bottomChildren.forEach((child) => {
            const result = processNode(child, x, branchY, 0, 1);
            branchY = result.maxY;
            maxX = Math.max(maxX, result.maxX);
          });
          maxY = Math.max(maxY, branchY);
        }
        
        // Right branch - to the right
        const rightX = x + horizontalGap;
        branchY = nextY;
        if (rightChildren.length > 0) {
          rightChildren.forEach((child) => {
            const result = processNode(child, rightX, branchY, 0, 1);
            branchY = result.maxY;
            maxX = Math.max(maxX, result.maxX, rightX);
          });
          maxY = Math.max(maxY, branchY);
        }
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
