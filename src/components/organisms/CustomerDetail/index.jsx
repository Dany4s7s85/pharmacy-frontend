import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import { useMediaPredicate } from 'react-media-hook';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import userService from 'services/userService';
import Loaders from 'components/atoms/Loaders';
import Button from 'components/atoms/Button';
import RequestedCreditLimit from 'pages/requested-credit-limit';
import Payments from 'pages/payments';
import AccountCredit from 'pages/account-credit';
import UserTransactions from 'pages/user-transactions';
import { format, differenceInSeconds, addMinutes } from 'date-fns';
import { convertToCurrencyFormat, setAccountPortalCookies, getDateObject } from 'helpers/common';
import DataTabs from 'components/molecules/DataTabs';
import ModalContainer from 'components/molecules/ModalContainer';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import transactionService from 'services/transactionService';
import Table from 'components/molecules/Table';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import UserCards from '../UserCards';
import SuspentionHistory from '../SuspentionHistory';
import PointsToCashForm from '../PointsToCashForm';
import ReplacementCard from './card-replacement';
import GetUserAdditionalDocs from '../GetUserAdditionalDocs';
import AdminLoginHistory from '../AdminLoginHistory';

function CustomerDetail({ customerId, customerEmail, timeLeft }) {
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const { fetch, hasPermission, refetch } = useContext(AuthContext);
  const [state, setState] = useState([]);
  const [total, setTotal] = useState(0);
  const [timeLeftAcc, setTimeLeftAcc] = useState('');
  const [pushToCancellationDisp, setPushToCancellationDisp] = useState(false);
  const [pushedToCancellationDisp, setPushedToCancellationDisp] = useState(false);

  const { single_customer_data, single_customer_loading } = userService.GetSingleCustomer(customerId);
  const { equifax_open_date, equifax_details, equifax_last_payment } = userService.GetEquifaxOpenDate(customerId);
  const { single_statement_data } = userService.GetSingleStatement(customerId);
  const { cancellationDetailsData } = userService.GetCancellationDetails(customerId, fetch);
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
  useEffect(() => {
    if (cancellationDetailsData && single_customer_data) {
      if (
        !cancellationDetailsData.pushed_to_cancellation &&
        single_customer_data.status.search(/Suspended/i) === 0 &&
        new Date(cancellationDetailsData.refund_date) > new Date()
      ) {
        setPushToCancellationDisp(true);
      } else {
        setPushToCancellationDisp(false);
      }
      if (
        cancellationDetailsData.pushed_to_cancellation ||
        (new Date(cancellationDetailsData.refund_date) <= new Date() &&
          single_customer_data.status.search(/Suspended/i) === 0)
      ) {
        setPushedToCancellationDisp(true);
      } else {
        setPushedToCancellationDisp(false);
      }
    }
  }, [single_customer_data, cancellationDetailsData]);
  useEffect(async () => {
    let sum = 0;
    try {
      await transactionService.searchInteracTransactionAdmin(customerEmail).then(res => {
        setState(res?.transaction);
        res?.transaction?.map(_ => {
          sum += Number(_?.Amount);
          setTotal(sum);
          return sum;
        });
      });
    } catch (error) {
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeDiff = differenceInSeconds(
        getDateObject(getDateObject(new Date())),
        getDateObject(addMinutes(new Date(), 30)),
      );
      const _time = 15 * 60 - timeDiff;
      if (_time <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeftAcc(`${Math.floor(_time / 60)}:${_time % 60 < 10 ? `0${_time % 60}` : _time % 60}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pushCustomerToCancellation = async userId => {
    try {
      await userService.pushCustomerToCancellation(userId).then(res => {
        if (res.success) {
          refetch();
          Toast({
            type: 'success',
            message: res?.message,
          });
        } else {
          Toast({
            type: 'error',
            message: res?.message,
          });
        }
      });
    } catch (error) {
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  };

  const getAccountClosureDetails = async () => {
    try {
      await userService.getAccountClosureDetails({ user: single_customer_data._id }).then(res => {
        if (res?.success) {
          refetch();
          Toast({
            type: 'success',
            message: res?.message,
          });
        } else {
          Toast({
            type: 'error',
            message: res?.message,
          });
        }
      });
    } catch (error) {
      Toast({
        type: 'error',
        message: error?.message,
      });
    }
  };

  const data = [
    {
      label: 'Status',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={2} gap={20}>
            <InfoCard title="Current Status:" value={single_customer_data.status} $unStyled />
            {single_customer_data.card_type && (
              <InfoCard
                title="Card Type"
                value={single_customer_data.card_type === '2' ? 'Canucks Plastk Card' : 'Original Plastk Card '}
                $unStyled
              />
            )}
            <InfoCard
              title="Created At:"
              value={
                single_customer_data?.created_at &&
                format(getDateObject(single_customer_data?.created_at), 'dd/MM/yyyy')
              }
              $unStyled
            />
            <InfoCard
              title="Last Update:"
              value={
                single_customer_data?.updated_at &&
                format(getDateObject(single_customer_data?.updated_at), 'dd/MM/yyyy')
              }
              $unStyled
            />
            {single_customer_data?.became_a_customer_date && (
              <InfoCard
                title="Became a Customer Date:"
                value={format(getDateObject(single_customer_data?.became_a_customer_date), 'dd/MM/yyyy')}
                $unStyled
              />
            )}
            {single_customer_data?.status_change_date && (
              <InfoCard
                title="Status Change Date:"
                value={format(getDateObject(single_customer_data?.status_change_date), 'dd/MM/yyyy')}
                $unStyled
              />
            )}
            {single_customer_data?.hubspotupdated && (
              <InfoCard
                title="HubSpot Updated Date:"
                value={format(getDateObject(single_customer_data?.hubspotupdated), 'dd/MM/yyyy')}
                $unStyled
              />
            )}
            {single_customer_data?.equifax_status === 'Verified' && single_customer_data?.equifax_check_date && (
              <InfoCard
                title="Equifax Verification Date:"
                value={format(getDateObject(single_customer_data?.equifax_check_date), 'dd/MM/yyyy')}
                $unStyled
              />
            )}
            {single_customer_data?.kyc_status === 'approved' &&
              single_customer_data?.kyc &&
              single_customer_data?.equifax_check_date && (
                <InfoCard
                  title="KYC Verification Date:"
                  value={format(getDateObject(single_customer_data?.equifax_check_date), 'dd/MM/yyyy')}
                  $unStyled
                />
              )}

            {single_customer_data?.status?.match('Suspended') && single_customer_data?.suspend?.created_at && (
              <InfoCard
                title="Suspended Date:"
                value={format(getDateObject(single_customer_data?.suspend?.created_at), 'dd/MM/yyyy')}
                $unStyled
              />
            )}
          </Grid>
        </DetailsCard>
      ),
    },
    single_customer_data.affiliate_id && {
      label: 'Affiliate ID',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} gap={20}>
            <InfoCard
              title="Affiliate ID:"
              value={single_customer_data.affiliate_id ? single_customer_data.affiliate_id : ' --- '}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    {
      label: 'Personal Information',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="First Name:"
              value={single_customer_data.first_name ? single_customer_data.first_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Middle Name:"
              value={single_customer_data.middle_name ? single_customer_data.middle_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Last Name:"
              value={single_customer_data.last_name ? single_customer_data.last_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Emboss Name:"
              value={single_customer_data.emboss ? single_customer_data.emboss : '---'}
              $unStyled
            />
            <InfoCard
              title="Email:"
              value={single_customer_data.email ? single_customer_data.email : '---'}
              $unStyled
            />
            <InfoCard
              title="Phone Number:"
              value={single_customer_data.phone_number ? single_customer_data.phone_number : '---'}
              $unStyled
            />
            <InfoCard
              title="DOB:"
              value={single_customer_data.dob ? single_customer_data.dob.split('T')[0] : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Social Insurance Number:"
              value={single_customer_data.sin ? single_customer_data.sin : '---'}
              $unStyled
            />
            <InfoCard
              title="Why do you want the card:"
              value={
                single_customer_data.why_do_you_want_the_card ? single_customer_data.why_do_you_want_the_card : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Purpose Of Loan:"
              value={
                single_customer_data.why_do_you_want_the_card
                  ? single_customer_data.why_do_you_want_the_card.toLowerCase() === 'want a rewards credit card'
                    ? '13'
                    : '12'
                  : '---'
              }
              $unStyled
            />
            <InfoCard
              title="How did you hear about us:"
              value={
                single_customer_data.how_did_you_hear_about_us ? single_customer_data.how_did_you_hear_about_us : '---'
              }
              $unStyled
            />
            <InfoCard
              title="Status Update Date:"
              value={
                single_customer_data.updated_at
                  ? format(getDateObject(single_customer_data.updated_at), 'dd/MM/yyyy')
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
              value={single_customer_data.street_address ? single_customer_data.street_address : '---'}
              $unStyled
            />
            <InfoCard
              title="Suite Number:"
              value={single_customer_data.suite_number ? single_customer_data.suite_number : '---'}
              $unStyled
            />
            <InfoCard title="City:" value={single_customer_data.city ? single_customer_data.city : '---'} $unStyled />
            <InfoCard
              title="Province:"
              value={single_customer_data.province ? getProvince(single_customer_data.province) : '---'}
              $unStyled
            />
            <InfoCard
              title="Province abbreviation:"
              value={single_customer_data.province ? single_customer_data.province : '---'}
              $unStyled
            />
            <InfoCard
              title="Postal Code:"
              value={single_customer_data.postal_code ? single_customer_data.postal_code : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    single_customer_data.authorized_user_check && {
      label: 'Authorized User Info',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Authorized First Name:"
              value={single_customer_data.authorized_first_name ? single_customer_data.authorized_first_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Authorized Middle Name:"
              value={single_customer_data.authorized_middle_name ? single_customer_data.authorized_middle_name : '---'}
              $unStyled
            />
            <InfoCard
              title="Authorized Last Name:"
              value={single_customer_data.authorized_last_name ? single_customer_data.authorized_last_name : '---'}
              $unStyled
            />
          </Grid>
        </DetailsCard>
      ),
    },
    single_customer_data.authorized_user_check &&
      !single_customer_data.authorized_same_address && {
        label: 'Authorized User Address Info',
        content: (
          <DetailsCard gray css="margin-bottom: var(--gutter);">
            <Grid xs={1} sm={3} gap={20}>
              <InfoCard
                title="Authorized Same Address:"
                value={
                  single_customer_data.authorized_same_address ? single_customer_data.authorized_same_address : ' --- '
                }
                $unStyled
              />
              <InfoCard
                title="Authorized Street Address:"
                value={
                  single_customer_data.authorized_street_address
                    ? single_customer_data.authorized_street_address
                    : ' --- '
                }
                $unStyled
              />
              <InfoCard
                title="Authorized Suite Number:"
                value={
                  single_customer_data.authorized_suite_number ? single_customer_data.authorized_suite_number : ' --- '
                }
                $unStyled
              />
              <InfoCard
                title="Authorized City:"
                value={single_customer_data.authorized_city ? single_customer_data.authorized_city : ' --- '}
                $unStyled
              />

              <InfoCard
                title="Authorized Province:"
                value={single_customer_data.authorized_province ? single_customer_data.authorized_province : ' --- '}
                $unStyled
              />

              <InfoCard
                title="Authorized Postal Code:"
                value={
                  single_customer_data.authorized_postal_code ? single_customer_data.authorized_postal_code : ' --- '
                }
                $unStyled
              />

              <InfoCard
                title="Authorized Email:"
                value={single_customer_data.authorized_email ? single_customer_data.authorized_email : ' --- '}
                $unStyled
              />
              <InfoCard
                title="Authorized Phone Number:"
                value={single_customer_data.authorized_phone ? single_customer_data.authorized_phone : ' --- '}
                $unStyled
              />
              <InfoCard
                title="Authorized User Check:"
                value={single_customer_data.authorized_city ? single_customer_data.authorized_city : ' --- '}
                $unStyled
              />
            </Grid>
          </DetailsCard>
        ),
      },
    state?.length > 0 && {
      label: 'Interac Codes',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={1} gap={20}>
            <InfoCard
              title="Security Funds Ref Numbers"
              value={
                <Table
                  width={100}
                  rowsData={state?.map(_ => [_?.ReferenceNumber, convertToCurrencyFormat(_?.Amount ?? 0)])}
                  columnNames={['Reference Number', 'Amount']}
                  noPadding
                />
              }
              $unStyled
            />
            <InfoCard title="Total Amount" value={convertToCurrencyFormat(total ?? 0)} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    single_customer_data.employment_status === 'Employed' || single_customer_data.employment_status === 'Self-Employed'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: var(--gutter);">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={single_customer_data.employment_status ? single_customer_data.employment_status : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Industry:"
                  value={single_customer_data.industry ? single_customer_data.industry : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Job Description:"
                  value={single_customer_data.job_description ? single_customer_data.job_description : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Current Employer:"
                  value={single_customer_data.current_employer ? single_customer_data.current_employer : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Employment Year:"
                  value={single_customer_data.employment_year ? single_customer_data.employment_year : ' --- '}
                  $unStyled
                />
                <InfoCard
                  title="Employment Month:"
                  value={single_customer_data.employment_month ? single_customer_data.employment_month : ' --- '}
                  $unStyled
                />
              </Grid>
            </DetailsCard>
          ),
        }
      : single_customer_data.employment_status === 'Student'
      ? {
          label: 'Employment Info',
          content: (
            <DetailsCard gray css="margin-bottom: 0;">
              <Grid xs={1} sm={3} gap={20}>
                <InfoCard
                  title="Employment Status:"
                  value={single_customer_data.employment_status ? single_customer_data.employment_status : '-'}
                  $unStyled
                />
                <InfoCard
                  title="School Name"
                  value={single_customer_data.school_name ? single_customer_data.school_name : '-'}
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
                  value={single_customer_data.employment_status ? single_customer_data.employment_status : '-'}
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
              value={single_customer_data.customer_number ? single_customer_data.customer_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Card Number:"
              value={single_customer_data.card_number ? single_customer_data.card_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Wallet ID:"
              value={single_customer_data.wallet_number ? single_customer_data.wallet_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Security Number:"
              value={single_customer_data.security_number ? single_customer_data.security_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Security Id:"
              value={single_customer_data.security_id ? single_customer_data.security_id : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Application Id:"
              value={single_customer_data.application_id ? single_customer_data.application_id : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Applicant Id:"
              value={single_customer_data.applicant_id ? single_customer_data.applicant_id : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Equifax Status:"
              value={single_customer_data.equifax_status ? single_customer_data.equifax_status : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Application Date:"
              value={single_customer_data.created_at ? single_customer_data.created_at.split('T')[0] : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Confirmation Date:"
              value={
                single_customer_data.funds_created_at ? single_customer_data.funds_created_at.split('T')[0] : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Direct Payment ID:"
              value={single_customer_data.directCreditId ? single_customer_data.directCreditId : ' --- '}
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
              value={convertToCurrencyFormat(single_customer_data.credit_limit)}
              $unStyled
            />
            <InfoCard
              title="Available Credit:"
              value={convertToCurrencyFormat(
                (single_customer_data.AvailableCreditLimit ?? 0) - (single_customer_data?.CardBalance ?? 0),
              )}
              $unStyled
            />
            {single_customer_data?.CardBalance && single_customer_data?.CardBalance < 0 ? (
              <>
                <InfoCard title="Credit Balance:" value="0.00" $unStyled />
                <InfoCard
                  title="Overfunded Amount:"
                  value={convertToCurrencyFormat(single_customer_data.CardBalance)}
                  $unStyled
                />
              </>
            ) : (
              <InfoCard
                title="Credit Balance:"
                value={convertToCurrencyFormat(single_customer_data.CardBalance)}
                $unStyled
              />
            )}
            <InfoCard
              title="Annual Salary Before Tax:"
              value={convertToCurrencyFormat(single_customer_data?.annual_salary_before_tax ?? 0)}
              $unStyled
            />
            <InfoCard
              title="Other House Income:"
              value={convertToCurrencyFormat(single_customer_data?.other_house_income ?? 0)}
              $unStyled
            />
            <InfoCard title="Mortgage:" value={single_customer_data.mortgage ?? 'No'} $unStyled />
            <InfoCard
              title="Rent On Mortgage:"
              value={convertToCurrencyFormat(single_customer_data.rent_on_mortgage)}
              $unStyled
            />
            <InfoCard title="Date Opened(Equifax):" value={equifax_open_date || ' --- '} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    equifax_details && {
      label: 'Equifax Report',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="High Credit:"
              value={equifax_details.high_credit ? equifax_details.high_credit : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Actual Payment Amount:"
              value={
                equifax_details.actual_payment_amount
                  ? convertToCurrencyFormat(equifax_details.actual_payment_amount)
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Account Status:"
              value={equifax_details.account_status ? equifax_details.account_status : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Amount Past Due:"
              value={equifax_details.amount_pas_due ? convertToCurrencyFormat(equifax_details.amount_pas_due) : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Statement Month:"
              value={equifax_details['statement month'] ? equifax_details['statement month'] : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Current Balance:"
              value={
                equifax_details.current_balance ? convertToCurrencyFormat(equifax_details.current_balance) : ' --- '
              }
              $unStyled
            />

            <InfoCard
              title="Date of first delinquency:"
              value={equifax_details.date_of_first_delinquency ? equifax_details.date_of_first_delinquency : ' --- '}
              $unStyled
            />
            <InfoCard title="Last Payment Date:" value={equifax_last_payment || ' --- '} $unStyled />
            <InfoCard title="Date Opened(Equifax):" value={equifax_open_date || ' --- '} $unStyled />
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
              value={single_customer_data.application_no ? single_customer_data.application_no : ' --- '}
              $unStyled
            />
            <InfoCard title="IP:" value={single_customer_data.ip ? single_customer_data.ip : ' --- '} $unStyled />
            <InfoCard
              title="Order Number:"
              value={single_customer_data.order_number ? single_customer_data.order_number : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Other Source:"
              value={single_customer_data.other_source ? single_customer_data.other_source : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Referral Code:"
              value={single_customer_data.referral_code ? single_customer_data.referral_code : ' --- '}
              $unStyled
            />
            <InfoCard title="Is Free User:" value={single_customer_data.is_free_user ? 'Yes' : ' No '} $unStyled />
          </Grid>
        </DetailsCard>
      ),
    },
    single_statement_data.length > 0 && {
      label: 'Statement',
      content: single_statement_data.map((item, index) => (
        <DetailsCard gray css="margin-bottom: var(--gutter);" key={index}>
          <Grid xs={1} ssm={3} gap={20}>
            <InfoCard title="Payment Amount:" value={convertToCurrencyFormat(item.paymentAmount)} $unStyled />
            <InfoCard title="Purchase Amount:" value={convertToCurrencyFormat(item.purchaseAmount)} $unStyled />
            <InfoCard title="Total Interest:" value={convertToCurrencyFormat(item.TotalInterest)} $unStyled />
            <InfoCard title="Available Balance:" value={convertToCurrencyFormat(item.availableBalance)} $unStyled />
            <InfoCard title="Balance Owing:" value={convertToCurrencyFormat(item.BalanceOwing)} $unStyled />
            <InfoCard title="Statement Begin Date:" value={item.statementBeginDate.slice(0, 10)} $unStyled />
            <InfoCard title="Statement End Date:" value={item.statementEndDate.slice(0, 10)} $unStyled />
          </Grid>
        </DetailsCard>
      )),
    },
    cancellationDetailsData && {
      label: 'Account Closure Details',
      content: (
        <DetailsCard gray css="margin-bottom: var(--gutter);">
          <Grid xs={1} sm={3} gap={20}>
            <InfoCard
              title="Became a customer:"
              value={
                single_customer_data.became_a_customer_date
                  ? single_customer_data.became_a_customer_date.split('T')[0]
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Suspended On:"
              value={
                cancellationDetailsData.suspended_on ? cancellationDetailsData.suspended_on.split('T')[0] : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Closure Date:"
              value={cancellationDetailsData.refund_date ? cancellationDetailsData.refund_date.split('T')[0] : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Status:"
              value={cancellationDetailsData.status ? cancellationDetailsData.status : ' --- '}
              $unStyled
            />
            <InfoCard
              title="Years Elapsed:"
              value={cancellationDetailsData.years_elapsed ? cancellationDetailsData.years_elapsed : ' --- '}
              $unStyled
            />
            <InfoCard
              title="# of Annual Fees charged:"
              value={
                cancellationDetailsData.annual_fee_charged.length > 0
                  ? cancellationDetailsData.annual_fee_charged.length
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Months Elapsed:"
              value={cancellationDetailsData.months_elapsed ? cancellationDetailsData.months_elapsed : ' --- '}
              $unStyled
            />
            <InfoCard
              title="# of Monthly Fees charged:"
              value={
                cancellationDetailsData.monthly_fee_charged.length > 0
                  ? cancellationDetailsData.monthly_fee_charged.length
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Funds Sent:"
              value={
                cancellationDetailsData.funds_sent
                  ? convertToCurrencyFormat(cancellationDetailsData.funds_sent)
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Deductions:"
              value={
                cancellationDetailsData.deductions >= 0
                  ? convertToCurrencyFormat(cancellationDetailsData.deductions)
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="E-transfer charges:"
              value={
                cancellationDetailsData.etransfer_charges
                  ? convertToCurrencyFormat(cancellationDetailsData.etransfer_charges)
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard
              title="Total deductions:"
              value={
                cancellationDetailsData.etransfer_charges >= 0 && cancellationDetailsData.deductions >= 0
                  ? convertToCurrencyFormat(
                      Number(cancellationDetailsData.etransfer_charges) + Number(cancellationDetailsData.deductions),
                    )
                  : ' --- '
              }
              $unStyled
            />
            <InfoCard title="" value=" " $unStyled />
            <InfoCard title="" value=" " $unStyled />
            <InfoCard
              style={{ borderStyle: 'solid', padding: '1rem' }}
              title="Final Refund Amount:"
              value={
                cancellationDetailsData.refund_amount
                  ? convertToCurrencyFormat(cancellationDetailsData.refund_amount)
                  : ' --- '
              }
              $unStyled
            />
          </Grid>
          {pushToCancellationDisp && (
            <ConfirmationModal
              title="Are you sure you want to approve this cancellation request?"
              onOk={() => pushCustomerToCancellation(cancellationDetailsData.user)}
              confirmationModal="Yes"
              btnComponent={({ onClick }) => (
                <Button css="margin-top: 2rem;" onClick={onClick} type="primary">
                  Push to cancellation
                </Button>
              )}
            />
          )}
          {pushedToCancellationDisp && (
            <p css="color:red; margin-top: 2rem;">
              This customer has been pushed to cancellation process. Please check &quot;Account Closure&quot; page for
              further details
            </p>
          )}
          {/* {cancellationDetailsData.status === 'Pending' && (
            <Grid style={{ marginTop: '2rem' }} xs={1} sm={2} gap={20}>
              <ModalContainer
                title="Edit Cancellation Details"
                btnComponent={({ onClick }) => (
                  <Button xs type="outline" onClick={onClick}>
                    Edit
                  </Button>
                )}
                content={({ onClose }) => editCancellationDetailsForm(onClose)}
              />
              <ModalContainer
                title="QFT Customer"
                btnComponent={({ onClick }) => (
                  <Button xs type="outline" onClick={onClick}>
                    QFT Customer
                  </Button>
                )}
                content={({ onClose }) => qftCustomerForm(onClose)}
              />
              <ConfirmationModal
                title="Are you sure you want to approve this cancellation request?"
                onOk={() => approveRejectCancellationRequest(cancellationDetailsData, 'approve')}
                confirmationModal="Yes"
                btnComponent={({ onClick }) => (
                  <Button onClick={onClick} iconMobile type="primary">
                    Approve
                  </Button>
                )}
              />
              <ConfirmationModal
                title="Are you sure you want to decline this cancellation request?"
                onOk={() => approveRejectCancellationRequest(cancellationDetailsData, 'decline')}
                confirmationModal="Yes"
                btnComponent={({ onClick }) => (
                  <Button onClick={onClick} iconMobile type="danger">
                    Decline
                  </Button>
                )}
              />
            </Grid>
          )} */}
        </DetailsCard>
      ),
    },
  ];

  const getAccountAccess = () => {
    userService
      .getAccountAccess(customerId, timeLeftAcc)
      .then(res => {
        setAccountPortalCookies(res);
      })
      .catch(ex => {
        Toast({
          type: 'error',
          message: ex.message,
        });
      });
  };

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
        <Grid xs={1} sm={2} md={3} lg={4} gap={20} css="margin-bottom: 30px;">
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button
                xs
                type="white"
                prefix={<i className="material-icons-outlined">request_quote</i>}
                onClick={onClick}>
                Credit Limit Requests
              </Button>
            )}
            content={() => <RequestedCreditLimit customerId={customerId} />}
          />
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button xs type="white" prefix={<i className="material-icons-outlined">repeat</i>} onClick={onClick}>
                User Transactions
              </Button>
            )}
            content={() => <UserTransactions customerId={customerId} />}
          />
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button xs type="white" prefix={<i className="material-icons-outlined">payments</i>} onClick={onClick}>
                Payments
              </Button>
            )}
            content={() => <Payments customerId={customerId} />}
          />
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button xs type="white" prefix={<i className="material-icons-outlined">credit_card</i>} onClick={onClick}>
                Cards
              </Button>
            )}
            content={() => <UserCards customerId={customerId} />}
          />
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button xs type="white" prefix={<i className="material-icons-outlined">person_off</i>} onClick={onClick}>
                Suspension History
              </Button>
            )}
            content={() => <SuspentionHistory customerId={customerId} />}
          />
          <ModalContainer
            width={1100}
            btnComponent={({ onClick }) => (
              <Button xs type="white" prefix={<i className="material-icons-outlined">history</i>} onClick={onClick}>
                Account Credit History
              </Button>
            )}
            content={() => <AccountCredit customerId={customerId} />}
          />
          {single_customer_data.status === 'Active' && (
            <ModalContainer
              title="Redeem Your Points"
              btnComponent={({ onClick }) => (
                <Button
                  xs
                  type="white"
                  prefix={<i className="material-icons-outlined">currency_exchange</i>}
                  onClick={onClick}>
                  Points To Cash
                </Button>
              )}
              content={({ onClose }) => <PointsToCashForm customer={single_customer_data} onClose={onClose} />}
            />
          )}
          {(single_customer_data.status === 'Active' || single_customer_data.status === 'Activate Your Card') && (
            <>
              <ModalContainer
                width={800}
                btnComponent={({ onClick }) => (
                  <Button xs type="white" prefix={<i className="material-icons-outlined">replace</i>} onClick={onClick}>
                    Replace Card
                  </Button>
                )}
                content={() => <ReplacementCard customer={single_customer_data} />}
              />
              <ModalContainer
                width={800}
                btnComponent={({ onClick }) => (
                  <Button
                    xs
                    type="white"
                    prefix={<i className="material-icons-outlined">description</i>}
                    onClick={onClick}>
                    Additional Documents
                  </Button>
                )}
                content={() => <GetUserAdditionalDocs customerId={customerId} />}
              />
            </>
          )}
          {hasPermission('account-portal.view-admin-login-sessions') && (
            <ModalContainer
              width={1100}
              btnComponent={({ onClick }) => (
                <Button xs type="white" prefix={<i className="material-icons-outlined">history</i>} onClick={onClick}>
                  View Admin Login History
                </Button>
              )}
              content={() => <AdminLoginHistory customerId={customerId} />}
            />
          )}
          {hasPermission('account-portal.can-login-to-customer-portal') && (
            <ConfirmationModal
              title="All Your Actions Will Be Monitored By The System, Do You Want To Continue?"
              subtitle="Press Confirm Button To Get Access"
              confirmationModal="Confirm"
              onOk={() => getAccountAccess()}
              btnComponent={({ onClick }) => (
                <Button xs type="white" prefix={<i className="material-icons-outlined">shortcut</i>} onClick={onClick}>
                  Login to account portal
                </Button>
              )}
            />
          )}
          {single_customer_data?.status?.search(/Suspended/i) === 0 && !cancellationDetailsData && (
            <ConfirmationModal
              title={`Are you sure you want to get the account closure details for ${single_customer_data.email} `}
              onOk={() => getAccountClosureDetails()}
              confirmationModal="Confirm"
              btnComponent={({ onClick }) => (
                <Button xs type="white" prefix={<i className="material-icons-outlined">close</i>} onClick={onClick}>
                  Get Account Closure Details
                </Button>
              )}
            />
          )}
        </Grid>

        <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />
      </Loaders>
    </>
  );
}

export default CustomerDetail;
