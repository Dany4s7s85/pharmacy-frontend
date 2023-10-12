import React from 'react';
import Grid from 'components/atoms/Grid';
import { useMediaPredicate } from 'react-media-hook';
import { format } from 'date-fns';
import { getDateObject, convertToCurrencyFormat } from 'helpers/common';
import DetailsCard from '../../molecules/DetailsCard';
import InfoCard from '../../molecules/InfoCard';
import DataTabs from '../../molecules/DataTabs';

const UserTransactionDetail = ({ _ }) => {
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const data = [
    {
      label: 'Transaction Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={2} gap={20}>
            <InfoCard title="Date" value={format(getDateObject(_.created_at), 'yyyy-MM-dd')} $unStyled />
            <InfoCard title="Reference Number" value={_?.ReferenceNumber ?? '-'} $unStyled />
            <InfoCard title="Settlement Status" value={_?.SettlementStatus ?? '-'} $unStyled />
            <InfoCard title="Channel Name" value={_?.ChannelName ?? '-'} $unStyled />
            <InfoCard title="Merchant" value={_?.Merchant ?? '-'} $unStyled />
            <InfoCard title="Description" value={_?.Description ?? '-'} $unStyled />
            <InfoCard title="Transaction Type" value={_?.TransactionTypeCode === 'C' ? 'Debit' : 'Credit'} $unStyled />
            <InfoCard
              title="Transaction Amount"
              value={_?.TransactionAmount ? convertToCurrencyFormat(_.TransactionAmount) : '-'}
              $unStyled
            />
            <InfoCard
              title="Rewards Points"
              value={_?.bapRewardPoints ? _?.bapRewardPoints : _?.RewardPoints ?? '-'}
              $unStyled
            />
            <InfoCard title="Mcc" value={_?.Mcc ?? '-'} $unStyled />
            <InfoCard title="Authorization Code" value={_?.AuthorzationCode ?? '-'} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
  ];
  return <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />;
};

export default UserTransactionDetail;
