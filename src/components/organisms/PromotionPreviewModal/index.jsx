import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import MacBookView from '../MacBookView';
// import MobileView from '../MobileView';

import { SwitcherBtns, Button } from './PromotionPreviewModal.styles';

function PromotionPreviewModal({ promotion }) {
  const [macBookView, setMacBookView] = useState(true);
  return (
    <>
      <SwitcherBtns>
        <Button type="button" className={`${macBookView && 'active'}`} onClick={() => setMacBookView(true)}>
          <span className="material-icons-outlined">phone_iphone</span>
        </Button>
        <Button type="button" className={`${!macBookView && 'active'}`} onClick={() => setMacBookView(false)}>
          <span className="material-icons-outlined">laptop_mac</span>{' '}
        </Button>
      </SwitcherBtns>
      {macBookView ? <MacBookView promotion={promotion} mobileView /> : <MacBookView promotion={promotion} />}
    </>
  );
}

export default PromotionPreviewModal;
