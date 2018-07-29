/**
 * Class to contain all task details required by UI.
 */

import { TaskBare } from './TaskBare';

export class Task extends TaskBare {
  /**
   * true if the task is locked because at least one of it direct or 
   * indirect dependents is not completed yet. 
   * This is a calculated field set by the TaskManager functions on 
   * the task list loading and update.
   */
  public isLocked: boolean = false;

  /**
   * Array with IDs of the direct dependendents of this task 
   * (i.e. the tasks waiting for this one to be completed)
   * This is a calculated field set by the TaskManager functions on 
   * the task list loading.
   */
  public readonly dependentIds: number[] = [];

  /**
   *
   * @param id Task ID
   * @param task Task name
   * @param group Name of the group the task belongs to
   * @param dependencyIds Array with IDs of the direct dependencies of this task 
   * (i.e. the tasks to be completed before this task can be unlocked)
   * @param completedAt Date/time when this task has been completed
   */
  constructor(
   public readonly id: number,
   public readonly task: string,
   public readonly group: string,
   public readonly dependencyIds: number[],
   public readonly completedAt: Date | null,
  ) {
    super(id, task, group, dependencyIds, completedAt);
  }

  /**
   * Converts task supplied from the exernal source to the "normal" one.
   *
   * @param taskBare Task as ssupplied from the external source
   */
  public static CREATE_FROM_BARE(taskBare: TaskBare): Task {
    return new Task(
      taskBare.id, taskBare.task, taskBare.group, 
      taskBare.dependencyIds, taskBare.completedAt);
  }
}
