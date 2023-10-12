import React, { useEffect, useState } from 'react';

import Modal from 'components/molecules/Modal';

function ModalContainer({
  btnComponent,
  content,
  title,
  xl,
  lg,
  sm,
  isClosable,
  onModalClose = () => {},
  isOpen,
  imgPreview,
  width,
  helpModal,
}) {
  const [isVisible, setIsVisible] = useState(!!isOpen);
  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };
  useEffect(() => {
    if (!isVisible) {
      onModalClose();
    }
  }, [isVisible]);

  return (
    <>
      {btnComponent && btnComponent({ onClick: showModal })}
      <Modal
        title={title}
        isOpen={isVisible}
        setIsOpen={setIsVisible}
        xl={xl}
        lg={lg}
        sm={sm}
        width={width}
        isClosable={isClosable}
        helpModal={helpModal}
        imgPreview={imgPreview}>
        {content({ onClose: handleCancel })}
      </Modal>
    </>
  );
}

export default ModalContainer;
