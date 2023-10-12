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
import AgentDetailsCsr from 'components/organisms/AgentDetailsCsr';

export default function AgentDetailsSummary({ onClose, ivrData }) {
  const { fetch, refetch } = useContext(AuthContext);
  const [selectVal, setSelectVal] = useState();
  const [sids, setSids] = useState();
  // const [dateRange, setDateRange] = useState([null, null]);
  const [buttonValue, setButtonValue] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState({
    startDate: '',
    endDate: '',
    fileType: '',
  });
  const [sidArr, setSidArr] = useState([]);
  const { callDetails_data } = ivrService.GetTotalDetails(startDate, endDate, startDate, endDate, fetch);
  const { agentDetails } = callDetails_data;

  useEffect(() => {
    // console.log(ivrData);
    ivrData?.ivrAdmins.map(item => setSidArr(current => [...current, item.sid]));
    // setMyArray(oldArray => [...oldArray, newElement]);
  }, [ivrData]);

  // const { agentDetails } = agentDetails_data;
  // const selectOptions = [{}];
  // // eslint-disable-next-line no-plusplus
  // for (let i = 1; i < 31; i++) {
  //   selectOptions.push({ value: i, label: i });
  // }

  return (
    <>
      <Grid xs={1} lg={3} colGap={20}>
        <Button
          type="primary"
          onClick={() => setButtonValue('summary')}
          iconMobile
          prefix={<i className="material-icons-outlined">add</i>}>
          <span className="text">Call Summary</span>
        </Button>
        <Button
          type="primary"
          iconMobile
          onClick={() => setButtonValue('csr')}
          prefix={<i className="material-icons-outlined">add</i>}>
          <span className="text">Calls Breakdown</span>
        </Button>
        <Button type="primary" iconMobile prefix={<i className="material-icons-outlined">add</i>}>
          <span className="text">COMING SOON</span>
        </Button>
      </Grid>
      {buttonValue === 'summary' && (
        <>
          <Field
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={({ target: { value } }) => {
              // console.log(startOfDay(getDateObject(value[0])).toISOString());
              console.log(value[0] ? value[0] : '');
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
              <InfoCard
                title="Reservation Created"
                value={agentDetails?.reservationsCreated ? agentDetails?.reservationsCreated : '---'}
                $unStyled
              />
              <InfoCard
                title="Reservation Accepted"
                value={agentDetails?.reservationsAccepted ? agentDetails?.reservationsAccepted : '---'}
                $unStyled
              />
              <InfoCard
                title="Reservation Rejected"
                value={agentDetails?.reservationsRejected ? agentDetails?.reservationsRejected : '---'}
                $unStyled
              />
              <InfoCard
                title="Reservation Canceled"
                value={agentDetails?.reservationsCanceled ? agentDetails?.reservationsCanceled : '---'}
                $unStyled
              />
              <InfoCard
                title="Reservation Rescinded"
                value={agentDetails?.reservationsRescinded ? agentDetails?.reservationsRescinded : '---'}
                $unStyled
              />
              <InfoCard
                title="Reservation Timeout"
                value={agentDetails?.reservationsTimedOut ? agentDetails?.reservationsTimedOut : '---'}
                $unStyled
              />
            </Grid>
          </DetailsCard>
          <h3>Tasks</h3>
          <DetailsCard gray>
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
          </DetailsCard>
        </>
      )}

      {buttonValue === 'csr' && <AgentDetailsCsr sids={sidArr} />}

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
