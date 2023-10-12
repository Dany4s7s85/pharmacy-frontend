/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React, { useState, useMemo, useEffect, useContext } from 'react';
// import styled from 'styled-components/macro';
import { subYears, addYears } from 'date-fns';
import { AuthContext } from 'context/authContext';
import applicationService from 'services/applicationService';
import embossList from 'helpers/embossList';
import JD from 'helpers/jobDescription';
import Form, { useForm } from 'components/molecules/Form';
import Field from 'components/molecules/Field';
import Toast from 'components/molecules/Toast';
import { getDateObject } from 'helpers/common';
import Button from '../../atoms/Button';
import Grid from '../../atoms/Grid';
import SubTitle from '../../atoms/SubTitle';
import Select from '../../atoms/Select';
import Icon from '../../atoms/Icon';

function ApplicationForm({ application, onClose = () => {} }) {
  const [form] = useForm();
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState('');
  const [state, setState] = useState({});

  const [startDate, setStartDate] = useState(subYears(getDateObject(new Date()), 18));
  const [embossOptions, setEmbossOptions] = useState([]);
  const [showEmploymentFields, setShowEmploymentFields] = useState(false);
  const [showSchoolNameField, setShowSchoolNameField] = useState(false);

  const CardTypes = [
    { value: '1', label: 'Original Plastk Card' },
    { value: '2', label: 'Canucks Plastk Card', isDisabled: true },
  ];

  const Title = [
    { value: 'M', label: 'Mr.' },
    { value: 'F', label: 'Ms.' },
    { value: 'F', label: 'Mrs.' },
    { value: 'O', label: 'Other' },
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
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
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
  };
  let JobDes;
  if (industry) {
    JobDes = JD[industry].map(_id => ({ value: _id, label: _id }));
  }

  const employment_year = useMemo(() => Array.from(new Array(50), (_, i) => ({ value: i + 1, label: i + 1 })), []);
  const employment_month = useMemo(() => Array.from(new Array(11), (_, i) => ({ value: i + 1, label: i + 1 })), []);

  const onSubmit = async data => {
    try {
      setLoading(true);
      if (application) {
        delete data.affiliate_id;
        delete data.affiliate_name;
        delete data.affiliate_status;
        delete data.created_at;
        delete data.hutk;
        delete data.hutk_original_owner;
        delete data.ip;
        delete data.order_number;
        delete data.password_reset;
        delete data.sms_subscription;
        delete data.status;
        delete data.totp;
        // edit admin
        await applicationService.updateApplication(application.email, {
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
        });
      } else {
        await applicationService.createApplications({
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
          mortgage: data.mortgage ? data.mortgage.value : '',
        });
      }
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Application saved successfully',
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
  const getEmbossOptions = (first_name, middle_name, last_name) => {
    const options = embossList(first_name, middle_name, last_name);
    options.forEach((opt, index) => {
      options[index] = { value: opt, label: opt };
    });
    setEmbossOptions(() => options);
  };
  useEffect(() => {
    if (application) {
      if (application.employment_status === 'Employed' || application.employment_status === 'Self-Employed') {
        setIndustry(application.industry);
        setShowEmploymentFields(true);
      }
      if (application.employment_status === 'Student') setShowSchoolNameField(true);

      const timeSplit = application.dob.split('-');
      const year = timeSplit[0];
      const month = timeSplit[1];
      const day = timeSplit[2].split('T')[0];

      form.setFieldsValue({
        ...application,
        dob: `${year}-${month}-${day}`,
        card_type: { value: '1', label: 'Original Plastk Card' },
        emboss: { value: application.emboss, label: application.emboss },
        employment_status: { value: application.employment_status, label: application.employment_status },
        industry: { value: application.industry, label: application.industry },
        job_description: { value: application.job_description, label: application.job_description },
        employment_month: { value: application.employment_month, label: application.employment_month },
        employment_year: { value: application.employment_year, label: application.employment_year },
        school_name: application.school_name,
        how_did_you_hear_about_us: {
          value: application.how_did_you_hear_about_us,
          label: application.how_did_you_hear_about_us,
        },
        why_do_you_want_the_card: {
          value: application.why_do_you_want_the_card,
          label: application.why_do_you_want_the_card,
        },
        gender: {
          value: application.gender,
          label: application.gender === 'F' ? 'Ms' : application.gender === 'M' ? 'Mr' : 'Other',
        },
        province: { value: application.province, label: getProvince(application.province) },
        mortgage: { value: application.mortgage, label: application.mortgage },
      });
      getEmbossOptions(
        state.first_name ? state.first_name : application?.first_name,
        state.middle_name ? state.middle_name : application?.middle_name,
        state.last_name ? state.last_name : application?.last_name,
      );
    }
  }, []);
  useEffect(() => {
    if (!application) {
      getEmbossOptions(state?.first_name, state?.middle_name, state?.last_name);

      if (state.employment_status) {
        if (state.employment_status.value === 'Student') {
          setShowSchoolNameField(true);
        } else {
          setShowSchoolNameField(false);
        }
        if (state.employment_status.value === 'Employed' || state.employment_status.value === 'Self-Employed') {
          setShowEmploymentFields(true);
          if (state.industry) {
            setIndustry(state.industry.value);
          }
        } else {
          setShowEmploymentFields(false);
          setIndustry('');
        }
      }
      if (state.dob) {
        setStartDate(state.dob);
      }
    }
  }, [state]);

  return (
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
          name="card_type"
          rules={[{ required: true, message: 'Please Select your Card Type' }]}>
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
          rules={[{ required: true, message: 'Please Select your Gender' }]}>
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
            getEmbossOptions(state.first_name, state.middle_name, state.last_name);
          }}
          rules={[
            { required: true, message: 'Please Input your First Name' },
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
            getEmbossOptions(state.first_name, state.middle_name, state.last_name);
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
            getEmbossOptions(state.first_name, state.middle_name, state.last_name);
          }}
          rules={[
            { required: true, message: 'Please Input your Last Name' },
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
            message: 'Please select the name that should appear on your card',
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
            { required: true, message: 'Please Input your Email' },
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
              message: 'Please Complete your Phone Number',
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
              toolTipContent="An SIN is optional but can help us get your file quickly. "
              iconName="help_outline"
              tooltipWidth={250}
            />
          }
          label="Social insurance number"
          name="sin"
          placeholder="111-111-111"
          rules={[
            {
              pattern: /^\d{3}-\d{3}-\d{3}$/,
              message: 'Please Complete the Social Insurance Number',
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
        placeholder="How Did You Hear About Us?">
        <Select />
      </Form.Item>
      {form.getFieldValue('how_did_you_hear_about_us')?.value?.toLowerCase() === 'other' && (
        <Form.Item
          sm
          name="other_source"
          label="Other Source"
          rules={[
            {
              pattern: /^[a-zA-Z\s]*$/,
              message: 'Please enter alphabets only',
            },
            {
              pattern: /^[a-zA-Z\s]{2,}$/,
              message: 'Other Source must be minimum 2 characters.',
            },
            {
              pattern: /^[a-zA-Z\s]{2,40}$/,
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
        rules={[
          { required: true, message: 'Please Input your Street Address' },
          { pattern: /^.{0,100}$/, message: 'Maximum Character Length is 100' },
        ]}>
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
            { required: true, message: 'Please Input your City' },
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
            { required: true, message: 'Please Select your Province' },
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
          placeholder="A4A4A4"
          rules={[
            { required: true, message: 'Please Input your Postal Code' },
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
          } else if (e.target.value.value === 'Student') {
            setShowEmploymentFields(false);
            setShowSchoolNameField(true);
          } else {
            setShowEmploymentFields(false);
            setShowSchoolNameField(false);
          }
        }}
        rules={[{ required: true, message: 'Please Select your Employment Status' }]}>
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
              { required: true, message: 'Please Select your Industry' },
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
            rules={[
              { required: true, message: 'Please Select your Job Description' },
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
              { required: true, message: 'Please Input your Current Employer' },
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

          <Form.Item sm options={employment_year} isSearchable label="Years" name="employment_year" placeholder="Years">
            <Select />
          </Form.Item>

          <Form.Item
            sm
            options={employment_month}
            isSearchable
            label="Months"
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
              pattern: /^[a-zA-Z0-9./$!&()']{3,}$/,
              message: 'School Name must be minimum 3 characters.',
            },
            {
              pattern: /^[a-zA-Z0-9./$!&()']{3,80}$/,
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
            toolTipContent="Your requested credit limit is what you are required to submit as a security deposit to get a secured credit card"
            iconName="help_outline"
            tooltipWidth={300}
          />
        }
        label="Credit Limit"
        placeholder="Requested Credit Limit"
        rules={[
          {
            required: true,
            message: 'Please Input your Credit Limit',
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
              tooltipWidth={250}
            />
          }
          label="Annual Income Before Taxes"
          placeholder="Annual Income Before Taxes"
          rules={[
            {
              required: true,
              message: 'Please Input your Annual Income Before Taxes',
            },
            {
              pattern: /^\d+$/,
              message: 'Only Whole Numbers Are Allowed without decimal',
            },
            { pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' },
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
            { pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' },
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
          label="Do you have a Mortgage"
          placeholder="Monthly Rent/Mortgage"
          rules={[
            { min: 1, message: 'Please enter a positive value' },
            {
              pattern: /^\d+$/,
              message: 'Only Whole Numbers Are Allowed without decimal',
            },
            { pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' },
          ]}>
          <Field />
        </Form.Item>
      </Grid>

      <Form.Item
        sm
        type="text"
        name="referred_by"
        label="Referral Code"
        placeholder="Referral Code"
        rules={[{ pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' }]}>
        <Field />
      </Form.Item>

      <Button loading={loading} type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ApplicationForm;
