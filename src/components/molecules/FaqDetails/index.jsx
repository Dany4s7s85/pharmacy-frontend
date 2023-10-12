/* eslint-disable react/no-danger */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';

function FaqDetails({ faq }) {
  const renderHtml = () => ({ __html: faq?.answer });
  return (
    <>
      <DetailsCard gray>
        <InfoCard title="Category" value={faq?.category} />
        <InfoCard title="Question" value={faq?.question ? faq?.question : '---'} />
        <InfoCard title="Answer" value={<div dangerouslySetInnerHTML={renderHtml()} />} />
      </DetailsCard>
    </>
  );
}

export default FaqDetails;
