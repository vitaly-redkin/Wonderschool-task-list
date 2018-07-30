/**
 * Base class for task and group entities.
 */

export class BaseEntity<TId> {
  /**
   * Constructor.
   * 
   * @param id Entity ID
   */
  constructor(public readonly id: TId) {
  }
}
