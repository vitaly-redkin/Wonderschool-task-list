/**
 * The root file of the Redux store.
 */

import * as TaskListHandler from './TaskListHandler';

/**
 * Interface for the application state.
 */
export interface IApplicationState {
  taskList: TaskListHandler.ITaskListState;
}

/**
 * Inital application state.
 */
export const initialState: IApplicationState = {
  taskList: TaskListHandler.initialState
};

/**
 * Application reducers.
 */
export const reducers = {
  taskList: TaskListHandler.reducer
};

/**
 * This type can be used as a hint on action creators so that its 'dispatch' and
 * 'getState' params are correctly typed to match your store.
 */
export type AppThunkAction<TAction> = (
  dispatch: (action: TAction) => void,
  getState: () => IApplicationState) => void;
