import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Heading from '../Heading';
import { StyledCard, CardHead, CardContentHolder } from './Card.styles';

function Card({ children, title, filter, button, noPadding, ...props }) {
  return (
    <StyledCard {...props}>
      {title && (
        <CardHead>
          <Heading level={3} css="font-weight: 500; margin-bottom:0;">
            {title}
          </Heading>
          {filter && <div css="flex-shrink:0; min-width: 120px;">{filter}</div>}
          {button ?? null}
        </CardHead>
      )}
      <CardContentHolder noPadding={noPadding}>{children}</CardContentHolder>
    </StyledCard>
  );
}

export default Card;
