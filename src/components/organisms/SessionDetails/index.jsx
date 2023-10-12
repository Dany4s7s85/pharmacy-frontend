import TableLayout from 'components/atoms/TableLayout';
import Table from 'components/molecules/Table';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React, { useMemo, useState } from 'react';

import adminService from 'services/adminService';

export default function SessionDetails({ customerId, sessionId }) {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
  });
  const { sessions_data, sessions_loading } = adminService.GetSessionsDetails({
    customerId,
    sessionId,
  });
  const { totalCount, sessions_rows } = useMemo(
    () => ({
      sessions_rows: sessions_data.customerSessions
        .slice((searchQuery.page - 1) * searchQuery.pageSize, searchQuery.page * searchQuery.pageSize)
        .map(_ => [_.action, format(getDateObject(_.time), 'dd/MM/yyyy HH:mm')]),
      totalCount: sessions_data.totalItems,
    }),
    [sessions_data, searchQuery],
  );
  const columnNames = [`Action`, `Time`];

  return (
    <TableLayout
      customFilterKey="none"
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
