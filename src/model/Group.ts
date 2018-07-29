/**
 * Class to contain group information.
 */
export class Group {
  /**
   * Constructor.
   *
   * @param name Name of the group.
   * @param taskCount Total task number
   * @param completedTaskCount Number of comleetd tasks
   */
  constructor(
    public name: string,
    public taskCount: number,
    public completedTaskCount: number) {
  }
}
