import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import { toast } from 'react-toastify';

import AlertIcon from 'components/atoms/AlertIcon';
import Heading from 'components/atoms/Heading';
import Paragraph from 'components/atoms/Paragraph';
import { StyledNotification, TextHolder } from './Notification.styles';

function Notification({ type, message, title, ...props }) {
  return toast(
    <>
      <StyledNotification $type={type} {...props}>
        <AlertIcon $type={type} />
        <TextHolder>
          <Heading level={5} css="margin-bottom:4px;">
            {title}
          </Heading>
          <Paragraph $type={type} css="margin:0; color: var(--base-text-color) !important;">
            {message}
          </Paragraph>
        </TextHolder>
      </StyledNotification>
    </>,
    {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
    },
  );
}

export default Notification;
