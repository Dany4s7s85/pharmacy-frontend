/* eslint-disable consistent-return */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import { useMediaPredicate } from 'react-media-hook';
import { format } from 'date-fns';
import InfoCard from 'components/molecules/InfoCard';
import DetailsCard from 'components/molecules/DetailsCard';
import DataTabs from 'components/molecules/DataTabs';
import { getDateObject, convertToCurrencyFormat } from '../../../helpers/common';

function ApplicationModal({ _ }) {
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
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
  const data = [
    {
      label: 'Card Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={1} gap={20}>
            <InfoCard title="Card Title" value="Original Plastk Card " $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Affiliate ID',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={1} gap={20}>
            <InfoCard title="Affiliate ID" value={_.afaffiliate_id ? _.affiliate_id : '-'} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Personal Information',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard title="Gender:" value={_.gender ? _.gender : '-'} $unStyled />
            <InfoCard title="First Name:" value={_.first_name ? _.first_name : '-'} $unStyled />
            <InfoCard title="Middle Name:" value={_.middle_name ? _.middle_name : '-'} $unStyled />
            <InfoCard title="Last Name:" value={_.last_name ? _.last_name : '-'} $unStyled />
            <InfoCard title="Emboss Name:" value={_.emboss ? _.emboss : '-'} $unStyled />
            <InfoCard title="Email:" value={_.email ? _.email : '-'} $unStyled />
            <InfoCard
              title="Date Of Birth:"
              value={
                _?.dob
                  ? format(getDateObject(_?.dob), 'yyyy-MM-dd')
                  : _?.d_o_b
                  ? format(getDateObject(_?.d_o_b), 'yyyy-MM-dd')
                  : '-'
              }
              $unStyled
            />
            <InfoCard title="Phone Number:" value={_.phone_number ? _.phone_number : '-'} $unStyled />
            <InfoCard title="Social Insurance Number:" value={_.sin ? _.sin : '-'} $unStyled />
            <InfoCard
              title="Why do you want the card:"
              value={_.why_do_you_want_the_card ? _.why_do_you_want_the_card : '-'}
              $unStyled
            />
            <InfoCard
              title="How did you hear about us:"
              value={_.how_did_you_hear_about_us ? _.how_did_you_hear_about_us : '-'}
              $unStyled
            />
            {_.how_did_you_hear_about_us.toLowerCase() === 'other' && (
              <InfoCard title="Other Source:" value={_.other_source ? _.other_source : '-'} $unStyled />
            )}
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Address Info',
      content: (
        <DetailsCard gray css="margin-bottom: 0;">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard title="Street Address:" value={_.street_address ? _.street_address : '-'} $unStyled />
            <InfoCard title="Suite Number:" value={_.suite_number ? _.suite_number : '-'} $unStyled />
            <InfoCard title="City:" value={_.city ? _.city : '-'} $unStyled />
            <InfoCard title="Province:" value={_.province ? getProvince(_.province) : '-'} $unStyled />
            <InfoCard title="Postal Code:" value={_.postal_code ? _.postal_code : '-'} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    _.employment_status === 'Employed' || _.employment_status === 'Self-Employed'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={_.employment_status ? _.employment_status : '-'}
                  $unStyled
                />
                <InfoCard title="Industry:" value={_.industry ? _.industry : '-'} $unStyled />
                <InfoCard title="Job Description:" value={_.job_description ? _.job_description : '-'} $unStyled />
                <InfoCard title="Current Employer:" value={_.current_employer ? _.current_employer : '-'} $unStyled />
                <InfoCard title="Employment Year:" value={_.employment_year ? _.employment_year : '-'} $unStyled />
                <InfoCard title="Employment Month:" value={_.employment_month ? _.employment_month : '-'} $unStyled />
              </Grid>
            </DetailsCard>
          ),
        }
      : _.employment_status === 'Student'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={_.employment_status ? _.employment_status : '-'}
                  $unStyled
                />
                <InfoCard title="School Name" value={_.school_name ? _.school_name : '-'} $unStyled />
              </Grid>
            </DetailsCard>
          ),
        }
      : {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={_.employment_status ? _.employment_status : '-'}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ),
        },
    {
      label: 'Financial Info',
      content: (
        <DetailsCard gray css="margin-bottom: 0;">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Credit Limit:"
              value={_.credit_limit ? convertToCurrencyFormat(_.credit_limit) : '-'}
              $unStyled
            />
            <InfoCard
              title="Annual Salary Before Tax:"
              value={convertToCurrencyFormat(_?.annual_salary_before_tax ?? 0)}
              $unStyled
            />
            <InfoCard
              title="Other House Income:"
              value={convertToCurrencyFormat(_?.other_house_income ?? 0)}
              $unStyled
            />
            <InfoCard title="Mortgage:" value={_.mortgage ? _.mortgage : '-'} $unStyled />
            <InfoCard
              title="Rent On Mortgage:"
              value={_.rent_on_mortgage ? convertToCurrencyFormat(_.rent_on_mortgage) : '-'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    _.status === 'Application Received'
      ? {
          label: 'Other Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard title="Order Number:" value={_.order_number ? _.order_number : '-'} $unStyled />
                <InfoCard title="Referral Code:" value={_.referral_code ? _.referral_code : '-'} $unStyled />
                <InfoCard title="IP:" value={_.ip ? _.ip : '-'} $unStyled />
              </Grid>
            </DetailsCard>
          ),
        }
      : {
          label: 'Other Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard title="Order Number:" value={_.order_number ? _.order_number : '-'} $unStyled />
                <InfoCard title="Referral Code:" value={_.referral_code ? _.referral_code : '-'} $unStyled />
                <InfoCard title="IP:" value={_.ip ? _.ip : '-'} $unStyled />
                <InfoCard
                  title="Application Creation Date:"
                  value={_.created_at ? format(getDateObject(_.created_at), 'yyyy-MM-dd') : '-'}
                  $unStyled
                />
                <InfoCard
                  title="Application Cancellation Date:"
                  value={_.updated_at ? format(getDateObject(_.updated_at), 'yyyy-MM-dd') : '-'}
                  $unStyled
                />
                <InfoCard title="Cancellation Reason:" value={_.reason ? _.reason : '-'} $unStyled />
              </Grid>
            </DetailsCard>
          ),
        },
  ];
  return <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />;
}

export default ApplicationModal;
