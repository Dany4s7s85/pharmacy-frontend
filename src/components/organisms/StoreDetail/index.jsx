import React from 'react';
import DetailsCard from '../../molecules/DetailsCard';
import InfoCard from '../../molecules/InfoCard';
import Grid from '../../atoms/Grid';
import GridCol from '../../atoms/GridCol';

function StoreDetail({ details }) {
  const { name, address, status, contact, store_contact_person, store_id, auth_code, transaction_id } = details;
  return (
    <>
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
    </>
  );
}

export default StoreDetail;
