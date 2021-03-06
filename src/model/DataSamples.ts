/**
 * Test samples.
 */

import { TaskBare } from './TaskBare';

/**
 * 'Normal' sample
 */
export const normalSample: TaskBare[] = [
  {
    id: 1,
    group: 'Purchases',
    task: 'Go to the bank',
    dependencyIds: [],
    completedAt: null,
  },
  {
    id: 2,
    group: 'Purchases',
    task: 'Buy hammer',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 3,
    group: 'Purchases',
    task: 'Buy wood',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 4,
    group: 'Purchases',
    task: 'Buy nails',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 5,
    group: 'Purchases',
    task: 'Buy paint',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 6,
    group: 'Build Airplane',
    task: 'Hammer nails into wood',
    dependencyIds: [2, 3, 4],
    completedAt: null,
  },
  {
    id: 7,
    group: 'Build Airplane',
    task: 'Paint wings',
    dependencyIds: [5, 6],
    completedAt: null,
  },
  {
    id: 8,
    group: 'Build Airplane',
    task: 'Have a snack',
    dependencyIds: [],
    completedAt: null,
  }
];

/**
 * Sample with 'orphan' dependency
 */
export const sampleWithOrphan: TaskBare[] = [
  {
    id: 1,
    group: 'Purchases',
    task: 'Go to the bank',
    dependencyIds: [666], // Orphan dependency to remove
    completedAt: null,
  },
  {
    id: 2,
    group: 'Purchases',
    task: 'Buy hammer',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 3,
    group: 'Purchases',
    task: 'Buy wood',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 4,
    group: 'Purchases',
    task: 'Buy nails',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 5,
    group: 'Purchases',
    task: 'Buy paint',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 6,
    group: 'Build Airplane',
    task: 'Hammer nails into wood',
    dependencyIds: [2, 3, 4],
    completedAt: null,
  },
  {
    id: 7,
    group: 'Build Airplane',
    task: 'Paint wings',
    dependencyIds: [5, 6],
    completedAt: null,
  },
  {
    id: 8,
    group: 'Build Airplane',
    task: 'Have a snack',
    dependencyIds: [],
    completedAt: null,
  }
];

/**
 * Sample with simple loop ([1, 2, 1])
 */
export const sampleWithLoop1: TaskBare[] = [
  {
    id: 1,
    group: 'Purchases',
    task: 'Go to the bank',
    dependencyIds: [2],
    completedAt: null,
  },
  {
    id: 2,
    group: 'Purchases',
    task: 'Buy hammer',
    dependencyIds: [1],
    completedAt: null,
  },
];

/**
 * Sample with indirect loop loop ([1, 6, 2, 1])
 */
export const sampleWithLoop2: TaskBare[] = [
  {
    id: 1,
    group: 'Purchases',
    task: 'Go to the bank',
    dependencyIds: [6],
    completedAt: null,
  },
  {
    id: 2,
    group: 'Purchases',
    task: 'Buy hammer',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 3,
    group: 'Purchases',
    task: 'Buy wood',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 4,
    group: 'Purchases',
    task: 'Buy nails',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 5,
    group: 'Purchases',
    task: 'Buy paint',
    dependencyIds: [1],
    completedAt: null,
  },
  {
    id: 6,
    group: 'Build Airplane',
    task: 'Hammer nails into wood',
    dependencyIds: [2, 3, 4],
    completedAt: null,
  },
  {
    id: 7,
    group: 'Build Airplane',
    task: 'Paint wings',
    dependencyIds: [5, 6],
    completedAt: null,
  },
  {
    id: 8,
    group: 'Build Airplane',
    task: 'Have a snack',
    dependencyIds: [],
    completedAt: null,
  }
];
