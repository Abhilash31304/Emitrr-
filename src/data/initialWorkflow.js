/**
 * Initial workflow data structure
 * The workflow starts with a single "Start" node
 */
export const initialWorkflow = {
  id: 'start_node',
  type: 'start',
  label: 'Start',
  children: [],
};

/**
 * Node type definitions
 */
export const NODE_TYPES = {
  START: 'start',
  ACTION: 'action',
  BRANCH: 'branch',
  END: 'end',
};

/**
 * Example workflow structure for reference
 * Branch nodes now have 3 branches: [left, bottom, right]
 */
export const exampleWorkflow = {
  id: 'start_node',
  type: 'start',
  label: 'Start',
  children: [
    {
      id: 'action_1',
      type: 'action',
      label: 'Execute Code',
      children: [
        {
          id: 'branch_1',
          type: 'branch',
          label: 'Check Status',
          children: [
            // Left branch (index 0)
            [
              {
                id: 'end_1',
                type: 'end',
                label: 'End (Error)',
                children: [],
              },
            ],
            // Bottom/Center branch (index 1)
            [
              {
                id: 'action_2',
                type: 'action',
                label: 'Process Data',
                children: [
                  {
                    id: 'end_2',
                    type: 'end',
                    label: 'End (Success)',
                    children: [],
                  },
                ],
              },
            ],
            // Right branch (index 2)
            [
              {
                id: 'end_3',
                type: 'end',
                label: 'End (Pending)',
                children: [],
              },
            ],
          ],
        },
      ],
    },
  ],
};
