import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import Heading from 'components/atoms/Heading';
import GridCol from 'components/atoms/GridCol';
import { useMediaPredicate } from 'react-media-hook';
import Icon from 'components/atoms/Icon';
import Loaders from 'components/atoms/Loaders';
import DataTabs from 'components/molecules/DataTabs';
import Toast from 'components/molecules/Toast';
import Table from 'components/molecules/Table';
import ImgPreview from 'components/molecules/ImgPreview';
import userService from 'services/userService';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Button from 'components/atoms/Button';

function ApplicationModal({ _ }) {
  const [discountData, setDiscountData] = useState('');
  const [loading, setLoading] = useState(false);
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const Discdetails = async () => {
    setLoading(true);
    await userService
      .getDiscountDetails(_._id)
      .then(res => {
        setLoading(false);
        setDiscountData(res);
      })
      .catch(err => {
        setLoading(false);
        Toast({
          type: 'error',
          message: err.message,
        });
      });
  };

  const makeImagesPublic = async () => {
    try {
      const res = await userService.dev_make_images_public(_.user_id._id);
      if (res?.status) {
        Discdetails();
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  const makeImagesPrivate = async () => {
    try {
      const res = await userService.dev_make_images_private(_.user_id._id);
      if (res?.status) {
        Discdetails();
      }
    } catch (error) {
      Toast({
        type: 'error',
        message: error.message,
      });
    }
  };

  useEffect(() => {
    Discdetails();
  }, []);
  const statusIcon = status => {
    switch (status) {
      case 'paid':
        return 'check_circle';
      case 'pending':
        return 'error';
      default:
        return 'clear';
    }
  };

  const { result } = useMemo(
    () => ({
      result: discountData
        ? discountData.details.map(data => [
            data.discount,
            data.amount,
            data.status ? (
              <Icon
                iconName={statusIcon(data.status)}
                showTooltip
                toolTipContent={data.status === 'paid' ? 'Paid' : 'Pending'}
              />
            ) : (
              '-------'
            ),
          ])
        : null,
    }),
    [discountData.details],
  );

  const columnNames = [`Discount`, `Amount`, `Status`];

  const data = [
    discountData?.private === false && {
      label: 'Photos',
      content: (
        <Grid gap={30} lg={2}>
          <GridCol>
            <Heading level={3}>Id Card Image</Heading>
            <ImgPreview src={discountData?.image_url} alt="Id Card Image" />
          </GridCol>
          <GridCol>
            <Heading level={3}>Selfie</Heading>
            <ImgPreview src={discountData?.selfie} alt="selfie" />
          </GridCol>
        </Grid>
      ),
    },
    {
      label: 'Details',
      content: <Table columnNames={columnNames} rowsData={result} noPadding />,
    },
  ];
  return (
    <>
      <div
        css={`
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        `}>
        {discountData?.private === true ? (
          <ConfirmationModal
            title="Do you want to perform action?"
            subtitle="Press Submit to confirm"
            confirmationModal="Submit"
            onOk={makeImagesPublic}
            btnComponent={({ onClick }) => (
              <Button type="white" width={150} onClick={onClick}>
                Make User Public
              </Button>
            )}
          />
        ) : (
          <ConfirmationModal
            title="Do you want to perform action?"
            subtitle="Press Submit to confirm"
            confirmationModal="Submit"
            onOk={makeImagesPrivate}
            btnComponent={({ onClick }) => (
              <Button type="white" width={150} onClick={onClick}>
                Make User Private
              </Button>
            )}
          />
        )}
      </div>
      <Loaders loading={loading}>
        <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />
      </Loaders>
    </>
  );
}
export default ApplicationModal;
