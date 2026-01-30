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
          label: 'Is Valid?',
          children: [
            // True branch
            [
              {
                id: 'action_2',
                type: 'action',
                label: 'Process Data',
                children: [
                  {
                    id: 'end_1',
                    type: 'end',
                    label: 'End (Success)',
                    children: [],
                  },
                ],
              },
            ],
            // False branch
            [
              {
                id: 'end_2',
                type: 'end',
                label: 'End (Failed)',
                children: [],
              },
            ],
          ],
        },
      ],
    },
  ],
};
