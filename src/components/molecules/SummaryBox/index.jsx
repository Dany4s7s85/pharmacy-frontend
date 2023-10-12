import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Heading from 'components/atoms/Heading';
import Card from 'components/atoms/Card';
import { CreditLimit, Customers, FlexHolder, Subtitle } from './SummaryBox.styles';

function SummaryBox({ title, creditLimit, customers, value, subtitle }) {
  return (
    <Card>
      {title && (
        <FlexHolder>
          <Heading level={3} css="font-weight: 500; margin: 0;">
            {title}
          </Heading>
          {customers && <Customers>Total Customers: {customers}</Customers>}
        </FlexHolder>
      )}
      {creditLimit && (
        <CreditLimit>
          Credit Limit:<span>${creditLimit}</span>
        </CreditLimit>
      )}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {value && (
        <CreditLimit>
          <span>{value}</span>
        </CreditLimit>
      )}
    </Card>
  );
}

export default SummaryBox;
