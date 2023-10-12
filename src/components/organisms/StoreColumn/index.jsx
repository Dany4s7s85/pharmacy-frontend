import React, { useState } from 'react';
import pointimg from '../../../assets/images/points.svg';

import {
  StyledStoreColumn,
  ImgBox,
  TextBox,
  Title,
  SubTitle,
  Ul,
  Li,
  PointText,
  HeartIcon,
  Img,
} from './StoreColumn.styles';

function StoreColumn({ storeimg, title, subtitle, points, onClick, storeId, campaignId, favourite, ...props }) {
  const [heartActive, setHeartActive] = useState(false);

  const handleFavoriteCampaign = () => {
    document.getElementById(storeId).classList.toggle('is-active');
  };
  return (
    <>
      <StyledStoreColumn {...props}>
        <ImgBox onClick={onClick}>
          <img src={storeimg} width="134" height="124" alt="img" />
        </ImgBox>
        <TextBox onClick={onClick}>
          <Title>{title}</Title>
          <SubTitle>{subtitle}</SubTitle>
        </TextBox>
        <Ul>
          <Li>
            <Img src={pointimg} width="16" height="16" alt="img" />
            <PointText>{points}</PointText>
          </Li>
          <Li>
            <HeartIcon
              className={favourite ? 'is-active' : ''}
              id={storeId}
              onClick={() => {
                setHeartActive(!heartActive);
                handleFavoriteCampaign();
              }}
            />
          </Li>
        </Ul>
      </StyledStoreColumn>
    </>
  );
}

export default StoreColumn;
