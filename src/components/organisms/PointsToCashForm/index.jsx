import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
import InfoCard from 'components/molecules/InfoCard';

import cardService from 'services/cardService';
import transactionService from 'services/transactionService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Message from 'components/molecules/Message';
import Paragraph from 'components/atoms/Paragraph';
import { AuthContext } from '../../../context/authContext';

// eslint-disable-next-line no-unused-vars
function PointsToCashForm({ customer, onClose }) {
  const [form] = useForm();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const { channels_data } = transactionService.GetPlastkChannel({ type: 'Points To Cash' });
  const [state, setState] = useState({
    total_points: 1350,
    redeemBtnActive: false,
    converted: 0,
    pointsToRedeem: 0,
    goodStanding: true,
  });
  const [error, setError] = useState({
    redeemError: '',
  });
  const { refetch } = useContext(AuthContext);

  // eslint-disable-next-line no-unused-vars
  const { total_points, redeemBtnActive, converted, pointsToRedeem, goodStanding } = state;
  const { redeemError } = error;
  useEffect(async () => {
    try {
      const res = await cardService.getCardPoints(customer._id);
      setState(prev => ({ ...prev, total_points: res.total_points }));
      const response = await transactionService.checkGoodStandingAdminPtc(customer._id);
      setState(prev => ({ ...prev, goodStanding: response?.userInGoodStanding?.goodStanding }));
    } catch (ex) {
      onClose();
      Toast({
        message: ex?.message,
        type: 'error',
      });
    }
  }, [customer]);
  const onChangeCashToPoints = value => {
    let pointsValue = value.replace(/[a-zA-Z-[/\]'`=_~!;"<>:@&%{}()*+?.,\\^$|#\s]/g, '');
    if (pointsValue.match(/^[0-9]*$/) === false) {
      setState(prev => ({ ...prev, redeemBtnActive: true }));
      setError(prev => ({ ...prev, redeemError: '1250 Minimum points to redeem' }));
    }

    const convertedCashValue = parseInt(pointsValue, 10) * 0.004;
    setState(prev => ({ ...prev, pointsToRedeem: pointsValue }));
    if (pointsValue.match(/^[0-9]*$/) && total_points >= 0) {
      pointsValue = parseInt(pointsValue, 10);

      setError(prev => ({ ...prev, redeemError: 'Enter points to redeem (only whole numbers are allowed)' }));
      if (pointsValue >= 1250 && pointsValue <= total_points) {
        pointsValue = parseInt(pointsValue, 10);

        setState(prev => ({
          ...prev,
          converted: pointsValue >= 0 ? convertedCashValue.toFixed(2) : 0,
          redeemBtnActive: false,
        }));
        setError(prev => ({ ...prev, redeemError: '' }));
      } else if (pointsValue < 1250) {
        pointsValue = parseInt(pointsValue, 10);
        setState(prev => ({
          ...prev,
          converted: pointsValue >= 0 ? convertedCashValue.toFixed(2) : 0,
          redeemBtnActive: true,
        }));
        setError(prev => ({ ...prev, redeemError: 'Points must be more or equal to 1250' }));
      } else if (pointsValue > total_points) {
        pointsValue = parseInt(pointsValue, 10);
        setState(prev => ({
          ...prev,
          converted: pointsValue >= 0 ? convertedCashValue.toFixed(2) : 0,
          redeemBtnActive: true,
        }));
        setError(prev => ({
          ...prev,
          redeemError: `Points to redeem should be less than or equal to  ${total_points}`,
        }));
      } else if (pointsValue === null) {
        setState(prev => ({ ...prev, redeemBtnActive: true }));
        setError(prev => ({ ...prev, redeemError: '1250 Minimum points to redeem' }));
      }
    }
  };

  const onSubmit = async values => {
    try {
      setLoading(true);
      const res = await transactionService.pendingPointRequest({
        user: customer?._id,
        plastk_channel: channels_data[0]._id,
        notes: 'points to cash',
        points: values.points,
      });
      if (res?.success) {
        Toast({
          message: res?.message,
          type: 'success',
        });
        refetch();
        onClose();
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }
      setLoading(false);
    } catch (ex) {
      refetch();
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  return (
    <>
      <Grid xs={1} lg={2} gap={20} css="margin-bottom: var(--gutter);">
        <InfoCard title="Name:" value={`${customer?.first_name} ${customer?.last_name}`} $unStyled />
        <InfoCard title="Email:" value={customer?.email} $unStyled />
        <InfoCard title="Points:" value={total_points} $unStyled />
      </Grid>

      {goodStanding ? (
        <Form form={form} onSubmit={onSubmit}>
          <Form.Item
            sm
            type="number"
            name="points"
            labelIcon={
              <Icon
                size="1rem"
                showTooltip
                toolTipContent="We'll use this to give you more accurate financial suggestions"
                className="icon-help-circle"
              />
            }
            label="Points to be redeemed"
            placeholder="Kindly enter points to be updated to"
            onChange={e => {
              form.setFieldsValue({ points: e.target.value });
              onChangeCashToPoints(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: 'Please Specify a number',
              },
              {
                pattern: /^\d+$/,
                message: 'Only Whole Numbers Are Allowed without decimal',
              },
            ]}>
            <Field />
          </Form.Item>
          <Paragraph css="color: var(--danger)">{redeemError}</Paragraph>
          <Paragraph>Amount Converted: ${converted}</Paragraph>
          <Button disabled={redeemBtnActive} type="primary" htmlType="submit" loading={loading}>
            Redeem
          </Button>
        </Form>
      ) : (
        <Message text="User needs to make a payment before using this feature" css="color: var(--danger);" />
      )}
    </>
  );
}

export default PointsToCashForm;
