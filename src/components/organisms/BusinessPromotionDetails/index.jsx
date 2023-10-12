import React, { useState, useMemo, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Table from 'components/molecules/Table';
import TableLayout from 'components/atoms/TableLayout';
import businessCompaignsService from 'services/businessCampaignsService';
import { AuthContext } from 'context/authContext';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import Grid from 'components/atoms/Grid';

const BusinessPromotionDetails = ({ businessUserId }) => {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    searchText: '',
    startDate: '',
    endDate: '',
    filterStatus: '',
    businessUserId,
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { refetch } = useContext(AuthContext);

  const { campaigns_data, campaigns_loading } = businessCompaignsService.GetBusinessCampaigns(searchQuery, refetch);

  const { campaigns_rows, totalCount } = useMemo(
    () => ({
      campaigns_rows: campaigns_data?.records?.items?.map(_ => [
        format(getDateObject(_?.created_at), 'yyyy-MM-dd'),
        _?.name ?? '--',
        format(getDateObject(_?.duration?.startDate), 'yyyy-MM-dd'),
        format(getDateObject(_?.duration?.endDate), 'yyyy-MM-dd'),
        _?.status ?? '--',
      ]),
      totalCount: campaigns_data?.records?.totalItems,
    }),
    [campaigns_data],
  );

  const columnNames = ['Date', 'Promotion Name', 'Start Date', 'End Date', 'Status', ''];

  return (
    <>
      <Grid xs={1} md={3} gap={20} css="margin-bottom:var(--gutter)">
        <Field
          sm
          noMargin
          prefix={<i className="material-icons-outlined">search</i>}
          placeholder="Search"
          type="text"
          label="Search"
          onChange={({ target: { value } }) => {
            setSearchQuery({
              ...searchQuery,
              searchText: value,
            });
          }}
        />
        <Select
          sm
          noMargin
          placeholder="Select Status"
          label="Status"
          options={[
            { label: 'All', value: '' },
            { label: 'Active', value: 'Active' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Stopped', value: 'Stopped' },
          ]}
          prefix={<i className="material-icons-outlined">filter_alt</i>}
          onChange={({ target: { value } }) => {
            setSearchQuery({
              ...searchQuery,
              filterStatus: value.value,
            });
          }}
        />
        <Field
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={({ target: { value } }) => {
            setDateRange(value);
            if (value[0] && value[1]) {
              setSearchQuery({
                ...searchQuery,
                startDate: value[0] ? format(value[0], 'yyyy-MM-dd') : '',
                endDate: value[1] ? format(value[1], 'yyyy-MM-dd') : '',
              });
            } else if (!value[0] && !value[1]) {
              setSearchQuery({
                ...searchQuery,
                startDate: '',
                endDate: '',
              });
            }
          }}
          prefix={<i className="material-icons-outlined">date_range</i>}
          placeholderText="Select date range"
          type="datepicker"
          label="Date Range"
          noMargin
          sm
          clear={startDate || endDate}
        />
      </Grid>
      <TableLayout
        onChangeFilters={filters => {
          setSearchQuery({
            ...searchQuery,
            ...filters,
          });
        }}
        filters={false}
        currentPage={searchQuery.page}
        totalCount={totalCount}
        pageSize={searchQuery.pageSize}>
        <Table width={1200} loading={campaigns_loading} rowsData={campaigns_rows} columnNames={columnNames} noPadding />
      </TableLayout>
    </>
  );
};

export default BusinessPromotionDetails;
