import Icon from 'components/atoms/Icon';
import React from 'react';
import ModalContainer from 'components/molecules/ModalContainer';
import { HelpIcon, TextHolder } from './Help.styles';

function Help({ helpText }) {
  return (
    <ModalContainer
      helpModal
      btnComponent={({ onClick }) => (
        <Icon showTooltip toolTipContent="Help" iconName="help_outline" onClick={onClick} />
      )}
      content={() => (
        <>
          <HelpIcon>
            <span className="material-icons-outlined">help_outline</span>
          </HelpIcon>
          <TextHolder>{helpText}</TextHolder>
        </>
      )}
    />
  );
}

export default Help;
