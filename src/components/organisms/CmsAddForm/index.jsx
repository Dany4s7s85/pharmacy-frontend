import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Form, { useForm } from 'components/molecules/Form';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import Toast from 'components/molecules/Toast';
import cmsService from 'services/cmsService';
import Field from 'components/molecules/Field';
import Select from 'components/atoms/Select';

import { AuthContext } from 'context/authContext';

function CmsEditForm({ onClose, category, levelVal }) {
  const [formAdd] = useForm();

  const { refetch } = useContext(AuthContext);
  const [addMoreCnt, setAddMoreCnt] = useState([]);

  const addSubCategories = async e => {
    const payload = {
      categoryId: category._id,
      formData: { ...e, edit_permission: e.edit_permission.value, view_permission: e.view_permission.value },
    };

    try {
      const res = await cmsService.addSubCategories(payload);
      if (res) {
        if (res?.success) {
          Toast({ type: 'success', message: res?.message });
        } else {
          Toast({ type: 'error', message: res?.message });
        }
      }
    } catch (error) {
      Toast({ type: 'error', message: error?.message });
    } finally {
      onClose();
      refetch();
    }
  };

  return (
    <Form form={formAdd} onSubmit={addSubCategories}>
      <Grid xs={1} sm={12} colGap={20}>
        <GridCol sm={12}>
          <Form.Item
            sm
            type="text"
            label="Parameter Title"
            rules={[
              { required: true, message: 'Please enter a Parameter!' },
              { pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' },
            ]}
            name="title"
            placeholder="Enter Title">
            <Field />
          </Form.Item>
        </GridCol>
        <GridCol sm={6}>
          <Form.Item
            id="dropdown"
            sm
            options={levelVal}
            isSearchable
            label="System Configuration - View"
            name="view_permission"
            rules={[{ required: true, message: 'View Permission level is required!' }]}>
            <Select />
          </Form.Item>
        </GridCol>
        <GridCol sm={6}>
          <Form.Item
            id="dropdown"
            sm
            options={levelVal}
            isSearchable
            label="System Configuration - Edit"
            name="edit_permission"
            rules={[{ required: true, message: 'Edit Permission level is required!' }]}>
            <Select />
          </Form.Item>
        </GridCol>
        {addMoreCnt.map((i, ind) => (
          <GridCol sm={12} name={i}>
            <Form.Item
              button={
                <Button
                  size={30}
                  type="danger"
                  shape="circle"
                  onClick={() => setAddMoreCnt(addMoreCnt.filter(ii => ii !== i))}>
                  <i className="material-icons-outlined">delete</i>
                </Button>
              }
              sm
              type="number"
              placeholder="Enter a value"
              label={`New Value ${Number(ind + 1)}`}
              name={`valueNew${i}`}
              rules={[
                { required: addMoreCnt.length > 0, message: 'This field is required' },
                { pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' },
              ]}>
              <Field />
            </Form.Item>
          </GridCol>
        ))}
        <GridCol sm={12} css="margin-bottom: var(--gutter);">
          <Button
            type="white"
            css="margin: 0 auto;"
            prefix={<i className="material-icons-outlined">add</i>}
            onClick={() => {
              setAddMoreCnt(orA => [...orA, Math.floor(Math.random() * 10 ** 4)]);
            }}
            width={120}>
            Add Value
          </Button>
        </GridCol>
      </Grid>
      <div
        css={`
          display: flex;
          justify-content: flex-end;
          gap: 20px;
        `}>
        <Button
          type="outline"
          onClick={() => {
            // formAdd.resetFields();
            onClose();
          }}
          width={120}>
          cancel
        </Button>
        <Button type="primary" width={120} htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default CmsEditForm;
