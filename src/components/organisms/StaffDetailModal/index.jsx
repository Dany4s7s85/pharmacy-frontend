import React, { useMemo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { useMediaPredicate } from 'react-media-hook';
import Grid from 'components/atoms/Grid';
import transactionService from 'services/transactionService';
import { format } from 'date-fns';
import { getDateObject, convertToCurrencyFormat } from 'helpers/common';
import Table from 'components/molecules/Table';
import TableLayout from 'components/atoms/TableLayout';
import DataTabs from '../../molecules/DataTabs';
import DetailsCard from '../../molecules/DetailsCard';
import InfoCard from '../../molecules/InfoCard';

const StaffDetailModal = ({ staffInfo }) => {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    searchText: '',
    startDate: '',
    endDate: '',
    mccCode: '',
    filterTransactionType: '',
    filterRewardsPoints: '',
    filterSettlementStatus: '',
    customerId: staffInfo?.user?._id,
  });

  const { userTransactions_data, loading } = transactionService.SearchSingleUserTransactions(searchQuery);
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const columnNames = [
    'Date',
    'Full name',
    'Email',
    'Description',
    'Channel Name',
    'Settlement Status',
    'Merchant',
    'Transaction Amount',
    'Rewards Point',
  ];

  const { totalCount, userTransactions_rows } = useMemo(
    () => ({
      userTransactions_rows: userTransactions_data?.data?.items?.map(_ => [
        format(getDateObject(_.created_at), 'yyyy-MM-dd'),
        `${_?.user?.first_name ?? '-'} ${_?.user?.last_name ?? '-'}`,
        `${_?.user?.email ?? '-'}`,
        _?.Description ?? '-',
        _?.ChannelName ?? '-',
        _?.SettlementStatus ?? '-',
        _?.Merchant ?? '-',
        <div css="display:flex;align-items:center; gap: 10px;">
          {_?.TransactionTypeCode === 'C' ? (
            <i className="material-icons-outlined" css="font-size:20px; color: var(--success);">
              arrow_circle_up
            </i>
          ) : (
            <i className="material-icons-outlined" css="font-size:20px; color: var(--danger);">
              arrow_circle_down
            </i>
          )}
          {convertToCurrencyFormat(_?.TransactionAmount)}
        </div>,
        _?.RewardPoints,
      ]),
      totalCount: userTransactions_data?.data?.totalItems,
    }),
    [userTransactions_data],
  );

  const data = [
    {
      label: 'Personal Information',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard title="First Name" value={staffInfo?.first_name ?? '--'} $unStyled />
            <InfoCard title="Last Name" value={staffInfo?.last_name ?? '--'} $unStyled />
            <InfoCard title="Email" value={staffInfo?.email ?? '--'} $unStyled />
            <InfoCard title="Phone Number" value={staffInfo?.phone_number ?? '--'} $unStyled />
            <InfoCard title="Customer Number" value={staffInfo?.user?.customer_number ?? '--'} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Refunded Transactions',
      content: (
        <TableLayout
          customFilterKey="user-transactions"
          onChangeFilters={filters => {
            setSearchQuery(_ => ({
              ..._,
              ...filters,
            }));
          }}
          filters={false}
          currentPage={searchQuery.page}
          totalCount={totalCount ?? 0}
          pageSize={searchQuery.pageSize}
          noNegativeMargin>
          <Table loading={loading} rowsData={userTransactions_rows} columnNames={columnNames} noPadding />
        </TableLayout>
      ),
    },
  ];

  return <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />;
};

export default StaffDetailModal;
