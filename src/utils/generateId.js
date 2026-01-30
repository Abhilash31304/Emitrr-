/**
 * Generate a unique ID for workflow nodes
 */
export const generateId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
