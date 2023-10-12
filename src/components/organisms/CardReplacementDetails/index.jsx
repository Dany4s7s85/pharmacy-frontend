import Grid from 'components/atoms/Grid';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React from 'react';
import InfoCard from '../../molecules/InfoCard';

export default function CardReplacementDetails({ card }) {
  return (
    <Grid xs={1} sm={2} gap={20} css="margin-bottom: 20px;">
      <InfoCard title="Request Date" value={format(getDateObject(card.created_at), 'yyyy-MM-dd')} $unStyled />
      <InfoCard
        title="Full Name"
        value={
          card?.middle_name && card?.middle_name !== ''
            ? `${card?.first_name} ${card?.middle_name} ${card?.last_name}`
            : `${card?.first_name} ${card?.last_name}`
        }
        $unStyled
      />
      <InfoCard title="Email" value={card.CustomerEmail} $unStyled />
      <InfoCard title="Current Card ID" value={card.CardId} $unStyled />
      <InfoCard title="Emboss Name" value={card.EmbossName} $unStyled />
      <InfoCard title="Issuing Reason" value={card.IssuingReasonDescription} $unStyled />
      <InfoCard title="Card Type" value={card.cardIdText} $unStyled />
      <InfoCard title="Status" value={card.card_request_status} $unStyled />
      <InfoCard
        title="Requested By"
        value={
          <>
            {card.UpdatedBy} / {card.UpdatedByEmail}
          </>
        }
        $unStyled
      />
      <InfoCard
        title="Approved By"
        value={
          <>
            {card.approvedBy} / {card.approvedByEmail}
          </>
        }
        $unStyled
      />
      <InfoCard title="Notes" value={card.Notes} $unStyled />
    </Grid>
  );
}
