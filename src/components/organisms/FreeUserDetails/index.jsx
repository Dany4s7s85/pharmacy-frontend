import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import { useMediaPredicate } from 'react-media-hook';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import freeUserService from 'services/freeUserService';
import Loaders from 'components/atoms/Loaders';
import NoData from 'components/atoms/NoData';
import DataTabs from 'components/molecules/DataTabs';
import { format } from 'date-fns';

import { convertToCurrencyFormat, getDateObject } from '../../../helpers/common';

function FreeUserDetail({ freeUserId, timeLeft }) {
  const { single_free_user_data, single_customer_loading } = freeUserService.GetSingleFreeUser(freeUserId);
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
  const getProvince = province => Object.keys(provinces).includes(province) && provinces[province];

  const data = [
    {
      label: 'Personal Information',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="First Name:"
              value={single_free_user_data.first_name ? single_free_user_data.first_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Middle Name:"
              value={single_free_user_data.middle_name ? single_free_user_data.middle_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Last Name:"
              value={single_free_user_data.last_name ? single_free_user_data.last_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Emboss Name:"
              value={single_free_user_data.emboss ? single_free_user_data.emboss : '---'}
              $unStyled
            />
            <InfoCard
              title="Email:"
              value={single_free_user_data.email ? single_free_user_data.email : '---'}
              $unStyled
            />
            <InfoCard
              title="Phone Number:"
              value={single_free_user_data.phone_number ? single_free_user_data.phone_number : '---'}
              $unStyled
            />
            <InfoCard
              title="DOB:"
              value={single_free_user_data.dob ? single_free_user_data.dob.split('T')[0] : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Social Insurance Number:"
              value={single_free_user_data.sin ? single_free_user_data.sin : '---'}
              $unStyled
            />
            <InfoCard
              title="Why do you want the card:"
              value={
                single_free_user_data.why_do_you_want_the_card ? single_free_user_data.why_do_you_want_the_card : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Purpose Of Loan:"
              value={
                single_free_user_data.why_do_you_want_the_card
                  ? single_free_user_data.why_do_you_want_the_card.toLowerCase() === 'want a rewards credit card'
                    ? '13'
                    : '12'
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="How did you hear about us:"
              value={
                single_free_user_data.how_did_you_hear_about_us
                  ? single_free_user_data.how_did_you_hear_about_us
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Status Update Date:"
              value={
                single_free_user_data.updated_at
                  ? format(getDateObject(single_free_user_data.updated_at), 'dd/MM/yyyy')
                  : '---'
              }
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Address Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Street Address:"
              value={single_free_user_data.street_address ? single_free_user_data.street_address : '---'}
              $unStyled
            />
            <InfoCard
              title="Suite Number:"
              value={single_free_user_data.suite_number ? single_free_user_data.suite_number : '---'}
              $unStyled
            />
            <InfoCard title="City:" value={single_free_user_data.city ? single_free_user_data.city : '---'} $unStyled />
            <InfoCard
              title="Province:"
              value={single_free_user_data.province ? getProvince(single_free_user_data.province) : '---'}
              $unStyled
            />
            <InfoCard
              title="Province abbreviation:"
              value={single_free_user_data.province ? single_free_user_data.province : '---'}
              $unStyled
            />
            <InfoCard
              title="Postal Code:"
              value={single_free_user_data.postal_code ? single_free_user_data.postal_code : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    single_free_user_data.authorized_user_check && {
      label: 'Authorized User Info',
      content: single_free_user_data.authorized_user_check ? (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Authorized First Name:"
              value={single_free_user_data?.authorized_first_name ? single_free_user_data.authorized_first_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Authorized Middle Name:"
              value={
                single_free_user_data.authorized_middle_name ? single_free_user_data.authorized_middle_name : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Authorized Last Name:"
              value={single_free_user_data.authorized_last_name ? single_free_user_data.authorized_last_name : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ) : (
        <NoData text="No Data" />
      ),
    },
    single_free_user_data.authorized_user_check &&
      !single_free_user_data.authorized_same_address && {
        label: 'Authorized User Address Info',
        content:
          single_free_user_data.authorized_user_check && !single_free_user_data.authorized_same_address ? (
            <DetailsCard gray css="margin-bottom: var(--gutter);">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Authorized Same Address:"
                  value={
                    single_free_user_data.authorized_same_address
                      ? single_free_user_data.authorized_same_address
                      : ' --- '
                  }
                  $unStyled
                />
                <InfoCard
                  title="Authorized Street Address:"
                  value={
                    single_free_user_data.authorized_street_address
                      ? single_free_user_data.authorized_street_address
                      : ' --- '
                  }
                  $unStyled
                />
                <InfoCard
                  title="Authorized Suite Number:"
                  value={
                    single_free_user_data.authorized_suite_number
                      ? single_free_user_data.authorized_suite_number
                      : ' --- '
                  }
                  $unStyled
                />
                <InfoCard
                  title="Authorized City:"
                  value={single_free_user_data.authorized_city ? single_free_user_data.authorized_city : ' --- '}
                  $unStyled
                />

                <InfoCard
                  title="Authorized Province:"
                  value={
                    single_free_user_data.authorized_province ? single_free_user_data.authorized_province : ' --- '
                  }
                  $unStyled
                />

                <InfoCard
                  title="Authorized Postal Code:"
                  value={
                    single_free_user_data.authorized_postal_code
                      ? single_free_user_data.authorized_postal_code
                      : ' --- '
                  }
                  $unStyled
                />

                <InfoCard
                  title="Authorized Email:"
                  value={single_free_user_data.authorized_email ? single_free_user_data.authorized_email : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Authorized Phone Number:"
                  value={single_free_user_data.authorized_phone ? single_free_user_data.authorized_phone : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Authorized User Check:"
                  value={single_free_user_data.authorized_city ? single_free_user_data.authorized_city : ' --- '}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ) : (
            <NoData text="No Data" />
          ),
      },
    {
      label: 'Interac Codes',
      content: single_free_user_data.interac_reference_number ? (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Interac Codes:"
              value={single_free_user_data.interac_reference_number.map(e => `${e}   ,`)}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ) : (
        <NoData text="No Data" />
      ),
    },
    single_free_user_data.employment_status === 'Employed' ||
    single_free_user_data.employment_status === 'Self-Employed'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: var(--gutter);">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={single_free_user_data.employment_status ? single_free_user_data.employment_status : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Industry:"
                  value={single_free_user_data.industry ? single_free_user_data.industry : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Job Description:"
                  value={single_free_user_data.job_description ? single_free_user_data.job_description : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Current Employer:"
                  value={single_free_user_data.current_employer ? single_free_user_data.current_employer : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Employment Year:"
                  value={single_free_user_data.employment_year ? single_free_user_data.employment_year : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Employment Month:"
                  value={single_free_user_data.employment_month ? single_free_user_data.employment_month : ' --- '}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ),
        }
      : single_free_user_data.employment_status === 'Student'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={single_free_user_data.employment_status ? single_free_user_data.employment_status : '-'}
                  $unStyled
                />
                <InfoCard
                  title="School Name"
                  value={single_free_user_data.school_name ? single_free_user_data.school_name : '-'}
                  $unStyled
                />
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
                  value={single_free_user_data.employment_status ? single_free_user_data.employment_status : '-'}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ),
        },
    {
      label: 'Bank Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Customer Number:"
              value={single_free_user_data.customer_number ? single_free_user_data.customer_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Card Number:"
              value={single_free_user_data.card_number ? single_free_user_data.card_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Wallet ID:"
              value={single_free_user_data.wallet_number ? single_free_user_data.wallet_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Security Number:"
              value={single_free_user_data.security_number ? single_free_user_data.security_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Security Id:"
              value={single_free_user_data.security_id ? single_free_user_data.security_id : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Application Id:"
              value={single_free_user_data.application_id ? single_free_user_data.application_id : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Applicant Id:"
              value={single_free_user_data.applicant_id ? single_free_user_data.applicant_id : ' --- '}
              $unStyled
            />

            <InfoCard
              title="Direct Payment ID:"
              value={single_free_user_data.directCreditId ? single_free_user_data.directCreditId : ' --- '}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Financial Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Credit Limit:"
              value={
                single_free_user_data.credit_limit
                  ? convertToCurrencyFormat(single_free_user_data.credit_limit)
                  : ' --- '
              }
              $unStyled
            />

            <InfoCard
              title="Annual Salary Before Tax:"
              value={single_free_user_data?.annual_salary_before_tax ?? 0}
              $unStyled
            />
            <InfoCard
              title="Other House Income:"
              value={convertToCurrencyFormat(single_free_user_data?.other_house_income ?? 0)}
              $unStyled
            />
            <InfoCard
              title="Mortgage:"
              value={single_free_user_data.mortgage ? single_free_user_data.mortgage : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Rent On Mortgage:"
              value={single_free_user_data.rent_on_mortgage ? single_free_user_data.rent_on_mortgage : ' --- '}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },

    {
      label: 'Other Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Application No:"
              value={single_free_user_data.application_no ? single_free_user_data.application_no : ' --- '}
              $unStyled
            />
            <InfoCard title="IP:" value={single_free_user_data.ip ? single_free_user_data.ip : ' --- '} $unStyled />
            <InfoCard
              title="Order Number:"
              value={single_free_user_data.order_number ? single_free_user_data.order_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Other Source:"
              value={single_free_user_data.other_source ? single_free_user_data.other_source : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Referral Code:"
              value={single_free_user_data.referral_code ? single_free_user_data.referral_code : ' --- '}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
  ];

  return (
    <>
      {timeLeft && (
        <span
          css={`
            text-align: right;
            margin-bottom: 10px;
            display: block;
            color: var(--danger);
          `}>
          Remaining Time : {timeLeft}
        </span>
      )}
      <Loaders loading={single_customer_loading}>
        <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />
      </Loaders>
    </>
  );
}

export default FreeUserDetail;
