/* eslint-disable no-shadow */
import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import Tooltip from 'components/atoms/Tooltip';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React, { useMemo } from 'react';

import cardService from 'services/cardService';
import { ActionBtnHolder } from 'styles/helpers.styles';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Table from 'components/molecules/Table';
import Toast from 'components/molecules/Toast';

export default function SendStatement({ customer }) {
  const { statements_data, statements_loading } = cardService.GetUserStatement(customer._id);
  const [loading, setLoading] = React.useState(false);
  const sendStatement = async id => {
    try {
      setLoading(true);
      await cardService.sendStatement(id, customer._id);
      setLoading(false);
      Toast({
        message: 'Statement sent successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const generateStatement = async id => {
    try {
      setLoading(true);
      const data = await cardService.getUserStatementAdmin(id);
      window.open(window.URL.createObjectURL(data), '_blank');
      setLoading(false);
      Toast({
        message: 'Statement generated successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const actionBtns = _ => (
    <ActionBtnHolder>
      <ConfirmationModal
        title="Are you sure you want to send this statement to user?"
        confirmationModal="Yes"
        onOk={() => sendStatement(_._id)}
        btnComponent={({ onClick }) => (
          <Tooltip title="Send Statement" type="dark">
            <Button unStyled size={20} onClick={onClick}>
              <i className="material-icons-outlined">send</i>
            </Button>
          </Tooltip>
        )}
      />
      <Tooltip title="View" type="dark">
        <Button unStyled size={20} onClick={() => generateStatement(_._id)}>
          <i className="material-icons-outlined">visibility</i>
        </Button>
      </Tooltip>
    </ActionBtnHolder>
  );
  const rows = useMemo(
    () =>
      statements_data?.map(_ => [
        _.statementBeginDate ? format(getDateObject(_.statementBeginDate), 'yyyy-MM-dd') : '------',
        _.statementEndDate ? format(getDateObject(_.statementEndDate), 'yyyy-MM-dd') : '------',
        actionBtns(_),
      ]),
    [statements_data],
  );
  return (
    <Loaders loading={loading}>
      <Table
        rowsData={rows}
        columnNames={[`Statement Start Date`, `Statement End Date`, ``]}
        loading={statements_loading}
      />
    </Loaders>
  );
}
