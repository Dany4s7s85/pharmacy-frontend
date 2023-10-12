/* eslint-disable no-useless-escape */
import React, { useContext, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Slider from 'components/atoms/Slider';
import InfoCard from 'components/molecules/InfoCard';
import Select from 'components/atoms/Select';
import transactionService from 'services/transactionService';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { convertToCurrencyFormat } from '../../../helpers/common';

function RefundRequestTransactionForm({ transaction }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [emptyNoteDisable, setEmptyNoteDisable] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [state, setState] = useState({ oneTime: false });
  const { user, refetch } = useContext(AuthContext);
  useEffect(() => {
    if (transaction?.user?._id) {
      transactionService
        .checkRequestCategory(transaction?.user?._id)
        .then(res => {
          setState(_ => ({ ..._, oneTime: res }));
        })
        .catch(() => {
          setState(_ => ({ ..._, oneTime: false }));
        });
    }
    setState(_ => ({ ..._, amount_to_be_added: 0, slider: 0 }));
  }, [transaction]);

  const options = useMemo(() => {
    const _options = [
      { value: 'Wrongfully Charged', label: 'Wrongfully Charged' },
      { value: 'Plastk Related Error', label: 'Plastk Related Error' },
    ];
    if (!state.oneTime) {
      _options.push({
        value: 'Credited As A Onetime Courtesy',
        label: 'Credited As A Onetime Courtesy',
      });
    }
    return _options;
  }, [state.oneTime]);

  const onSubmit = async () => {
    setLoading(true);
    const result = await transactionService.pendingRefundRequest({
      requestCategory: state?.request_category.value,
      email: transaction?.user?.email,
      refundAmount: state?.amount_to_be_refunded,
      notes: state?.edit_notes,
      transaction_ref: transaction?.ReferenceNumber,
      UpdatedByEmail: user.email,
      transactionId: transaction?._id,
      user: transaction?.user?._id,
      sliderValue: state?.sliderValue,
      amountRequested: state?.amount_to_be_added,
    });

    if (result?.data) {
      setLoading(false);
      refetch();
      Toast({
        type: 'success',
        message: 'Amount refunded Successfully',
      });
    } else {
      setLoading(false);
      Toast({
        type: 'error',
        message: result?.message,
      });
    }
  };

  return (
    <Loaders loading={loading}>
      <Grid xs={1} sm={3} gap={20} css="margin-bottom: 20px;">
        <InfoCard
          title="Customer Name:"
          value={`${transaction?.user?.first_name} ${transaction?.user?.last_name}`}
          $unStyled
        />
        <InfoCard title="Customer Email:" value={transaction?.user?.email} $unStyled />
        <InfoCard
          title="Transaction Amount:"
          value={convertToCurrencyFormat(transaction?.TransactionAmount)}
          $unStyled
        />
      </Grid>
      <Form
        form={form}
        onSubmit={onSubmit}
        onTouched={_ => {
          const [field, value] = Object.entries(_)[0];
          if (field === 'slider') {
            const convertedValue = ((transaction?.TransactionAmount / 100) * value).toFixed(2);
            if (state?.request_category?.value === 'Credited As A Onetime Courtesy' && convertedValue > 35) {
              setState(__ => ({
                ...__,
                amount_to_be_added: 35,
              }));
            } else {
              setState(__ => ({
                ...__,
                amount_to_be_added: convertedValue,
              }));
            }
            if (!value > 0) {
              setDisableSubmit(true);
            } else {
              setDisableSubmit(false);
            }
          }
          if (field === 'edit_notes') {
            if (value.length > 9 && value.length < 200) {
              setEmptyNoteDisable(false);
            } else {
              setEmptyNoteDisable(true);
            }
          }
          setState(__ => ({
            ...__,
            [field]: value,
          }));
        }}>
        <Form.Item options={options} label="Request Category" name="request_category" rules={[{ required: true }]}>
          <Select sm defaultValue={{ value: 'Wrongfully Charged', label: 'Wrongfully Charged' }} options={options} />
        </Form.Item>
        <Form.Item
          marks={{
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: {
              style: {
                color: '#f50',
              },
              label: <strong>100%</strong>,
            },
          }}
          step={null}
          formatOptions={{ style: 'percent' }}
          label="Credit Percentage"
          name="slider"
          rules={[{ required: true, message: 'Please select percentage greater the 0' }]}>
          <Slider />
        </Form.Item>
        <Field value={state?.amount_to_be_added} disabled />
        <Form.Item
          type="textarea"
          placeholder="Enter notes here"
          label="Add Notes"
          name="edit_notes"
          rules={[
            {
              required: true,
              message: 'Please enter notes here.',
            },
            {
              pattern: /^[a-zA-Z0-9./$!& ()><@#*^%?,']{0,200}$/,
              message: 'Notes must be maximum 200 characters.',
            },
          ]}>
          <Field />
        </Form.Item>

        <Button
          disabled={emptyNoteDisable || disableSubmit}
          type="primary"
          width={100}
          htmlType="submit"
          css="margin-left:auto;">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
}
export default RefundRequestTransactionForm;
