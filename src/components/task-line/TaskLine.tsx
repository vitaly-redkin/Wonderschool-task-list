/**
 * The Task Line component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Task } from '../../model/Task';
import { actionCreators } from '../../store/TaskListHandler';
import { ListLineProps } from '../list/list';

import './TaskLine.css';

import lockedImage from '../../images/Locked.svg';
import completedImage from '../../images/Completed.svg';
import incompleteImage from '../../images/Incomplete.svg';

type TaskLineProps = 
  ListLineProps<number, Task> & 
  typeof actionCreators;

class TaskLine extends React.PureComponent<TaskLineProps> {
  public render(): JSX.Element {
    const task: Task = this.props.entity;
    const taskRowClassName: string = 
      (task.isLocked ? 'task-line-row-locked' : 'task-line-row');
    const imageClassName: string = 
      (task.isLocked ? 'task-line-image-locked' : 'task-line-image');
    const textClassName: string = 
      (task.isLocked             ? 'task-line-text-locked' : 
       task.completedAt !== null ? 'task-line-text-completed' : 
                                   'task-line-text');

    return (
      <Row key={task.id} onClick={this.toggleTaskState} className={`pb-2 ${taskRowClassName}`}>
        <Col className='col-1'>
          <img 
            className={imageClassName}
            src={task.isLocked ? 
                  lockedImage : 
                task.completedAt !== null ?
                  completedImage : 
                  incompleteImage }
              title={task.isLocked ? 
                      'Locked' : 
                    task.completedAt !== null ? 
                      'Completed' : 
                      'Incomplete' }
              alt={task.isLocked ? 
                    'Task is locked pending dependencies completion' : 
                   task.completedAt !== null ? 
                    'Task is completed' : 
                    'Click to complete the task' }
        />
        </Col>
        <Col className={`col-5 ${textClassName}`}>
          {task.task}
        </Col>
      </Row>
    );
  }

  /**
   * Event handler for the task state change event.
   */
  private toggleTaskState = (): void => {
    const task: Task = this.props.entity;
    if (!task.isLocked) {
      const isCompleted = (task.completedAt !== null);
      this.props.setTaskCompletionState(task, !isCompleted);
    }
  }
}

// Redux-Wrapped Router-Enabled component
export default connect(null, actionCreators)(TaskLine);
