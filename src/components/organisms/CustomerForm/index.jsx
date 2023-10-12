/* eslint-disable no-param-reassign */
import React, { useState, useMemo, useEffect, useContext } from 'react';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import SubTitle from 'components/atoms/SubTitle';
import Select from 'components/atoms/Select';
import Icon from 'components/atoms/Icon';
import { subYears, addYears } from 'date-fns';
import userService from 'services/userService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { getDateObject } from 'helpers/common';
import embossList from '../../../helpers/embossList';
import { AuthContext } from '../../../context/authContext';
import JD from '../../../helpers/jobDescription';

function CustomerForm({ customer, onClose = () => {}, timeLeft }) {
  const [form] = useForm();
  const [startDate, setStartDate] = useState(subYears(getDateObject(new Date()), 18));
  const [embossOptions, setEmbossOptions] = useState([]);
  const [showEmploymentFields, setShowEmploymentFields] = useState(false);
  const [showSchoolNameField, setShowSchoolNameField] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const fetch = async () => {
    try {
      const res = await userService.getSingleUser(customer._id);
      if (res) {
        if (res?.success) {
          setSelectedCustomer(res.user);
        }
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const getEmbossOptions = (first_name, middle_name, last_name) => {
    const options = embossList(first_name, middle_name, last_name);
    options.forEach((opt, index) => {
      options[index] = { value: opt, label: opt };
    });
    setEmbossOptions(() => options);
  };
  const CardTypes = [
    { value: '1', label: 'Original Plastk Card' },
    { value: '2', label: 'Canucks Plastk Card', isDisabled: true },
  ];

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
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: ' Northwest Territories ' },
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

  const employment_year = useMemo(() => Array.from(new Array(50), (_, i) => ({ value: i + 1, label: i + 1 })), []);
  const employment_month = useMemo(() => Array.from(new Array(11), (_, i) => ({ value: i + 1, label: i + 1 })), []);

  let JobDes;
  if (industry)
    try {
      JobDes = JD[industry].map(_id => ({ value: _id, label: _id }));
    } catch (err) {
      JobDes = { value: jobDescription, label: jobDescription };
    }

  const provinces = {
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    SK: 'Saskatchewan',
    YT: 'Yukon',
  };

  const getProvince = province => {
    const keys = Object.keys(provinces);
    if (keys.includes(province)) {
      return provinces[province];
    }
    return '';
  };
  const onSubmit = async data => {
    try {
      setLoading(true);
      await userService.updateUser(selectedCustomer.email, {
        ...data,
        card_type: data.card_type.value,
        gender: data.gender.value,
        emboss: data.emboss.value,
        employment_status: data.employment_status.value,
        province: data.province.value,
        why_do_you_want_the_card: data.why_do_you_want_the_card.value,
        how_did_you_hear_about_us: data.how_did_you_hear_about_us ? data.how_did_you_hear_about_us.value : '',
        industry: data.industry ? data.industry.value : '',
        job_description: data.job_description ? data.job_description.value : '',
        school_name: data.school_name ? data.school_name : '',
        employment_month: data.employment_month ? data.employment_month.value : '',
        employment_year: data.employment_year ? data.employment_year.value : '',
        mortgage: data.mortgage.value,
        application_id: data.application_id,
      });

      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Customer updated successfully',
      });
    } catch (ex) {
      refetch();
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      if (selectedCustomer.employment_status === 'Employed' || selectedCustomer.employment_status === 'Self-Employed') {
        setIndustry(selectedCustomer.industry);
        setShowEmploymentFields(true);
      }
      if (selectedCustomer.employment_status === 'Student') setShowSchoolNameField(true);

      const timeSplit = selectedCustomer.dob.split('-');
      const year = timeSplit[0];
      const month = timeSplit[1];
      const day = timeSplit[2].split('T')[0];

      form.setFieldsValue({
        dob: `${year}-${month}-${day}`,
        card_type: { value: '1', label: 'Original Plastk Card' },
        emboss: { value: selectedCustomer.emboss, label: selectedCustomer.emboss },
        first_name: selectedCustomer.first_name ?? '',
        middle_name: selectedCustomer.middle_name ?? '',
        last_name: selectedCustomer.last_name ?? '',
        email: selectedCustomer.email ?? '',
        phone_number: selectedCustomer.phone_number ?? '',
        sin: selectedCustomer.sin ?? '',
        street_address: selectedCustomer.street_address ?? '',
        suit_number: selectedCustomer.suit_number ?? '',
        city: selectedCustomer.city ?? '',
        postal_code: selectedCustomer.postal_code ?? '',
        credit_limit: selectedCustomer.credit_limit ?? '',
        annual_salary_before_tax: selectedCustomer.annual_salary_before_tax ?? '',
        other_house_income: selectedCustomer.other_house_income ?? '',
        rent_on_mortgage: selectedCustomer.rent_on_mortgage ?? '',
        current_employer: selectedCustomer.current_employer ?? '',
        employment_status: { value: selectedCustomer.employment_status, label: selectedCustomer.employment_status },
        industry: { value: selectedCustomer.industry, label: selectedCustomer.industry },
        job_description: { value: selectedCustomer.job_description, label: selectedCustomer.job_description },
        employment_month: { value: selectedCustomer.employment_month, label: selectedCustomer.employment_month },
        employment_year: { value: selectedCustomer.employment_year, label: selectedCustomer.employment_year },
        school_name: selectedCustomer.school_name,
        application_id: selectedCustomer.application_id,
        how_did_you_hear_about_us: {
          value: selectedCustomer.how_did_you_hear_about_us,
          label: selectedCustomer.how_did_you_hear_about_us,
        },
        why_do_you_want_the_card: {
          value: selectedCustomer.why_do_you_want_the_card,
          label: selectedCustomer.why_do_you_want_the_card,
        },
        gender: {
          value: selectedCustomer.gender,
          label: selectedCustomer.gender === 'F' ? 'Ms' : selectedCustomer.gender === 'M' ? 'Mr' : 'Other',
        },
        province: { value: selectedCustomer.province, label: getProvince(selectedCustomer.province) },
        mortgage: { value: selectedCustomer.mortgage, label: selectedCustomer.mortgage },
        suite_number: selectedCustomer.suite_number ?? '',
      });
      getEmbossOptions(
        state.first_name ? state.first_name : selectedCustomer?.first_name,
        state.middle_name ? state.middle_name : selectedCustomer?.middle_name,
        state.last_name ? state.last_name : selectedCustomer?.last_name,
      );
    }
  }, [selectedCustomer]);

  return (
    <>
      {timeLeft && (
        <div
          css={`
            color: red;
            float: right;
          `}>
          Remaining Time : {timeLeft}
        </div>
      )}
      <Form
        form={form}
        onSubmit={onSubmit}
        onTouched={_ => {
          setState(__ => ({ ...__, ..._ }));
        }}>
        <SubTitle>Personal Information</SubTitle>
        <Grid xs={1} lg={2} colGap={20}>
          <Form.Item
            id="dropdown"
            options={CardTypes}
            isSearchable
            label="Card Type"
            placeholder="Card Type"
            name="card_type">
            <Select sm />
          </Form.Item>
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
              form.setFieldsValue({ emboss: '', first_name: e.target.value });
              getEmbossOptions(e.target.value, state.middle_name, state.last_name);
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
              form.setFieldsValue({ emboss: '', middle_name: e.target.value });
              getEmbossOptions(state.first_name, e.target.value, state.last_name);
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
              form.setFieldsValue({ emboss: '', last_name: e.target.value });
              getEmbossOptions(state.first_name, state.middle_name, e.target.value);
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
            selected={startDate}
            onChange={date => {
              form.setFieldsValue({ dob: date.target.value ? getDateObject(date.target.value) : '' });
              setStartDate(getDateObject(date.target.value));
            }}
            isClearable
            prefix={<i className="material-icons-outlined">date_range</i>}
            placeholderText="Select date range"
            excludeDateIntervals={[
              { start: subYears(getDateObject(new Date()), 18), end: addYears(getDateObject(new Date()), 1) },
            ]}
            type="datepicker"
            noMargin>
            <Field />
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
          <Form.Item
            sm
            type="text"
            labelIcon={<Icon size="1rem" showTooltip toolTipContent="DC Bank Application Id" iconName="help_outline" />}
            label="Application Id"
            name="application_id"
            placeholder="xxxxx"
            rules={[
              {
                pattern: /^\d{0,5}$/,
                message: 'Application Id can be maximum 5 digits',
              },
              {
                changeRegex: 'application_id',
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
          placeholder="How Did You Hear About Us?">
          <Select />
        </Form.Item>
        {form.getFieldValue('how_did_you_hear_about_us')?.value?.toLowerCase() === 'other' && (
          <Form.Item
            sm
            name="other"
            label="Other Source"
            rules={[
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
                pattern: /^[a-zA-Z\s]*$/,
                message: 'Please enter alphabets only',
              },
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
          isSearchable
          label="Employment Status"
          name="employment_status"
          placeholder="Employment Status"
          onChange={e => {
            form.setFieldsValue({ employment_status: e.target.value });
            if (e.target.value.value === 'Employed' || e.target.value.value === 'Self-Employed') {
              setShowEmploymentFields(true);
              setShowSchoolNameField(false);
            } else if (e.target.value.value === 'Student') {
              setShowEmploymentFields(false);
              setShowSchoolNameField(true);
            } else {
              setShowEmploymentFields(false);
              setShowSchoolNameField(false);
            }
          }}
          rules={[{ required: true, message: 'Employment Status is Required' }]}>
          <Select />
        </Form.Item>

        {showEmploymentFields ? (
          <>
            <Form.Item
              sm
              options={industries}
              isSearchable
              label="Industry"
              name="industry"
              placeholder="Industry"
              onChange={e => {
                form.setFieldsValue({ industry: e.target.value });
                setIndustry(e.target.value.value);
              }}
              rules={[
                { required: true, message: 'Industry is Required' },
                {
                  transform: value => !value.length,
                  message: 'Please select an industry',
                },
              ]}>
              <Select
                rules={[
                  { required: true, message: 'Industry is Required' },
                  {
                    transform: value => !value.length,
                    message: 'Please select an industry',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              sm
              options={JobDes}
              label="Job Description"
              name="job_description"
              placeholder="Job Description"
              onChange={e => {
                form.setFieldsValue({ job_description: e.target.value });
                setJobDescription(e.target.value.value);
              }}
              rules={[
                { required: true, message: 'Job Description is required' },
                {
                  transform: value => !value.length,
                  message: 'Please select Job Description',
                },
              ]}>
              <Select
                rules={[
                  { required: true, message: 'Job Description is required' },
                  {
                    transform: value => !value.length,
                    message: 'Please select Job Description',
                  },
                ]}
              />
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

        {showSchoolNameField ? (
          <Form.Item
            sm
            label="School Name"
            name="school_name"
            placeholder="Enter School Name"
            rules={[
              {
                pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{3,}$/,
                message: 'School Name must be minimum 3 characters.',
              },
              {
                pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{3,80}$/,
                message: 'School Name must be maximum 80 characters.',
              },
            ]}>
            <Field />
          </Form.Item>
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

        <Form.Item sm type="text" name="referred_by" label="Referral Code" placeholder="Referral Code">
          <Field />
        </Form.Item>

        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CustomerForm;
