/**
 * The Task List component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Task } from '../../model/Task';
import * as TaskManager from '../../model/TaskManager';
import { IApplicationState } from '../../store';
import { AppRoutes } from '../../util/AppRoutes';
import { list } from '../list/list';
import TaskLine from '../task-line/TaskLine';

// Component properties type
class TaskListOwnProps {
  public groupTasks: Task[];
}

// Interface for component URL params
interface ITaskListUrlParams {
  group: string;
}

type TaskListProps = 
  TaskListOwnProps & 
  RouteComponentProps<ITaskListUrlParams>;

class TaskList extends React.PureComponent<TaskListProps> {
  public render(): JSX.Element {
    return list(
      TaskLine, 
      this.props.groupTasks, 
      'No tasks exist for this group',
      this.props.match.params.group,
      'ALL GROUPS',
      AppRoutes.Groups);
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState, ownProps: TaskListProps): TaskListOwnProps {
  const groupTasks: Task[] = TaskManager.getGroupTasks(
    state.taskList.allTasks, ownProps.match.params.group);

  return {groupTasks};
}

// Redux-Wrapped Router-Enabled component
export default connect(mapStateToProps)(TaskList);
