/* eslint-disable no-unused-vars */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import Field from 'components/molecules/Field';
import Select from 'components/atoms/Select';
import InfoCard from 'components/molecules/InfoCard';
import Button from 'components/atoms/Button';
import DetailsCard from 'components/molecules/DetailsCard';
import { CallContainer } from './CallSummaryIvr.styles';

export default function CallSummaryIvr({ ivrData }) {
  console.log(ivrData);
  return (
    <CallContainer>
      <DetailsCard gray>
        <Grid sm={3} gap={20}>
          <InfoCard
            title="Reservation Created"
            value={ivrData?.reservationsCreated ? ivrData?.reservationsCreated : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Accepted"
            value={ivrData?.reservationsAccepted ? ivrData?.reservationsAccepted : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Rejected"
            value={ivrData?.reservationsRejected ? ivrData?.reservationsRejected : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Canceled"
            value={ivrData?.reservationsCanceled ? ivrData?.reservationsCanceled : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Rescinded"
            value={ivrData?.reservationsRescinded ? ivrData?.reservationsRescinded : '---'}
            $unStyled
          />
          <InfoCard
            title="Reservation Timeout"
            value={ivrData?.reservationsTimedOut ? ivrData?.reservationsTimedOut : '---'}
            $unStyled
          />
        </Grid>
      </DetailsCard>
      {/* <Grid xs={1} lg={3} colGap={20}>
      </Grid> */}
      {/* {buttonValue === 'summary' && (
        <>
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
      )} */}
    </CallContainer>
  );
}
