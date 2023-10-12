import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import Table from 'components/molecules/Table';

function MccDetails({ mcc }) {
  const rowsData = mcc?.mcc.map(item => [item.description, item.code]);
  return (
    <>
      <DetailsCard gray css="margin-bottom: var(--gutter);">
        <InfoCard title="Title" value={mcc?.title} />
        <InfoCard title="Color" value={mcc?.color ? mcc?.color : '---'} />
        <InfoCard
          title="Sub Category"
          value={mcc?.sub_category ? mcc?.sub_category.map(i => <div> {i ?? ' --- '} </div>) : '---'}
        />
      </DetailsCard>

      <Table rowsData={rowsData} columnNames={['Description', 'Codes']} />
    </>
  );
}

export default MccDetails;
