/**
 * Module to contain all task-related operations.
 */

import { TaskBare } from './TaskBare';
import { Task } from './Task';
import { Group } from './Group';
 
// ----------
// Public API

/**
 * Checks if the source data contains loops. 
 * If it does - returns the first discovered loop as a list of task Ids.
 * 
 * @param allTasksBare List of tasks as supplied by the external source
 * @returns List of the task IDs which create the first discovered loop
 */
export function findLoop(allTasksBare: TaskBare[]): number[] {
  for (const task of allTasksBare) {
    const loop: number[] = findLoopForTask(allTasksBare, task);
    if (loop.length > 0) {
      return loop;
    }
  }

  return [];
}

/**
 * Prepares tasks in the list to be used in UI:
 * - converts to the "normal" tasks
 * - removes 'orphan' dependent task IDs
 * - set task dependents
 * - sets task locked and completed state
 * 
 * @param allTasksBare List of tasks as supplied by the external source
 * @returns List of the tasks ready to use in the UI
 */
export function prepareTaskList(allTasksBare: TaskBare[]): Task[] {
  const allTasks: Task[] = extendTasks(allTasksBare);
  const tasksWithoutOrphanDependencies: Task[] = allTasks.map(
    (item: Task) => removeOrphanDependents(allTasks, item));
  const tasksWithDependentsSet: Task[] = tasksWithoutOrphanDependencies.map(
    (item: Task) => setTaskDependents(tasksWithoutOrphanDependencies, item));

  return tasksWithDependentsSet.map(
    (item: Task) => setTaskStateByDependencies(tasksWithoutOrphanDependencies, item));
}

/**
 * Returns sorted list of the task group names.
 * 
 * @param allTasks List of all tasks
 */
export function getGroups(allTasks: Task[]): Group[] {
  return allTasks.reduce(
    (result: Group[], task: Task): Group[] => {
      const groupNameUp = task.group.toUpperCase();
      const completedCountInc = (task.completedAt !== null ? 1 : 0);
      const index = result.findIndex((item: Group) => item.name.toUpperCase() === groupNameUp);
      if (index < 0) {
        result.push(new Group(task.group, 1, completedCountInc));
      } else {
        const group: Group = result[index];
        result[index] = {
          ...group, 
          taskCount: group.taskCount + 1, 
          completedTaskCount: group.completedTaskCount + completedCountInc
        };
      }

      return result;
    },
    []).sort((group1: Group, group2: Group): number => group1.name.localeCompare(group2.name));
}

/**
 * Selectes only tasks with the same group as a given one.
 * 
 * @param tasks List of tasks to filter by the group
 * @param group Name of the group to filter by
 */
export function getGroupTasks(tasks: Task[], group: string): Task[] {
  const groupUp = group.toUpperCase();

  return tasks.filter((task: Task) => task.group.toUpperCase() === groupUp);
}

/**
 * Sets task completion status. 
 * If it has actually changed update the locked and completed status of the tasks which depends on this one.
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
  // We cannot complete a locked task
  // For this example I just do nothing.
  // In the real life I will throw an exception or return an empty list 
  // or some flag to allow the caller method to handle an error.
  if (isCompleted && task.isLocked) {
    return allTasks;
  }

  const completedAt: Date | null = 
    (isCompleted && task.completedAt === null ? new Date() : 
     !isCompleted ? null : task.completedAt);
  const newTask: Task = {...task, completedAt};
  const newAllTasks = allTasks.map(
    (item: Task) => item.id === newTask.id ? newTask : item);

  return updateTaskParentsState(newAllTasks, newTask);
}

/**
 * Finds the task with the given ID. If not found throws an exception.
 * This function should be called for the already cleansed task list 
 * so the exception is unlikely to be thrown - thus no special exception type
 * has been defined for this example.
 * 
 * @param tasks List of tasks to find the one with the given ID
 * @param id ID to find the task with
 * @returns Task with the given ID
 */
export function getTaskById(tasks: Task[], id: number): Task {
  const task: Task | undefined = getTaskOrUndefinedById<Task>(tasks, id);
  if (task === undefined) {
    throw new Error(`There is no task with ID=${id}`);
  }

  return task;
}

/**
 * Converts list of Task objects to TaskBare ones.
 * 
 * @param tasks List of Task objects to convert to TaskBare ones
 */
export function stripToBare(tasks: Task[]): TaskBare[] {
  return tasks.reduce(
    (result: TaskBare[], task: Task): TaskBare[] => 
      result.concat(Task.STRIP_TO_BARE(task)),
    []
  );
}

// --------------------------
// Internal utility functions

/**
 * Updates locked and completed state of all tasks which are the parents of the given one.
 * 
 * @param allTasks List of all tasks to process
 * @param task Task to process parents of
 * @returns Updated task list
 */
function updateTaskParentsState(allTasks: Task[], task: Task): Task[] {
  const newAllTasks: Task[] = allTasks.slice();
  const visitedTasks: Task[] = [];
  updateTaskParentsStateInternal(newAllTasks, task, visitedTasks);

  return newAllTasks;
}

/**
 * Updates locked and completed state of all tasks which are the parent of the given one (recursively).
 * For simplification purposes replaces elements of the allTasks array with updates tasks.
 * 
 * @param allTasks List of all tasks to process
 * @param task Task to process parents of
 * @param visitedTasks List of already visited tasks (for optimization purposes)
 */
function updateTaskParentsStateInternal(
  allTasks: Task[], 
  task: Task,
  visitedTasks: Task[], 
): void {
  task.dependentIds.forEach(
    (id: number) => {
      // Skip already visited tasks
      if (getTaskOrUndefinedById<Task>(visitedTasks, id) === undefined) {
        const dependent: Task = getTaskById(allTasks, id);
        visitedTasks.push(dependent);
        const updatedDependent: Task = setTaskStateByDependencies(allTasks, dependent);
        const index = allTasks.findIndex((item: Task) => item.id === updatedDependent.id);
        allTasks[index] = updatedDependent;
        updateTaskParentsStateInternal(allTasks, updatedDependent, visitedTasks);
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
    (id: number) => (getTaskOrUndefinedById<Task>(allTasks, id) !== undefined));
  
  return {...task, dependencyIds: newDependencyIds};
}

/**
 * Sets task dependents (IDs of tasks locked before this one is completed).
 * 
 * @param allTasks List of all tasks to find the dependendents for
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
 * Sets task locked and completed state by ensuring all dependencies are completed.
 * 
 * @param allTasks List of all tasks to find the dependencies in
 * @param task Task to set the locked state for
 * @param task Updated task
 */
function setTaskStateByDependencies(allTasks: Task[], task: Task): Task {
  const isLocked: boolean = hasUncompletedDependency(allTasks, task);
  // Locked task (i.e. the one with uncompete dependencies cannot be completed itself)
  const completedAt: Date | null = (isLocked ? null : task.completedAt);

  return {...task, isLocked, completedAt};
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
  if (task.dependencyIds.length === 0) {
    return false;
  }

  for (const dependencyId of task.dependencyIds) {
    const dependency: Task = getTaskById(allTasks, dependencyId);
    if (dependency.completedAt === null) {
      return true;
    } else {
      const result = hasUncompletedDependency(allTasks, dependency);
      if (result) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Finds the task with the given ID. If not found returns undefined.
 * 
 * @param tasks List of tasks to find the one with the given ID
 * @param id ID to find the task with
 * @returns Task with the given ID or undefined if not found
 */
function getTaskOrUndefinedById<T extends TaskBare>(tasks: T[], id: number): T | undefined {
  return tasks.find((item) => item.id === id);
}

/**
 * Converts tasks supplied by external source to the "normal" tasks.
 * 
 * @param allTaskBare List of tasks as supplied from the external source
 * @returns List of "normal" tasks fonverted from the one supplied by external source
 */
function extendTasks(allTaskBare: TaskBare[]): Task[] {
  return allTaskBare.map((taskBare: TaskBare) => Task.CREATE_FROM_BARE(taskBare));
}

/**
 * Checks if the source data contains loops which starts with the given task. 
 * If it does return the first discovered loop as a list of task Ids.
 * 
 * @param allTasksBare List of tasks as supplied by the external source
 * @param task Task to finds the loops starting with
 * @returns List of the task IDs which create the first discovered loop
 */
function findLoopForTask(allTasksBare: TaskBare[], task: TaskBare): number[] {
  const path: number[] = [task.id];

  return findLoopForTaskInternal(allTasksBare, task, path);
}

/**
 * Checks if the source data contains loops which starts with the given task. 
 * If it does return the first discovered loop as a list of task Ids.
 * 
 * @param allTasksBare List of tasks as supplied by the external source
 * @param task Task to finds the loops starting with
 * @param path Path (the sequence of task IDs) we are building recursively
 * @returns List of the task IDs which create the first discovered loop
 */
function findLoopForTaskInternal(
  allTasksBare: TaskBare[], 
  task: TaskBare,
  path: number[]
): number[] {
  for (const dependencyId of task.dependencyIds) {
    const dependency: TaskBare | undefined = getTaskOrUndefinedById<TaskBare>(
      allTasksBare, dependencyId);
    if (dependency === undefined) {
      continue; // 'Orphan' dependency - this would be dealt with on the later stage
    }

    if (path.findIndex((item: number) => (item === dependency.id)) >= 0) {
      // Loop found!
      path.push(dependency.id);

      return path;
    } else {
      path.push(dependency.id);
      const loop = findLoopForTaskInternal(allTasksBare, dependency, path);
      if (loop.length > 0) {
        return loop;
      } else {
        path.pop();
      }
    }
  }

  return [];
}
