/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-no-bind */
import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import applicationService from 'services/applicationService';
import cardService from 'services/cardService';
import userService from 'services/userService';
import transactionService from 'services/transactionService';

import Switch from 'components/atoms/Switch';
import { convertToCurrencyFormat } from 'helpers/common';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import ModalContainer from 'components/molecules/ModalContainer';
import Field from 'components/molecules/Field';
import Toast from 'components/molecules/Toast';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Grid from '../../atoms/Grid';
import { StepsList, StepItem, StepBtn } from './CustomerActions.styles';
import Button from '../../atoms/Button';
import SendStatement from '../SendStatement';
import MakePayment from '../MakePayment';
import AddPoints from '../AddPoints';
import RequestCreditLimit from '../RequestCreditLimit';
import PointsToCashForm from '../PointsToCashForm';
import PlastkVerification from '../PlastkVerification';
import SuspendCustomer from '../SuspendCustomer';

const UserInfo = ({ customer, children, ...props }) => (
  <Grid xs={1} sm={2} gap={20} css="margin-bottom: 20px;" {...props}>
    <InfoCard title="Name" value={`${customer?.first_name} ${customer?.last_name}`} $unStyled />
    <InfoCard title="Email" value={customer?.email} $unStyled />
    {children}
  </Grid>
);

function CustomerActions({ customer }) {
  const [loading, setLoading] = useState(false);
  const { hasPermission, refetch } = useContext(AuthContext);
  const [state, setState] = useState('');
  const [generateDpid, setGenerateDpid] = useState(false);
  const paymentStatus = [
    'Funds Received',
    'Profile Created',
    'Card Issued',
    'Activate Your Card',
    'Active',
    'Partial Payment',
    'New Card Requested',
    'Suspended Due to Non-payment',
    'Suspended Due to Cancellation',
    'Suspended Due to Unverified Identity',
    'Suspended Due to Fraud',
    'Suspended Sent to Collection',
    'Suspended Due to Partial Payment',
    'Suspended Due to Application Cancellation',
    'Suspended due to Consumer proposal or Bankruptcy',
  ];
  const addPointStatus = ['Activate Your Card', 'Active', 'New Card Requested'];
  const unsuspendStatus = [
    'Funds Requested',
    'Funds Received',
    'Profile Created',
    'Card Issued',
    'Activate Your Card',
    'New Card Requested',
    'Active',
  ];
  const suspendedStatus = [
    'Suspended Due to Non-payment',
    'Suspended Due to Cancellation',
    'Suspended Due to Unverified Identity',
    'Suspended Due to Fraud',
    'Suspended Due to Partial Payment',
    'Suspended Due to Application Cancellation',
    'Suspended due to Application error',
    'Suspended Sent to Collection',
    'Suspended due to Consumer proposal or Bankruptcy',
  ];

  const sendWelcomeEmail = async () => {
    try {
      setLoading(true);
      await applicationService.sendWelcomeEmail(customer.email);
      setLoading(false);
      Toast({
        message: 'Welcome email sent successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const handleEmailSend = async () => {
    try {
      setLoading(true);
      await applicationService.sendEmailVerification(customer.email, 'Activate Your Card');
      setLoading(false);
      Toast({
        message: 'Verification code sent successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const handlePushSend = async () => {
    try {
      setLoading(true);
      await applicationService.sendPushVerification(customer.email);
      setLoading(false);
      Toast({
        message: 'Verification code sent successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const unsubscribeSMS = async () => {
    try {
      setLoading(true);
      await applicationService.unSubscribeSmS(customer);
      setLoading(false);
      refetch();
      Toast({
        message: 'SMS unsubscribed successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const updateCardDetails = async () => {
    try {
      setLoading(true);
      await cardService.retreive_card(customer.customer_number);
      setLoading(false);
      refetch();
      Toast({
        message: 'Card details updated successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };
  const verifyEmail = async () => {
    try {
      setLoading(true);
      await userService.verifyUserEmail(customer.email);
      setLoading(false);
      refetch();
      Toast({
        message: 'Email verified successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const sendReferralCode = async () => {
    try {
      setLoading(true);
      await userService.referralCodeEmail(customer.email);
      setLoading(false);
      Toast({
        message: 'Referral code sent successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const unSuspendCustomer = async () => {
    try {
      setLoading(true);
      await userService.unSuspendCustomer({ user: customer._id });
      setLoading(false);
      refetch();
      Toast({
        message: 'Customer unsuspended successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const updateCreditLimit = async () => {
    try {
      if (!state || state < 300 || state > 10000 || isNaN(state)) {
        throw new Error('Kindly Enter a valid limit');
      }
      setLoading(true);
      await transactionService.updateCreditLimit(state, customer._id);
      setLoading(false);
      refetch();
      Toast({
        message: 'Credit Limit Updated successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const reRegisterDirectDeposit = async () => {
    try {
      setLoading(true);
      await transactionService.reRegisterDirectDeposit(customer.email, generateDpid);
      setLoading(false);
      refetch();
      Toast({
        message: 'Auto Deposit Re-Registered successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const resetIVRCode = async () => {
    try {
      setLoading(true);
      await userService.resetIVRCode(customer.email).then(res => {
        if (res?.success) {
          Toast({
            message: 'IVR code reset successfull',
            type: 'success',
          });
        } else {
          Toast({
            message: res?.message,
            type: 'error',
          });
        }
      });
      setLoading(false);
      refetch();
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  return (
    <Loaders loading={loading}>
      <DetailsCard gray css="margin-bottom: var(--gutter);">
        <UserInfo customer={customer} css="margin-bottom: 0;">
          <InfoCard title="Credit Limit" value={convertToCurrencyFormat(customer?.credit_limit)} $unStyled />
          <InfoCard
            title="Direct Payment Id"
            value={customer?.directCreditId ? customer?.directCreditId : '---'}
            $unStyled
          />
        </UserInfo>
      </DetailsCard>
      <StepsList>
        {hasPermission('customers.send-welcome-email') && (
          <StepItem>
            <ConfirmationModal
              title="Are you sure you want to send a welcome email?"
              onOk={sendWelcomeEmail}
              confirmationModal="yes"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Send Welcome Email
                </StepBtn>
              )}>
              <Grid xs={1} sm={2} gap={20}>
                <InfoCard title="Name" value={`${customer?.first_name} ${customer?.last_name}`} $unStyled />
                <InfoCard title="Email" value={customer?.email} $unStyled />
              </Grid>
            </ConfirmationModal>
          </StepItem>
        )}
        {hasPermission('customers.unsubscribe-sms') && customer?.status === 'Funds Requested' && (
          <StepItem>
            <ConfirmationModal
              title="Are you sure you unsubscribe from the SMS?"
              onOk={unsubscribeSMS}
              deleteModal="Confirm"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Unsubscribe SMS
                </StepBtn>
              )}>
              <Grid xs={1} sm={2} gap={20}>
                <InfoCard title="Name" value={`${customer?.first_name} ${customer?.last_name}`} $unStyled />
                <InfoCard title="Email" value={customer?.email} $unStyled />
              </Grid>
            </ConfirmationModal>
          </StepItem>
        )}
        {hasPermission('customers.update-card-details') &&
          customer?.customer_number &&
          (customer.status === 'Profile Created' ||
          customer.status === 'Card Issued' ||
          customer.status === 'Activate Your Card' ||
          customer.status === 'Active' ? (
            <StepItem>
              <ConfirmationModal
                title="Are you sure you update this user`s card details?"
                onOk={updateCardDetails}
                deleteModal="Confirm"
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Update Card Details
                  </StepBtn>
                )}>
                <Grid xs={1} sm={2} gap={20}>
                  <InfoCard title="Name" value={`${customer?.first_name} ${customer?.last_name}`} $unStyled />
                  <InfoCard title="Email" value={customer?.email} $unStyled />
                </Grid>
              </ConfirmationModal>
            </StepItem>
          ) : null)}
        {/* {hasPermission('customers.plastk-verification') && customer?.kyc_status !== 'not verified' && (
          <StepItem>
            <ModalContainer
              title="Plastk Verification"
              width={700}
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Plastk Verification
                </StepBtn>
              )}
              content={({ onClose }) => <PlastkVerification onClose={onClose} customer={customer} />} //! THIS IS DETAILS COMPONENT
            />
          </StepItem>
        )} */}
        {hasPermission('customers.verify-email') &&
          !customer?.email_verified &&
          customer.status === 'Funds Requested' && (
            <StepItem>
              <ConfirmationModal
                title="Are you sure you want to verify this user email?"
                onOk={verifyEmail}
                confirmationModal="Yes"
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Verify Email
                  </StepBtn>
                )}>
                <UserInfo customer={customer} />
              </ConfirmationModal>
            </StepItem>
          )}
        {/* {hasPermission('customers.start-plastk-verification') &&
          customer?.kyc_status === 'not verified' &&
          customer.status !== 'Funds Requested' && (
            <StepItem>
              <ModalContainer
                title="Plastk Verification"
                width={700}
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Start Plastk Verification
                  </StepBtn>
                )}
                content={({ onClose }) => <PlastkVerification onClose={onClose} customer={customer} />}
              />
            </StepItem>
          )} */}
        {hasPermission('customers.send-referal-code') && (
          <StepItem>
            <ConfirmationModal
              title="Are you sure you want to send an email with the referral code to ?"
              onOk={sendReferralCode}
              confirmationModal="Yes"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Send Referral Code
                </StepBtn>
              )}>
              <UserInfo customer={customer} />
            </ConfirmationModal>
          </StepItem>
        )}
        {hasPermission('customers.make-payment') && paymentStatus.includes(customer.status) && (
          <StepItem>
            <ModalContainer
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Make Payment
                </StepBtn>
              )}
              content={({ onClose }) => (
                <MakePayment customer={customer} userInfo={<UserInfo customer={customer} />} onClose={onClose} />
              )}
            />
          </StepItem>
        )}
        {hasPermission('customers.send-statement') &&
          (customer.status === 'Active' || customer.status.includes('Suspend')) && (
            <StepItem>
              <ModalContainer
                xl
                title="Send Statement"
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Send Statement
                  </StepBtn>
                )}
                content={({ onClose }) => (
                  <>
                    <UserInfo customer={customer} />
                    <SendStatement customer={customer} onClose={onClose} />
                  </>
                )}
              />
            </StepItem>
          )}
        {hasPermission('customers.add-points') && addPointStatus.includes(customer.status) && (
          <StepItem>
            <ModalContainer
              title="Add Points"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Add Points
                </StepBtn>
              )}
              content={() => <AddPoints customer={customer} userInfo={<UserInfo customer={customer} />} />}
            />
          </StepItem>
        )}
        {hasPermission('customers.request-credit-limit') && paymentStatus.includes(customer.status) && (
          <StepItem>
            <ModalContainer
              title="Request Credit Limit"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Request Credit Limit
                </StepBtn>
              )}
              content={() => <RequestCreditLimit customer={customer} userInfo={<UserInfo customer={customer} />} />}
            />
          </StepItem>
        )}
        {hasPermission('customers.suspend-customer') && unsuspendStatus.includes(customer.status) && (
          <StepItem>
            <ModalContainer
              lg
              title={`Suspend Customer (${customer.email})`}
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Suspend Customer
                </StepBtn>
              )}
              content={({ onClose }) => (
                <SuspendCustomer onClose={onClose} customer={customer}>
                  <UserInfo customer={customer} />
                </SuspendCustomer>
              )}
            />
          </StepItem>
        )}
        {hasPermission('customers.un-suspend-customer') && suspendedStatus.includes(customer.status) && (
          <StepItem>
            <ConfirmationModal
              title="Are you sure you want to Un Suspend the customer?"
              onOk={unSuspendCustomer}
              deleteModal="Submit"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Un Suspend Customer
                </StepBtn>
              )}>
              <UserInfo customer={customer} />
            </ConfirmationModal>
          </StepItem>
        )}
        {hasPermission('customers.update-credit-limit') && customer.status === 'Funds Requested' && (
          <StepItem>
            <ModalContainer
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Update Credit Limit
                </StepBtn>
              )}
              content={() => (
                <>
                  <Field
                    type="number"
                    sm
                    label="Update Credit Limit"
                    onChange={({ target: { value } }) => setState(value)}
                    prefix={<i className="material-icons-outlined">attach_money</i>}
                  />
                  <Button type="primary" width={130} onClick={updateCreditLimit}>
                    Submit
                  </Button>
                </>
              )}
            />
          </StepItem>
        )}
        {hasPermission('customers.re-register-direct-deposit') &&
          customer.status !== 'Funds Requested' &&
          customer.status !== 'Funds Received' && (
            <StepItem>
              <ConfirmationModal
                title="Are you sure you want to Re-Register Direct Deposit?"
                onOk={reRegisterDirectDeposit}
                deleteModal="Submit"
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Re-Register Direct Deposit
                  </StepBtn>
                )}>
                <UserInfo customer={customer} />
                <Switch
                  label="Create New DPID"
                  name="create_new"
                  value={generateDpid}
                  onChange={({ target: { value } }) => setGenerateDpid(value)}
                />
              </ConfirmationModal>
            </StepItem>
          )}

        {hasPermission('customers.points_to_cash') && customer?.status === 'Active' && (
          <StepItem>
            <ModalContainer
              title="Redeem Your Points"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Points to Cash
                </StepBtn>
              )}
              content={({ onClose }) => <PointsToCashForm customer={customer} onClose={onClose} />}
            />
          </StepItem>
        )}

        {customer.status === 'Activate Your Card' && (
          <StepItem>
            <ModalContainer
              title="Send Activation Code"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Send Activation Code
                </StepBtn>
              )}
              content={() => (
                <>
                  <Button type="primary" width onClick={handleEmailSend}>
                    Send code via Email
                  </Button>
                  &ensp;
                  <Button type="primary" onClick={handlePushSend}>
                    Send code via Push Notification
                  </Button>
                </>
              )}
            />
          </StepItem>
        )}

        {hasPermission('plastk-verification-documents.start') &&
          (customer?.status === 'Profile Created' ||
            customer?.status === 'Card Issued' ||
            customer?.status === 'Activate Your Card' ||
            customer?.status === 'Active') &&
          (!customer?.kyc_status || customer?.kyc_status === 'not verified') && (
            <StepItem>
              <ModalContainer
                width={800}
                btnComponent={({ onClick }) => (
                  <StepBtn type="button" onClick={onClick}>
                    Start Plastk Verification
                  </StepBtn>
                )}
                content={({ onClose }) => <PlastkVerification onClose={onClose} user={customer} />}
              />
            </StepItem>
          )}
        {hasPermission('customers.reset-ivr-code') && (
          <StepItem>
            <ConfirmationModal
              title="Are you sure you want to reset the IVR security code for ?"
              onOk={resetIVRCode}
              confirmationModal="Yes"
              btnComponent={({ onClick }) => (
                <StepBtn type="button" onClick={onClick}>
                  Reset IVR Security Code
                </StepBtn>
              )}>
              <UserInfo customer={customer} />
            </ConfirmationModal>
          </StepItem>
        )}
      </StepsList>
    </Loaders>
  );
}

export default CustomerActions;
