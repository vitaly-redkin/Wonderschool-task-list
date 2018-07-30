/**
 * The component to contain routes.
 */

import * as React from 'react';
import { Switch, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AppRoutes } from '../../util/AppRoutes';
import GroupList from '../group-list/GroupList';
import TaskList from '../task-list/TaskList';

// Required to make the component "withRouter-enabled".
interface IDummyProps {
}

class Routes extends React.PureComponent<RouteComponentProps<IDummyProps>> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path={AppRoutes.Groups} component={GroupList} exact={true} />
        <Route path={AppRoutes.Tasks} component={TaskList} />
        <Redirect to={AppRoutes.Groups} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
