import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import { getDateObject } from 'helpers/common';

import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import transactionService from 'services/transactionService';
import Toast from 'components/molecules/Toast';
import NoData from 'components/atoms/NoData';
import Loaders from 'components/atoms/Loaders';
import { format } from 'date-fns';

function CustomerDetail({ result }) {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    setLoading(true);
    try {
      await transactionService.incomingTransactionDetail(result._id).then(res => {
        setState(res);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  }, []);
  return (
    <Loaders loading={loading}>
      {state.user && (
        <DetailsCard title="User Payment">
          <Grid lg={2} gap={20}>
            <InfoCard
              title="Used At"
              value={
                state?.user_payment?.created_at
                  ? format(getDateObject(state?.user_payment?.created_at), 'yyyy-MM-dd')
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Name"
              value={
                state?.user?.middle_name && state?.user?.middle_name !== ''
                  ? `${state?.user?.first_name} ${state?.user?.middle_name} ${state?.user?.last_name}`
                  : `${state?.user?.first_name} ${state?.user?.last_name}`
              }
              $unStyled
            />
            <InfoCard title="Email" value={state?.user?.email ? state.user.email : '---'} $unStyled />
            <InfoCard
              title="Customer Number"
              value={state?.user?.customer_number ? state.user.customer_number : '---'}
              $unStyled
            />
            <InfoCard
              title="Reference Number"
              value={result.ReferenceNumber ? result.ReferenceNumber : '---'}
              $unStyled
            />
            <InfoCard
              title="Posted By"
              value={state.user_payment.posted_by ? state.user_payment.posted_by : '---'}
              $unStyled
            />
            {state.user_payment.posted_by === 'Admin' && (
              <InfoCard
                title="Admin Name"
                value={
                  state.user_payment.posted_admin_id?.username ? state.user_payment?.posted_admin_id?.username : '---'
                }
                $unStyled
              />
            )}
          </Grid>
        </DetailsCard>
      )}
      {state.credit && (
        <DetailsCard title="Credit Limit Request">
          <Grid lg={2} gap={20}>
            <InfoCard
              title="Used At"
              value={
                state?.credit_limit_request?.created_at
                  ? format(getDateObject(state?.credit_limit_request?.created_at), 'yyyy-MM-dd')
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Approved By"
              value={
                state?.credit_limit_request?.approved_by?.username
                  ? state?.credit_limit_request?.approved_by?.username
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Name"
              value={
                state?.credit?.middle_name && state?.credit?.middle_name !== ''
                  ? `${state?.credit?.first_name} ${state?.credit?.middle_name} ${state?.credit?.last_name}`
                  : `${state?.credit?.first_name} ${state?.credit?.last_name}`
              }
              $unStyled
            />
            <InfoCard title="Email" value={state?.credit?.email ? state.credit.email : '---'} $unStyled />
            <InfoCard
              title="Customer Number"
              value={state?.credit?.customer_number ? state.credit.customer_number : '---'}
              $unStyled
            />
            <InfoCard
              title="Reference Number"
              value={result.ReferenceNumber ? result.ReferenceNumber : '---'}
              $unStyled
            />
            <InfoCard
              title="Request Posted By"
              value={
                state?.credit_limit_request?.request_post_by ? state?.credit_limit_request?.request_post_by : '---'
              }
              $unStyled
            />
            {state?.credit_limit_request?.request_post_by === 'Admin' && (
              <InfoCard
                title="Admin Name"
                value={
                  state?.credit_limit_request?.requested_by
                    ? state?.credit_limit_request?.requested_by?.username
                    : '---'
                }
                $unStyled
              />
            )}
          </Grid>
        </DetailsCard>
      )}
      {state.interac && (
        <DetailsCard title="User Interac Reference Number">
          <Grid lg={2} gap={20}>
            <InfoCard
              title="Name"
              value={
                state?.interac?.middle_name && state?.interac?.middle_name !== ''
                  ? `${state?.interac?.first_name} ${state?.interac?.middle_name} ${state?.interac?.last_name}`
                  : `${state?.interac?.first_name} ${state?.interac?.last_name}`
              }
              $unStyled
            />
            <InfoCard title="Email" value={state?.interac?.email ? state.interac.email : '---'} $unStyled />
            <InfoCard
              title="Customer Number"
              value={state?.interac?.customer_number ? state.interac.customer_number : '---'}
              $unStyled
            />
            <InfoCard
              title="Reference Number"
              value={result.ReferenceNumber ? result.ReferenceNumber : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      )}
      {!state.interac && !state.credit && !state.user && <NoData />}
    </Loaders>
  );
}

export default CustomerDetail;
