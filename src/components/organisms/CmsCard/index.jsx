import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import Card from 'components/atoms/Card';
import InfoCard from 'components/molecules/InfoCard';
import Switch from 'components/atoms/Switch';
import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import ModalContainer from 'components/molecules/ModalContainer';
import cmsService from 'services/cmsService';
import Toast from 'components/molecules/Toast';
import DetailsCard from 'components/molecules/DetailsCard';
import CmsEditForm from '../CmsEditForm';
import CmsAddForm from '../CmsAddForm';

// eslint-disable-next-line no-unused-vars
function CmsCard({ refetch, title, cmsData, viewEditLevel, levelVal, category, hasPermission }) {
  const [loading, setLoading] = useState(false);
  const disableItem = async (item, value, active) => {
    try {
      setLoading(true);
      const payload = {
        category,
        subcategory: item,
        value,
        active,
      };
      const res = await cmsService.disableItem(payload);
      if (res) {
        if (res?.success) {
          setLoading(false);
          Toast({ type: 'success', message: res?.message });
          refetch();
        } else {
          Toast({ type: 'error', message: res?.message });
        }
      }
    } catch (error) {
      setLoading(false);
      Toast({ type: 'error', message: error?.message });
    }
  };

  return (
    <>
      <Card
        title={title}
        button={
          hasPermission('system-configuration.add_sub_category') && (
            <ModalContainer
              lg
              title="Add Parameters"
              btnComponent={({ onClick }) => (
                <Button
                  type="outline"
                  width={150}
                  onClick={onClick}
                  prefix={<i className="material-icons-outlined">add</i>}>
                  Add Parameters
                </Button>
              )}
              content={({ onClose }) => (
                <CmsAddForm onClose={onClose} category={category} refetch={refetch} levelVal={levelVal} />
              )}
            />
          )
        }>
        <Grid xs={12} gap={20}>
          {cmsData &&
            cmsData.length > 0 &&
            cmsData.map(item => (
              <GridCol xs={12} xl={6} xxl={4} css="display: grid;">
                <DetailsCard gray title={item.title ? item.title : '-'} css="margin-bottom:0;">
                  {hasPermission('system-configuration.edit_sub_category') && (
                    <ModalContainer
                      lg
                      title="Add Parameters"
                      btnComponent={({ onClick }) => (
                        <Button
                          size={30}
                          type="primary"
                          shape="circle"
                          onClick={onClick}
                          css={`
                            position: absolute;
                            top: 20px;
                            right: 20px;
                          `}>
                          <i className="material-icons-outlined">edit</i>
                        </Button>
                      )}
                      content={({ onClose }) => (
                        <CmsEditForm
                          item={item}
                          onClose={onClose}
                          category={category}
                          refetch={refetch}
                          levelVal={levelVal}
                        />
                      )}
                    />
                  )}

                  <Grid xs={12} gap={20}>
                    <GridCol xs={6} xxl={6}>
                      <InfoCard title="View Permission:" value={item.view_permission} $unStyled fontbase />
                    </GridCol>
                    <GridCol xs={6} xxl={6}>
                      <InfoCard title="Edit Permission:" value={item.edit_permission} $unStyled fontbase />
                    </GridCol>
                    <GridCol xs={12} xxl={12}>
                      <Grid xs={1} sm={2} gap={15}>
                        {item.values.map((s, ind) => {
                          let indCurr = item?.values?.filter(v => v.active);
                          indCurr = indCurr[indCurr.length - 1];
                          return (
                            <Grid
                              xs={12}
                              gap={10}
                              css={`
                                border: 1px solid var(--border-color);
                                border-radius: 10px;
                                padding: 10px;
                              `}>
                              <GridCol xs={8}>
                                <InfoCard
                                  title="Value"
                                  value={
                                    <span
                                      css={`
                                        color: ${s.active ? 'var(--success)' : 'var(--danger)'};
                                        font-size: 14px;
                                      `}>
                                      {s.value}
                                    </span>
                                  }
                                  $unStyled
                                  fontbase
                                />
                              </GridCol>
                              <GridCol xs={4}>
                                <div
                                  css={`
                                    margin-bottom: 6px;
                                    font-size: 12px;
                                  `}>
                                  {ind === 0 && <span>(Default)</span>}
                                  {s?.value === indCurr?.value && <span>(Current)</span>}
                                </div>
                                {ind !== 0 && (
                                  <Tooltip title={s.active ? 'Disable' : 'Enable'}>
                                    <Switch
                                      disabled={loading}
                                      noMargin
                                      name={s._id}
                                      defaultChecked={s.active}
                                      checked={s.active}
                                      onChange={({ target: { value } }) => {
                                        disableItem(item, s, value);
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </GridCol>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </GridCol>
                  </Grid>
                </DetailsCard>
              </GridCol>
            ))}
        </Grid>
      </Card>
    </>
  );
}

export default CmsCard;
