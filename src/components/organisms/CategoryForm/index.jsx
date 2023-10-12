import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import CategoryService from 'services/categoryService';

function CategoryFrom({ category, onClose = () => {} }) {
  const [form] = useForm();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        category_name: category.category_name,
        category_image_url: category.category_image_url,
      });
      setState({
        ...state,
        category_name: category.category_name,
        category_image_url: category.category_image_url,
      });
    }
  }, [category]);
  const onSubmit = async data => {
    try {
      setLoading(true);
      if (category) await CategoryService.updateBusinessCategory(category._id, data);
      else await CategoryService.createBusinessCategory(data);
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Category Updated successfully',
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
    <Form form={form} onSubmit={onSubmit} onTouched={_ => setState(__ => ({ ...__, ..._ }))}>
      <Grid
        xs={1}
        lg={2}
        colGap={20}
        css={`
          align-items: center;
        `}>
        <Form.Item
          sm
          type="text"
          label="Category Name"
          name="category_name"
          placeholder="Categpry Name"
          rules={[
            { required: true, message: 'Please enter category name' },
            { pattern: /^[A-Za-z0-9\s&]*$/, message: "Only Alphabets and '&' sign is allowed" },
            { pattern: /^.{3,40}$/, message: 'Maximum Character Length is 40 And Minimum Character Length is 3' },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          sm
          type="test"
          label="Category Image"
          name="category_image_url"
          placeholder="Category Image Url"
          rules={[
            { required: true, message: 'Please enter email address' },
            {
              pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
              message: 'Please enter a valid url',
            },
          ]}>
          <Field />
        </Form.Item>
      </Grid>
      <Button loading={loading} type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
}

export default CategoryFrom;
