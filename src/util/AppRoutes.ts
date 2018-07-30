/**
 * Module with application routs related stuff.
 */

/**
 * Enum with application routes.
 */
export enum AppRoutes {
  Groups = '/groups',
  Tasks = '/groups/:group/tasks',
}

/**
 * Composes path to show group tasks.
 * 
 * @param group Group to compose path for
 */
export function composeTaskListPath(group: string): string {
  return AppRoutes.Tasks.replace('/:group/', `/${group}/`);
}
