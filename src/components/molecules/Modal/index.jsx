// TODO : fix modal leave animation

import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import { animated, useTransition } from 'react-spring';
import { Flex } from '../../../styles/helpers.styles';
import { CloseButton, ModalHeading, StyledDialogOverlay, StyledDialogContent, DialogCentered } from './Modal.styles';

function Modal({
  isOpen,
  setIsOpen = () => {},
  title,
  children,
  sm,
  lg,
  xl,
  isClosable,
  imgPreview,
  width,
  helpModal,
}) {
  const AnimatedDialogOverlay = animated(StyledDialogOverlay);
  const AnimatedDialogContent = animated(StyledDialogContent);
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
  });

  const dismiss = () => (isClosable === false ? setIsOpen(true) : setIsOpen(false));

  return (
    <>
      {transitions(
        (styles, item) =>
          item && (
            <AnimatedDialogOverlay style={{ opacity: styles.opacity }} isOpen={isOpen} onDismiss={dismiss}>
              <DialogCentered $xl={xl} $lg={lg} $sm={sm} $width={width} imgPreview={imgPreview}>
                <AnimatedDialogContent
                  aria-labelledby="dialog-title"
                  style={{
                    background: helpModal ? 'var(--dark)' : '#fff',
                    transform: styles.y.to(value => `translate3d(0px, ${value}px, 0px)`),
                  }}>
                  <Flex
                    justify="space-between"
                    align="middle"
                    nowrap
                    css={`
                      ${!imgPreview && 'margin-bottom: 1.875rem;'}
                      ${!title && 'margin-bottom: 0;'}
                    `}>
                    {!imgPreview && title && <ModalHeading level={2}>{title}</ModalHeading>}
                    {isClosable !== false && (
                      <CloseButton
                        type="white"
                        shape="circle"
                        onClick={() => setIsOpen(!isOpen)}
                        size={35}
                        css="flex-shrink:0;"
                        absolute={!title && true}>
                        <i className="material-icons-outlined">close</i>
                      </CloseButton>
                    )}
                  </Flex>
                  {children}
                </AnimatedDialogContent>
              </DialogCentered>
            </AnimatedDialogOverlay>
          ),
      )}
    </>
  );
}

export default Modal;
