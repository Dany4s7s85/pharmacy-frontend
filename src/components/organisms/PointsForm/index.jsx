import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import SubTitle from 'components/atoms/SubTitle';
import Icon from 'components/atoms/Icon';
import InfoCard from 'components/molecules/InfoCard';

import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import transactionService from 'services/transactionService';
import cardService from 'services/cardService';
import Toast from 'components/molecules/Toast';
import Paragraph from 'components/atoms/Paragraph';

// eslint-disable-next-line no-unused-vars
function PointsForm({ modalUser, onClose }) {
  const [form] = useForm();
  const { loading } = useContext(AuthContext);
  const { refetch, setLoading } = useContext(AuthContext);
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
  // eslint-disable-next-line no-unused-vars
  const { total_points, redeemBtnActive, converted } = state;
  const { redeemError } = error;
  const onSubmit = async data => {
    const { points } = data;
    await transactionService.togglePointRequest({ _id: modalUser._id, approve: false, points }).then(res => {
      if (res.success) {
        Toast({
          message: res.message,
          type: 'success',
        });
        setLoading(false);
        refetch();
        onClose();
      } else {
        Toast({
          message: res.message,
          type: 'error',
        });
        setLoading(false);
        refetch();
        onClose();
      }
    });
  };
  useEffect(async () => {
    try {
      const res = await cardService.getCardPoints(modalUser.user._id);
      setState(prev => ({ ...prev, total_points: res.total_points }));
      const response = await transactionService.checkGoodStandingAdminPtc(modalUser.user._id);
      setState(prev => ({ ...prev, goodStanding: response?.userInGoodStanding?.goodStanding }));
    } catch (ex) {
      onClose();
      Toast({
        message: ex?.message,
        type: 'error',
      });
    }
  }, [modalUser]);
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

  return (
    <Loaders loading={loading}>
      <Form form={form} onSubmit={onSubmit}>
        <SubTitle>Current Points: {modalUser?.points}</SubTitle>
        <Grid xs={1} lg={2} colGap={20} css="margin-bottom: 20px;">
          <InfoCard title="Name" value={`${modalUser?.user?.first_name} ${modalUser?.user?.last_name}`} $unStyled />
          <InfoCard title="Email" value={modalUser?.user?.email} $unStyled />
          {modalUser.plastk_channel.description !== 'Points To Cash' ? (
            <InfoCard title="Notes" value={modalUser?.notes} $unStyled />
          ) : null}
        </Grid>
        {modalUser.plastk_channel.channel !== 'Points To Cash' ? (
          <Form.Item
            sm
            type="number"
            name="points"
            labelIcon={<Icon size="1rem" iconName="help_outline" />}
            label="Points Value"
            placeholder="Kindly enter points to be updated to"
            rules={[
              {
                required: true,
                message: 'Please Specify a number',
              },
              {
                pattern: /^\d+$/,
                message: 'Only Whole Numbers Are Allowed without decimal',
              },
              {
                max: 5000,
                message: 'Only value under 5000 is allowed',
              },
            ]}>
            <Field />
          </Form.Item>
        ) : (
          <>
            <InfoCard title="Points:" value={total_points} $unStyled />
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
                {
                  max: 5000,
                  message: 'Only value under 5000 is allowed',
                },
              ]}>
              <Field />
            </Form.Item>
            <Paragraph css="color: var(--danger)">{redeemError}</Paragraph>
            <Paragraph>Amount Converted: ${converted}</Paragraph>
          </>
        )}
        <Button type="primary" disabled={redeemBtnActive} htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form>
    </Loaders>
  );
}

export default PointsForm;
