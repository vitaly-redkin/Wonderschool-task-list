/**
 * Class to contain task details as suplied from the server.
 */

 export class TaskBare {
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
   }
 }