import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import transactionService from 'services/transactionService';
import Loaders from 'components/atoms/Loaders';
import userService from 'services/userService';
import { AuthContext } from 'context/authContext';
import { convertToCurrencyFormat } from 'helpers/common';
import Toast from 'components/molecules/Toast';
import ModalContainer from 'components/molecules/ModalContainer';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import UpdateInteractCode from '../UpdateInteract';

function InteracHistory({ customer, onCloseModal }) {
  const { refetch } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    amountReceived: 0,
    userCreditLimit: customer.credit_limit,
    amountPending: customer.credit_limit,
  });
  const [refTrans, setRefTrans] = useState(false);
  useEffect(() => {
    transactionService
      .searchInteracTransactionAdmin(customer.email)
      .then(({ transaction: _, user, remaining }) => {
        setLoading(false);
        setState(() => ({
          amountReceived: user.received_amount,
          userCreditLimit: user.credit_limit,
          amountPending: remaining,
        }));
        setTransactions(_);
      })
      .catch(err => {
        setLoading(false);

        Toast({
          type: 'error',
          message: err.message,
        });
      });
  }, [customer, refTrans]);

  return (
    <Loaders loading={loading}>
      <DetailsCard gray css="margin-bottom: var(--gutter);">
        <Grid xs={1} sm={2} gap={20}>
          <InfoCard title="Credit Limit Requested" value={convertToCurrencyFormat(state.userCreditLimit)} $unStyled />
          <InfoCard
            title="Total Received Amount"
            value={convertToCurrencyFormat(state.amountReceived ?? 0)}
            $unStyled
          />
          <InfoCard
            title="Total Remaining Amount"
            value={convertToCurrencyFormat(state.amountPending ?? 0)}
            $unStyled
          />
        </Grid>
      </DetailsCard>
      <DetailsCard title="Transaction Details" gray css="margin-bottom: var(--gutter);">
        {transactions?.map(transaction => (
          <>
            <Grid xs={1} sm={2} gap={20} key={transaction._id}>
              <InfoCard title="Sender Bank Name" value={transaction.SenderBankName} $unStyled />
              <InfoCard title="Account Number:" value={transaction.AccountNumber} $unStyled />
              <InfoCard title="Sender Name:" value={transaction.SenderName} $unStyled />
              <InfoCard title="Amount:" value={convertToCurrencyFormat(transaction.Amount ?? 0)} $unStyled />
              <InfoCard title="Reference Number: " value={transaction.ReferenceNumber} $unStyled />
            </Grid>
            <hr />
          </>
        ))}
        <div
          css={`
            display: flex;
            justify-content: flex-end;
            gap: 20px;
          `}>
          {state?.amountReceived >= 300 && state.amountReceived <= 10000 && (
            <>
              <ConfirmationModal
                title="Use Current as Credit Limit"
                subtitle={<>Are you sure you want to use this credit limit as a new credit limit?</>}
                confirmationModal="OK"
                onOk={() => {
                  userService
                    .useCurrentAsLimit({
                      credit_limit: state?.amountReceived,
                      email: customer?.email,
                    })
                    .then(res => {
                      if (res?.success) {
                        Toast({
                          type: 'success',
                          message: res?.message,
                        });
                        onCloseModal();
                        refetch();
                      } else {
                        Toast({
                          type: 'error',
                          message: res?.message,
                        });
                      }
                    })
                    .catch(() => {});
                }}
                btnComponent={({ onClick }) => (
                  <Button
                    onClick={onClick}
                    type="primary"
                    css="margin-bottom: var(--gutter); margin-top: var(--gutter)">
                    Use as Credit Limit
                  </Button>
                )}
              />
            </>
          )}
          {state.amountPending > 0 && state?.amountReceived >= 300 && state.amountReceived <= 10000 && (
            <InfoCard title="OR" />
          )}
          {state.amountPending > 0 && (
            <ModalContainer
              title="Update Interac"
              btnComponent={({ onClick }) => (
                <Button
                  onClick={onClick}
                  type="primary"
                  css="margin-bottom: var(--gutter); margin-top: var(--gutter)"
                  disabled={state.amountPending < 0}>
                  Enter Additional Reference Number
                </Button>
              )}
              content={({ onClose }) => (
                <UpdateInteractCode
                  customer={customer}
                  onClose1={onClose}
                  setRefTrans={setRefTrans}
                  refTrans={refTrans}
                />
              )}
            />
          )}
        </div>
      </DetailsCard>
    </Loaders>
  );
}

export default InteracHistory;
