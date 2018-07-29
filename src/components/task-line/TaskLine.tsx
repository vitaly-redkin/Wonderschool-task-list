/**
 * The Task Line component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Task } from '../../model/Task';
import { actionCreators } from '../../store/TaskListHandler';

import lockedImage from '../../images/Locked.svg';
import completedImage from '../../images/Completed.svg';
import incompleteImage from '../../images/Incomplete.svg';

// Component properties type
class TaskLineOwnProps {
  public task: Task;
}

type TaskLineProps = 
  TaskLineOwnProps & 
  typeof actionCreators;

class TaskLine extends React.PureComponent<TaskLineProps> {
  public render(): JSX.Element {
    const task: Task = this.props.task;

    return (
      <Row key={task.id} onClick={this.toggleTaskState}>
        <Col>
          <img 
            src={task.isLocked ? 
                  lockedImage : 
                task.completedAt !== null ?
                  completedImage : 
                  incompleteImage }
              title={task.isLocked ? 
                      'Locked' : 
                    task.completedAt !== null ? 
                      'Completed' : 
                      'Icomplete' }
              alt={task.isLocked ? 
                  'Task is locked pending dependencies completion' : 
                task.completedAt !== null ? 
                  'Task is completed' : 
                  'Click to complete the task' }
          />
        </Col>
        <Col>
          {task.task}
        </Col>
      </Row>
    );
  }

  /**
   * Event handler for the task state change event.
   */
  private toggleTaskState = (): void => {
    const task: Task = this.props.task;
    if (!task.isLocked) {
      const isCompleted = (task.completedAt !== null);
      this.props.setTaskCompletionState(task, !isCompleted);
    }
  }
}

// Redux-Wrapped Router-Enabled component
export default connect(null, actionCreators)(TaskLine);
