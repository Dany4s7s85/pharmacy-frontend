/* eslint-disable react/no-danger */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';

function CmsDetails({ cms }) {
  const renderHtml = () => ({ __html: cms?.htmlContent });
  return (
    <>
      <DetailsCard gray>
        <InfoCard title="Page Title" value={cms?.pageTitle ? cms?.pageTitle : '---'} />
        <InfoCard title="Slug" value={cms?.slug ? cms?.slug : '---'} />
        <InfoCard title="Meta" value={cms?.meta ? cms?.meta : '---'} />
        <InfoCard title="Content" value={<div dangerouslySetInnerHTML={renderHtml()} />} />
      </DetailsCard>
    </>
  );
}

export default CmsDetails;
