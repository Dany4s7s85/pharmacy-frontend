// import Grid from 'components/atoms/Grid';
import Grid from '@atoms/Grid';
import DetailsCard from '@molecules/DetailsCard';
import InfoCard from '@molecules/InfoCard';
import { convertToCurrencyFormat } from 'helpers/common';
import React from 'react';

const BusinessDetails = ({ user }) => (
  <DetailsCard gray css="margin-bottom: var(--gutter);">
    <Grid xs={1} sm={3} gap={20}>
      <InfoCard title="Business No:" value={user?.business_info?.business_no} $unStyled />
      <InfoCard title="Business Name:" value={user?.business_info?.business_name} $unStyled />
      <InfoCard title="Business Address:" value={user?.business_info?.address?.street_address ?? '---'} $unStyled />
      <InfoCard title="Business Email:" value={user?.email ?? '---'} $unStyled />
      <InfoCard title="Business Status:" value={user?.business_info?.status ?? '---'} $unStyled />
      <InfoCard title="Business Contact Number:" value={user?.business_info?.contact_number ?? '---'} $unStyled />
      <InfoCard title="Created At:" value={user?.business_info?.created_at ?? '---'} $unStyled />
      <InfoCard
        title="Credit Limit:"
        value={convertToCurrencyFormat(user?.business_info?.credit_limit) ?? '---'}
        $unStyled
      />
      <InfoCard title="Client Type:" value={user?.business_info?.client_type ?? '---'} $unStyled />
      <InfoCard title="Card Number:" value={user?.business_info?.cardInfo?.card_number ?? '---'} $unStyled />
      <InfoCard title="Card Name:" value={user?.business_info?.cardInfo?.cardholder_name ?? '---'} $unStyled />
      <InfoCard title="Card Cvv:" value={user?.business_info?.cardInfo?.cvc_cvv ?? '---'} $unStyled />
      <InfoCard
        title="Card Expiry:"
        value={
          user?.business_info?.cardInfo?.expiry_date
            ? new Date(user?.business_info?.cardInfo?.expiry_date).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'long',
              })
            : '---'
        }
        $unStyled
      />
      <InfoCard
        title="Account Balance:"
        value={convertToCurrencyFormat(user?.business_info?.account_balance) ?? '---'}
        $unStyled
      />
    </Grid>
  </DetailsCard>
);

export default BusinessDetails;
