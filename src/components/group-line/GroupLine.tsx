/**
 * The Group Line component.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Group } from '../../model/Group';
import { actionCreators } from '../../store/TaskListHandler';
import { composeTaskListPath } from '../../util/AppRoutes';
import { ListLineProps } from '../list/list';

import './GroupLine.css';

import groupImage from '../../images/Group.svg';

type GroupLineProps = 
  ListLineProps<string, Group> & 
  typeof actionCreators;

class GroupLine extends React.PureComponent<GroupLineProps> {
  public render(): JSX.Element {
    const group: Group = this.props.entity;
    const subText: string = 
      `${group.completedTaskCount} of ${group.taskCount} tasks(s) complete`;

    return (
      <Link to={composeTaskListPath(group.name)}>
        <Row key={group.name} className='group-line-row'>
          <Col className='col-1'>
            <img 
              className='group-line-image'
              src={groupImage}
              alt='Task Group'
          />
          </Col>
          <Col className='col-5 group-line-text'>
            {group.name}
            <p className='group-line-subtext'>{subText}</p>
          </Col>
        </Row>
      </Link> 
    );
  }
}

// Redux-Wrapped Router-Enabled component
export default connect(null, actionCreators)(GroupLine);
