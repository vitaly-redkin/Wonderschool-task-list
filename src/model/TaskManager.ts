/**
 * Module to contain all task-related operations.
 */

import { TaskBare } from './TaskBare';
import { Task } from './Task';
 
// ----------
// Public API

/**
 * Prepares tasks in the list to be used in UI:
 * - converts to the "normal" tasks
 * - removes 'orphan' dependent task IDs
 * - set task dependents
 * - sets task locked state
 * 
 * @param allTasksBare List of tasks as supplied by the external source
 * @returns List of the tasks ready to use in the UI
 */
export function prepareTaskList(allTasksBare: TaskBare[]): Task[] {
  const allTasks = extendTasks(allTasksBare);
  const tasksWithoutOrphanDependencies: Task[] = allTasks.map(
    (item: Task) => removeOrphanDependents(allTasks, item));
  const tasksWithDependentsSet: Task[] = tasksWithoutOrphanDependencies.map(
    (item: Task) => setTaskDependents(tasksWithoutOrphanDependencies, item));
  const tasksWithLockedStateSet: Task[] = tasksWithDependentsSet.map(
    (item: Task) => setTaskLockedStateByDependencies(tasksWithoutOrphanDependencies, item));
  return tasksWithLockedStateSet;
}

/**
 * Selectes only tasks with the same group as a given one.
 * 
 * @param tasks List of tasks to filter by the group
 * @param group Name of the group to filter by
 */
export function getGroupTasks(tasks: Task[], group: string): Task[] {
  return tasks.filter((task: Task) => task.group.toUpperCase() === group.toUpperCase());
}

/**
 * Sets task completion status. 
 * If it has actually changed update the locked status of the tasks which depends on this one.
 * 
 * @param allTasks List of all tasks to update when the given task completed status has been changed
 * @param task Task to set the completion status of
 * @param isCompleted true if the task is completed or false otherwise
 * @returns Updated task list
 */
export function setTaskCompletionState(
    allTasks: Task[], 
    task: Task, 
    isCompleted: boolean
  ): Task[] {
  // We cannot complete an incompleted task
  // For this example I just do nothing.
  // In the real life I will throw an exception or return an empty list 
  // or some flag to allow the caller method to handle an error.
  if (isCompleted && task.isLocked) return allTasks;

  const completedAt = 
    (isCompleted && task.completedAt === null ? Date.now() : 
     !isCompleted ? null : task.completedAt);
  const newTask: Task = <Task>{...task, completedAt};
  const newAllTasks = allTasks.map(
    (item: Task) => item.id === newTask.id ? newTask : item);
  return updateTaskParentsLockedState(newAllTasks, newTask);
}

/**
 * Finds the task with the given ID. If not found throws an exception.
 * This function should be called for the already prepared task list 
 * so the exception is unlikely to be thrown - thus no special exeption type
 * has been defined for this example.
 * 
 * @param tasks List of tasks to find the one with the given ID
 * @param id ID to find the task with
 * @returns Task with the given ID
 */
export function getTaskById(tasks: Task[], id: number): Task {
  const task: Task | undefined = getTaskOrUndefinedById(tasks, id);
  if (task === undefined) {
    throw new Error(`There is no task with ID=${id}`);
  }

  return task;
}

// --------------------------
// Internal utility functions

/**
 * Updates locked state of all tasks which are the parent of the given one.
 * 
 * @param allTasks List of all tasks to process
 * @param task Task to process parents of
 * @returns Updated task list
 */
function updateTaskParentsLockedState(allTasks: Task[], task: Task): Task[] {
  const newAllTasks: Task[] = allTasks.slice();
  const visitedTasks: Task[] = [];
  updateTaskParentsLockedStateInternal(newAllTasks, task, visitedTasks);
  return newAllTasks;
}

/**
 * Updates locked state of all tasks which are the parent of the given one (recursively).
 * For simplification purposes replaces elements of the allTasks array with updates tasks.
 * 
 * @param allTasks List of all tasks to process
 * @param task Task to process parents of
 * @param visitedTasks List of already visited tasks (for optimization purposes)
 */
function updateTaskParentsLockedStateInternal(
  allTasks: Task[], 
  task: Task,
  visitedTasks: Task[], 
): void {
  task.dependentIds.forEach(
    (id: number) => {
      // Skip already visited tasks
      if (getTaskOrUndefinedById(visitedTasks, id) === undefined)
      {
        const dependent: Task = getTaskById(allTasks, id);
        visitedTasks.push(dependent);
        const updatedDependent: Task = setTaskLockedStateByDependencies(allTasks, dependent);
        const index = allTasks.findIndex((item: Task) => item.id === updatedDependent.id);
        allTasks[index] = updatedDependent;
        updateTaskParentsLockedStateInternal(allTasks, updatedDependent, visitedTasks);
      }
    });
}

/**
 * Remove 'orphan' dependency IDs from the given task.
 * 
 * @param allTasks List of all tasks to find the dependencies in
 * @param task Task to remove 'orphan' dependecy IDs from
 * @returns Task without dependency IDs
 */
function removeOrphanDependents(allTasks: Task[], task: Task): Task {
  const newDependencyIds: number[] = task.dependencyIds.filter(
    (id: number) => (getTaskOrUndefinedById(allTasks, id) !== undefined));
  const newTask: Task = {...task, dependencyIds: newDependencyIds};

  return newTask;
}

/**
 * Sets task dependents (IDs of tasks locked before this one is completed).
 * 
 * @param allTasks List of all tasks to find the dependendents fo
 * @param task Task to set the dependents for
 * @param task Updated task
 */
function setTaskDependents(allTasks: Task[], task: Task): Task {
  const dependentIds: number[] = allTasks.reduce(
    (ids: number[], item: Task) => 
     (item.dependencyIds.findIndex((id: number) => id === task.id) >= 0 ? 
      ids.concat(item.id) : ids), 
    []);
  return {...task, dependentIds};
}


/**
 * Sets task locked state buy ensuring all dependencies are completed.
 * 
 * @param allTasks List of all tasks to find the dependencies in
 * @param task Task to set the locked state for
 * @param task Updated task
 */
function setTaskLockedStateByDependencies(allTasks: Task[], task: Task): Task {
  const isLocked: boolean = hasUncompletedDependency(allTasks, task);
  return {...task, isLocked};
}

/**
 * Checks all direct and indirect dependencies of the given task and returns true
 * if at least one of them is incomplete.
 * 
 * @param allTasks List of all tasks to find the dependencies in
 * @param task Task to check the dependencies of
 * @returns true if the task has at least one incomplete dependency (direct or indirect)
 */
function hasUncompletedDependency(allTasks: Task[], task: Task): boolean {
  if (task.dependencyIds.length === 0) return false;

  for (let dependencyId of task.dependencyIds) {
    const dependency: Task = getTaskById(allTasks, dependencyId);
    if (dependency.completedAt === null) {
      return true;
    } else {
      return hasUncompletedDependency(allTasks, dependency);
    }
  };

  return false;
}

/**
 * Finds the task with the given ID. If not found returns undefined.
 * 
 * @param tasks List of tasks to find the one with the given ID
 * @param id ID to find the task with
 * @returns Task with the given ID or undefined if not found
 */
function getTaskOrUndefinedById(tasks: Task[], id: number): Task | undefined {
  return tasks.find((item) => item.id === id);
}

/**
 * Converts tasks supplied by external source to the "normal" tasks.
 * 
 * @param allTaskBare List of tasks as supplied from the external source
 * @returns List of "normal" tasks fonverted from the one supplied by external source
 */
function extendTasks(allTaskBare: TaskBare[]): Task[] {
  return allTaskBare.map((taskBare: TaskBare) => Task.createFromBare(taskBare));
}
