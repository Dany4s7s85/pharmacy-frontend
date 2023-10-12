import React, { useEffect, useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Toast from 'components/molecules/Toast';
import adminService from 'services/adminService';
import Table from 'components/molecules/Table';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import TableLayout from 'components/atoms/TableLayout';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import Grid from 'components/atoms/Grid';
import ModalContainer from 'components/molecules/ModalContainer';
import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';

function AdminLogsDetailModal({ admin_id }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    actionType: '',
    admin_id,
  });

  useEffect(async () => {
    setLoading(true);
    try {
      await adminService.getAdminLogsDetail(searchQuery).then(res => {
        setState(res?.logs);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  }, [
    searchQuery.page,
    searchQuery.pageSize,
    searchQuery.startDate,
    searchQuery.endDate,
    searchQuery.admin_id,
    searchQuery.actionType,
  ]);

  const { result, totalCount } = useMemo(
    () => ({
      result: state?.items?.map(item => [
        format(getDateObject(item.created_at), 'yyyy-MM-dd'),
        item.action,
        item.done_by.email,
        (item.action === 'Username' || item.action === 'Roles') && (
          <ModalContainer
            lg
            title={`Admin ${item.action} Log Detail`}
            btnComponent={({ onClick }) => (
              <Tooltip title="Details" type="dark">
                <Button unStyled css="color: var(--primary);" onClick={onClick}>
                  <i className="material-icons-outlined">description</i>
                </Button>
              </Tooltip>
            )}
            content={() => (
              <DetailsCard gray css="margin-top: var(--gutter);">
                <Grid xs={1} sm={2} gap={20}>
                  <InfoCard
                    title="Before"
                    value={
                      item.action === 'Roles'
                        ? item?.rolesLog?.before?.map(__ => __.type).join(', ')
                        : item?.usernameLog?.before
                    }
                    $unStyled
                  />
                  <InfoCard
                    title="After"
                    value={
                      item.action === 'Roles'
                        ? item?.rolesLog?.after?.map(__ => __.type).join(', ')
                        : item?.usernameLog?.after
                    }
                    $unStyled
                  />
                </Grid>
              </DetailsCard>
            )}
          />
        ),
      ]),
      totalCount: state?.logs?.totalItems,
    }),
    [state],
  );

  return (
    <>
      <Grid xs={1} md={3} gap={20} css="margin-bottom:var(--gutter)">
        <Select
          sm
          noMargin
          placeholder="Select Log Type"
          label="Log Type"
          options={[
            { label: 'All', value: '' },
            { label: 'Suspension', value: 'Suspension' },
            { label: 'Reset Auth', value: 'Auth' },
            { label: 'Username', value: 'Username' },
            { label: 'Roles', value: 'Roles' },
          ]}
          defaultValue={[{ label: 'All', value: '' }]}
          prefix={<i className="material-icons-outlined">filter_alt</i>}
          onChange={({ target: { value } }) => {
            setSearchQuery({
              ...searchQuery,
              actionType: value.value,
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
        <Table loading={loading} columnNames={['Date', 'Action', 'Updated By', '']} rowsData={result ?? []} noPadding />
      </TableLayout>
    </>
  );
}
export default AdminLogsDetailModal;
