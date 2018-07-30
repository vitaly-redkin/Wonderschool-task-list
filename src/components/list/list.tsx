/**
 * The generic list component.
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { PlaceholderMessage } from '../placeholder-message/PlaceholderMessage';
import { BaseEntity } from '../../model/BaseEntity';
import './list.css';

/**
 * Class to contain list line properties.
 * 
 * @param TId Type of the entity id field (number, string)
 * @param TEntity Type of the entity shown in the list lines
 */
export class ListLineProps<TId, TEntity extends BaseEntity<TId>> {
  /**
   * Entity the list line shows.
   */
  public readonly entity: TEntity;
}

/**
 * Renders the list (or a place holder if there are lines to render).
 * 
 * @param lineComponent Line componnet to render
 * @param entities List of line entities
 * @param placeHolderMessage Message to show in placeholder when there are no lines
 */
const renderList = <TId, TEntity extends BaseEntity<TId>>(
  lineComponent: React.ComponentType<ListLineProps<TId, TEntity>>,
  entities: TEntity[], 
  placeHolderMessage: string
): JSX.Element => {
  if (entities.length === 0) {
    return (
      <PlaceholderMessage message={placeHolderMessage} />
    );
  }

  // We need component variable title cased for JSX
  // tslint:disable
  const LineComponent = lineComponent;
  // tslint:disable
  return (
    <>
      {entities.map((entity: TEntity) => (
        <Container key={entity.id.toString()} className='list-line-container pl-0 pr-0 pt-3 pb-1'>
          <LineComponent entity={entity} />
        </Container>
      ))
      }
    </>
  );
};

/**
 * Renders component.
 * 
 * @param lineComponent Line componnet to render
 * @param entities List of line entities
 * @param placeHolderMessage Message to show in placeholder when there are no lins
 * @param titleMessage Component title message
 * @param titleLinkCaption Component title link caption (if emoty renders no link)
 * @param titleLinkUrl Component link URL
 */
export const list = <TId, TEntity extends BaseEntity<TId>>(
  lineComponent: React.ComponentType<ListLineProps<TId, TEntity>>,
  entities: BaseEntity<TId>[], 
  placeHolderMessage: string,
  titleMessage: string,
  titleLinkCaption: string = '',
  titleLinkUrl: string = ''
): JSX.Element => {
  return (
    <Container>
      <Row className='list-title-row pb-4'>
        <Col className='list-title'>
          {titleMessage}
        </Col>
        {(titleLinkCaption !== '' &&
        <Col className='list-title-link'>
          <Link to={titleLinkUrl} className='list-title-link'>{titleLinkCaption}</Link>
        </Col>
        )}
      </Row>
      <Row>
        <Container>
          {renderList(lineComponent, entities, placeHolderMessage)}
        </Container>
      </Row>
    </Container>
  );
};
