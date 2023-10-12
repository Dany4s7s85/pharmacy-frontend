import React, { useState, useMemo, useEffect, useContext } from 'react';
import { format, differenceInYears } from 'date-fns';

import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import SubTitle from 'components/atoms/SubTitle';
import Select from 'components/atoms/Select';
import Icon from 'components/atoms/Icon';
import freeUserService from 'services/freeUserService';
import Loaders from 'components/atoms/Loaders';
import { AuthContext } from 'context/authContext';
import Toast from 'components/molecules/Toast';

import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import { getDateObject } from 'helpers/common';
import embossList from '../../../helpers/embossList';
import JD from '../../../helpers/jobDescription';

function FreeUserForm({ freeUser, onClose }) {
  const { refetch, fetchUser } = useContext(AuthContext);

  const [form] = useForm();
  const [startDate, setStartDate] = useState(getDateObject(new Date()));

  const [state, setState] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    embossOptions: [],
    jobDescription: [],
    industry: { label: '', value: '' },
    employment_status: { label: '', value: '' },
    how_did_you_hear_about_us: { label: '', value: '' },
  });

  const [loading, setLoading] = useState(false);
  const { embossOptions, jobDescription } = state;

  const getEmbossOptions = (first_name, middle_name, last_name) => {
    const options = embossList(first_name, middle_name, last_name);
    options.forEach((opt, index) => {
      options[index] = { value: opt, label: opt };
    });
    setState(prev => ({ ...prev, embossOptions: options }));
  };

  const Title = [
    { value: 'M', label: 'Mr.' },
    { value: 'F', label: 'Ms.' },
    { value: 'O', label: 'Mrs.' },
    { value: 'Other', label: 'Other' },
  ];

  const SurveyOptions = [
    { value: 'Mail Offer', label: 'Mail Offer' },
    { value: 'Friends or Family', label: 'Friends or Family' },
    { value: 'Email Offer Plastk', label: 'Email Offer Plastk' },
    { value: 'Search Engine', label: 'Search Engine' },
    { value: 'Online Banner Ad or Video', label: 'Online Banner Ad or Video' },
    { value: 'Facebook Ad or Video', label: 'Facebook Ad or Video' },
    { value: 'Credit Card Comparisons', label: 'Credit Card Comparisons' },
    { value: 'Other', label: 'Other' },
  ];

  const WhyWantCardOptions = [
    { value: 'Rebuild your Credit', label: 'To Rebuild My Credit' },
    { value: 'New to Canada', label: 'New to Canada' },
    {
      value: 'Want a rewards Credit Card',
      label: 'Want a rewards Credit Card',
    },
  ];

  const provinceOptions = [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Northwest Territories' },
    { value: 'NT', label: 'Nova Scotia' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Quebec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
  ];

  const employment_status = [
    { value: 'Employed', label: 'Employed' },
    { value: 'Self-Employed', label: 'Self-Employed' },
    { value: 'Retired', label: 'Retired' },
    { value: 'Student', label: 'Student' },
    { value: 'Unemployed', label: 'Unemployed' },
  ];

  const industries = [
    { value: 'administrative', label: 'Administrative or Clerical' },
    { value: 'business', label: 'Business or Strategic Management' },
    { value: 'construction', label: 'Construction or Skilled Trades' },
    { value: 'creative', label: 'Creative or Design' },
    { value: 'customer', label: 'Customer Support or Client Care' },
    { value: 'editorial', label: 'Editorial or Writing' },
    { value: 'education', label: 'Education or Training' },
    { value: 'engineering', label: 'Engineering or Architecture' },
    { value: 'finance', label: 'Finance or Insurance' },
    { value: 'food', label: 'Food Services or Hospitality' },
    { value: 'installation', label: 'Installation or Maintenance or Repair' },
    { value: 'it', label: 'IT' },
    { value: 'legal', label: 'Legal' },
    { value: 'logistics', label: 'Logistics or Transportation' },
    { value: 'manufacture', label: 'Manufacture or Production or Operations' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'medical', label: 'Medical or Health' },
    {
      value: 'projectOrProgramManagement',
      label: 'Project or Program Management',
    },
    { value: 'qualityAssurance', label: 'Quality Assurance or Safety' },
    { value: 'retail', label: 'Retail Sales or Business Development' },
    { value: 'security', label: 'Security or Protective Services' },
    { value: 'science', label: 'Science or Research and Design' },
  ];

  const selectGender = gender => {
    switch (gender) {
      case 'M':
        return { value: 'M', label: 'Mr.' };

      case 'F':
        return { value: 'F', label: 'Ms.' };
      case 'O':
        return { value: 'O', label: 'Mrs.' };

      case 'Other':
        return { value: 'Other', label: 'Other' };

      default:
        return false;
    }
  };
  const selectProvince = province => provinceOptions.find(x => x.value === province);
  const selectHowDidYouHearAboutUs = value =>
    SurveyOptions.find(x => {
      if (x.value === value) {
        return true;
      }

      return false;
    });
  const employment_year = useMemo(() => Array.from(new Array(50), (_, i) => ({ value: i + 1, label: i + 1 })), []);
  const employment_month = useMemo(() => Array.from(new Array(11), (_, i) => ({ value: i + 1, label: i + 1 })), []);
  useEffect(() => {
    if (freeUser) {
      if (freeUser?.employment_status === 'Employed' || freeUser?.employment_status === 'Self-Employed') {
        setState(prev => ({ ...prev, industry: freeUser?.industry, showEmploymentFields: true }));
      }

      setState(prev => ({
        ...prev,
        employment_status: { value: freeUser?.employment_status, label: freeUser?.employment_status },
      }));

      if (freeUser?.dob) {
        const timeSplit = freeUser?.dob.split('-');
        const year = timeSplit[0];
        const month = timeSplit[1];
        const day = timeSplit[2].split('T')[0];

        form.setFieldsValue({
          dob: `${year}-${month}-${day}`,
        });
      }
      form.setFieldsValue({
        ...freeUser,
        card_type: { value: '1', label: 'Original Plastk Card' },
        emboss: freeUser?.emboss ? { value: freeUser?.emboss, label: freeUser?.emboss } : undefined,
        employment_status: freeUser?.employment_status
          ? { value: freeUser?.employment_status, label: freeUser?.employment_status }
          : undefined,
        industry: { value: freeUser?.industry, label: freeUser?.industry },
        job_description: { value: freeUser?.job_description, label: freeUser?.job_description },
        employment_month: { value: freeUser?.employment_month, label: freeUser?.employment_month },
        employment_year: { value: freeUser?.employment_year, label: freeUser?.employment_year },
        how_did_you_hear_about_us: !selectHowDidYouHearAboutUs(freeUser?.how_did_you_hear_about_us)
          ? undefined
          : { value: freeUser?.how_did_you_hear_about_us, label: freeUser?.how_did_you_hear_about_us },
        other: !selectHowDidYouHearAboutUs(freeUser?.how_did_you_hear_about_us)
          ? freeUser?.how_did_you_hear_about_us
          : undefined,
        why_do_you_want_the_card: freeUser?.why_do_you_want_the_card
          ? {
              value: freeUser?.why_do_you_want_the_card,
              label: freeUser?.why_do_you_want_the_card,
            }
          : undefined,
        gender: selectGender(freeUser?.gender) ? selectGender(freeUser?.gender) : undefined,
        province: selectProvince(freeUser.province),
      });

      getEmbossOptions(freeUser?.first_name, freeUser?.middle_name, freeUser?.last_name);
    }
  }, [freeUser]);

  const onSubmit = async data => {
    try {
      const payload = {
        ...data,
        industry: data?.industry?.value,
        employment_status: data?.employment_status?.value,
        how_did_you_hear_about_us:
          data?.how_did_you_hear_about_us?.value === 'other' || data?.how_did_you_hear_about_us?.value === 'Other'
            ? data?.other
            : data?.how_did_you_hear_about_us?.value,
        emboss: data?.emboss?.value,
        card_type: data?.card_type?.value,
        mortgage: data.mortgage?.value,
        province: data?.province?.value,
        why_do_you_want_the_card: data?.why_do_you_want_the_card?.value,
        gender: data?.gender?.value,
        employment_month: data?.employment_month?.value,
        employment_year: data?.employment_year?.value,
        job_description: data?.job_description?.value,
      };

      setLoading(true);
      const res = await freeUserService.updateFreeUser(freeUser._id, payload);

      if (res.code === 200) {
        Toast({
          message: res?.message,
          type: 'success',
        });
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }
      refetch();
      fetchUser();
      setLoading(false);
      onClose();
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  return (
    <>
      <Loaders loading={loading}>
        <Form form={form} onSubmit={onSubmit}>
          <SubTitle>Personal Information</SubTitle>
          <Grid xs={1} lg={2} colGap={20}>
            <Form.Item
              id="dropdown"
              sm
              options={Title}
              isSearchable
              label="Title"
              placeholder="Title"
              name="gender"
              rules={[{ required: true, message: 'Please select gender' }]}>
              <Select />
            </Form.Item>
          </Grid>
          <Grid xs={1} lg={3} colGap={20}>
            <Form.Item
              sm
              type="text"
              label="First Name"
              name="first_name"
              placeholder="First Name"
              onChange={e => {
                getEmbossOptions(e.target.value, form.getFieldValue('middle_name'), form.getFieldValue('last_name'));
                setState(prev => ({ ...prev, first_name: e.target.value }));
                form.setFieldsValue({ first_name: e.target.value });
              }}
              rules={[
                { required: true, message: 'Please enter first name' },
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: 'First name should be alphabets!',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,}$/,
                  message: 'First Name must be minimum 2 characters.',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,40}$/,
                  message: 'First Name must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              sm
              type="text"
              label="Middle Name"
              name="middle_name"
              placeholder="Middle Name"
              onChange={e => {
                getEmbossOptions(form.getFieldValue('first_name'), e.target.value, form.getFieldValue('last_name'));
                setState(prev => ({ ...prev, middle_name: e.target.value }));
                form.setFieldsValue({ middle_name: e.target.value });
              }}
              rules={[
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: 'Middle name should be alphabets!',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,}$/,
                  message: 'Middle Name must be minimum 2 characters.',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,40}$/,
                  message: 'Middle Name must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              sm
              type="text"
              label="Last Name"
              name="last_name"
              placeholder="Last Name"
              onChange={e => {
                getEmbossOptions(form.getFieldValue('first_name'), form.getFieldValue('middle_name'), e.target.value);
                setState(prev => ({ ...prev, last_name: e.target.value }));
                form.setFieldsValue({ last_name: e.target.value });
              }}
              rules={[
                { required: true, message: 'Please input your last name' },
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: 'Last name should be alphabets!',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,}$/,
                  message: 'Last Name must be minimum 2 characters.',
                },
                {
                  pattern: /^[a-zA-Z_ ]{2,40}$/,
                  message: 'Last Name must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>
          <Form.Item
            sm
            id="dropdown"
            options={embossOptions}
            isSearchable
            name="emboss"
            label="Emboss"
            placeholder="Select Emboss Name"
            rules={[
              {
                required: true,
                message: 'Name that should be on the card should be selected',
              },
            ]}>
            <Select />
          </Form.Item>
          <Grid lg={2} colGap={20}>
            <Form.Item
              sm
              type="email"
              label="Email"
              name="email"
              disabled={!!freeUser}
              placeholder="Email"
              rules={[
                { required: true, message: 'Please enter email address' },
                { email: true, message: 'Please enter a valid email' },
                { max: 40, message: 'Email should be at max 40 characters!' },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              sm
              type="text"
              label="Phone Number"
              name="phone_number"
              placeholder="(123) 345-6789"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                {
                  pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
                  message: 'Phone number should be 10 digits!',
                },
                {
                  changeRegex: 'phone_number',
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              sm
              name="dob"
              label="Date of Birth"
              rules={[
                { required: true, message: 'Please enter your date of birth' },
                {
                  pattern: /[1-9][0-9]{3}/,
                  message: 'Please enter your complete date of birth',
                },
                {
                  pattern: /[1-9][0-9]{3}/,
                  message: 'Please enter your complete date of birth',
                },
                {
                  transform: value => {
                    if (
                      differenceInYears(
                        getDateObject(new Date()),
                        getDateObject(new Date(format(getDateObject(new Date(value)), 'yyyy-MM-dd'))),
                      ) >= 18
                    ) {
                      return false;
                    }
                    return true;
                  },
                  message: 'Your age must be 18 years to apply',
                },
              ]}>
              <Field
                selected={startDate}
                onChange={date => setStartDate(date)}
                isClearable
                prefix={<i className="material-icons-outlined">date_range</i>}
                placeholderText="Select date range"
                type="datepicker"
                label="Date Range"
                noMargin
                sm
              />
            </Form.Item>
            <Form.Item
              sm
              type="text"
              labelIcon={
                <Icon
                  size="1rem"
                  showTooltip
                  toolTipContent="An SIN is optional but can help us get your file quickly."
                  iconName="help_outline"
                />
              }
              label="Social insurance number"
              name="sin"
              placeholder="111-111-111"
              rules={[
                {
                  pattern: /^\d{3}-\d{3}-\d{3}$/,
                  message: 'Social Insurance Number must be 9 characters long!',
                },
                {
                  changeRegex: 'sin',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>
          <Form.Item
            sm
            id="dropdown"
            options={WhyWantCardOptions}
            isSearchable
            name="why_do_you_want_the_card"
            label="Why Do You Want The Card"
            placeholder="Why Do You Want The Card?"
            rules={[{ required: true, message: 'Please select an option!' }]}>
            <Select />
          </Form.Item>
          <Form.Item
            sm
            id="dropdown"
            menuPlacement="top"
            options={SurveyOptions}
            isSearchable
            name="how_did_you_hear_about_us"
            label="How Did You Hear About Us?"
            onChange={e => {
              setState(prev => ({ ...prev, how_did_you_hear_about_us: e.target.value }));
              form.setFieldsValue({ how_did_you_hear_about_us: e.target.value });
              if (e.target.value === 'Other') {
                form.setFieldsValue({ other: undefined });
              }
            }}
            placeholder="How Did You Hear About Us?">
            <Select />
          </Form.Item>
          {form.getFieldValue('how_did_you_hear_about_us')?.value?.toLowerCase() === 'other' && (
            <Form.Item
              sm
              name="other"
              label="Other Source"
              rules={[
                { required: form.getFieldValue('how_did_you_hear_about_us')?.value?.toLowerCase() === 'other' },
                {
                  pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{2,}$/,
                  message: 'Other Source must be minimum 2 characters.',
                },
                {
                  pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{2,40}$/,
                  message: 'Other Source must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
          )}
          <SubTitle>Address</SubTitle>

          <Form.Item
            sm
            type="text"
            label="Street Address"
            labelIcon={
              <Icon size="1rem" showTooltip toolTipContent="Enter your street address" className="icon-help-circle" />
            }
            name="street_address"
            placeholder="Street Address"
            rules={[{ required: true, message: 'Street Address is required' }]}>
            <Field />
          </Form.Item>

          <Grid xs={1} lg={2} colGap={20}>
            <Form.Item
              sm
              type="text"
              label="Suite Number"
              name="suite_number"
              placeholder="Suite Number"
              rules={[
                {
                  pattern: /^[a-zA-Z0-9-.,_ ]{0,46}$/,
                  message: 'Suit number should be at max 64 characters!',
                },
              ]}>
              <Field />
            </Form.Item>

            <Form.Item
              sm
              type="text"
              label="City"
              name="city"
              placeholder="City"
              rules={[
                { required: true, message: 'City is required' },
                {
                  transform: value => !(String(value).length > 2 && String(value).length < 50),
                  message: 'City should be between 3 to 50 characters!',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>

          <Grid xs={1} lg={2} colGap={20}>
            <Form.Item
              sm
              options={provinceOptions}
              isSearchable
              is
              label="Province"
              name="province"
              placeholder="Province"
              rules={[
                { required: true, message: 'Province is required' },
                {
                  transform: value => {
                    if (value === 'QC') return true;
                    return false;
                  },
                  message: 'Plastk Secured Credit Card service is not available in Quebec at this time',
                },
              ]}>
              <Select />
            </Form.Item>
            <Form.Item
              sm
              type="text"
              label="Postal Code"
              name="postal_code"
              placeholder="Postal Code"
              rules={[
                { required: true, message: 'Postal code is required' },
                {
                  pattern: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
                  message: 'Postal Code is invalid',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>

          <SubTitle>Employment Information</SubTitle>
          <Form.Item
            sm
            options={employment_status}
            onChange={e => {
              setState(prev => ({ ...prev, employment_status: e.target.value }));
              form.setFieldsValue({ employment_status: e.target.value });
            }}
            isSearchable
            label="Employment Status"
            name="employment_status"
            placeholder="Employment Status"
            rules={[{ required: true, message: 'Employment Status is Required' }]}>
            <Select />
          </Form.Item>

          {state.employment_status.value === 'Employed' || state.employment_status.value === 'Self-Employed' ? (
            <>
              <Form.Item
                sm
                options={industries}
                isSearchable
                label="Industry"
                name="industry"
                placeholder="Industry"
                onChange={e => {
                  const JobDes = JD[e.target.value.value]?.map(_id => ({ value: _id, label: _id }));
                  setState(prev => ({ ...prev, industry: e.target.value, jobDescription: JobDes }));
                  form.setFieldsValue({ industry: e.target.value });
                }}
                rules={[
                  { required: true, message: 'Industry is Required' },
                  {
                    transform: value => !value.length,
                    message: 'Please select an industry',
                  },
                ]}>
                <Select />
              </Form.Item>

              <Form.Item
                sm
                options={jobDescription}
                label="Job Description"
                name="job_description"
                placeholder="Job Description"
                onChange={e => {
                  form.setFieldsValue({ job_description: e.target.value });
                }}
                rules={[
                  { required: true, message: 'Job Description is required' },
                  {
                    transform: value => !value.length,
                    message: 'Please select Job Description',
                  },
                ]}>
                <Select />
              </Form.Item>

              <Form.Item
                sm
                label="Current Employer"
                name="current_employer"
                placeholder="Current Employer"
                rules={[
                  { required: true, message: 'Current Employer is required' },
                  {
                    pattern: /^[a-zA-Z\s]*$/,
                    message: 'Please enter alphabets only',
                  },
                  {
                    pattern: /^[a-zA-Z_ ]{2,}$/,
                    message: 'Current Employer must be minimum 2 characters.',
                  },
                  {
                    pattern: /^[a-zA-Z_ ]{2,40}$/,
                    message: 'Current Employer must be maximum 40 characters.',
                  },
                ]}>
                <Field />
              </Form.Item>

              <Form.Item
                sm
                options={employment_year}
                isSearchable
                label="Years (Optional)"
                name="employment_year"
                placeholder="Years">
                <Select />
              </Form.Item>

              <Form.Item
                sm
                options={employment_month}
                isSearchable
                label="Months (Optional)"
                name="employment_month"
                placeholder="Months">
                <Select />
              </Form.Item>
            </>
          ) : null}

          <SubTitle>Financial Information</SubTitle>

          <Form.Item
            sm
            type="number"
            name="credit_limit"
            labelIcon={
              <Icon
                size="1rem"
                showTooltip
                toolTipContent="You requested credit limit what you are requried to submit as a security deposit to get a secured credit card"
                iconName="help_outline"
              />
            }
            label="Credit Limit"
            placeholder="Requested Credit Limit"
            rules={[
              {
                required: true,
                message: 'Please enter your credit limit',
              },
              { min: 300, message: 'Minimum credit limit is $300' },
              { max: 10000, message: 'Maximum credit Limit is $10,000' },
              { pattern: /^\d+$/, message: 'Only Whole Numbers Are Allowed' },
            ]}>
            <Field />
          </Form.Item>

          <Grid xs={1} lg={2} colGap={20}>
            <Form.Item
              sm
              type="number"
              name="annual_salary_before_tax"
              labelIcon={
                <Icon
                  size="1rem"
                  showTooltip
                  toolTipContent="We'll use this to give you more accurate financial suggestions"
                  iconName="help_outline"
                />
              }
              label="Annual Income Before Taxes"
              placeholder="Annual Income Before Taxes"
              rules={[
                {
                  required: true,
                  message: 'Please Specify Annual Salary Before Taxes',
                },
                {
                  pattern: /^\d+$/,
                  message: 'Only Whole Numbers Are Allowed without decimal',
                },
              ]}>
              <Field />
            </Form.Item>

            <Form.Item
              sm
              type="number"
              name="other_house_income"
              label="Other Household Income Before Taxes"
              placeholder="Other Household Income Before Taxes"
              rules={[
                { min: 1, message: 'Please enter a positive value' },
                {
                  pattern: /^\d+$/,
                  message: 'Only Whole Numbers Are Allowed without decimal',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>

          <Grid xs={1} lg={2} colGap={20}>
            <Form.Item
              sm
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
              isSearchable
              label="Mortgage"
              name="mortgage"
              placeholder="Mortgage">
              <Select />
            </Form.Item>

            <Form.Item
              sm
              type="number"
              name="rent_on_mortgage"
              label="Monthly Rent/Mortgage (Optional)"
              placeholder="Monthly Rent/Mortgage"
              rules={[
                { min: 1, message: 'Please enter a positive value' },
                {
                  pattern: /^\d+$/,
                  message: 'Only Whole Numbers Are Allowed without decimal',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Loaders>
    </>
  );
}

export default FreeUserForm;
