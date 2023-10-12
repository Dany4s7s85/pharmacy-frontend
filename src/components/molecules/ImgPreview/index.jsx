import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import ModalContainer from 'components/molecules/ModalContainer';
import { ImgHolder, Delete, PreviewBtn } from './ImgPreview.styles';
import PdfIcon from '../../../assets/images/pdfdemo.png';
import ConfirmationModal from '../ConfirmationModal';

function ImgPreview({ src, alt, pdf, onDelete, withDelete, ...props }) {
  return pdf ? (
    <ImgHolder $pdf {...props}>
      <PreviewBtn as="a" href={src} type="button" target="_blank" download rel="noreferrer" withDelete={withDelete}>
        <span className="material-icons-outlined">file_download</span>
      </PreviewBtn>
      <img src={PdfIcon} alt="pdf icon" />
      {withDelete && (
        <ConfirmationModal
          title="Are you sure you want to Delete this document?"
          onOk={onDelete}
          confirmationModal="yes"
          btnComponent={({ onClick }) => (
            <Delete type="button" onClick={onClick}>
              <span className="material-icons-outlined">delete</span>
            </Delete>
          )}
        />
      )}
    </ImgHolder>
  ) : (
    <ModalContainer
      xl
      imgPreview
      btnComponent={({ onClick }) => (
        <ImgHolder {...props}>
          <img src={src} alt={alt || 'kyc docs'} />
          <PreviewBtn type="button" onClick={onClick} withDelete={withDelete}>
            <span className="material-icons-outlined">visibility</span>
          </PreviewBtn>
          {withDelete && (
            <ConfirmationModal
              title="Are you sure you want to Delete this document?"
              onOk={onDelete}
              confirmationModal="yes"
              btnComponent={({ onClick: newClick }) => (
                <Delete type="button" onClick={newClick}>
                  <span className="material-icons-outlined">delete</span>
                </Delete>
              )}
            />
          )}
        </ImgHolder>
      )}
      content={() => <img src={src} alt={alt || 'kyc docs'} css="width: 100%; border-radius: 10px;" />}
    />
  );
}

export default ImgPreview;
