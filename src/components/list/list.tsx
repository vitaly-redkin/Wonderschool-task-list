/**
 * The generic list component.
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { PlaceholderMessage } from '../placeholder-message/PlaceholderMessage';
import { BaseEntity } from '../../model/BaseEntity';

class ListLineProps<TId> {
  public readonly key: string;
  public readonly entity: BaseEntity<TId>;
}

export type ListLineComponent<TId> = 
  React.StatelessComponent<ListLineProps<TId>>;

/**
 * Renders task list (or a place holder if there are now tasks).
 */
const renderList = <TId extends {}>(
  lineComponent: ListLineComponent<TId>,
  entities: BaseEntity<TId>[], 
  placeHolderMessage: string
): JSX.Element => {
  if (entities.length === 0) {
    return (
      <PlaceholderMessage message={placeHolderMessage} />
    );
  }

  return (
    <>
      {entities.map((entity: BaseEntity<TId>) => (
        React.createElement(lineComponent, {key: entity.toString(), entity})))
      }
    </>
  );
};

export const list = <TId extends {}>(
  lineComponent: ListLineComponent<TId>,
  entities: BaseEntity<TId>[], 
  placeHolderMessage: string,
  titleMessage: string,
  titleLinkCaption: string = '',
  titleLinkUrl: string = ''
): JSX.Element => {
  return (
    <Container className='pl-0 pr-0'>
      <Row>
        <Col>
          {titleMessage}
        </Col>
        (titleLinkCaption !== '' &&
        <Col>
          <Link to={titleLinkUrl}>{titleLinkCaption}</Link>
        </Col>
        )
      </Row>
      <Row>
        <Container>
          {renderList(lineComponent, entities, placeHolderMessage)}
        </Container>
      </Row>
    </Container>
  );
};
