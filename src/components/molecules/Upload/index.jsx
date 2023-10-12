import React, { useCallback, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import ReactCrop from 'react-image-crop';
import Button from 'components/atoms/Button';
import Label from 'components/atoms/Label';
import UploadIcon from 'components/atoms/UploadIcon';
import { StyledFormGroup } from 'styles/helpers.styles';
import { compressImage } from 'helpers/common';
import ModalContainer from 'components/molecules/ModalContainer';
import Toast from 'components/molecules/Toast';
import Modal from 'components/molecules/Modal';
import 'react-image-crop/dist/ReactCrop.css';
import { Error } from 'components/molecules/Field/Field.styles';
import { StyledBtn, StyledImage, ImgHolder, IconsHolder, Icon } from './Upload.styles';

function Upload({
  label = '',
  name = 'Upload',
  uploadBtnText = '',
  icon = <i className="material-icons-outlined">cloud_upload</i>,
  noMargin,
  error,
  value,
  base64,
  onChange,
  allowCrop,
  cropRatio,
  allowPreview,
  showOptions = 'true',
  customUploadBtn,
  success,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState('');
  const imgRef = useRef(null);
  const [imageSource, setImageSource] = useState('');
  const [crop, setCrop] = useState({
    aspect: cropRatio?.[0] / cropRatio?.[1],
    width: cropRatio?.[0] * 100,
    height: cropRatio?.[1] * 100,
  });
  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);
  const getCroppedImg = () => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
    const base64Image = canvas.toDataURL('image/jpeg');
    onChange({ target: { name, value: base64Image } });
    setIsOpen(false);
  };
  const clearState = () => {
    setSrc('');
    setIsOpen('');
    imgRef.current = null;
    onChange(base64 || allowCrop ? { target: { name, value: '' } } : { target: { files: [] } });
  };
  React.useEffect(() => {
    if (typeof value === 'object') {
      const fileReader = new FileReader();
      fileReader.onload = () => setImageSource(fileReader.result);
      fileReader.readAsDataURL(value);
    } else setImageSource(value);
  }, [value]);
  return (
    <StyledFormGroup noMargin={noMargin}>
      <Label as="span">{label}</Label>
      {imageSource && showOptions === 'true' ? (
        <ImgHolder>
          <StyledImage $success={success} src={imageSource} />

          <img src={imageSource} alt="ssd" />
          <IconsHolder>
            <ModalContainer
              btnComponent={({ onClick }) => (
                <Icon className="material-icons-outlined" onClick={onClick}>
                  visibility
                </Icon>
              )}
              content={() => (
                <img src={imageSource} alt="preview" css="border-radius: 10px; margin: 0 auto; display:block;" />
              )}
              imgPreview
              lg
            />
            <Icon
              className="material-icons-outlined"
              onClick={() => {
                clearState();
              }}>
              delete
            </Icon>
          </IconsHolder>
        </ImgHolder>
      ) : allowCrop && cropRatio?.length > 1 ? (
        <>
          <input
            {...props}
            accept="image/*"
            type="file"
            id={name}
            className="hidden"
            onChange={({ target: { files } }) => {
              if (files[0]) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  setSrc(reader.result);
                  setIsOpen(true);
                });
                reader.readAsDataURL(files[0]);
              } else clearState();
            }}
          />
          {customUploadBtn || (
            <StyledBtn htmlFor={name} css={error && 'border-color:var(--danger)'}>
              <UploadIcon icon={icon} /> {uploadBtnText}
            </StyledBtn>
          )}
          <Modal isClosable isOpen={isOpen} setIsOpen={setIsOpen} title="Crop Image" lg>
            <ReactCrop src={src} crop={crop} onChange={c => setCrop(c)} onImageLoaded={onLoad} />
            <Button type="primary" sm onClick={getCroppedImg}>
              Select
            </Button>
          </Modal>
        </>
      ) : (
        <>
          <input
            {...props}
            accept="image/*"
            type="file"
            id={name}
            name={name}
            onChange={({ target: { files } }) => {
              if (!/[/.](gif|jpg|jpeg|tiff|png)$/i.test(files[0].name)) {
                Toast({ type: 'error', message: 'Only images are allowed' });
                clearState();
              } else if (!files[0]) {
                clearState();
              } else if (base64) {
                compressImage(files[0])
                  .then(image => {
                    onChange({ target: { value: image, name } });
                  })
                  .catch(() => {
                    Toast({
                      type: 'error',
                      message: 'Error compressing the image',
                    });
                    clearState();
                  });
              } else onChange({ target: { value: files[0], name } });
            }}
            className="hidden"
          />
          {customUploadBtn || (
            <StyledBtn htmlFor={name} css={error && 'border-color:var(--danger)'}>
              <UploadIcon icon={icon} /> {uploadBtnText}
            </StyledBtn>
          )}
        </>
      )}
      {error && (
        <Error id={`${props.name}Error`} role="alert">
          {error}
        </Error>
      )}
    </StyledFormGroup>
  );
}

export default Upload;
