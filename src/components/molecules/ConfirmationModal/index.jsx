import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import Heading from 'components/atoms/Heading';
import Button from 'components/atoms/Button';
import Modal from 'components/molecules/Modal';
import { BtnHolder, Subtitle } from './ConfirmationModal.styles';

function ConfirmationModal({
  cancelText = 'Cancel',
  btnComponent,
  title,
  subtitle,
  deleteModal,
  confirmationModal,
  children,
  okLoading,
  onOk = () => {},
}) {
  const [isVisible, setIsVisible] = useState(false);
  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };
  // useEffect(() => {
  //   if (!isVisible) {
  //     onModalClose();
  //   }
  // }, [isVisible]);
  return (
    <>
      {btnComponent && btnComponent({ onClick: showModal })}
      <Modal isOpen={isVisible} setIsOpen={setIsVisible}>
        <>
          <Heading level={3} css="margin-bottom: 10px; font-weight: 500;">
            {title}
          </Heading>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {children ?? null}
          <BtnHolder>
            <Button type="outline" width={130} onClick={handleCancel}>
              {cancelText}
            </Button>
            {deleteModal && (
              <Button
                type="danger"
                width={130}
                onClick={() => {
                  onOk();
                  handleCancel();
                }}>
                {deleteModal.length === undefined ? 'Yes' : deleteModal}
              </Button>
            )}
            {confirmationModal && (
              <Button
                type="primary"
                width={130}
                onClick={() => {
                  onOk();
                  handleCancel();
                }}
                loading={okLoading}>
                {confirmationModal}
              </Button>
            )}
          </BtnHolder>
        </>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
