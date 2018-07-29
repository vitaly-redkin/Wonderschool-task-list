/**
 * The application root component.
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IApplicationState } from '../../store';
import { configureStore, StoreType } from '../../store/configureStore';
import * as TaskManager from '../../model/TaskManager';
import { Task } from '../../model/Task';
import * as DataSamples from '../../model/DataSamples';
import Main from '../main/Main';

// Application initial state
const allTasks: Task[] = TaskManager.prepareTaskList(DataSamples.normalSample);
const initialState: IApplicationState = { taskList: { allTasks, lastError: ''} };

// Redux store to use in the application
const store: StoreType = configureStore(initialState);

export class App extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Main /> 
        </BrowserRouter>
      </Provider>
    );
  }
}
