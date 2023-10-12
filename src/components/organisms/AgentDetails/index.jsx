/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { endOfDay, startOfDay } from 'date-fns';
import { getDateObject } from 'helpers/common';
import ivrService from 'services/ivrService';
import Grid from 'components/atoms/Grid';
import Field from 'components/molecules/Field';
import Select from 'components/atoms/Select';
import InfoCard from 'components/molecules/InfoCard';
import Button from 'components/atoms/Button';

import { AuthContext } from 'context/authContext';
import DetailsCard from 'components/molecules/DetailsCard';

export default function DetailAgentModal({ onClose, sid }) {
  const { fetch, refetch } = useContext(AuthContext);
  const [selectVal, setSelectVal] = useState();
  // const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState({
    startDate: '',
    endDate: '',
    fileType: '',
  });
  const { agentDetails_data } = ivrService.GetAgentDetails(
    sid,
    selectVal || 30,
    startDate,
    endDate,
    startDate,
    endDate,
    fetch,
  );

  const { agentDetails } = agentDetails_data;
  const selectOptions = [{}];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < 31; i++) {
    selectOptions.push({ value: i, label: i });
  }
  return (
    <>
      <Field
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={({ target: { value } }) => {
          setStartDate(value[0] ? value[0] : '');
          setEndDate(value[1] ? value[1] : '');
          if (value[0] && value[1]) {
            setStartDate(value[0] ? startOfDay(getDateObject(value[0])) : '');
            setEndDate(value[1] ? endOfDay(getDateObject(value[1])) : '');
          } else if (!value[0] && !value[1]) {
            setStartDate('');
            setEndDate('');
          }
        }}
        prefix={<i className="material-icons-outlined">date_range</i>}
        placeholderText="Select date range"
        type="datepicker"
        label="Date Range"
        sm
        clear={startDate || endDate}
      />

      <DetailsCard gray>
        <Grid sm={2} gap={20}>
          <InfoCard title="Sid of Agent" value={sid} $unStyled />
          <InfoCard
            title="Reservation Created"
            value={agentDetails?.reservations_created ? agentDetails?.reservations_created : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Accepted"
            value={agentDetails?.reservations_accepted ? agentDetails?.reservations_accepted : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Rejected"
            value={agentDetails?.reservations_rejected ? agentDetails?.reservations_rejected : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Canceled"
            value={agentDetails?.reservations_canceled ? agentDetails?.reservations_canceled : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Rescinded"
            value={agentDetails?.reservations_rescinded ? agentDetails?.reservations_rescinded : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Timeout"
            value={agentDetails?.reservations_timed_out ? agentDetails?.reservations_timed_out : '---'}
            $unStyled
          />
        </Grid>
      </DetailsCard>
      {/* {agentDetails?.activity_durations && (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid sm={2} gap={20}>
            {agentDetails?.activity_durations.map(info => (
              <InfoCard
                title={info?.friendly_name}
                value={`${(info.total / 3600).toLocaleString('en-US', { maximumFractionDigits: 3 })} Hr`}
                $unStyled
              />
            ))}
          </Grid>
        </DetailsCard>
      )} */}
      <div
        css={`
          display: flex;
          justify-content: flex-end;
          gap: 20px;
        `}>
        <Button type="outline" onClick={onClose} width={120}>
          cancel
        </Button>
      </div>
    </>
  );
}
