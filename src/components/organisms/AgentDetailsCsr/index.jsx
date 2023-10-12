/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
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

export default function AgentDetailsCsr({ onClose, sids }) {
  const { fetch, refetch } = useContext(AuthContext);
  const [selectVal, setSelectVal] = useState();
  // const [dateRange, setDateRange] = useState([null, null]);
  const [buttonValue, setButtonValue] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState({
    startDate: '',
    endDate: '',
    fileType: '',
  });
  const { agentDetails_data } = ivrService.GetTotalAgentDetails(sids, startDate, endDate, startDate, endDate, fetch);
  console.log(agentDetails_data);
  // const { agentDetails } = agentDetails_data;
  // console.log('here');

  // const { agentDetails } = agentDetails_data;
  // const selectOptions = [{}];
  // // eslint-disable-next-line no-plusplus
  // for (let i = 1; i < 31; i++) {
  //   selectOptions.push({ value: i, label: i });
  // }

  return (
    <>
      <Field
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={({ target: { value } }) => {
          // console.log(startOfDay(getDateObject(value[0])).toISOString());
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
      <h3>Tasks</h3>
      {/* <DetailsCard gray>
        <Grid sm={2} gap={20}>
          <InfoCard
            title="Tasks Canceled"
            value={agentDetails?.tasksCanceled ? agentDetails?.tasksCanceled : '---'}
            $unStyled
          />
          <InfoCard
            title="Tasks Completed"
            value={agentDetails?.tasksCompleted ? agentDetails?.tasksCompleted : '---'}
            $unStyled
          />
          <InfoCard
            title="Tasks Created"
            value={agentDetails?.tasksCreated ? agentDetails?.tasksCreated : '---'}
            $unStyled
          />
        </Grid>
      </DetailsCard> */}
    </>
  );
}
