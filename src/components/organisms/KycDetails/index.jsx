import React, { useState, useContext, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { useMediaPredicate } from 'react-media-hook';
import Grid from 'components/atoms/Grid';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import kycService from 'services/kycService';
import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import KycRejectionForm from 'components/organisms/KycRejectionForm';
import ModalContainer from 'components/molecules/ModalContainer';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import CsrWrapper from 'components/organisms/CsrWrapper';
import CustomerDetail from 'components/organisms/CustomerDetail';
import Heading from 'components/atoms/Heading';
import GridCol from 'components/atoms/GridCol';
import DataTabs from 'components/molecules/DataTabs';
import ImgPreview from 'components/molecules/ImgPreview';
import GetUserAdditionalDocs from '../GetUserAdditionalDocs';
import KycRequestImage from '../KycRequestImage';

export default function KycDetails({ userId }) {
  const { refetch, hasPermission } = useContext(AuthContext);
  const [reload, setReload] = useState(false);
  const { single_kyc_data, single_kyc_loading } = kycService.GetSingleKyc(userId, reload);
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const [state, setState] = useState({
    kyc_status: '',
    updated_by: '',
    updated_at: '',
  });

  const [actionsState, setActionsState] = useState({
    areImagesPrivate: '',
    isKycPrivate: false,
    isStatusPublic: '',
  });

  const [loading, setLoading] = useState(false);

  const { areImagesPrivate, isKycPrivate, isStatusPublic } = actionsState;
  const { kyc_status } = state;
  useEffect(() => {
    setState(prev => ({
      ...prev,
      kyc_status: single_kyc_data?.user_id?.kyc_status,
      updated_by: single_kyc_data?.updated_by,
      updated_at: single_kyc_data?.updated_at?.split('T')[0],
    }));
    setActionsState(prev => ({
      ...prev,
      areImagesPrivate: true,
      isKycPrivate: single_kyc_data.private ?? false,
      isStatusPublic: false,
    }));
  }, [single_kyc_data, reload]);

  const provinces = {
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    SK: 'Saskatchewan',
    YT: 'Yukon',
  };

  const getProvince = province => Object.keys(provinces).includes(province) && provinces[province];
  const didMatched = isMatched => (
    <Tooltip title={isMatched === true ? 'matched' : 'not matched'} type="dark">
      {isMatched === true ? (
        <Button unStyled className="detail-btn">
          <i className="material-icons-outlined">check</i>
        </Button>
      ) : (
        <Button unStyled className="detail-btn">
          <i className="material-icons-outlined">clear</i>
        </Button>
      )}
    </Tooltip>
  );
  const downloadIt = () => {
    setLoading(true);
    try {
      const urls = [];

      urls.push(single_kyc_data?.selfie);
      urls.push(single_kyc_data?.photo_id_front);
      urls.push(single_kyc_data?.photo_id_back);
      urls.push(single_kyc_data?.utility_doc);

      const interval = setInterval(() => {
        const url = urls.pop();
        const a = document.createElement('a');
        if (url !== undefined && url !== '') {
          a.href = url;
          a.click();
        }
        if (urls.length === 0) {
          clearInterval(interval);

          setLoading(false);
        }
      }, 1000);
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  const makeImagesPublic = async () => {
    try {
      await kycService.dev_make_images_public(userId);
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
    }

    setReload(() => !reload);
  };

  const makeImagesPrivate = async () => {
    try {
      await kycService.dev_make_images_private(userId);

      setReload(() => !reload);
    } catch (error) {
      Toast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const approveKyc = async kycId => {
    try {
      setLoading(true);
      const res = await kycService.approve_kyc(kycId);
      if (res?.success) {
        Toast({
          message: res?.message,
          type: 'success',
        });
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }
      refetch();
      setLoading(false);
    } catch (err) {
      refetch();
      setLoading(false);
      Toast({
        type: 'error',
        message: err.message,
      });
    }
  };

  const resetKYC = async kycId => {
    try {
      setLoading(true);
      const res = await kycService.reset_kyc(kycId);
      Toast({
        message: res?.message,
        type: 'success',
      });

      refetch();
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      refetch();
      Toast({
        message: ex?.message,
        type: 'error',
      });
    }
  };

  const tabsData = [
    {
      label: 'Plastk Verification',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={2} gap={20}>
            <InfoCard
              title="Kyc Status"
              value={single_kyc_data?.user_id?.kyc_status.toString().toUpperCase()}
              $unStyled
            />
            {single_kyc_data?.user_id?.kyc_status === 'processing' && (
              <InfoCard
                title="Automation Rejection Message"
                value={single_kyc_data?.auto_kyc_message?.toUpperCase() || ''}
                $unStyled
              />
            )}

            <InfoCard title="Card Type" value={single_kyc_data.photo_id_type} $unStyled />
            {single_kyc_data?.province && <InfoCard title="Province" value={single_kyc_data?.province} $unStyled />}
            {single_kyc_data?.updated_by && (
              <InfoCard title="Updated By" value={single_kyc_data?.updated_by.split('T')[0]} $unStyled />
            )}
            {single_kyc_data?.updated_at && (
              <InfoCard title="Updated At" value={single_kyc_data?.updated_at.split('T')[0]} $unStyled />
            )}
          </Grid>
        </DetailsCard>
      ),
    },
    isStatusPublic || !isKycPrivate
      ? {
          label: 'Verification Documents',
          content:
            isStatusPublic || !isKycPrivate ? (
              <Grid gap={30} lg={3}>
                <GridCol>
                  <Heading level={3}>Front Photo</Heading>
                  <ImgPreview src={`${single_kyc_data?.photo_id_front}?${new Date().getTime()}`} />
                </GridCol>
                {single_kyc_data.photo_id_back && (
                  <GridCol>
                    <Heading level={3}>Back Photo</Heading>
                    <ImgPreview src={`${single_kyc_data?.photo_id_back}?${new Date().getTime()}`} />
                  </GridCol>
                )}
                {single_kyc_data.utility_doc && (
                  <GridCol>
                    <Heading level={3}>Utility Doc</Heading>
                    <ImgPreview src={`${single_kyc_data?.utility_doc}?${new Date().getTime()}`} />
                  </GridCol>
                )}
                <GridCol>
                  <Heading level={3}>Selfie</Heading>
                  <ImgPreview src={`${single_kyc_data?.selfie}?${new Date().getTime()}`} />
                </GridCol>
              </Grid>
            ) : null,
        }
      : undefined,
    {
      label: 'Personal Information',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="First Name:"
              value={single_kyc_data?.user_id?.first_name ? single_kyc_data?.user_id?.first_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Middle Name:"
              value={single_kyc_data?.user_id?.middle_name ? single_kyc_data?.user_id?.middle_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Last Name:"
              value={single_kyc_data?.user_id?.last_name ? single_kyc_data?.user_id?.last_name : '---'}
              $unStyled
            />

            {single_kyc_data?.user_id?.dob && (
              <InfoCard
                title="DOB:"
                value={single_kyc_data?.user_id?.dob ? single_kyc_data?.user_id?.dob.split('T')[0] : ' --- '}
                $unStyled
              />
            )}
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Address Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Street Address:"
              value={single_kyc_data?.user_id?.street_address ? single_kyc_data?.user_id?.street_address : '---'}
              $unStyled
            />
            <InfoCard
              title="Suite Number:"
              value={single_kyc_data?.user_id?.suite_number ? single_kyc_data?.user_id?.suite_number : '---'}
              $unStyled
            />
            <InfoCard
              title="City:"
              value={single_kyc_data?.user_id?.city ? single_kyc_data?.user_id?.city : '---'}
              $unStyled
            />
            <InfoCard
              title="Province:"
              value={single_kyc_data?.user_id?.province ? getProvince(single_kyc_data?.user_id?.province) : '---'}
              $unStyled
            />
            <InfoCard
              title="Province abbreviation:"
              value={single_kyc_data?.user_id?.province ? single_kyc_data?.user_id?.province : '---'}
              $unStyled
            />
            <InfoCard
              title="Postal Code:"
              value={single_kyc_data?.user_id?.postal_code ? single_kyc_data?.user_id?.postal_code : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    single_kyc_data?.kyc_response &&
      !single_kyc_data?.kyc_response?.isCardVerified &&
      !single_kyc_data?.kyc_response?.isKycPassed && {
        label: 'Automation Aborted',
        content: single_kyc_data?.kyc_response &&
          !single_kyc_data?.kyc_response?.isCardVerified &&
          !single_kyc_data?.kyc_response?.isKycPassed && (
            <DetailsCard gray css="margin-bottom: var(--gutter);">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Automation Aborted :"
                  value={single_kyc_data.kyc_response?.message ? single_kyc_data.kyc_response?.message : '---'}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ),
      },
    single_kyc_data?.kyc_response?.isCardVerified &&
      single_kyc_data?.kyc_response?.BarcodeVsSignup && {
        label: 'Barcode Vs Sign Up Matching',
        content: single_kyc_data?.kyc_response?.isCardVerified && single_kyc_data?.kyc_response?.BarcodeVsSignup && (
          <DetailsCard gray css="margin-bottom: var(--gutter);">
            <Grid xs={1} sm={3} gap={20}>
              <InfoCard
                title="Postal Code Match"
                value={
                  didMatched(single_kyc_data?.kyc_response?.BarcodeVsSignup?.isPostalCodeMatched)
                    ? single_kyc_data?.kyc_response?.message
                    : '---'
                }
                $unStyled
              />
              <InfoCard
                title="DOB Match"
                value={didMatched(single_kyc_data?.kyc_response?.BarcodeVsSignup?.isDOBMatched)}
                $unStyled
              />
              <InfoCard
                title="Name Match"
                value={didMatched(single_kyc_data?.kyc_response.BarcodeVsSignup.isNameMatched)}
                $unStyled
              />
              {!single_kyc_data?.kyc_response.BarcodeVsSignup?.isPostalCodeMatched && (
                <InfoCard
                  title="Utility Postal Code Match"
                  value={single_kyc_data?.kyc_response?.BarcodeVsSignup?.signupVsUtilityBill?.message}
                />
              )}
            </Grid>
          </DetailsCard>
        ),
      },
    !single_kyc_data?.kyc_response?.isCardVerified && single_kyc_data?.kyc_response?.OCRvsBarcode
      ? {
          label: 'OCR vs Barcode Matching',
          content: (
            <>
              {!single_kyc_data?.kyc_response?.isCardVerified && single_kyc_data?.kyc_response?.OCRvsBarcode && (
                <DetailsCard gray css="margin-bottom: var(--gutter);">
                  <Grid>
                    <InfoCard
                      title="Address Match"
                      value={<>{didMatched(single_kyc_data?.kyc_response.OCRvsBarcode.isAddressMatched)}</>}
                      $unStyled
                    />
                    <InfoCard
                      title="DOB Match"
                      value={<>{didMatched(single_kyc_data?.kyc_response?.OCRvsBarcode?.isDOBMatched)}</>}
                      $unStyled
                    />
                    <InfoCard
                      title="Expiry Match"
                      value={<>{didMatched(single_kyc_data?.kyc_response?.OCRvsBarcode?.isExpiryMatched)}</>}
                      $unStyled
                    />
                  </Grid>
                </DetailsCard>
              )}
              {single_kyc_data?.kyc_response?.OCRvsBarcode && (
                <DetailsCard>
                  <InfoCard
                    title="License Number Match"
                    value={<>{didMatched(single_kyc_data?.kyc_response.OCRvsBarcode.isLicenseNumberMatched)}</>}
                    $unStyled
                  />
                  <InfoCard
                    title="Name Match"
                    value={<>{didMatched(single_kyc_data?.kyc_response.OCRvsBarcode.isNameMatched)}</>}
                    $unStyled
                  />
                  <InfoCard
                    title="Face Match"
                    value={<>{didMatched(single_kyc_data?.kyc_response.isFaceVerified)}</>}
                    $unStyled
                  />
                </DetailsCard>
              )}
            </>
          ),
        }
      : undefined,
    { label: 'Additional Documents', content: <GetUserAdditionalDocs customerId={userId} /> },
  ];

  return (
    <>
      <Grid gap={20} xs={4} css="margin-bottom: var(--gutter);">
        {hasPermission('plastk-verification-documents.approve') &&
          single_kyc_data?.user_id?.kyc_status === 'processing' && (
            <ConfirmationModal
              title="Do you want to approve kyc?"
              subtitle="Press Submit to confirm"
              confirmationModal="Submit"
              onOk={() => {
                approveKyc(userId);
              }}
              btnComponent={({ onClick }) => (
                <Button
                  type="primary"
                  onClick={onClick}
                  prefix={<i className="material-icons-outlined">check_circle</i>}>
                  Approve KYC
                </Button>
              )}
            />
          )}

        {hasPermission('plastk-verification-documents.reject') &&
          single_kyc_data?.user_id?.kyc_status === 'processing' && (
            <ModalContainer
              lg
              title="Reject KYC"
              btnComponent={({ onClick }) => (
                <Button
                  type="danger"
                  prefix={<i className="material-icons-outlined">highlight_off</i>}
                  onClick={onClick}>
                  Reject KYC
                </Button>
              )}
              content={({ onClose }) => <KycRejectionForm onClose={onClose} userId={userId} />}
            />
          )}
        {hasPermission('plastk-verification-documents.request') &&
          single_kyc_data?.user_id?.kyc_status === 'processing' && (
            <ModalContainer
              lg
              title="Request New Images"
              btnComponent={({ onClick }) => (
                <Button
                  type="primary"
                  prefix={<i className="material-icons-outlined">image_search</i>}
                  onClick={onClick}>
                  Request New Images
                </Button>
              )}
              content={({ onClose }) => <KycRequestImage onClose={onClose} userId={userId} kycData={single_kyc_data} />}
            />
          )}
        {hasPermission('plastk-verification-documents.reset') &&
          single_kyc_data?.user_id?.kyc_status === 'rejected' && (
            <Loaders loading={loading}>
              <ConfirmationModal
                title="Do you want to reset kyc?"
                subtitle="Press Submit to confirm"
                confirmationModal="Submit"
                onOk={() => {
                  resetKYC(userId);
                }}
                btnComponent={({ onClick }) => (
                  <Button type="white" prefix={<i className="material-icons-outlined">update</i>} onClick={onClick}>
                    Reset KYC
                  </Button>
                )}
              />
            </Loaders>
          )}
        {(kyc_status !== 'approved' || !isKycPrivate) && (
          <Button
            type="outline"
            prefix={<i className="material-icons-outlined">download</i>}
            onClick={() => downloadIt()}>
            Download Docs
          </Button>
        )}

        {hasPermission('customers.details') && (
          <ModalContainer
            width={900}
            title={`Details (${single_kyc_data?.user_id?.email})`}
            btnComponent={({ onClick }) => (
              <Button type="primary" prefix={<i className="material-icons-outlined">description</i>} onClick={onClick}>
                Details
              </Button>
            )}
            content={({ onClose }) => (
              <CsrWrapper onClose={onClose} customer={single_kyc_data?.user_id}>
                <CustomerDetail
                  customerId={single_kyc_data?.user_id?._id}
                  customerEmail={single_kyc_data?.user_id?.email}
                  onClose={onClose}
                />
              </CsrWrapper>
            )}
          />
        )}
        {hasPermission('plastk-verification-documents.makeuserprivate') &&
          !isKycPrivate &&
          kyc_status === 'approved' && (
            <ConfirmationModal
              title="Do you want to perform action?"
              subtitle="Press Submit to confirm"
              confirmationModal="Submit"
              onOk={() => {
                makeImagesPrivate();
              }}
              btnComponent={({ onClick }) => (
                <Button type="primary" onClick={onClick}>
                  Make User Private
                </Button>
              )}
            />
          )}

        {hasPermission('plastk-verification-documents.makeuserpublic') &&
          isKycPrivate &&
          areImagesPrivate &&
          kyc_status === 'approved' && (
            <ConfirmationModal
              title="Do you want to perform action?"
              subtitle="Press Submit to confirm"
              confirmationModal="Submit"
              onOk={() => {
                makeImagesPublic();
              }}
              btnComponent={({ onClick }) => (
                <Button type="primary" onClick={onClick}>
                  Make User Public
                </Button>
              )}
            />
          )}
      </Grid>

      <Loaders loading={single_kyc_loading}>
        <DataTabs data={tabsData} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />
      </Loaders>
    </>
  );
}
