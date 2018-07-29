/**
 * The main component (to contain everything else).
 */

import * as React from 'react';
import { Switch, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import GroupList from '../group-list/GroupList';
import TaskList from '../task-list/TaskList';
import './Main.css';

/**
 * Enum with application routes.
 */
export enum Routes {
  Groups = '/groups',
  Tasks = '/groups/:group/tasks',
}

interface IDummyProps {

}

class Main extends React.PureComponent<RouteComponentProps<IDummyProps>> {
  public render(): JSX.Element {
    return (
      <Container className='main-container'>
        <Row>
          <Col>
            <Switch>
              <Route path={Routes.Groups} component={GroupList} exact={true} />
              <Route path={Routes.Tasks} component={TaskList} />
              <Redirect to={Routes.Groups} />
            </Switch>
          </Col>
          <Col>
            Placeholder for data
          </Col>
        </Row>
      </Container>
    );
  }
}

/**
 * Composes path to show group tasks.
 * 
 * @param group Group to compose path for
 */
export function composeTaskListPath(group: string): string {
  return Routes.Tasks.replace('/:group/', `/${group}/`);
}

export default withRouter(Main);
