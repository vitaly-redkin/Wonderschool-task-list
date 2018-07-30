/**
 * The Group List component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import { Group } from '../../model/Group';
import * as TaskManager from '../../model/TaskManager';
import { IApplicationState } from '../../store';
import { PlaceholderMessage } from '../placeholder-message/PlaceholderMessage';
import { composeTaskListPath } from '../../util/AppRoutes';

// Component properties type
class GroupListOwnProps {
  public groups: Group[];
}

type GroupListProps = GroupListOwnProps;

class GroupList extends React.PureComponent<GroupListProps> {
  public render(): JSX.Element {
    const groups: Group[] = this.props.groups;
    if (groups.length === 0) {
      return (
        <PlaceholderMessage message='No tasks exist' />
      );
    }

    return (
      <Container className='pl-0 pr-0'>
        {groups.map((group: Group) => (
          <Row key={group.name} >
            <Link 
              to={composeTaskListPath(group.name)}>{group.name}
            </Link> 
         </Row>
        ))}
      </Container>
    );
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): GroupListOwnProps {
  const groups: Group[] = TaskManager.getGroups(state.taskList.allTasks);

  return {groups};
}

// Redux-Wrapped component
export default connect(mapStateToProps)(GroupList);
