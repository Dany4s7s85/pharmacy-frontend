import React from 'react';

import Heading from 'components/atoms/Heading';
import { StyledDetailsCard } from './DetailsCard.styles';

function DetailsCard({ title, children, ...props }) {
  return (
    <StyledDetailsCard {...props}>
      <>
        {title && <Heading level={4}>{title}</Heading>}
        {children}
      </>
    </StyledDetailsCard>
  );
}

export default DetailsCard;
