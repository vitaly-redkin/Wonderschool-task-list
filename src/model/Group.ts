/**
 * Class to contain group information.
 */

import { BaseEntity } from './BaseEntity';

export class Group extends BaseEntity<string> {
  /**
   * Constructor.
   *
   * @param name Name of the group. Aslo used as an ID
   * @param taskCount Total task number
   * @param completedTaskCount Number of comleetd tasks
   */
  constructor(
    public name: string,
    public taskCount: number,
    public completedTaskCount: number) {
      super(name);
  }
}
