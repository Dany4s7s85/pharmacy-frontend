import Button from 'components/atoms/Button';
import TableLayout from 'components/atoms/TableLayout';
import Tooltip from 'components/atoms/Tooltip';
import ModalContainer from 'components/molecules/ModalContainer';
import Table from 'components/molecules/Table';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React, { useMemo, useState } from 'react';

import adminService from 'services/adminService';
import { ActionBtnHolder } from 'styles/helpers.styles';
import SessionDetails from '../SessionDetails';

export default function AdminLoginHistory({ customerId }) {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    customerId,
  });
  const { sessions_data, sessions_loading } = adminService.GetCustomerSessions(searchQuery);
  const actionBtns = _ => (
    <ActionBtnHolder numOfBtns={1}>
      <ModalContainer
        width={1100}
        title="Session Details"
        btnComponent={({ onClick }) => (
          <Tooltip title="Details" type="dark">
            <Button unStyled className="detail-btn" onClick={onClick}>
              <i className="material-icons-outlined">description</i>
            </Button>
          </Tooltip>
        )}
        content={({ onClose }) => <SessionDetails onClose={onClose} customerId={customerId} sessionId={_._id} />}
      />
    </ActionBtnHolder>
  );
  const { totalCount, sessions_rows } = useMemo(
    () => ({
      sessions_rows: sessions_data.customerSessions.map(_ => [
        _.admin_id.email,
        format(getDateObject(_.session_start), 'dd/MM/yyyy HH:mm'),
        format(getDateObject(_.session_end), 'dd/MM/yyyy HH:mm'),
        actionBtns(_),
      ]),
      totalCount: sessions_data.totalItems,
    }),
    [sessions_data],
  );
  const columnNames = [`Admin`, `Session Start`, `Session End`, ``];

  return (
    <TableLayout
      customFilterKey="sessions"
      onChangeFilters={filters => {
        setSearchQuery(_ => ({
          ..._,
          ...filters,
        }));
      }}
      currentPage={searchQuery.page}
      totalCount={totalCount}
      pageSize={searchQuery.pageSize}>
      <Table width={1200} loading={sessions_loading} rowsData={sessions_rows} columnNames={columnNames} noPadding />
    </TableLayout>
  );
}
