import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Table from 'components/molecules/Table';
import TableLayout from 'components/atoms/TableLayout';
import StoreService from 'services/businessStoreService';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import GridCol from 'components/atoms/GridCol';
import Tooltip from 'components/atoms/Tooltip';
import ModalContainer from 'components/molecules/ModalContainer';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';

const StoreDetails = ({ businessId }) => {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    searchText: '',
    filterText: '',
    getAll: true,
    startDate: '',
    endDate: '',
    businessId,
  });

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { stores_data, stores_loading } = StoreService.GetStores(searchQuery);

  const detailModal = ({
    name,
    address,
    status,
    contact,
    store_contact_person,
    store_id,
    auth_code,
    transaction_id,
  }) => (
    <ModalContainer
      width="1200"
      title="Store Detail"
      btnComponent={({ onClick }) => (
        <Tooltip title="Details" type="dark">
          <Button unStyled className="detail-btn" onClick={onClick}>
            <i className="material-icons-outlined" css="color: var(--primary);font-size:1.3rem;">
              description
            </i>
          </Button>
        </Tooltip>
      )}
      content={() => (
        <DetailsCard>
          <Grid xs={1} sm={3} className="card-row">
            <InfoCard title="Store Name" value={name} />
            <InfoCard title="Store Address" value={address?.street_address ?? '--'} />
            <InfoCard title="Status" value={status} />
          </Grid>
          <Grid xs={1} sm={3} className="card-row">
            <InfoCard title="Store ID" value={store_id ?? '--'} />
            <InfoCard title="Store Contact Person" value={store_contact_person} />
            <InfoCard title="Store Contact No:" value={contact} />
          </Grid>
          {(auth_code || transaction_id) && (
            <Grid xs={12} className="card-row">
              <GridCol sm={4}>
                <InfoCard title="Auth Code" value={auth_code ?? '--'} />
              </GridCol>
              <GridCol sm={8}>
                <InfoCard title="Description" value={transaction_id ?? '--'} />
              </GridCol>
            </Grid>
          )}
        </DetailsCard>
      )}
    />
  );

  const { stores, totalCount } = useMemo(
    () => ({
      stores: stores_data?.data?.items?.map(item => [
        format(getDateObject(item.created_at), 'yyyy-MM-dd'),
        item?.name ?? '--',
        item.address?.street_address ?? '---',
        item?.status ?? '---',
        detailModal(item),
      ]),
      totalCount: stores_data?.data?.totalItems,
    }),
    [stores_data],
  );

  const columnNames = ['Date', 'Store Name', 'Store Address', 'Status', ''];

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
            { label: 'Cancelled', value: 'Cancelled' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Deactivated', value: 'Deactivated' },
            { label: 'Dormant', value: 'Dormant' },
          ]}
          defaultValue={[{ label: 'All', value: '' }]}
          prefix={<i className="material-icons-outlined">filter_alt</i>}
          onChange={({ target: { value } }) => {
            setSearchQuery({
              ...searchQuery,
              filterText: value.value,
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
        totalCount={totalCount ?? 0}
        pageSize={searchQuery.pageSize}
        noNegativeMargin>
        <Table loading={stores_loading} rowsData={stores} columnNames={columnNames} noPadding />
      </TableLayout>
    </>
  );
};

export default StoreDetails;
