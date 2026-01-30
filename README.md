# Workflow Builder UI

A React-based workflow builder for creating and managing visual workflow diagrams. Built as a take-home assignment for a Frontend Intern position.

## Features

### Core Features
- **Visual Workflow Canvas**: Single-page application with a clean, intuitive interface
- **Multiple Node Types**:
  - **Start**: Initial node (cannot be deleted)
  - **Action**: Single step/task with one outgoing connection
  - **Branch**: Decision point with multiple outgoing connections (True/False)
  - **End**: Final step with no outgoing connections
- **Node Editing**: Double-click to edit node labels
- **Add Nodes**: Context menu to add new nodes after any non-End node
- **Delete Nodes**: Remove nodes while maintaining workflow continuity

### Bonus Features
- **Save Workflow**: Export workflow data structure to console
- **Undo/Redo**: Basic undo/redo functionality for structural changes

## Tech Stack

- **React** (functional components with Hooks)
- **JavaScript/JSX**
- **CSS** (no UI libraries - custom styling)
- **Vite** (build tool)

## Project Structure

```
Emitrr/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── canvas/          # Main workflow canvas
│   │   ├── node/            # Individual workflow nodes
│   │   ├── node-actions/    # Node action menus
│   │   ├── controls/        # Top-level controls (save, undo, redo)
│   │   └── ui/              # Reusable UI components
│   ├── hooks/
│   │   ├── useWorkflow.js   # Workflow state management
│   │   └── useUndoRedo.js   # Undo/redo functionality
│   ├── utils/
│   │   ├── workflowHelpers.js  # Workflow manipulation functions
│   │   └── generateId.js       # Unique ID generator
│   ├── data/
│   │   └── initialWorkflow.js  # Initial workflow data
│   ├── styles/
│   │   ├── variables.css    # CSS custom properties
│   │   └── global.css       # Global styles
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
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
2. Click the "+" button
3. Select the node type from the menu (Action, Branch, or End)

### Editing Nodes
- Double-click on a node's label to edit it
- Press Enter to save or Escape to cancel

### Deleting Nodes
- Click the "×" button on any node (except the Start node)
- Child nodes will be reconnected to maintain workflow continuity

### Saving Workflow
- Click the "Save" button in the top-right corner
- The workflow data structure will be logged to the console

## Data Model

The workflow is represented as a tree structure:

```javascript
{
  id: 'unique_id',
  type: 'start' | 'action' | 'branch' | 'end',
  label: 'Node Label',
  children: [] // Array of child nodes (or array of arrays for branch nodes)
}
```

## License

This project is created for educational purposes as part of a job application.
