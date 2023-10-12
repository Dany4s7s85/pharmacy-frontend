import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import { convertToCurrencyFormat, GeoCode } from 'helpers/common';
import Toast from 'components/molecules/Toast';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import ModalContainer from 'components/molecules/ModalContainer';
import Button from 'components/atoms/Button';
import BusinessPromotionDetails from 'components/organisms/BusinessPromotionDetails';
import StoreDetails from './storeDetails';

const BusinessProfilesDetails = ({ businessProfile }) => {
  const [formattedAddress, setFormattedAddress] = useState({});
  const { business_info } = businessProfile;

  useEffect(() => {
    if (business_info?.address?.place_id && business_info?.address?.place_id !== formattedAddress?.place_id) {
      GeoCode({ placeId: business_info?.address?.place_id })
        .then(res => {
          setFormattedAddress(res);
        })
        .catch(() => {
          Toast({
            type: 'warning',
            message: 'Something Went Wrong',
          });
        });
    }
  }, []);

  const ImagePreviewModal = ({ src, alt }) => (
    <ModalContainer
      xl
      imgPreview
      btnComponent={({ onClick }) => (
        <Button
          width={200}
          onClick={onClick}
          type="primary"
          prefix={<span className="material-icons-outlined">visibility</span>}>
          Preview
        </Button>
      )}
      content={() => <img src={src} alt={alt} css="width: 100%; border-radius: 10px;" />}
    />
  );

  return (
    <>
      <Grid xs={1} sm={3} gap={20}>
        <ModalContainer
          xl
          btnComponent={({ onClick }) => (
            <Button
              xs
              type="white"
              prefix={<span className="material-icons-outlined">shopping_cart</span>}
              onClick={onClick}>
              Stores
            </Button>
          )}
          content={() => <StoreDetails businessId={businessProfile?.user_id} />}
        />
        <ModalContainer
          xl
          btnComponent={({ onClick }) => (
            <Button
              xs
              type="white"
              prefix={<span className="material-icons-outlined">campaign</span>}
              onClick={onClick}>
              Campaigns
            </Button>
          )}
          content={() => <BusinessPromotionDetails businessUserId={businessProfile?.user_id} />}
        />
      </Grid>
      <DetailsCard gray css="margin-top: var(--gutter);">
        <Grid xs={1} sm={3} gap={20}>
          <InfoCard title="Name" value={business_info?.primary_contact_person ?? '--'} $unStyled />
          <InfoCard title="Email" value={businessProfile?.email ?? '--'} $unStyled />
          <InfoCard title="Status" value={business_info?.status ?? '--'} $unStyled />
          <InfoCard title="Client Type" value={business_info?.client_type ?? '--'} $unStyled />
          <InfoCard
            title="Account Balance"
            value={business_info?.account_balance && convertToCurrencyFormat(business_info?.account_balance)}
            $unStyled
          />
          <InfoCard
            title="Credit Limit"
            value={business_info?.credit_limit && convertToCurrencyFormat(business_info?.credit_limit)}
            $unStyled
          />
          <InfoCard title="Contact Number" value={business_info?.primary_contact_number ?? '---'} $unStyled />
          <InfoCard title="Business Name" value={business_info?.business_name ?? '--'} $unStyled />
          <InfoCard
            title="Address"
            value={business_info?.address ? formattedAddress?.formatted_address : '---'}
            $unStyled
          />
          <InfoCard title="Business Number" value={business_info?.business_no ?? '---'} $unStyled />
          {business_info?.attachments?.business_logo?.cloudinary_url &&
            business_info?.attachments?.business_logo?.cloudinary_url !== '' && (
              <InfoCard
                title="Business Logo"
                value={
                  <ImagePreviewModal
                    src={business_info?.attachments?.business_logo?.cloudinary_url}
                    alt="Business Logo Not Found"
                  />
                }
                $unStyled
              />
            )}
          {business_info?.attachments?.business_picture?.cloudinary_url &&
            business_info?.attachments?.business_picture?.cloudinary_url !== '' && (
              <InfoCard
                title="Business Picture"
                value={
                  <ImagePreviewModal
                    src={business_info?.attachments?.business_picture?.cloudinary_url}
                    alt="Business Picture Not Found"
                  />
                }
                $unStyled
              />
            )}
          {business_info?.attachments?.business_receipt?.cloudinary_url &&
            business_info?.attachments?.business_receipt?.cloudinary_url !== '' && (
              <InfoCard
                title="Business Receipt"
                value={
                  <ImagePreviewModal
                    src={business_info?.attachments?.business_receipt?.cloudinary_url}
                    alt="Business Receipt Not Found"
                  />
                }
                $unStyled
              />
            )}
        </Grid>
      </DetailsCard>
    </>
  );
};

export default BusinessProfilesDetails;
