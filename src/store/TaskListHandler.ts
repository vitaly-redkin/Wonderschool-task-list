/**
 * The Redux store stuff for the task list.
 */

import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import { Task } from '../model/Task';
import * as TaskManager from '../model/TaskManager';

/**
 * Interface for the task list state.
 */
export interface ITaskListState {
  allTasks: Task[];
  lastError: string;
}

/**
 * Initial task list state,
 */
export const initialState: ITaskListState = {
  allTasks: [],
  lastError: '',
};

/**
 * Enumeration for the action type strings.
 */
export enum ActionTypeEnum {
  TaskListSet = '@@TASK_LIST/SET',
  TaskSetCompletionState = '@@TASK/SET_COMPLETED',
  ErrorSet = '@@ERROR/SET',
}

// -----------------
// ACTIONS

/**
 * Interface for the TaskListSet action.
 */
interface ITaskListSetAction {
  // tslint:disable
  type: ActionTypeEnum.TaskListSet;
  // tslint:enable
  allTasks: Task[];
}

/**
 * Interface for the TaskSetCompletionState action.
 */
interface ITaskSetCompletionStateAction {
  // tslint:disable
  type: ActionTypeEnum.TaskSetCompletionState;
  // tslint:enable
  task: Task;
  isCompleted: boolean;
}

/**
 * Interface for the SetErrorAction
 */
interface IErrorSetAction {
  // tslint:disable
  type: ActionTypeEnum.ErrorSet;
  // tslint:enable
  error: string;
}

/**
 * Declare a 'discriminated union' type. This guarantees that all references
 * to 'type' properties contain one of the declared type strings
 * (and not any other arbitrary string).
 */
export type KnownAction = 
  ITaskListSetAction | ITaskSetCompletionStateAction | IErrorSetAction;

/**
 * ACTION CREATORS.
 * These are functions exposed to UI components that will trigger a state transition.
 */
export const actionCreators = {
  setTaskList: (allTasks: Task[]): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.TaskListSet, allTasks });
  },

  setTaskCompletionState: (task: Task, isCompleted: boolean): AppThunkAction<KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.TaskSetCompletionState, task, isCompleted });
  },

  setError: (error: string): AppThunkAction<KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.ErrorSet, error });
  },
};

/**
 * REDUCER - For a given state and action, returns the new state.
 *
 * @param state Current application state
 * @param incomingAction Dispatched Redux action
 *
 * @returns New application state
 */
export const reducer: Reducer<ITaskListState> =
  (state: ITaskListState, incomingAction: KnownAction): ITaskListState => {
  switch (incomingAction.type) {
    case ActionTypeEnum.TaskListSet:
    {
      const action: ITaskListSetAction = incomingAction;

      return {...state, allTasks: action.allTasks, lastError: ''};
    }
    case ActionTypeEnum.TaskSetCompletionState:
    {
      const action: ITaskSetCompletionStateAction = incomingAction;

      const newAllTasks = TaskManager.setTaskCompletionState(
        state.allTasks, action.task, action.isCompleted);
        
      return {...state, allTasks: newAllTasks, lastError: ''};
      }
    case ActionTypeEnum.ErrorSet:
    {
      const action: IErrorSetAction = incomingAction;

      return {...state, lastError: action.error};
    }
    default:
      // Do nothing - the final return will work
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  //  (or default initial state if none was supplied)
  return state || initialState;
};
