import React from 'react';

import { StyledInfoCard, Title, Value } from './InfoCard.styles';

function InfoCard({ title, value, fontbase, ...props }) {
  return (
    <StyledInfoCard {...props}>
      <Title fontbase={fontbase}>{title}</Title>
      <Value fontbase={fontbase}>{value}</Value>
    </StyledInfoCard>
  );
}

export default InfoCard;
