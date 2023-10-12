/* eslint-disable consistent-return */
import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
// import Select from 'components/atoms/Select';
import Button from 'components/atoms/Button';

import transactionService from 'services/transactionService';
import Grid from 'components/atoms/Grid';
import Tooltip from 'components/atoms/Tooltip';
import { AuthContext } from 'context/authContext';

import Loaders from 'components/atoms/Loaders';
import { convertToCurrencyFormat } from 'helpers/common';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import DetailsCard from 'components/molecules/DetailsCard';
import Toast from 'components/molecules/Toast';
import InfoCard from 'components/molecules/InfoCard';
import ModalContainer from 'components/molecules/ModalContainer';
import Modal from 'components/molecules/Modal';
import ConfirmationModal from 'components/molecules/ConfirmationModal';

const UpdateRequestedCreditLimit = ({ onClose, creditLimitRequestItem }) => {
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [form] = useForm();
  const [state, setState] = useState({
    splitData: '',
    editCLR: false,
    values: '',
    confirmCreditLimitRequest: false,
    formData: '',
    updateCreditLimitRequestData: '',
    showConfirmationMessage: false,
    showRejectionMessage: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { splitData, formData, values, updateCreditLimitRequestData } = state;

  const getUpdateSplitDetails = async (v, split_data) => {
    transactionService
      .getCreditLimitSplitDetails(v)
      .then(res => {
        if (res?.success) {
          setState(prev => ({
            ...prev,
            splitData: {
              ...res?.data,
              available_credit_increase: split_data?.available_credit_increase,
              credit_limit_increase: split_data?.credit_limit_increase,
            },
          }));
        } else {
          Toast({
            type: `error`,
            message: res?.message,
          });
        }
      })
      .catch(err => {
        Toast({
          type: 'error',
          message: err?.message,
        });
      });
  };

  useEffect(() => {
    setState(prev => ({
      ...prev,

      values: { customer: creditLimitRequestItem?.customer_id },
    }));
    getUpdateSplitDetails(
      {
        customer: creditLimitRequestItem.customer_id,
        code: creditLimitRequestItem?.incomingtransaction_id?.ReferenceNumber,
      },
      creditLimitRequestItem,
    );
  }, [creditLimitRequestItem]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      formData: {
        amount_remaining: splitData?.total_amount,
        available_credit_increase: splitData?.available_credit_increase,
        minimum_payment: splitData?.minimum_payment,
        credit_limit_increase: splitData?.credit_limit_increase,
      },
    }));
  }, [splitData]);

  const submitUpdateRequest = () => {
    setState(prev => ({
      ...prev,
      updateCreditLimitRequestData: { ...splitData, ...formData, type: 'custom' },
      showConfirmationMessage: true,
    }));
    setIsOpen(true);
  };

  const updateCreditLimitRequest = async () => {
    setLoading(true);

    try {
      await transactionService.updateCreditLimitRequest(updateCreditLimitRequestData).then(res => {
        if (res?.success) {
          Toast({
            type: 'success',
            message: res?.message,
          });
        } else {
          Toast({
            type: 'error',
            message: res?.message,
          });
        }
        onClose();
        refetch();
        setLoading(false);
        setIsOpen(false);
      });
    } catch (error) {
      setLoading(false);
      setIsOpen(false);
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  };

  return (
    <>
      {splitData ? (
        <>
          <Loaders loading={loading}>
            <DetailsCard gray css="margin-bottom: var(--gutter);">
              <Grid xs={1} md={2} lg={3} gap={20}>
                <InfoCard
                  title="Name:"
                  value={`${values?.customer?.first_name} ${values?.customer?.last_name}`}
                  $unStyled
                />
                <InfoCard title="Email:" value={values?.customer?.email} $unStyled />
                <InfoCard title="Customer Number:" value={values?.customer?.customer_number} $unStyled />
                <InfoCard
                  title="Total Amount Received:"
                  value={convertToCurrencyFormat(splitData?.total_amount)}
                  $unStyled
                />
                <InfoCard
                  title="Current Credit Limit:"
                  value={convertToCurrencyFormat(values?.customer?.credit_limit)}
                  $unStyled
                />
                <InfoCard
                  title="Current Available Credit:"
                  value={convertToCurrencyFormat(values?.customer?.Balance)}
                  $unStyled
                />
                <InfoCard
                  title="Current Balance:"
                  value={convertToCurrencyFormat(values?.customer?.CardBalance)}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
            <Grid md={2} gap={20} css="margin-bottom: var(--gutter);">
              <DetailsCard title="Recommended">
                <Grid xs={1} gap={20}>
                  <InfoCard
                    title="Minimum Payment:"
                    value={convertToCurrencyFormat(splitData?.minimum_payment)}
                    $unStyled
                  />
                  <InfoCard
                    title="Good Standing Payment:"
                    value={convertToCurrencyFormat(splitData?.available_credit_increase)}
                    $unStyled
                  />
                  <InfoCard
                    title="Credit Limit Increase:"
                    value={convertToCurrencyFormat(splitData?.credit_limit_increase)}
                    $unStyled
                  />
                  <ConfirmationModal
                    title="Are you sure you want to update the credit limit request with the following details?"
                    okLoading={loading}
                    confirmationModal="OK"
                    onOk={() => {
                      updateCreditLimitRequest();
                    }}
                    btnComponent={({ onClick }) => (
                      <Button
                        type="primary"
                        loading={loading}
                        onClick={() => {
                          onClick();
                          setState(prev => ({
                            ...prev,
                            updateCreditLimitRequestData: { ...splitData, type: 'default' },
                            showConfirmationMessage: true,
                          }));
                        }}>
                        Confirm
                      </Button>
                    )}>
                    <Grid xs={1} gap={20}>
                      <InfoCard
                        title="Minimum Payment:"
                        value={convertToCurrencyFormat(formData.minimum_payment)}
                        $unStyled
                      />
                      <InfoCard
                        title="Good Standing Payment:"
                        value={convertToCurrencyFormat(formData.available_credit_increase)}
                        $unStyled
                      />
                      <InfoCard
                        title="Credit Limit Increase:"
                        value={convertToCurrencyFormat(formData.credit_limit_increase)}
                        $unStyled
                      />
                    </Grid>
                  </ConfirmationModal>
                </Grid>
              </DetailsCard>
              <DetailsCard title="Process As Payment">
                <Grid xs={1} gap={20}>
                  <InfoCard
                    title="Minimum Payment:"
                    value={convertToCurrencyFormat(splitData?.minimum_payment)}
                    $unStyled
                  />
                  <InfoCard
                    title="Good Standing Payment:"
                    value={convertToCurrencyFormat(splitData?.pay_balance_available_credit_increase)}
                    $unStyled
                  />
                  <InfoCard
                    title="Credit Limit Increase:"
                    value={convertToCurrencyFormat(splitData?.pay_balance_credit_limit_increase)}
                    $unStyled
                  />
                  <Tooltip title="Payment equal to the maximum of the credit limit or the incoming transaction amount will be applied. If the sum of available credit on the user account and the incoming transaction amount exceeds credit limit the excess will be applied as a credit limit.">
                    <ConfirmationModal
                      title="Are you sure you want to update the credit limit request with the following details?"
                      okLoading={loading}
                      confirmationModal="OK"
                      onOk={() => {
                        updateCreditLimitRequest();
                      }}
                      btnComponent={({ onClick }) => (
                        <Button
                          loading={loading}
                          type="primary"
                          onClick={() => {
                            onClick();
                            setState(prev => ({
                              ...prev,
                              updateCreditLimitRequestData: { ...splitData, type: 'pay_balance' },
                              showConfirmationMessage: true,
                            }));
                          }}>
                          Process Payment
                        </Button>
                      )}>
                      <Grid xs={1} gap={20}>
                        <InfoCard
                          title="Minimum Payment:"
                          value={convertToCurrencyFormat(splitData?.minimum_payment)}
                          $unStyled
                        />
                        <InfoCard
                          title="Good Standing Payment:"
                          value={convertToCurrencyFormat(splitData?.pay_balance_available_credit_increase)}
                          $unStyled
                        />
                        <InfoCard
                          title="Credit Limit Increase:"
                          value={convertToCurrencyFormat(splitData?.pay_balance_credit_limit_increase)}
                          $unStyled
                        />
                      </Grid>
                    </ConfirmationModal>
                  </Tooltip>
                </Grid>
              </DetailsCard>
            </Grid>

            <div
              css={`
                display: flex;
                justify-content: flex-end;
                gap: 20px;
              `}>
              <ModalContainer
                title="Edit Details"
                btnComponent={({ onClick }) => (
                  <Button
                    type="outline"
                    width={120}
                    loading={loading}
                    onClick={() => {
                      onClick();
                      setState(prev => ({ ...prev, editCLR: true }));
                    }}>
                    Edit Details
                  </Button>
                )}
                content={() => (
                  <>
                    {splitData.total_amount && (
                      <InfoCard
                        title="Total Amount Received:"
                        value={convertToCurrencyFormat(splitData.total_amount)}
                        css="margin-bottom: var(--gutter);"
                      />
                    )}

                    <Form form={form} onSubmit={submitUpdateRequest}>
                      <Grid xs={2} gap={20}>
                        <Form.Item
                          name="minimum_payment"
                          label="Minimum Payment"
                          value={splitData?.minimum_payment}
                          disabled
                          onChange={e => {
                            const { value } = e.target.value;
                            form.setFieldsValue({ minimum_payment: value });
                            let data = '';
                            if (!e.target.value) {
                              setState(prev => ({
                                ...prev,
                                formData: {
                                  amount_remaining: splitData?.total_amount,
                                  available_credit_increase: splitData?.available_credit_increase,
                                  minimum_payment: splitData?.minimum_payment,
                                  credit_limit_increase: splitData?.credit_limit_increase,
                                },
                              }));
                            } else if (value <= Number(splitData?.total_amount) - Number(splitData?.minimum_payment)) {
                              if (Number(value) > 0) {
                                data = {
                                  ...formData,
                                  minimum_payment: value,
                                  credit_limit_increase:
                                    Number(splitData?.total_amount) -
                                    Number(splitData.available_credit_increase) -
                                    Number(value),
                                };
                                setState(prev => ({
                                  ...prev,
                                  formData: data,
                                }));
                              }
                            } else {
                              data = {
                                ...formData,
                                available_credit_increase:
                                  Number(splitData?.total_amount) - Number(splitData.minimum_payment) - Number(value),
                                minimum_payment: splitData?.minimum_payment,
                              };
                              setState(prev => ({
                                ...prev,
                                formData: data,
                              }));
                            }
                          }}
                          rules={[
                            { min: 0, message: 'Amount should be Minimum 0' },
                            {
                              transform: () => {
                                if (formData?.available_credit_increase < splitData?.available_credit_increase) {
                                  return true;
                                }
                              },
                              message: 'Good Standing cannot be less that the required value',
                            },
                            {
                              transform: value => {
                                if (Number(value) % 5 !== 0) {
                                  return true;
                                }
                                return false;
                              },
                              message: 'Credit Limit Increase should be a multiple of 5',
                            },
                            {
                              transform: value => {
                                if (
                                  Number(value) <=
                                  Number(splitData?.total_amount) - Number(splitData?.minimum_payment)
                                ) {
                                  return false;
                                }
                                return true;
                              },
                              message: `Good Standing cannot exceed ${
                                splitData?.total_amount - splitData?.available_credit_increase
                              }`,
                            },
                          ]}>
                          <Field />
                        </Form.Item>
                        <Form.Item
                          name="minimum_payment_required"
                          label="Minimum Payment Required"
                          placeholder="Enter Amount"
                          value={splitData?.minimum_payment}
                          disabled
                          rules={[{ min: 0, message: 'Amount should be Minimum 0' }]}>
                          <Field />
                        </Form.Item>
                        <Form.Item
                          name="available_credit_increase"
                          label="Good Standing Payment"
                          placeholder="Enter Amount"
                          value={formData?.available_credit_increase}
                          disabled
                          rules={[{ min: 0, message: 'Amount should be Minimum 0' }]}>
                          <Field />
                        </Form.Item>
                        <Form.Item
                          name="available_credit_increase_required"
                          label="Good Standing Payment Required"
                          placeholder="Enter Amount"
                          value={splitData?.available_credit_increase}
                          disabled>
                          <Field />
                        </Form.Item>
                        <Form.Item
                          name="credit_limit_increase"
                          label="Credit Limit Increase"
                          placeholder="Enter Amount"
                          onChange={e => {
                            form.setFieldsValue({ credit_limit_increase: e.target.value });
                            let data;
                            if (!e.target.value) {
                              if (Number(e.target.value === 0)) {
                                data = {
                                  ...formData,
                                  available_credit_increase:
                                    Number(splitData?.total_amount) -
                                    Number(splitData.minimum_payment) -
                                    Number(e.target.value),
                                  credit_limit_increase: e.target.value,
                                  minimum_payment: splitData?.minimum_payment,
                                };
                                setState(prev => ({
                                  ...prev,
                                  formData: data,
                                }));
                              } else {
                                setState(prev => ({
                                  ...prev,
                                  formData: {
                                    amount_remaining: splitData?.total_amount,
                                    available_credit_increase: splitData?.available_credit_increase,
                                    minimum_payment: splitData?.minimum_payment,
                                    credit_limit_increase: splitData?.credit_limit_increase,
                                  },
                                }));
                              }
                            } else if (
                              Number(e.target.value) <=
                              Number(splitData?.total_amount) - Number(splitData.minimum_payment)
                            ) {
                              if (Number(e.target.value > 0)) {
                                if (Number(e.target.value) % 5 === 0) {
                                  data = {
                                    ...formData,
                                    available_credit_increase:
                                      Number(splitData?.total_amount) -
                                      Number(splitData.minimum_payment) -
                                      Number(e.target.value),
                                    credit_limit_increase: e.target.value,
                                    minimum_payment: splitData?.minimum_payment,
                                  };
                                  setState(prev => ({
                                    ...prev,
                                    formData: data,
                                  }));
                                }
                              }
                            } else {
                              data = {
                                ...formData,
                                available_credit_increase:
                                  Number(splitData?.total_amount) -
                                  Number(splitData.minimum_payment) -
                                  Number(e.target.value),
                                credit_limit_increase: e.target.value,
                                minimum_payment: splitData?.minimum_payment,
                              };
                              setState(prev => ({
                                ...prev,
                                formData: {
                                  ...prev.formData,
                                  available_credit_increase:
                                    Number(splitData?.total_amount) -
                                    Number(splitData.minimum_payment) -
                                    Number(e.target.value),
                                  credit_limit_increase: e.target.value,
                                  minimum_payment: splitData?.minimum_payment,
                                },
                              }));
                            }
                          }}
                          rules={[
                            { required: true, message: 'Credit limit increase required' },
                            { min: 0, message: 'Amount should be Minimum 0' },
                            {
                              transform: () => {
                                if (formData?.available_credit_increase < splitData?.available_credit_increase) {
                                  return true;
                                }
                              },
                              message: 'Good Standing cannot be less that the required value',
                            },
                            {
                              transform: value => {
                                if (Number(value) % 5 !== 0) {
                                  return true;
                                }
                                return false;
                              },
                              message: 'Credit Limit Increase should be a multiple of 5',
                            },
                            {
                              transform: value => {
                                if (
                                  Number(value) <=
                                  Number(splitData?.total_amount) - Number(splitData?.minimum_payment)
                                ) {
                                  return false;
                                }
                                return true;
                              },
                              message: `Good Standing cannot exceed ${
                                splitData?.total_amount - splitData?.available_credit_increase
                              }`,
                            },
                          ]}>
                          <Field />
                        </Form.Item>
                        <Form.Item
                          name="credit_limit_increase_required"
                          label="Credit Limit Increase Required"
                          placeholder="Enter Amount"
                          value={splitData?.credit_limit_increase}
                          disabled>
                          <Field />
                        </Form.Item>
                      </Grid>
                      <Button type="primary" htmlType="submit">
                        Submit Request
                      </Button>
                    </Form>
                  </>
                )}
              />
              <ConfirmationModal
                title="Are you sure you want to reject this credit limit request?"
                okLoading={loading}
                confirmationModal="OK"
                onOk={() => {
                  updateCreditLimitRequest();
                }}
                btnComponent={({ onClick }) => (
                  <Button
                    type="danger"
                    width={120}
                    loading={loading}
                    onClick={() => {
                      onClick();
                      setState(prev => ({
                        ...prev,
                        updateCreditLimitRequestData: { ...splitData, type: 'reject' },
                      }));
                    }}>
                    Reject
                  </Button>
                )}
              />
            </div>
          </Loaders>
        </>
      ) : (
        <h4>There was an error retrieving the split amount, please try again!</h4>
      )}
      <Modal
        title="Are you sure you want to update the credit limit request with the following details?"
        isOpen={isOpen}
        setIsOpen={setIsOpen}>
        <Grid xs={1} gap={20}>
          <InfoCard title="Minimum Payment:" value={convertToCurrencyFormat(formData.minimum_payment)} $unStyled />
          <InfoCard
            title="Good Standing Payment:"
            value={convertToCurrencyFormat(formData.available_credit_increase)}
            $unStyled
          />
          <InfoCard
            title="Credit Limit Increase:"
            value={convertToCurrencyFormat(formData.credit_limit_increase)}
            $unStyled
          />
        </Grid>
        <Grid style={{ marginTop: '2rem' }} xl={3} lg={3} md={3} sm={1} xs={1} gap={20}>
          <Button type="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={updateCreditLimitRequest}>
            Confirm
          </Button>
        </Grid>
      </Modal>
    </>
  );
};

export default UpdateRequestedCreditLimit;
