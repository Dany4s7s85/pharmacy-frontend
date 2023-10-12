import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Select from 'components/atoms/Select';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import userService from 'services/userService';
import kycService from 'services/kycService';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import InfoCard from 'components/molecules/InfoCard';
import Toast from 'components/molecules/Toast';
import GridCol from 'components/atoms/GridCol';
import Heading from 'components/atoms/Heading';
import ImgPreview from 'components/molecules/ImgPreview';
import equifaxService from 'services/equifaxService';

function TagVerification({ onClose }) {
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userKYCDocs, setUserKYCDocs] = useState(null);
  const [verificationType, setVerificationType] = useState('');
  const [state, setState] = useState({
    approvedCustomerId: '',
    notVerifiedCustomerId: '',
  });

  const handleSearchKYCApprovedCustomers = async inputValue => {
    try {
      const response = await kycService.search_kyc({
        page: 1,
        pageSize: 20,
        searchText: inputValue,
        startDate: '',
        endDate: '',
        filterKyc: 'approved',
        customerStatus: 'Suspended due to Application error',
      });

      const options = response.kyc.map(_ => ({
        value: _,
        label: `Name:${`${_?.user_id?.first_name} ${_?.user_id?.last_name}`}, Email: ${_?.user_id?.email}`,
      }));
      return options;
    } catch {
      return [];
    }
  };

  const handleSearchKYCNotVerifiedCustomers = async inputValue => {
    try {
      const response = await kycService.getEligibleTagVerificationCustomers(inputValue);

      const options = response.data.map(_ => ({
        value: _,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));
      return options;
    } catch {
      return [];
    }
  };

  const makeImagesPublic = async userId => {
    await kycService
      .dev_make_images_public(userId)
      .then(res => {
        if (res.status) {
          setUserKYCDocs(res.result);
        }
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
  };

  const handleGetKYCDocs = async e => {
    if (userKYCDocs !== null) {
      setUserKYCDocs(null);
    }
    setState({
      ...state,
      approvedCustomerId: e.target.value.value.user_id._id,
    });
    if (e.target.value.value?.private) {
      makeImagesPublic(e.target.value.value.user_id._id);
    } else {
      setUserKYCDocs(e.target.value.value);
    }
  };

  const handleTagKYCVerification = async () => {
    setLoading(true);
    await kycService
      .tagKYCVerification(state)
      .then(res => {
        if (res.success) {
          Toast({
            type: 'success',
            message: res?.message,
          });
        } else {
          Toast({
            type: 'error',
            message: res?.message ?? 'Something Went Wrong',
          });
        }
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
    setLoading(false);
    onClose();
    refetch();
  };

  const handleSearchEquifaxVerifiedCustomers = async inputValue => {
    try {
      const response = await userService.getUsers({
        searchText: inputValue,
        page: 1,
        pageSize: 20,
        startDate: '',
        endDate: '',
        filterStatus: 'Suspended due to Application error',
        filterKyc: '',
        filterEquifax: 'Verified',
        filterCard: '',
        filterCardStatus: '',
        getFilterOnly: false,
        getWhoIsNotTagged: true,
      });

      const options = response.customers.map(_ => ({
        value: _?._id,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));
      return options;
    } catch {
      return [];
    }
  };

  const handleSearchEquifaxNotVerifiedCustomers = async inputValue => {
    try {
      const response = await equifaxService.getEligibleTagVerificationCustomers(inputValue);

      const options = response.data.map(_ => ({
        value: _,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));
      return options;
    } catch {
      return [];
    }
  };

  const handleTagEquifaxVerification = async () => {
    setLoading(true);
    await equifaxService
      .tagVerification(state)
      .then(res => {
        if (res.success) {
          Toast({
            type: 'success',
            message: res?.message,
          });
        } else {
          Toast({
            type: 'error',
            message: res?.message ?? 'Something Went Wrong',
          });
        }
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
    setLoading(false);
    onClose();
    refetch();
  };

  const handleTagVerification = () => {
    if (state.approvedCustomerId !== '' && state.notVerifiedCustomerId !== '') {
      if (verificationType === 'kycVerification') {
        handleTagKYCVerification();
      }
      if (verificationType === 'equifaxVerification') {
        handleTagEquifaxVerification();
      }
    } else {
      Toast({
        type: 'error',
        message: 'Values Are Required For The Process',
      });
    }
  };

  return (
    <Loaders loading={loading}>
      <Select
        sm
        noMargin
        isSearchable={false}
        options={[
          { label: 'Tag KYC Verification', value: 'kycVerification' },
          { label: 'Tag Equifax Verification', value: 'equifaxVerification' },
        ]}
        onChange={e => {
          setVerificationType(e.target.value.value);
        }}
      />
      {verificationType === 'kycVerification' ? (
        <Grid xs={1} css="margin-top:20px;">
          <InfoCard
            title="KYC Approved Customer"
            value={
              <Select
                sm
                open
                async
                defaultOptions
                filterOption={false}
                loadOptions={handleSearchKYCApprovedCustomers}
                onChange={handleGetKYCDocs}
              />
            }
          />
          {userKYCDocs && (
            <Grid gap={30} lg={3} css="margin:20px 0px;">
              <GridCol>
                <Heading level={3}>Front Photo</Heading>
                <ImgPreview src={userKYCDocs?.photo_id_front} />
              </GridCol>
              {userKYCDocs.photo_id_back && (
                <GridCol>
                  <Heading level={3}>Back Photo</Heading>
                  <ImgPreview src={userKYCDocs?.photo_id_back} />
                </GridCol>
              )}
              {userKYCDocs.utility_doc && (
                <GridCol>
                  <Heading level={3}>Utility Doc</Heading>
                  <ImgPreview src={userKYCDocs?.utility_doc} />
                </GridCol>
              )}
              <GridCol>
                <Heading level={3}>Selfie</Heading>
                <ImgPreview src={userKYCDocs?.selfie} />
              </GridCol>
            </Grid>
          )}
          <InfoCard
            title="KYC Not Verified Customer"
            value={
              <Select
                sm
                open
                async
                defaultOptions
                filterOption={false}
                loadOptions={handleSearchKYCNotVerifiedCustomers}
                onChange={e => {
                  setState({
                    ...state,
                    notVerifiedCustomerId: e.target.value.value._id,
                  });
                }}
              />
            }
          />
        </Grid>
      ) : verificationType === 'equifaxVerification' ? (
        <Grid xs={1} css="margin-top:20px;">
          <InfoCard
            title="Equifax Verified Customer"
            value={
              <Select
                sm
                open
                async
                defaultOptions
                filterOption={false}
                loadOptions={handleSearchEquifaxVerifiedCustomers}
                onChange={e => {
                  setState({
                    ...state,
                    approvedCustomerId: e.target.value.value,
                  });
                }}
              />
            }
          />
          <InfoCard
            title="Equifax Not Verified Customer"
            value={
              <Select
                sm
                open
                async
                defaultOptions
                filterOption={false}
                loadOptions={handleSearchEquifaxNotVerifiedCustomers}
                onChange={e => {
                  setState({
                    ...state,
                    notVerifiedCustomerId: e.target.value.value,
                  });
                }}
              />
            }
          />
        </Grid>
      ) : null}
      <Button type="primary" css="margin-top:20px;" onClick={handleTagVerification}>
        Submit
      </Button>
    </Loaders>
  );
}

export default TagVerification;
