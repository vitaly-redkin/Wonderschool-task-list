/**
 * The Group List component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Group } from '../../model/Group';
import * as TaskManager from '../../model/TaskManager';
import { IApplicationState } from '../../store';
import { list } from '../list/list';
import GroupLine from '../group-line/GroupLine';

// Component properties type
class GroupListOwnProps {
  public groups: Group[];
}

class GroupList extends React.PureComponent<GroupListOwnProps> {
  public render(): JSX.Element {
    return list(
      GroupLine, 
      this.props.groups, 
      'No groups defined',
      'Things To Do');
  }
}

// Redux mapStateToProps function
function mapStateToProps(state: IApplicationState): GroupListOwnProps {
  const groups: Group[] = TaskManager.getGroups(state.taskList.allTasks);

  return {groups};
}

// Redux-Wrapped component
export default connect(mapStateToProps)(GroupList);
