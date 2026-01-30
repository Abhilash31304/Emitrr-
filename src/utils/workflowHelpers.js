/**
 * Deep clone a workflow object
 */
export const cloneWorkflow = (workflow) => {
  return JSON.parse(JSON.stringify(workflow));
};

/**
 * Find a node by ID in the workflow tree
 */
export const findNodeById = (node, nodeId) => {
  if (node.id === nodeId) {
    return node;
  }

  if (node.type === 'branch') {
    for (const branch of node.children) {
      for (const child of branch) {
        const found = findNodeById(child, nodeId);
        if (found) return found;
      }
    }
  } else if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Find parent node of a given node ID
 */
export const findParentNode = (node, nodeId, parent = null) => {
  if (node.id === nodeId) {
    return parent;
  }

  if (node.type === 'branch') {
    for (const branch of node.children) {
      for (const child of branch) {
        const found = findParentNode(child, nodeId, node);
        if (found) return found;
      }
    }
  } else if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findParentNode(child, nodeId, node);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Add a new node after a parent node
 */
export const addNode = (workflow, parentId, newNode, branchIndex = null) => {
  const cloned = cloneWorkflow(workflow);
  const parent = findNodeById(cloned, parentId);

  if (!parent) return cloned;

  if (parent.type === 'branch' && branchIndex !== null) {
    parent.children[branchIndex].push(newNode);
  } else if (parent.type !== 'end') {
    if (!Array.isArray(parent.children)) {
      parent.children = [];
    }
    parent.children.push(newNode);
  }

  return cloned;
};

/**
 * Delete a node and reconnect children to parent
 */
export const deleteNode = (workflow, nodeId) => {
  const cloned = cloneWorkflow(workflow);
  
  // Cannot delete the root node
  if (cloned.id === nodeId) return cloned;

  const deleteRecursive = (node) => {
    if (node.type === 'branch') {
      node.children = node.children.map((branch) =>
        branch.filter((child) => {
          if (child.id === nodeId) {
            return false;
          }
          deleteRecursive(child);
          return true;
        })
      );
    } else if (Array.isArray(node.children)) {
      node.children = node.children.filter((child) => {
        if (child.id === nodeId) {
          // Reconnect grandchildren to current node
          if (child.children && child.children.length > 0) {
            node.children.push(...child.children);
          }
          return false;
        }
        deleteRecursive(child);
        return true;
      });
    }
  };

  deleteRecursive(cloned);
  return cloned;
};

/**
 * Update the label of a node
 */
export const updateNodeLabel = (workflow, nodeId, newLabel) => {
  const cloned = cloneWorkflow(workflow);
  const node = findNodeById(cloned, nodeId);

  if (node) {
    node.label = newLabel;
  }

  return cloned;
};
