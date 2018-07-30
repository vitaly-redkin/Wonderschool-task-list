/**
 * The Task List component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { Task } from '../../model/Task';
import * as TaskManager from '../../model/TaskManager';
import { IApplicationState } from '../../store';
import { actionCreators } from '../../store/TaskListHandler';
import { AppRoutes } from '../../util/AppRoutes';
import { PlaceholderMessage } from '../placeholder-message/PlaceholderMessage';
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
  RouteComponentProps<ITaskListUrlParams> & 
  typeof actionCreators;

class TaskList extends React.PureComponent<TaskListProps> {
  public render(): JSX.Element {
    return (
      <Container className='pl-0 pr-0'>
        <Row>
          <Col>
            {this.props.match.params.group}
          </Col>
          <Col>
            <Link to={AppRoutes.Groups}>All Groups</Link>
          </Col>
        </Row>
        <Row>
          <Container>
            {this.renderList()}
          </Container>
        </Row>
      </Container>
    );
  }

  /**
   * Renders task list (or a place holder if there are now tasks).
   */
  private renderList(): JSX.Element {
    const groupTasks: Task[] = this.props.groupTasks;
    if (groupTasks.length === 0) {
      return (
        <PlaceholderMessage message='No tasks exist for this group' />
      );
    }

    return (
      <>
        {groupTasks.map((task: Task) => (
          <TaskLine key={task.id} task={task} />
        ))}
      </>
    );
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
