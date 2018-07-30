/**
 * The Data Loader component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, Container, Row, Col, Button } from 'reactstrap';
import { actionCreators } from '../../store/TaskListHandler';
import { TaskBare } from '../../model/TaskBare';
import { Task } from '../../model/Task';
import * as TaskManager from '../../model/TaskManager';
import { IApplicationState } from '../../store';

import './DataLoader.css';

// Component properties type
class DataLoaderOwnProps {
  public json: string;
  public lastError: string;
}

// Component properties type
type DataLoaderProps = 
  DataLoaderOwnProps & 
  typeof actionCreators;

class DataLoader extends React.PureComponent<DataLoaderProps> {
  private editRef: React.RefObject<HTMLTextAreaElement | null> = 
    React.createRef<HTMLTextAreaElement | null>();

  public render(): JSX.Element {
    return (
      <Container className='v-100 h-100'>
        <Row className='pb-3'>
          <Col className='data-loader-title pl-0'>
            Task JSON Data
          </Col>
          <Col className='text-right mr-2'>
            <Button
              className='primary'
              type='button'
              onClick={this.loadData}
            > 
              Load Data
            </Button> 
          </Col>
        </Row>
        {
          this.props.lastError !== '' &&
          <Row className='pb-1 pt-0'>
            <Alert className='alert-danger w-100 mr-4'>
              {this.props.lastError}
            </Alert>    
          </Row>
        }
        <Row className='data-loader-edit'>
          <textarea 
            defaultValue={this.props.json}
            ref={this.editRef}
            className='data-loader-edit'
          />
        </Row>
      </Container>
    );
  }

  /**
   * Loads JSON data for tasks.
   */
  private loadData = (): void => {
    const json: string = this.editRef.current!.value.trim();
    try {
      const data: TaskBare[] = JSON.parse(json);
      const loop: number[] = TaskManager.findLoop(data);
      if (loop.length === 0) {
        const allTasks: Task[] = TaskManager.prepareTaskList(data);
        this.props.setTaskList(allTasks);
      } else {
        const error: string = `There is a loop in the data: ${loop}`;
        this.props.setError(error);
      }
    } catch (e) {
      const error: string = e.message;
      this.props.setError(error);
    }
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): DataLoaderOwnProps {
  const allTaskBare: TaskBare[] = TaskManager.stripToBare(state.taskList.allTasks);
  const json: string = JSON.stringify(allTaskBare, null, 2);

  return {json, lastError: state.taskList.lastError};
}

// Redux-Wrapped component
export default connect(mapStateToProps, actionCreators)(DataLoader);
