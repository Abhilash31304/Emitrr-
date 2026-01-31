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
 * When a node is deleted, its children are connected to the parent
 */
export const deleteNode = (workflow, nodeId) => {
  const cloned = cloneWorkflow(workflow);
  
  // Cannot delete the root node
  if (cloned.id === nodeId) return cloned;

  const deleteRecursive = (node) => {
    if (node.type === 'branch') {
      // For branch nodes, process each branch
      node.children = node.children.map((branch) => {
        const newBranch = [];
        for (const child of branch) {
          if (child.id === nodeId) {
            // Found the node to delete - add its children to this branch
            if (child.type === 'branch') {
              // If deleting a branch node, flatten its children
              for (const subBranch of child.children) {
                newBranch.push(...subBranch);
              }
            } else if (child.children && child.children.length > 0) {
              newBranch.push(...child.children);
            }
          } else {
            deleteRecursive(child);
            newBranch.push(child);
          }
        }
        return newBranch;
      });
    } else if (Array.isArray(node.children)) {
      const newChildren = [];
      for (const child of node.children) {
        if (child.id === nodeId) {
          // Found the node to delete - reconnect its children to this node
          if (child.type === 'branch') {
            // If deleting a branch node, flatten its children
            for (const subBranch of child.children) {
              newChildren.push(...subBranch);
            }
          } else if (child.children && child.children.length > 0) {
            newChildren.push(...child.children);
          }
        } else {
          deleteRecursive(child);
          newChildren.push(child);
        }
      }
      node.children = newChildren;
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

/**
 * Insert a new node between a parent and target node
 * The new node becomes the parent of the target node
 */
export const insertNodeBetween = (workflow, parentId, targetId, newNode, branchIndex = null) => {
  const cloned = cloneWorkflow(workflow);
  const parent = findNodeById(cloned, parentId);
  
  if (!parent) return cloned;

  // For branch nodes, we need to find the target in the specific branch
  if (parent.type === 'branch' && branchIndex !== null) {
    const branch = parent.children[branchIndex];
    const targetIndex = branch.findIndex(child => child.id === targetId);
    
    if (targetIndex !== -1) {
      // Get the target node
      const targetNode = branch[targetIndex];
      // Set the new node's children to include the target
      newNode.children = newNode.type === 'branch' ? [[targetNode], []] : [targetNode];
      // Replace target with new node at that position
      branch[targetIndex] = newNode;
    }
  } else if (Array.isArray(parent.children)) {
    const targetIndex = parent.children.findIndex(child => child.id === targetId);
    
    if (targetIndex !== -1) {
      // Get the target node
      const targetNode = parent.children[targetIndex];
      // Set the new node's children to include the target
      newNode.children = newNode.type === 'branch' ? [[targetNode], []] : [targetNode];
      // Replace target with new node at that position
      parent.children[targetIndex] = newNode;
    }
  }

  return cloned;
};
