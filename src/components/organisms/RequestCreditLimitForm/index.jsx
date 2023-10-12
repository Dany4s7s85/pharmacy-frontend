/* eslint-disable consistent-return */
import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Select from 'components/atoms/Select';
import Button from 'components/atoms/Button';
import userService from 'services/userService';
import Alert from 'components/molecules/Alert';
import transactionService from 'services/transactionService';

import Grid from 'components/atoms/Grid';
import Tooltip from 'components/atoms/Tooltip';
import Loaders from 'components/atoms/Loaders';
import { AuthContext } from 'context/authContext';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import ModalContainer from 'components/molecules/ModalContainer';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
// import InfoCard from 'components/molecules/InfoCard';

const RequestedCreditLimitForm = ({ onClose }) => {
  const [form] = useForm();
  const [form1] = useForm();
  const [state, setState] = useState({
    splitData: '',
    values: '',
    creditLimitRequestItem: '',
    customers: [],
    selected: '',
    editCLR: false,
    formData: '',
    splitErrorMessage: '',
    splitError: true,
    showDetail: false,
  });
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const { splitData, formData, values, showDetail } = state;
  const handleUserSearch = async __ => {
    try {
      const response = await userService.getUsers({
        page: 1,
        pageSize: 10,
        searchText: __,
        startDate: '',
        endDate: '',
        filterText: '',
        filterStatus: 'Active',
      });
      const options = response.customers.map(_ => ({
        value: _?._id,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));

      setState(prev => ({ ...prev, customers: response?.customers }));

      return options;
    } catch {
      return [];
    }
  };

  const getSplitDetails = async v => {
    transactionService
      .getCreditLimitSplitDetails(v)
      .then(res => {
        if (res?.success) {
          setState(prev => ({
            ...prev,
            splitData: res?.data,
            values: {
              ...prev.values,
              code: v.code,
            },
            showDetail: true,
          }));
        } else {
          Toast({
            type: 'error',
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
      formData: {
        amount_remaining: splitData?.total_amount,
        available_credit_increase: splitData?.available_credit_increase,
        minimum_payment: splitData?.minimum_payment,
        credit_limit_increase: splitData?.credit_limit_increase,
      },
    }));
    form1.setFieldsValue({
      amount_remaining: splitData?.total_amount,
      available_credit_increase: splitData?.available_credit_increase,
      minimum_payment: splitData?.minimum_payment,
      credit_limit_increase: splitData?.credit_limit_increase,
    });
  }, [splitData]);

  const onSubmit = async data => {
    const payload = {
      ...data,
      customer: { _id: data?.customer?.value },
    };
    getSplitDetails(payload);
  };

  const submitCustomRequest = async () => {
    setLoading(true);

    try {
      const payload = {
        credit_limit_request_data: formData,
        interac_code: splitData?.interac_code,
        user: splitData?.user,
      };
      await transactionService.submitCustomCreditLimitRequest(payload).then(res => {
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

        setState(prev => ({ ...prev, editCLR: false }));
        onClose();
        refetch();
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  };

  const submitPayBalanceRequest = async submitData => {
    setLoading(true);

    try {
      const payload = {
        credit_limit_request_data: submitData,
        interac_code: splitData?.interac_code,
        user: splitData?.user,
      };
      await transactionService.submitCustomCreditLimitRequest(payload).then(res => {
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
        setLoading(false);
        onClose();
        refetch();
        setState(prev => ({ ...prev, editCLR: false }));
      });
    } catch (error) {
      setLoading(false);
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  };
  const createCreditLimitRequest = (code, customer) => {
    setLoading(true);
    try {
      transactionService
        .createCreditLimitRequestByAdmin(code, customer)
        .then(res => {
          Toast({
            type: 'success',
            message: res?.message,
          });
        })
        .catch(error => {
          Toast({
            type: 'error',
            message: error?.message,
          });
        });
      setLoading(false);
      onClose();
      refetch();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('line:200 error', 'color: #007acc;', error);
    }
  };

  const ConfirmCreditLimitRequest = () => (
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
                  value={`${Number(splitData?.total_amount).toFixed(2)}`}
                  $unStyled
                />
                <InfoCard
                  title="Current Credit Limit:"
                  value={`${Number(values?.customer?.credit_limit).toFixed(2)}`}
                  $unStyled
                />
                <InfoCard
                  title="Current Available Credit:"
                  value={`${Number(values?.customer?.Balance).toFixed(2)}`}
                  $unStyled
                />
                <InfoCard
                  title="Current Balance:"
                  value={`${Number(values?.customer?.CardBalance).toFixed(2)}`}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
            <Grid md={2} gap={20} css="margin-bottom: var(--gutter);">
              <DetailsCard title="Recommended">
                <Grid xs={1} gap={20}>
                  <InfoCard
                    title="Minimum Payment:"
                    value={splitData?.minimum_payment ? splitData?.minimum_payment : '----'}
                    $unStyled
                  />
                  <InfoCard
                    title="Good Standing Payment:"
                    value={splitData?.available_credit_increase ? splitData?.available_credit_increase : '----'}
                    $unStyled
                  />
                  <InfoCard
                    title="Credit Limit Increase:"
                    value={splitData?.credit_limit_increase ? splitData?.credit_limit_increase : '----'}
                    $unStyled
                  />
                  <ConfirmationModal
                    title="Are you sure you want to update the credit limit request with the following details?"
                    okLoading={loading}
                    confirmationModal="OK"
                    onOk={() => {
                      createCreditLimitRequest(values.code, values.customer._id);
                    }}
                    btnComponent={({ onClick }) => (
                      <Button
                        disabled={!splitData}
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
                      <InfoCard title="Minimum Payment:" value={formData.minimum_payment} $unStyled />
                      <InfoCard title="Good Standing Payment:" value={formData.available_credit_increase} $unStyled />
                      <InfoCard title="Credit Limit Increase:" value={formData.credit_limit_increase} $unStyled />
                    </Grid>
                  </ConfirmationModal>
                </Grid>
              </DetailsCard>
              <DetailsCard title="Process As Payment">
                <Grid xs={1} gap={20}>
                  <InfoCard
                    title="Minimum Payment:"
                    value={splitData?.minimum_payment ? splitData?.minimum_payment : '----'}
                    $unStyled
                  />
                  <InfoCard
                    title="Good Standing Payment:"
                    value={
                      splitData?.pay_balance_available_credit_increase
                        ? splitData?.pay_balance_available_credit_increase
                        : '----'
                    }
                    $unStyled
                  />
                  <InfoCard
                    title="Credit Limit Increase:"
                    value={
                      splitData?.pay_balance_credit_limit_increase
                        ? splitData?.pay_balance_credit_limit_increase
                        : '----'
                    }
                    $unStyled
                  />
                  <Tooltip title="Payment equal to the maximum of the credit limit or the incoming transaction amount will be applied. If the sum of available credit on the user account and the incoming transaction amount exceeds credit limit the excess will be applied as a credit limit.">
                    <ConfirmationModal
                      title="Are you sure you want to update the credit limit request with the following details?"
                      okLoading={loading}
                      confirmationModal="OK"
                      onOk={() => {
                        submitPayBalanceRequest({
                          amount_remaining: splitData?.total_amount,
                          available_credit_increase: splitData?.pay_balance_available_credit_increase,
                          minimum_payment: splitData?.minimum_payment,
                          credit_limit_increase: splitData?.pay_balance_credit_limit_increase,
                        });
                      }}
                      btnComponent={({ onClick }) => (
                        <Button
                          loading={loading}
                          disabled={!splitData}
                          type="primary"
                          onClick={() => {
                            onClick();
                          }}>
                          Process Payment
                        </Button>
                      )}>
                      <Grid xs={1} gap={20}>
                        <InfoCard title="Minimum Payment:" value={`${splitData?.minimum_payment}`} $unStyled />
                        <InfoCard
                          title="Good Standing Payment:"
                          value={`${splitData?.pay_balance_available_credit_increase}`}
                          $unStyled
                        />
                        <InfoCard
                          title="Credit Limit Increase:"
                          value={`${splitData?.pay_balance_credit_limit_increase}`}
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
                      form1.setFieldsValue({
                        amount_remaining: splitData?.total_amount,
                        available_credit_increase: splitData?.available_credit_increase,
                        minimum_payment: splitData?.minimum_payment,
                        credit_limit_increase: splitData?.credit_limit_increase,
                      });
                    }}>
                    Edit Details
                  </Button>
                )}
                content={() => (
                  <>
                    {splitData?.total_amount && (
                      <InfoCard
                        title="Total Amount Received:"
                        value={splitData?.total_amount}
                        css="margin-bottom: var(--gutter);"
                      />
                    )}
                    <Form form={form1} onSubmit={submitCustomRequest}>
                      <Grid xs={2} gap={20}>
                        <Form.Item
                          name="minimum_payment"
                          label="Minimum Payment"
                          value={splitData?.minimum_payment}
                          disabled
                          onChange={e => {
                            const { value } = e.target.value;
                            form1.setFieldsValue({ minimum_payment: value });
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
                            } else if (value <= Number(splitData?.total_amount) - Number(splitData.minimum_payment)) {
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

                            if (data?.available_credit_increase < splitData?.available_credit_increase) {
                              setState(prev => ({
                                ...prev,
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
                                return false;
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
                            form1.setFieldsValue({ credit_limit_increase: e.target.value });
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
                              Number(splitData?.total_amount) - Number(splitData?.minimum_payment)
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
                                formData: data,
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
                                return false;
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
            </div>
          </Loaders>
        </>
      ) : (
        <h4>There was an error retrieving the split amount, please try again!</h4>
      )}
    </>
  );

  return (
    <>
      <>
        <Form form={form} onSubmit={onSubmit}>
          <Form.Item
            onChange={e => {
              const { value } = e.target;
              form.setFieldsValue({ customer: value });
              const result = state?.customers.find(customer => customer?._id === value?.value);
              setState(prev => ({
                ...prev,
                values: {
                  ...prev.values,
                  customer: result,
                },
                selected: value,
              }));
            }}
            name="customer"
            rules={[{ required: true, message: 'Please select your customer' }]}
            label="Select Customer">
            <Select sm open async defaultOptions filterOption={false} loadOptions={handleUserSearch} />
          </Form.Item>
          <Form.Item
            name="code"
            label="Interac Reference code"
            placeholder="Enter Interac Reference code"
            rules={[
              { required: true, message: 'Please enter your interac code' },
              { pattern: /^.{0,10}$/, message: 'Maximum Character Limit Is 10' },
            ]}>
            <Field />
          </Form.Item>

          <Alert
            type="info"
            message="*The time between sending the deposit & updating the activation code needs to be about 30 minutes."
            css="margin-bottom:15px"
          />
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </>
      {showDetail && (
        <ModalContainer
          isOpen={showDetail}
          lg
          onModalClose={() => {
            setState(prev => ({ ...prev, showDetail: false }));
          }}
          title="Requested Credit Limit"
          content={() => <>{ConfirmCreditLimitRequest()}</>}
        />
      )}
    </>
  );
};

export default RequestedCreditLimitForm;
