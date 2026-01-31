# Workflow Builder UI

A React-based workflow builder for creating and managing visual workflow diagrams. Built as a take-home assignment for a Frontend Intern position.

## Features

### Core Features
- **Visual Workflow Canvas**: Single-page application with a clean, intuitive interface
- **Multiple Node Types**:
  - **Start**: Initial node (cannot be deleted)
  - **Action**: Single step/task with one outgoing connection
  - **Branch**: Decision point with multiple outgoing connections (Yes/No branches)
  - **End**: Final step with no outgoing connections
- **Node Editing**: Click on a node's label to edit it inline
- **Add Nodes**: Context-sensitive menus to add new nodes after any non-End node
- **Delete Nodes**: Remove nodes while maintaining workflow continuity (children reconnect to parent)
- **Canvas Panning**: Click and drag on empty canvas space to pan around
- **Zoom Controls**: Use Ctrl+Scroll or the +/- buttons to zoom in/out
- **Draggable Nodes**: Reposition nodes anywhere on the canvas
- **Resizable Nodes**: Drag the bottom-right corner to resize nodes
- **Edge Connections**: Visual SVG edges with curved paths and arrows

### Bonus Features
- **Save Workflow**: Export workflow data structure to console (click Save button)
- **Undo/Redo**: Full undo/redo functionality with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Interactive Node Creation**: Context-sensitive popover menus on connection points
- **Edge Insert**: Click on any edge to insert a new node between existing nodes
- **Help Guide**: Built-in help popup for first-time users

## Tech Stack

- **React** (functional components with Hooks)
- **JavaScript/JSX**
- **CSS** (no UI libraries - custom styling)
- **Vite** (build tool)

## Project Structure

```
Emitrr/
├── public/
├── src/
│   ├── components/
│   │   ├── canvas/          # Main workflow canvas container
│   │   ├── controls/        # Top-level controls (save, undo, redo, help)
│   │   ├── draggable-node/  # Draggable & resizable node wrapper
│   │   ├── edges/           # SVG edge connections with insert buttons
│   │   ├── node/            # Individual workflow node rendering
│   │   ├── node-actions/    # Node action menus (add/delete)
│   │   └── ui/              # Reusable UI components (Badge, Button, EditableText)
│   ├── hooks/
│   │   ├── useWorkflow.js      # Workflow state management with undo/redo
│   │   ├── useNodePositions.js # Node position & sizing management
│   │   └── useUndoRedo.js      # Undo/redo utility hook
│   ├── utils/
│   │   ├── workflowHelpers.js  # Workflow manipulation functions
│   │   └── generateId.js       # Unique ID generator
│   ├── data/
│   │   └── initialWorkflow.js  # Initial workflow data & node types
│   ├── styles/
│   │   ├── variables.css    # CSS custom properties
│   │   └── global.css       # Global styles
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Emitrr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding Nodes
1. Hover over any node (except End nodes)
2. Click the "+" button that appears
3. Select the node type from the dropdown menu (Action, Condition, or End)
4. For Branch nodes: Use the "Add to 'Yes' branch" or "Add to 'No' branch" buttons

### Inserting Nodes Between Existing Nodes
1. Hover over any edge (connection line) between two nodes
2. Click the "+" button that appears on the edge
3. Select the node type to insert

### Editing Nodes
- Click on a node's label/title to edit it inline
- Press Enter to save or Escape to cancel

### Deleting Nodes
- Hover over a node and click the trash icon (except the Start node)
- Click again to confirm deletion
- Child nodes will be automatically reconnected to the parent

### Canvas Navigation
- **Pan**: Click and drag on empty canvas space
- **Zoom**: Use Ctrl+Scroll or the +/- buttons in the header
- **Reset View**: Click the reset button (⟲) to return to default view

### Keyboard Shortcuts
- **Ctrl+Z**: Undo last action
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo last undone action

### Saving Workflow
- Click the "Save" button in the top-right corner
- The complete workflow data structure will be logged to the browser console (F12)

## Data Model

The workflow is represented as a tree structure:

```javascript
{
  id: 'unique_id',
  type: 'start' | 'action' | 'branch' | 'end',
  label: 'Node Label',
  children: [] // Array of child nodes
}

// For branch nodes, children is an array of branch arrays:
{
  id: 'branch_id',
  type: 'branch',
  label: 'Check Condition',
  children: [
    [...], // Yes branch (index 0)
    [...]  // No branch (index 1)
  ]
}
```

## Design Decisions

- **No external workflow libraries**: Custom SVG edge rendering and node positioning
- **Immutable state updates**: All workflow modifications create new state objects
- **History-based undo/redo**: Maintains a stack of workflow states (max 50)
- **CSS transitions only**: No animation libraries, using native CSS for smooth UX

## License

This project is created for educational purposes as part of a job application.
