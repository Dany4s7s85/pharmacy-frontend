import React from 'react';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import Grid from 'components/atoms/Grid';
import SubTitle from '../../atoms/SubTitle';

const EquifaxTriggerDataDetail = ({ _ }) => {
  const itemKeys = Object.keys(_);
  const itemValues = Object.values(_);
  const date_list = ['date_reported', 'date_opened', 'date_of_last_activity', 'dob', 'date_filed'];
  return (
    <DetailsCard gray css="margin-bottom: var(--gutter);">
      <SubTitle>{_?.description}</SubTitle>
      <Grid xs={1} sm={3} gap={20}>
        {itemKeys.map((item, index) => (
          <InfoCard
            key={index}
            title={item.replace(/_/g, ' ').toLocaleUpperCase()}
            value={
              date_list.includes(item)
                ? `${itemValues[index].substr(0, 2)}-${itemValues[index].substr(2, 2)}-${itemValues[index].substr(
                    4,
                    2,
                  )}`
                : itemValues[index]
            }
            $unStyled
          />
        ))}
      </Grid>
    </DetailsCard>
  );
};

export default EquifaxTriggerDataDetail;
