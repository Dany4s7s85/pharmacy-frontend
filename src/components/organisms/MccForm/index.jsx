import React, { useState, useContext, useEffect } from 'react';
import Button from 'components/atoms/Button';
import SubTitle from 'components/atoms/SubTitle';
import Icon from 'components/atoms/Icon';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import cardService from 'services/cardService';
import { AuthContext } from 'context/authContext';
import Toast from 'components/molecules/Toast';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';

function MccForm({ onClose = () => {}, mccData }) {
  const { refetch } = useContext(AuthContext);
  const [form] = useForm();
  const [mcc_form] = useForm();
  const [loading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState(['']);
  const [mcc, setMcc] = useState([{ code: '', description: '' }]);

  useEffect(() => {
    if (mccData) {
      form.setFieldsValue({
        title: mccData?.title,
        color: mccData?.color,
      });
      setMcc(mccData.mcc);
      setSubCategory(mccData.sub_category);
    }
  }, [mccData]);
  const removeCategory = index => {
    const sub = [...subCategory];
    sub.splice(index, 1);
    setSubCategory(sub);
  };

  const removeMcc = index => {
    const sub = [...mcc];
    sub.splice(index, 1);
    setMcc(sub);
  };

  const onChangeCategory = (i, e) => {
    const sub = [...subCategory];
    sub[i] = e;
    setSubCategory(sub);
  };

  const onChangeMcc = (i, e, name, type) => {
    const sub = [...mcc];
    sub[i][type] = e;
    mcc_form.setFieldsValue({
      [name]: e,
    });
    setMcc(sub);
  };

  const getSub = sub => {
    const subs = sub.map((e, i) => {
      const next = i + 1;
      return (
        <Form.Item
          sm
          button={
            i !== 0 && (
              <Button size={30} type="danger" shape="circle" onClick={() => removeCategory(i)}>
                <i className="material-icons-outlined">delete</i>
              </Button>
            )
          }
          type="text"
          name={`sub_category[${i}]`}
          value={e}
          onChange={({ target: { value } }) => {
            onChangeCategory(i, value);
          }}
          placeholder={`Sub Category ${next}`}
          rules={[{ pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' }]}>
          <Field />
        </Form.Item>
      );
    });
    return subs;
  };
  const getMcc = sub => {
    const subs = sub.map((e, i) => {
      const next = i + 1;
      const mcc_code = `mcc[${i}][code]`;
      const mcc_description = `mcc[${i}][description]`;
      return (
        <Form form={mcc_form}>
          <Form.Item
            sm
            button={
              i !== 0 && (
                <Button
                  size={30}
                  type="danger"
                  shape="circle"
                  css={`
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 10px;
                  `}
                  onClick={() => removeMcc(i)}>
                  <i className="material-icons-outlined">delete</i>
                </Button>
              )
            }
            label="Code"
            type="text"
            name={mcc_code}
            value={e.code}
            placeholder={`Code ${next}`}
            rules={[
              { required: true, message: 'Code is required' },
              {
                pattern: /^[0-9]*$/,
                message: 'Code must be a number',
              },
              { pattern: /^.{0,10}$/, message: 'Maximum Character Length is 10' },
            ]}
            onChange={({ target: { value, name } }) => {
              onChangeMcc(i, value, name, 'code');
            }}>
            <Field />
          </Form.Item>
          <Form.Item
            sm
            label="Description"
            type="text"
            name={mcc_description}
            value={e.description}
            onChange={({ target: { value, name } }) => onChangeMcc(i, value, name, 'description')}
            placeholder={`Description ${next}`}
            rules={[
              { required: true, message: 'Description is required' },
              {
                pattern: /^.{5,}$/,
                message: 'Description must be minimum 5 characters.',
              },
              {
                pattern: /^.{5,80}$/,
                message: 'Description must be maximum 80 characters.',
              },
            ]}>
            <Field />
          </Form.Item>
        </Form>
      );
    });
    return subs;
  };

  const onSubmit = async data => {
    try {
      const payLoad = {
        title: data.title,
        color: data.color,
        sub_category: subCategory,
        mcc,
      };
      setLoading(true);
      if (mccData) {
        await cardService.updateMCCById(mccData?._id, payLoad);
      } else {
        await cardService.addMCC(payLoad);
      }
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Mcc saved successfully',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  return (
    <Form form={form} onSubmit={onSubmit}>
      <Form.Item
        sm
        type="text"
        label="Title"
        labelIcon={<Icon size="1rem" showTooltip toolTipContent="Enter Mcc Totle" className="icon-help-circle" />}
        name="title"
        placeholder="title"
        rules={[
          { required: true, message: 'Title is required' },
          {
            pattern: /^.{3,}$/,
            message: 'Title must be minimum 3 characters.',
          },
          {
            pattern: /^.{3,40}$/,
            message: 'Title must be maximum 80 characters.',
          },
        ]}>
        <Field />
      </Form.Item>
      <Form.Item
        sm
        type="text"
        label="Color"
        labelIcon={<Icon size="1rem" showTooltip toolTipContent="Enter MCC Color" className="icon-help-circle" />}
        name="color"
        placeholder="color"
        rules={[
          { required: true, message: 'Color is required' },
          {
            pattern: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
            message: 'Color should be a valid hex color code',
          },
        ]}>
        <Field />
      </Form.Item>
      <SubTitle>Sub Categories:</SubTitle>
      {getSub(subCategory)}
      <Button
        css={`
          margin: 0 auto 15px;
        `}
        width={160}
        type="primary"
        prefix={<i className="material-icons-outlined">add</i>}
        onClick={() => setSubCategory([...subCategory, ''])}>
        Add Sub Category
      </Button>

      <SubTitle>Code & Description</SubTitle>
      {getMcc(mcc)}
      <Button
        css={`
          margin: 0 auto 15px;
        `}
        width={160}
        type="primary"
        prefix={<i className="material-icons-outlined">add</i>}
        onClick={() => setMcc([...mcc, { code: '', description: '' }])}>
        Add More
      </Button>

      <Button loading={loading} type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
}

export default MccForm;
