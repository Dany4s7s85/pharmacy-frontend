import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import Paragraph from 'components/atoms/Paragraph';
import { MessageHolder } from './Message.styles';

function Message({ text, width, lg, ...props }) {
  return (
    <MessageHolder $width={width} $lg={lg} {...props}>
      <Paragraph noMargin>{text}</Paragraph>
    </MessageHolder>
  );
}

export default Message;
