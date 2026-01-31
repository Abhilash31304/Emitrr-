import { useState, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import { 
  addNode, 
  deleteNode, 
  updateNodeLabel, 
  findNodeById,
  insertNodeBetween,
} from '../utils/workflowHelpers';
import { initialWorkflow } from '../data/initialWorkflow';

const MAX_HISTORY = 50;

const useWorkflow = () => {
  // State with undo/redo history
  const [history, setHistory] = useState([initialWorkflow]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Current workflow is the one at the current history index
  const workflow = history[historyIndex];

  // Helper to add a new state to history
  const pushToHistory = useCallback((newWorkflow) => {
    setHistory((prevHistory) => {
      // Remove any "future" states if we're not at the end
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      // Add new state
      newHistory.push(newWorkflow);
      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const handleAddNode = useCallback((parentId, nodeType, branchIndex = null) => {
    const newNode = {
      id: generateId(),
      type: nodeType,
      label: nodeType === 'action' 
        ? 'New Action' 
        : nodeType === 'branch' 
          ? 'New Condition' 
          : 'End',
      children: nodeType === 'branch' ? [[], [], []] : [], // 3 branches: left, bottom, right
    };

    const newWorkflow = addNode(workflow, parentId, newNode, branchIndex);
    pushToHistory(newWorkflow);
  }, [workflow, pushToHistory]);

  const handleDeleteNode = useCallback((nodeId) => {
    const newWorkflow = deleteNode(workflow, nodeId);
    pushToHistory(newWorkflow);
  }, [workflow, pushToHistory]);

  const handleUpdateLabel = useCallback((nodeId, newLabel) => {
    const newWorkflow = updateNodeLabel(workflow, nodeId, newLabel);
    pushToHistory(newWorkflow);
  }, [workflow, pushToHistory]);

  const handleInsertNode = useCallback((parentId, targetId, nodeType, branchIndex = null) => {
    const newNode = {
      id: generateId(),
      type: nodeType,
      label: nodeType === 'action' 
        ? 'New Action' 
        : nodeType === 'branch' 
          ? 'New Condition' 
          : 'End',
      children: nodeType === 'branch' ? [[], [], []] : [], // 3 branches: left, bottom, right
    };

    const newWorkflow = insertNodeBetween(workflow, parentId, targetId, newNode, branchIndex);
    pushToHistory(newWorkflow);
  }, [workflow, pushToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  const handleSave = useCallback(() => {
    console.log('='.repeat(50));
    console.log('WORKFLOW DATA STRUCTURE');
    console.log('='.repeat(50));
    console.log(JSON.stringify(workflow, null, 2));
    console.log('='.repeat(50));
    alert('Workflow data has been logged to the console. Press F12 to view.');
  }, [workflow]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    workflow,
    addNode: handleAddNode,
    deleteNode: handleDeleteNode,
    updateLabel: handleUpdateLabel,
    insertNode: handleInsertNode,
    saveWorkflow: handleSave,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};

export default useWorkflow;
