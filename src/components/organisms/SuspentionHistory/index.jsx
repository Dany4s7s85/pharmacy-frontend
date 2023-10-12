import TableLayout from 'components/atoms/TableLayout';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React, { useMemo, useState } from 'react';
import userService from 'services/userService';
import Table from 'components/molecules/Table';

export default function SuspentionHistory({ customerId = '' }) {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    searchText: '',
    startDate: '',
    endDate: '',
    customerId,
  });
  const { suspention_data, suspention_loading } = userService.GetSuspentionHistory(searchQuery);
  const { totalCount, rowsData } = useMemo(
    () => ({
      rowsData: suspention_data.suspention.map(_ => [
        format(getDateObject(_?.created_at), 'yyyy-MM-dd'),
        _.status,
        _.previous_status,
        _.refund_date ? format(getDateObject(_.refund_date), 'yyyy-MM-dd') : '-',
        _.refund_amount ? `$${_.refund_amount}` : '-',
        _.deductions ? `$${_.deductions}` : '-',
        _.suspended_by,
        _.un_suspended_by,
        _?.note && _?.note !== '' ? _.note : '-',
      ]),
      totalCount: suspention_data.totalItems,
    }),
    [suspention_data],
  );
  return (
    <TableLayout
      customFilterKey="suspention_status"
      onChangeFilters={filters => {
        setSearchQuery(_ => ({
          ..._,
          ...filters,
        }));
      }}
      currentPage={searchQuery.page}
      totalCount={totalCount}
      pageSize={searchQuery.pageSize}>
      <Table
        width={1200}
        loading={suspention_loading}
        rowsData={rowsData}
        columnNames={[
          `Date`,
          `Status`,
          `Previous Status`,
          'Closure Date',
          'Refund Amount',
          'Deductions',
          `Suspended By`,
          `UnSuspended By`,
          `Note`,
        ]}
        noPadding
      />
    </TableLayout>
  );
}
