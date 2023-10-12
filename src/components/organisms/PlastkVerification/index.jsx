/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Select from 'components/atoms/Select';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import userService from 'services/userService';
import Compress from 'react-image-file-resizer';
import kycService from 'services/kycService';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import Upload from 'components/molecules/Upload';
import InfoCard from 'components/molecules/InfoCard';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';

function PlastkVerification({ onClose, user = '' }) {
  const [form] = useForm();
  const { refetch } = useContext(AuthContext);
  const [formState, setFormState] = useState({ counter: 1 });
  const [state, setState] = useState({
    customers: '',
    selectedCustomer: user || '',
    cardType: '',
    selfie: '',
    backPhoto: '',
    frontPhoto: '',
    utilityDoc: '',
  });
  const [kycState, setKycState] = useState({
    user_id: '',
    postalCode: '',
    dob: '',
    showFrontPhoto: true,
    showBackPhoto: false,
    showUtilityDoc: false,
    showSelfie: false,
    frontPhotoCondition: false,
    subDisable: true,
    success: false,
    trigerprovince: false,
    isUtilityRequired: false,
    docLoading: false,
  });
  const [url, setUrl] = useState({
    front_image_url: '',
    back_image_url: '',
    utility_image_url: '',
    selfie_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);
  const { selectedCustomer, cardType, selfie, backPhoto, frontPhoto, utilityDoc } = state;
  const dummy_state = { ...formState };
  useEffect(() => {
    if (formState) {
      delete formState.card_type;
      delete formState.province;
      form.setFieldsValue({ ...formState });
    }
  }, [kycState.docLoading]);

  const handleUserSearch = async inputValue => {
    try {
      const response = await userService.searchUsersByTextKyc(1, 20, inputValue);

      const options = response.items.map(_ => ({
        value: _?._id,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));

      setState(prev => ({ ...prev, customers: response?.items }));
      return options;
    } catch {
      return [];
    }
  };

  const onFileResize = async file => {
    const p = await new Promise(resolve => {
      Compress.imageFileResizer(
        file,
        Infinity,
        Infinity,
        // 480, 480,
        'JPEG',
        70,
        0,
        uri => {
          resolve(uri);
        },
        'base64',
      );
    });
    return p;
  };
  const onSubmit = () => {
    setLoading(() => !loading);
    let result = {};
    setKycState(prev => ({ ...prev, subDisable: true, docLoading: true }));
    kycService
      .kycSubmission({
        options: {
          user_id: kycState.user_id,
          first_name: selectedCustomer?.first_name,
          middle_name: selectedCustomer?.middle_name || '',
          last_name: selectedCustomer?.last_name,
          postal_code: kycState.postalCode,
          type: form.getFieldValue('card_type').value,
          dob: kycState.dob,
        },
      })
      .then(res => {
        result = res;
        kycService
          .sendKycDocuments({
            payload: {
              photo_id_front: url.front_image_url,
              utility_doc: url.utility_image_url || '',
              selfie: url.selfie_url,
              photo_id_back: url.back_image_url,
              photo_id_type: state.cardType,
              province: form.getFieldValue('province') ? form.getFieldValue('province')?.value : '',
              isKycPassed: res?.isKycPassed,
              auto_kyc_message: res?.message,
              email: selectedCustomer?.email,
            },
          })

          .then(response => {
            setLoading(false);
            onClose();
            refetch();
          })
          .catch(ex => {
            setLoading(false);
            onClose();
            refetch();
            Toast({ type: 'error', message: ex.message });
          });
        setKycState(prev => ({ ...prev, subDisable: false, docLoading: false }));
        Toast({
          type: 'success',
          message: result.isKycPassed ? 'Your KYC is Approved' : 'Your KYC is Under Processing',
        });
      })
      .catch(ex => {
        setLoading(false);
        setKycState(prev => ({ ...prev, subDisable: false, docLoading: false }));
        Toast({ type: 'error', message: ex.message });
      });
    setKycState(prev => ({ ...prev, subDisable: false, docLoading: false }));
  };
  const cardTypeOptions = [
    { value: 'Drivers License', label: 'Drivers License' },
    { value: 'Canadian Passport', label: 'Canadian Passport' },
    { value: 'PR Card', label: 'PR Card' },
    { value: 'Provincial ID', label: 'Provincial ID' },
  ];

  const province = [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
  ];
  const uploadFrontImage = (image, documentType, image_extension, selected_province) => {
    delete dummy_state.backPhoto;
    setFormState(() => dummy_state);
    kycService
      .checkFrontPhoto({
        options: {
          type: documentType,
          user_id: kycState.user_id,
          image_extension,
          try_count: formState.counter,
          postal_code: kycState.postalCode,
          front_image: image,
          province: selected_province || '',
        },
      })
      .then(res => {
        setUrl(prev => ({ ...prev, front_image_url: res?.front_image_url }));
        if (res?.isUtilityRequired) {
          setKycState(prev => ({ ...prev, isUtilityRequired: res?.isUtilityRequired }));
        }
        if (res?.status) {
          setKycState(prev => ({ ...prev, success: true }));
          setFormState(prev => ({ ...prev, counter: 1 }));
          if (state.cardType === 'Canadian Passport') {
            setKycState(prev => ({ ...prev, showUtilityDoc: true }));
          } else {
            setKycState(prev => ({ ...prev, showBackPhoto: true }));
          }
          Toast({ type: 'success', message: res?.message });
        } else {
          form.setFieldsValue({ frontPhoto: '' });
          setState(prev => ({ ...prev, frontPhoto: '' }));
          setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
          Toast({ type: 'error', message: res?.message });
        }

        setUrl(prev => ({ ...prev, front_image_url: res?.front_image_url }));
        setKycState(prev => ({ ...prev, docLoading: false }));
      })
      .catch(ex => {
        form.setFieldsValue({ frontPhoto: '' });
        setState(prev => ({ ...prev, frontPhoto: '' }));
        Toast({ type: 'error', message: ex.message });
        setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
        setKycState(prev => ({ ...prev, docLoading: false }));
      });
  };

  const uploadBackImage = (image, documentType, image_extension, selected_province) => {
    delete dummy_state.utilityDoc;
    delete dummy_state.selfie;
    setFormState(() => dummy_state);
    setKycState(prev => ({ ...prev, success: false }));
    kycService
      .checkBackPhoto({
        options: {
          type: documentType,
          user_id: kycState.user_id,
          image_extension,
          try_count: formState.counter,
          postal_code: kycState.postalCode,
          back_image: image,
          province: selected_province || '',
        },
      })
      .then(res => {
        if (res?.status) {
          setKycState(prev => ({ ...prev, success: true }));
          setFormState(prev => ({ ...prev, counter: 1 }));
          if (kycState.isUtilityRequired) {
            setKycState(prev => ({ ...prev, showUtilityDoc: true }));
          } else {
            setKycState(prev => ({ ...prev, showSelfie: true }));
          }
          Toast({ type: 'success', message: res?.message });
        } else {
          form.setFieldsValue({ backPhoto: '' });
          setState(prev => ({ ...prev, backPhoto: '' }));
          setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
          Toast({ type: 'error', message: res?.message });
        }
        if (res?.back_image_url) {
          setUrl(prev => ({ ...prev, back_image_url: res?.back_image_url }));
        }
        setKycState(prev => ({ ...prev, success: true, docLoading: false }));
      })
      .catch(ex => {
        form.setFieldsValue({ backPhoto: '' });
        setState(prev => ({ ...prev, backPhoto: '' }));
        Toast({ type: 'error', message: ex.message });
        setKycState(prev => ({ ...prev, success: true, docLoading: false }));
        setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
      });
  };
  const uploadUtilityDoc = (image, documentType, image_extension, selected_province) => {
    delete dummy_state.selfie;
    setFormState(() => dummy_state);
    setKycState(prev => ({ ...prev, success: false }));
    kycService
      .checkUtilityPhoto({
        options: {
          type: documentType,
          user_id: kycState.user_id,
          image_extension,
          try_count: formState.counter,
          postal_code: kycState.postalCode,
          front_image: image,
          province: selected_province || '',
        },
      })
      .then(res => {
        if (res?.status) {
          setKycState(prev => ({ ...prev, success: true, showSelfie: true }));
          setFormState(prev => ({ ...prev, counter: 1 }));
          Toast({ type: 'success', message: res?.message });
        } else {
          form.setFieldsValue({ utilityDoc: '' });
          setState(prev => ({ ...prev, utilityDoc: '' }));
          setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
          Toast({ type: 'error', message: res?.message });
        }
        if (res?.utility_image_url) {
          setUrl(prev => ({ ...prev, utility_image_url: res?.utility_image_url }));
        }
        setKycState(prev => ({ ...prev, success: true, docLoading: false }));
      })
      .catch(ex => {
        form.setFieldsValue({ utilityDoc: '' });
        setState(prev => ({ ...prev, utilityDoc: '' }));
        Toast({ type: 'error', message: ex.message });
        setKycState(prev => ({ ...prev, success: true, docLoading: false }));
        setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
      });
  };
  const uploadSelfie = (image, image_extension) => {
    setKycState(prev => ({ ...prev, success: false }));
    kycService
      .checkSelfie({
        options: {
          selfie: image,
          user_id: kycState.user_id,
          image_extension,
        },
      })
      .then(res => {
        if (res.status) {
          setKycState(prev => ({ ...prev, subDisable: false, success: true }));
          setFormState(prev => ({ ...prev, counter: 1 }));
          Toast({ type: 'success', message: res?.message });
        } else {
          form.setFieldsValue({ selfie: '' });
          setState(prev => ({ ...prev, selfie: '' }));
          setKycState(prev => ({ ...prev, success: true }));
          setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
          Toast({ type: 'error', message: res?.message });
        }
        if (res?.selfie_url) {
          setUrl(prev => ({ ...prev, selfie_url: res?.selfie_url }));
        }
        setKycState(prev => ({ ...prev, docLoading: false }));
      })
      .catch(ex => {
        form.setFieldsValue({ selfie: '' });
        setState(prev => ({ ...prev, selfie: '' }));
        setKycState(prev => ({ ...prev, docLoading: false }));
        setFormState(prev => ({ ...prev, counter: prev.counter + 1 }));
        Toast({ type: 'error', message: ex.message });
      });
  };
  useEffect(() => {
    if (form.getFieldValue('frontPhoto') !== '' && form.getFieldValue('frontPhoto') !== undefined) {
      setKycState(prev => ({ ...prev, docLoading: true }));
      const image = form.getFieldValue('frontPhoto');
      const documentType = form.getFieldValue('card_type')?.value;
      const image_extension = image?.split(';')[0].split('/')[1];
      const selected_province = form.getFieldValue('province')?.value;
      uploadFrontImage(image, documentType, image_extension, selected_province);
    }
  }, [form.getFieldValue('frontPhoto')]);

  useEffect(() => {
    if (form.getFieldValue('backPhoto') !== '' && form.getFieldValue('backPhoto') !== undefined) {
      setKycState(prev => ({ ...prev, docLoading: true }));
      const image = form.getFieldValue('backPhoto');
      const documentType = form.getFieldValue('card_type')?.value;
      const image_extension = image?.split(';')[0].split('/')[1];
      const selected_province = form.getFieldValue('province')?.value;
      uploadBackImage(image, documentType, image_extension, selected_province);
    }
  }, [form.getFieldValue('backPhoto')]);
  useEffect(() => {
    if (form.getFieldValue('utilityDoc') !== '' && form.getFieldValue('utilityDoc') !== undefined) {
      setKycState(prev => ({ ...prev, docLoading: true }));
      const image = form.getFieldValue('utilityDoc');
      const documentType = form.getFieldValue('card_type')?.value;
      const image_extension = image?.split(';')[0].split('/')[1];
      const selected_province = form.getFieldValue('province')?.value;
      uploadUtilityDoc(image, documentType, image_extension, selected_province);
    }
  }, [form.getFieldValue('utilityDoc')]);
  useEffect(() => {
    if (form.getFieldValue('selfie') !== '' && form.getFieldValue('selfie') !== undefined) {
      setKycState(prev => ({ ...prev, docLoading: true }));
      const image = form.getFieldValue('selfie');
      const image_extension = image?.split(';')[0].split('/')[1];
      uploadSelfie(image, image_extension);
    }
  }, [form.getFieldValue('selfie')]);
  useEffect(() => {
    if (form.getFieldValue('card_type')?.value !== '' && form.getFieldValue('card_type')?.value !== undefined) {
      if (
        form.getFieldValue('card_type')?.value === 'Canadian Passport' ||
        form.getFieldValue('card_type')?.value === 'PR Card'
      ) {
        setKycState(prev => ({ ...prev, frontPhotoCondition: true }));
      } else if (
        (form.getFieldValue('card_type')?.value === 'Drivers License' ||
          form.getFieldValue('card_type')?.value === 'Provincial ID') &&
        typeof form.getFieldValue('province')?.value !== 'undefined'
      ) {
        setKycState(prev => ({ ...prev, frontPhotoCondition: true }));
      } else {
        setKycState(prev => ({ ...prev, frontPhotoCondition: false }));
      }
    }
  }, [form.getFieldValue('card_type'), kycState.trigerprovince]);

  const clearFields = type => {
    if (type === 'customer') {
      setKycState(prev => ({
        ...prev,
        showFrontPhoto: false,
        showUtilityDoc: false,
        showBackPhoto: false,
        showSelfie: false,
        trigerprovince: false,
      }));
      setState(prev => ({
        ...prev,
        cardType: '',
        frontPhoto: '',
        backPhoto: '',
        utilityDoc: '',
        selfie: '',
      }));
      form.setFieldsValue({
        card_type: '',
        province: '',
        frontPhoto: '',
        backPhoto: '',
        utilityDoc: '',
        selfie: '',
      });
      form.setFieldsError({
        card_type: undefined,
        province: undefined,
        frontPhoto: undefined,
        backPhoto: undefined,
        utilityDoc: undefined,
        selfie: undefined,
      });
      setKycState(prev => ({ ...prev, subDisable: true }));
    }
    if (type === 'frontPhoto') {
      setKycState(prev => ({
        ...prev,
        showUtilityDoc: false,
        showBackPhoto: false,
        showSelfie: false,
      }));
      setState(prev => ({
        ...prev,
        backPhoto: '',
        utilityDoc: '',
        selfie: '',
      }));
      form.setFieldsValue({
        frontPhoto: '',
        backPhoto: '',
        utilityDoc: '',
        selfie: '',
      });
      form.setFieldsError({
        frontPhoto: undefined,
        backPhoto: undefined,
        utilityDoc: undefined,
        selfie: undefined,
      });
      setKycState(prev => ({ ...prev, subDisable: true }));
    }
    if (type === 'backPhoto') {
      if (state.cardType !== 'Canadian Passport') {
        setKycState(prev => ({
          ...prev,
          showUtilityDoc: false,
          showSelfie: false,
        }));
        setState(prev => ({
          ...prev,
          selfie: '',
          utilityDoc: '',
        }));
        form.setFieldsValue({
          backPhoto: '',
          utilityDoc: '',
          selfie: '',
        });
        form.setFieldsError({
          backPhoto: undefined,
          utilityDoc: undefined,
          selfie: undefined,
        });
        setKycState(prev => ({ ...prev, subDisable: true }));
      }
    }
    if (type === 'utilityDoc') {
      setKycState(prev => ({
        ...prev,
        showSelfie: false,
      }));

      setState(prev => ({
        ...prev,
        selfie: '',
      }));
      form.setFieldsValue({
        utilityDoc: '',
        selfie: '',
      });
      form.setFieldsError({
        utilityDoc: undefined,
        selfie: undefined,
      });
      setKycState(prev => ({ ...prev, subDisable: true }));
    }
    if (type === 'selfie') {
      setState(prev => ({
        ...prev,
        selfie: '',
      }));
      form.setFieldsValue({
        selfie: '',
      });
      form.setFieldsError({
        utilityDoc: undefined,
        selfie: undefined,
      });
      setKycState(prev => ({ ...prev, subDisable: true }));
    }
  };
  return (
    <>
      <Loaders loading={loading}>
        {!user && (
          <Select
            sm
            open
            async
            defaultOptions
            disabled={kycState.docLoading}
            filterOption={false}
            loadOptions={handleUserSearch}
            onChange={e => {
              clearFields('customer');
              const { value } = e.target;
              const result = state?.customers.find(customer => customer?._id === value?.value);
              setKycState(prev => ({
                ...prev,
                user_id: result?._id,
                postalCode: result?.postal_code,
                dob: result?.dob,
              }));
              setState(prev => ({
                ...prev,
                selectedCustomer: {
                  first_name: result?.first_name,
                  last_name: result?.last_name,
                  email: result?.email,
                },
              }));
            }}
          />
        )}

        {!selectedCustomer?.kyc_status || selectedCustomer?.kyc_status === 'not verified' ? (
          <>
            <Form
              form={form}
              onSubmit={onSubmit}
              onTouched={e => {
                setFormState(_ => ({ ..._, ...e }));
                if (e.card_type) {
                  setKycState(prev => ({
                    ...prev,
                    showUtilityDoc: false,
                    showBackPhoto: false,
                    showSelfie: false,
                    trigerprovince: false,
                  }));
                  setState(prev => ({
                    ...prev,
                    frontPhoto: '',
                    backPhoto: '',
                    selfie: '',
                  }));
                  form.setFieldsValue({
                    province: '',
                    frontPhoto: '',
                    backPhoto: '',
                    utilityDoc: '',
                    selfie: '',
                  });
                  form.setFieldsError({
                    province: undefined,
                    frontPhoto: undefined,
                    backPhoto: undefined,
                    utilityDoc: undefined,
                    selfie: undefined,
                  });
                  setFormState(prev => ({ ...prev, counter: 1 }));
                }
                if (e.province) {
                  setKycState(prev => ({
                    ...prev,
                    showUtilityDoc: false,
                    showBackPhoto: false,
                    showSelfie: false,
                    trigerprovince: true,
                  }));
                  setState(prev => ({
                    ...prev,
                    frontPhoto: '',
                    backPhoto: '',
                    selfie: '',
                  }));
                  form.setFieldsValue({
                    frontPhoto: '',
                    backPhoto: '',
                    utilityDoc: '',
                    selfie: '',
                  });
                  form.setFieldsError({
                    frontPhoto: undefined,
                    backPhoto: undefined,
                    utilityDoc: undefined,
                    selfie: undefined,
                  });
                  setFormState(prev => ({ ...prev, counter: 1 }));
                }
              }}>
              <Grid xs={form.getFieldValue('card_type') ? 2 : 1} gap={20}>
                {selectedCustomer && (
                  <Form.Item
                    name="card_type"
                    label="Card Type"
                    isDisabled={kycState.docLoading}
                    onChange={e => {
                      const { value } = e.target;
                      form.setFieldsValue({ card_type: value });
                      setState(prev => ({
                        ...prev,
                        cardType: value?.value,
                        backPhoto: value?.value === 'Canadian Passport' && '',
                      }));
                      form.setFieldsValue({ backPhoto: '' });
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Please select your card type?',
                      },
                    ]}>
                    <Select options={cardTypeOptions} label="Card Type" />
                  </Form.Item>
                )}
                {(cardType === 'Drivers License' ||
                  (cardType === 'Provincial ID' && form.getFieldValue('card_type'))) && (
                  <Form.Item
                    name="province"
                    label="Province"
                    isDisabled={kycState.docLoading}
                    onChange={e => {
                      const { value } = e.target;
                      form.setFieldsValue({ province: value });
                    }}
                    rules={[
                      {
                        required: !!(cardType === 'Drivers License' || cardType === 'Provincial ID'),
                        message: 'Please select your province!',
                      },
                    ]}>
                    <Select options={province} label="Province" />
                  </Form.Item>
                )}
              </Grid>
              {cardType && (
                <Loaders loading={kycState.docLoading}>
                  <Grid xs={2} md={4} gap={20}>
                    {kycState.frontPhotoCondition && (
                      <Form.Item
                        name="frontPhoto"
                        label="Front Photo"
                        value={frontPhoto}
                        onChange={async info => {
                          clearFields('frontPhoto');
                          if (info.target?.value) {
                            const ff = await onFileResize(info.target.value);
                            form.setFieldsValue({ frontPhoto: ff });
                            setState(prev => ({ ...prev, frontPhoto: ff }));
                          } else {
                            setState(prev => ({ ...prev, frontPhoto: '' }));
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: 'Please select front photo!',
                          },
                        ]}>
                        <Upload
                          allowPreview
                          label="Front Photo"
                          uploadBtnText={`${`Upload ${cardType} Front Photo`}`}
                          success={kycState.success}
                        />
                      </Form.Item>
                    )}
                    {cardType === 'Canadian Passport' ? null : kycState.showBackPhoto ? (
                      <Form.Item
                        name="backPhoto"
                        label="Back Photo"
                        value={backPhoto}
                        onChange={async info => {
                          clearFields('backPhoto');
                          if (info.target?.value) {
                            const ff = await onFileResize(info.target.value);
                            form.setFieldsValue({ backPhoto: ff });
                            setState(prev => ({ ...prev, backPhoto: ff }));
                          } else {
                            setState(prev => ({ ...prev, backPhoto: '' }));
                          }
                        }}
                        rules={[
                          {
                            required: cardType !== 'Canadian Passport',
                            message: 'Please select your Back photo!',
                          },
                        ]}>
                        <Upload
                          label={`${`Upload ${cardType} Back Photo`}`}
                          success={kycState.success}
                          uploadBtnText="Upload Back Photo"
                        />
                      </Form.Item>
                    ) : (
                      ''
                    )}
                    {kycState.showUtilityDoc && (
                      <Form.Item
                        name="utilityDoc"
                        minHeight
                        label="Additional Doc"
                        value={utilityDoc}
                        onChange={async info => {
                          clearFields('utilityDoc');
                          if (info.target?.value) {
                            const ff = await onFileResize(info.target.value);
                            form.setFieldsValue({ utilityDoc: ff });
                            setState(prev => ({ ...prev, utilityDoc: ff }));
                          } else {
                            setState(prev => ({ ...prev, utilityDoc: '' }));
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: 'Please select aditional docs!',
                          },
                        ]}>
                        <Upload label="Aditional Doc" success={kycState.success} uploadBtnText="Upload Aditional Doc" />
                      </Form.Item>
                    )}
                    {kycState.showSelfie && (
                      <Form.Item
                        name="selfie"
                        label="Selfie Picture"
                        value={selfie}
                        onChange={async info => {
                          clearFields('selfie');
                          if (info.target?.value) {
                            const ff = await onFileResize(info.target.value);
                            form.setFieldsValue({ selfie: ff });
                            setState(prev => ({ ...prev, selfie: ff }));
                          } else {
                            setState(prev => ({ ...prev, selfie: '' }));
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: 'Please Upload selfie picture',
                          },
                        ]}>
                        <Upload
                          label="Selfie Picture"
                          success={kycState.success}
                          uploadBtnText="Upload Selfie Picture"
                        />
                      </Form.Item>
                    )}
                  </Grid>
                </Loaders>
              )}
              <Button type="primary" htmlType="submit" disabled={kycState.subDisable}>
                Submit
              </Button>
            </Form>
          </>
        ) : selectedCustomer?.kyc_status === 'processing' ? (
          <InfoCard title=" Please wait while we process your application...." />
        ) : selectedCustomer?.kyc_status === 'approved' ? (
          <InfoCard title="Thank you! You are now Plastk Verified." />
        ) : (
          selectedCustomer?.kyc_status === 'rejected' && <InfoCard title="Sorry we could not verify you." />
        )}
      </Loaders>
    </>
  );
}

export default PlastkVerification;
