import { useState, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import { 
  addNode, 
  deleteNode, 
  updateNodeLabel, 
  findNodeById 
} from '../utils/workflowHelpers';
import { initialWorkflow } from '../data/initialWorkflow';

const useWorkflow = () => {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const handleAddNode = useCallback((parentId, nodeType, branchIndex = null) => {
    const newNode = {
      id: generateId(),
      type: nodeType,
      label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
      children: nodeType === 'branch' ? [[], []] : [],
    };

    setWorkflow((prevWorkflow) => addNode(prevWorkflow, parentId, newNode, branchIndex));
  }, []);

  const handleDeleteNode = useCallback((nodeId) => {
    setWorkflow((prevWorkflow) => deleteNode(prevWorkflow, nodeId));
  }, []);

  const handleUpdateLabel = useCallback((nodeId, newLabel) => {
    setWorkflow((prevWorkflow) => updateNodeLabel(prevWorkflow, nodeId, newLabel));
  }, []);

  const handleSave = useCallback(() => {
    console.log('Workflow Data:', JSON.stringify(workflow, null, 2));
    alert('Workflow saved to console!');
  }, [workflow]);

  return {
    workflow,
    addNode: handleAddNode,
    deleteNode: handleDeleteNode,
    updateLabel: handleUpdateLabel,
    saveWorkflow: handleSave,
  };
};

export default useWorkflow;
