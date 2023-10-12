/* eslint-disable no-useless-escape */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Form, { useForm } from 'components/molecules/Form';
import Field from 'components/molecules/Field';
import Select from 'components/atoms/Select';
import CategoryService from 'services/categoryService';
import Toast from 'components/molecules/Toast';
import Button from 'components/atoms/Button';
import Upload from 'components/molecules/Upload';
import GridCol from 'components/atoms/GridCol';
import businessUsersService from 'services/businessUsersService';
import Tooltip from 'components/atoms/Tooltip';
// eslint-disable-next-line no-unused-vars
import { css } from 'styled-components/macro';
import businessStoresService from 'services/businessStoreService';
import Label from 'components/atoms/Label';
import Loaders from 'components/atoms/Loaders';
import { AuthContext } from 'context/authContext';
import Grid from '../../atoms/Grid';
import GoogleLocationSelector from '../GeolocationSelector';
import { compressImage } from '../../../helpers/common';
import { ImgBox } from './CreateBusinessForm.styles';

const CreateBusinessForm = ({ onClose }) => {
  const [state, setState] = useState({
    business_logo: '',
    business_picture: '',
    business_receipt: '',
  });
  const { business_logo, business_picture, business_receipt } = state;
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState({
    googleImgSrc: '',
    customImgSrc: '',
    defaultImg: true,
    customImg: false,
  });
  const [googleImgLoading, setGoogleImgLoading] = useState(false);
  const [form] = useForm();
  const { categories_data, categories_loading } = CategoryService.GetCategories();
  const { refetch } = useContext(AuthContext);
  const getSubCategory = categoryId => {
    CategoryService.getSubCategoryByParentId(categoryId)
      .then(res => {
        const data = res?.map(subCategory => ({ value: subCategory?._id, label: subCategory?.sub_category_name }));
        setSubCategories(data);
        form.setFieldsValue({
          sub_category: {
            label: data[0].label,
            value: data[0].value,
          },
        });
      })
      .catch(() => setSubCategories([]));
  };
  const { categories } = useMemo(
    () => ({
      categories: categories_data.map(x => ({ label: x.category_name, value: x._id })),
    }),
    [categories_data],
  );

  const onChangeCategory = ({ target: { value } }) => {
    form.setFieldsValue({
      category: {
        value: value?.value,
        label: value?.label,
      },
    });
    getSubCategory(value?.value);
  };
  const onFileResize = async file => {
    const p = await compressImage(file);
    return p;
  };
  useEffect(() => {
    if (state?.address && state?.isSameBusiness) {
      form.setFieldsValue({
        isSameBusiness: false,
        store_image: '',
      });
      // eslint-disable-next-line no-use-before-define
      handleStoreAddress({ target: { value: state.address } });
    }
  }, [state?.address]);
  useEffect(() => {
    if (state?.business_name && state?.isSameName && state?.business_name !== state?.store_name) {
      form.setFieldsValue({
        store_name: state?.business_name,
        isSameName: false,
      });
    }
  }, [state?.business_name]);
  const getStoreImg = e => {
    let isValid = true;
    if (e?.use_default_store_img) {
      if (images.googleImgSrc) {
        return { isValid, store_img: images.googleImgSrc };
      }
      Toast({
        type: 'error',
        message: 'Please upload store image',
      });
      isValid = false;
    }
    return { isValid, store_img: images.customImgSrc };
  };
  const handleSubmit = e => {
    const { isValid, store_img } = getStoreImg(e);
    const payload = {
      ...e,
      store_image: store_img,
      category: e?.category?.value,
      sub_category: e?.sub_category?.value,
    };
    if (isValid) {
      setLoading(true);
      businessUsersService
        .createBusiness(payload)
        .then(res => {
          if (res.error) {
            setLoading(false);
            Toast({
              type: 'error',
              message: res?.message,
            });
          } else {
            setLoading(false);
            refetch();
            onClose();
            Toast({
              type: 'success',
              message: res?.message,
            });
          }
        })
        .catch(err => {
          setLoading(false);
          Toast({
            type: 'error',
            message: err?.message,
          });
        });
    }
  };
  const getGoogleImgSrc = () => {
    setGoogleImgLoading(true);
    businessStoresService.getImageFromPlaceId(state?.store_address?.place_id).then(img => {
      setGoogleImgLoading(false);

      if (!img.image || img.image === '') {
        Toast({
          type: 'warning',
          message: 'No Image Found On Google',
        });

        setImages({ ...images, googleImgSrc: '', defaultImg: false, customImg: true });
        form.setFieldsValue({ use_default_store_img: false });
      } else {
        setImages({ ...images, googleImgSrc: img.image });
        setGoogleImgLoading(false);

        form.setFieldsValue({
          store_image: img.image,
          use_default_store_img: true,
        });
      }
    });
  };
  const handleStoreAddress = ({ target: { value } }) => {
    form.setFieldsValue({
      store_address: value,
    });
    getGoogleImgSrc();
  };
  const handleSameAddress = () => {
    form.setFieldsValue({
      store_address: form.getFieldValue('address'),
      store_name: form.getFieldValue('business_name'),
      isSameBusiness: true,
      isSameName: true,
    });
  };
  const handleDefaultImg = () => {
    setImages({ ...images, defaultImg: true, customImg: false });
    form.setFieldsValue({
      use_default_store_img: true,
      store_image: '',
    });
  };
  const handleCustomImg = () => {
    setImages({ ...images, customImg: true, defaultImg: false });
    form.setFieldsValue({
      use_default_store_img: false,
      store_image: '',
    });
  };

  return (
    <Form
      form={form}
      initialValues={{
        ...state,
      }}
      onSubmit={handleSubmit}
      onTouched={e => {
        setState(_ => ({ ..._, ...e }));
      }}
      onError={() => {
        Toast({
          type: 'error',
          message: 'Please fill all the required fields',
        });
      }}>
      <Grid xs={1} lg={2} colGap={20}>
        <Form.Item
          type="text"
          label="Business Name"
          name="business_name"
          placeholder="Business Name"
          rules={[
            { required: true, message: 'Business Name is required' },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]*$/,
              message: 'Enter a valid business name',
            },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]{3,}$/,
              message: 'Business name must be minimum 3 characters',
            },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]{3,100}$/,
              message: 'Business name must be maximum 100 characters',
            },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          type="text"
          name="address"
          label="Address"
          placeholder="Business Address"
          rules={[{ required: true, message: 'Business Address is required' }]}>
          <GoogleLocationSelector name="address" />
        </Form.Item>
        <Form.Item
          type="email"
          label="Email"
          name="email"
          placeholder="Email"
          rules={[
            { required: true, message: 'Email is required' },
            {
              pattern:
                /^[^<>()[\]\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Enter Valid Email Address',
            },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          type="password"
          label="Password"
          name="password"
          placeholder="Password"
          rules={[
            { required: true, message: 'Password is required' },
            { password: true },
            { pattern: /^.{8,64}$/, message: 'Minimum Character Length is 8 and Maximum Character Length is 64' },
          ]}>
          <Field />
        </Form.Item>

        <Form.Item type="text" label="GST/HST Number" name="business_gst" placeholder="GST/HST Number">
          <Field />
        </Form.Item>
        <Form.Item
          type="text"
          label="Business Contact Number"
          name="contact_number"
          placeholder="Business Contact Number"
          rules={[
            { required: true, message: 'Business Contact Number is required' },
            {
              pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
              message: 'Enter Complete Business Contact Number',
            },
            {
              changeRegex: 'phone_number',
            },
          ]}>
          <Field />
        </Form.Item>

        <Form.Item
          type="text"
          label="Primary Contact Person"
          name="primary_contact_person"
          placeholder="Primary Contact"
          rules={[
            { required: true, message: 'Primary Contact is required' },
            {
              pattern: /^[a-zA-Z ]*$/,
              message: 'Enter a valid Name',
            },
            {
              pattern: /^[a-zA-Z ]{3,}$/,
              message: 'Name must be minimum 3 characters',
            },
            {
              pattern: /^[a-zA-Z ]{2,40}$/,
              message: 'Name must be maximum 40 characters',
            },
          ]}>
          <Field />
        </Form.Item>

        <Form.Item
          type="text"
          label="Primary Contact Number"
          name="primary_contact_number"
          placeholder="Primary Contact Number"
          rules={[
            { required: true, message: 'Primary Contact Number is required' },
            {
              pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
              message: 'Primary Contact Number should be 10 digits!',
            },
            {
              changeRegex: 'phone_number',
            },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          type="text"
          label="Store Name"
          name="store_name"
          placeholder="Store Name"
          rules={[
            { required: true, message: 'Store Name is required' },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]*$/,
              message: 'Store Name only allows letters, numbers, and special characters',
            },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]{2,}$/,
              message: 'Store Name must be minimum 2 characters',
            },
            {
              pattern: /^[a-zA-Z0-9\s`!@#$%^&*()_+-=:";'<>,.]{2,100}$/,
              message: 'Store Name must be maximum 100 characters',
            },
          ]}>
          <Field />
        </Form.Item>

        <Form.Item
          type="text"
          labelIcon={
            <div
              css={`
                position: absolute;
                right: 0;
                top: -8px;
              `}>
              <Tooltip title="Set store name and address same as business">
                <Button type="primary" shape="circle" size={30} onClick={handleSameAddress}>
                  <span className="material-icons-outlined">add_location_alt</span>
                </Button>
              </Tooltip>
            </div>
          }
          label="Store address"
          name="store_address"
          placeholder="Store Address"
          onChange={handleStoreAddress}
          rules={[{ required: true, message: 'Store Address is required' }]}>
          <GoogleLocationSelector name="address" />
        </Form.Item>

        <Form.Item
          type="text"
          allowSearch
          loading={categories_loading}
          label="Category"
          options={categories}
          name="category"
          placeholder="Category"
          onChange={onChangeCategory}
          rules={[{ required: true, message: 'Category is required' }]}>
          <Select />
        </Form.Item>

        <Form.Item
          type="text"
          allowSearch
          options={subCategories}
          label="Sub-Category"
          name="sub_category"
          placeholder="Sub-Category"
          rules={[{ required: true, message: 'Sub-Category is required' }]}>
          <Select />
        </Form.Item>
        <Field
          id="default_img"
          type="radio"
          label="Use Default Store Image"
          value={images.defaultImg}
          name="radio1"
          onChange={handleDefaultImg}
        />
        <Field
          id="custom_img"
          type="radio"
          label="Use Custom Store Image"
          name="radio1"
          value={images.customImg}
          onChange={handleCustomImg}
        />
      </Grid>
      <Grid xs={12} colGap={20}>
        <GridCol xs={12} md={3}>
          <Form.Item
            name="business_logo"
            label="Business Logo"
            value={business_logo}
            onChange={async info => {
              if (info.target?.value) {
                const ff = await onFileResize(info.target.value);
                form.setFieldsValue({ business_logo: ff });
                setState(prev => ({ ...prev, business_logo: ff }));
              } else {
                setState(prev => ({ ...prev, business_logo: '' }));
                form.setFieldsValue({ business_logo: '' });
              }
            }}
            rules={[{ required: true, message: 'Business Logo is required' }]}>
            <Upload allowPreview label="Front Photo" uploadBtnText="Upload Business Logo" />
          </Form.Item>
        </GridCol>
        <GridCol xs={12} md={3}>
          <Form.Item
            name="business_picture"
            label="Business Picture"
            value={business_picture}
            onChange={async info => {
              if (info.target?.value) {
                const ff = await onFileResize(info.target.value);
                form.setFieldsValue({ business_picture: ff });
                setState(prev => ({ ...prev, business_picture: ff }));
              } else {
                setState(prev => ({ ...prev, business_picture: '' }));
                form.setFieldsValue({ business_picture: '' });
              }
            }}>
            <Upload allowPreview label="Front Photo" uploadBtnText="Upload Business Picture" />
          </Form.Item>
        </GridCol>
        <GridCol xs={12} md={3}>
          <Form.Item
            name="business_receipt"
            label="Business receipt"
            value={business_receipt}
            onChange={async info => {
              if (info.target?.value) {
                const ff = await onFileResize(info.target.value);
                form.setFieldsValue({ business_receipt: ff });
                setState(prev => ({ ...prev, business_receipt: ff }));
              } else {
                setState(prev => ({ ...prev, business_receipt: '' }));
                form.setFieldsValue({ business_receipt: '' });
              }
            }}>
            <Upload allowPreview label="Front Photo" uploadBtnText="Upload Business Receipt" />
          </Form.Item>
        </GridCol>
        <GridCol xs={12} md={3}>
          {images.customImg && (
            <Form.Item
              name="store_image"
              label="Store Image"
              value={images.customImgSrc}
              onChange={async info => {
                if (info.target?.value) {
                  const ff = await onFileResize(info.target.value);
                  form.setFieldsValue({ store_image: ff });
                  setImages(prev => ({ ...prev, customImgSrc: ff }));
                  setState(prev => ({ ...prev, store_image: ff }));
                } else {
                  setState(prev => ({ ...prev, store_image: '' }));
                  setImages(prev => ({ ...prev, customImgSrc: '' }));

                  form.setFieldsValue({ store_image: '' });
                }
              }}
              rules={[{ required: true, message: 'Store Image is required' }]}>
              <Upload allowPreview label="Front Photo" uploadBtnText="Upload Store Image" />
            </Form.Item>
          )}
          {images.defaultImg && (
            <>
              <Label>Store Image</Label>
              <ImgBox>
                {images.googleImgSrc ? (
                  <img src={images.googleImgSrc} alt="store_image" />
                ) : googleImgLoading ? (
                  <Loaders loading={googleImgLoading} />
                ) : (
                  <span>No image Found</span>
                )}
              </ImgBox>
            </>
          )}
        </GridCol>
      </Grid>
      <Button
        loading={loading}
        type="primary"
        htmlType="submit"
        rounded
        sm
        width={155}
        css={`
          margin: 0 auto 1.25rem;
          @media (min-width: 768px) {
            margin-bottom: 2.125rem;
          }
        `}>
        Submit
      </Button>
    </Form>
  );
};

export default CreateBusinessForm;
