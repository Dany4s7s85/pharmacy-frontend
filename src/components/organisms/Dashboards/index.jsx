/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import SummaryBox from 'components/molecules/SummaryBox';
import { convertToCurrencyFormat } from 'helpers/common';
import { BarChart, PieChart, FullPieChart, PieChartCustomShape, HalfPieChart } from 'components/molecules/Charts';
import Card from 'components/atoms/Card';
import Table from 'components/molecules/Table';
import Heading from 'components/atoms/Heading';
import Select from 'components/atoms/Select';
import { Bar } from 'recharts';
import reportService from 'services/reportService';
import Loaders from 'components/atoms/Loaders';
import NoData from 'components/atoms/NoData';
import InfoCard from 'components/molecules/InfoCard';
import DetailsCard from 'components/molecules/DetailsCard';
import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import { AuthContext } from 'context/authContext';

const selectOptions = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Monthly', label: 'Monthly' },
];

export function DashboardCustomer() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const [countCheck, setCountCheck] = useState('Total Count');
  const [monthlyCheck, setMonthlyCheck] = useState('Daily');
  const {
    users_loading,
    users_7_days_data,
    users_monthly_data,
    users_total_data,
    users_province_data,
    users_card_type_data,
    users_credit_limit_data,
    users_status_data,
    users_free_user_data,
    users_equifax_data,
  } = reportService.GetAllCustomersData(force, fetch);

  const columnNames = ['Date', 'Amount', 'Count'];
  const rowsData =
    countCheck === 'Total Count' && monthlyCheck === 'Daily'
      ? users_7_days_data?.weekly &&
        users_7_days_data?.weekly.map(item => [item.day, convertToCurrencyFormat(item.amount), item.count]).reverse()
      : users_monthly_data?.monthly &&
        users_monthly_data?.monthly.map(item => [item.day, convertToCurrencyFormat(item.amount), item.count]).reverse();

  const creditLimitColumns = [
    `Credit Limit ${users_total_data?.totalCredit && convertToCurrencyFormat(users_total_data?.totalCredit)}`,
    'Count',
  ];
  const creditLimitRows =
    users_credit_limit_data?.creditlimit && users_credit_limit_data?.creditlimit.map(item => [item.name, item.amount]);

  const statusColumns = ['Status', 'Count'];
  const statusRows = users_status_data?.status && users_status_data?.status.map(item => [item.name, item.amount]);

  const handleCountCheck = e => setCountCheck(e.target.value.value);
  const handleMonthlyCheck = e => setMonthlyCheck(e.target.value.value);

  return (
    <>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          margin-top: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Customers
        </Heading>
        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid lg={3} gap={20} css="margin-bottom: var(--gutter);">
        <Loaders loading={users_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Today"
                value={users_7_days_data?.today ? users_7_days_data?.today : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Today's Credit Limit"
                value={
                  users_7_days_data?.today_credit ? convertToCurrencyFormat(users_7_days_data.today_credit) : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={users_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <>
                <InfoCard
                  title="This Month"
                  value={`${
                    users_monthly_data?.monthly?.length
                      ? users_monthly_data?.monthly[users_monthly_data?.monthly?.length - 1]?.count
                      : '---'
                  }`}
                  $unStyled
                  fontbase
                />

                <InfoCard
                  title="Credit Limit"
                  value={
                    users_monthly_data?.monthly?.length
                      ? convertToCurrencyFormat(
                          users_monthly_data?.monthly[users_monthly_data?.monthly?.length - 1]?.amount,
                        )
                      : '---'
                  }
                  $unStyled
                  fontbase
                />
              </>
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={users_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Till Date"
                value={users_total_data?.totalusers ? users_total_data.totalusers : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Total Credit Limit"
                value={users_total_data?.totalCredit ? convertToCurrencyFormat(users_total_data.totalCredit) : '---'}
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
      </Grid>
      <Grid xs={24} gap={20} css="margin-bottom: var(--gutter);">
        <GridCol xs={24} lg={14} xxl={16}>
          <Card title="Customers By Province">
            <Loaders loading={users_loading}>
              {users_province_data?.province ? (
                <BarChart
                  height={300}
                  data={users_province_data.province}
                  xAxisKey="name"
                  barKey="Amount"
                  unit=""
                  gradientId="customersByProvince"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </Card>
        </GridCol>
        <GridCol xs={24} lg={10} xxl={8}>
          <Card title="Card">
            <Loaders loading={users_loading}>
              {users_card_type_data?.cardType ? (
                <PieChart height={300} data={users_card_type_data.cardType} dataKey="amount" />
              ) : (
                <NoData />
              )}
            </Loaders>
          </Card>
        </GridCol>
      </Grid>
      <Grid xs={24} gap={20} css="margin-bottom: var(--gutter);">
        <GridCol xs={24} lg={12} xl={7} xxl={6} css="display:grid;">
          <Card noPadding>
            <Table
              rowsData={creditLimitRows}
              columnNames={creditLimitColumns}
              noPadding
              height={350}
              loading={users_loading}
              responsive={false}
            />
          </Card>
        </GridCol>

        <GridCol xs={24} lg={12} xl={17} xxl={18}>
          <Card title="Status">
            <Grid xs={12} gap={20}>
              <GridCol xs={12} xl={7} xxl={8}>
                <Loaders loading={users_loading}>
                  {users_status_data.status ? (
                    <FullPieChart
                      colorsArr={[
                        '#788ef5',
                        '#c98fa2',
                        '#d19f8d',
                        '#cbb189',
                        '#bdc490',
                        '#a6d89e',
                        '#7eecb1',
                        '#f7e35a',
                        '#f2c96d',
                        '#e5b372',
                        '#cfa16c',
                        '#b3935b',
                        '#8e883d',
                        '#5b8000',
                      ]}
                      data={users_status_data.status}
                      height={350}
                      dataKey="amount"
                      label={false}
                      legendBottomCenter
                    />
                  ) : (
                    <NoData />
                  )}
                </Loaders>
              </GridCol>
              <GridCol xs={12} xl={5} xxl={4}>
                <Table
                  responsive={false}
                  rowsData={statusRows}
                  columnNames={statusColumns}
                  height={330}
                  loading={users_loading}
                />
              </GridCol>
            </Grid>
          </Card>
        </GridCol>
      </Grid>
      <Card
        css="margin-bottom: var(--gutter);"
        title={monthlyCheck === 'Daily' ? 'Daily Customers' : 'Monthly Customers'}
        filter={
          <Grid xs={2} gap={20} colWidth={200}>
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Total Count', value: 'Total Count' }}
              options={[
                { label: 'Total Count', value: 'Total Count' },
                { label: 'Total Credit Limit', value: 'Total Credit Limit' },
              ]}
              onChange={handleCountCheck}
            />
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Daily', value: 'Daily' }}
              options={selectOptions}
              onChange={handleMonthlyCheck}
            />
          </Grid>
        }>
        <Grid xs={12} gap={{ xs: 20, xl: 30 }}>
          <GridCol xs={12} lg={8}>
            <Loaders loading={users_loading}>
              {users_7_days_data.weekly && users_monthly_data.monthly ? (
                <BarChart
                  height={300}
                  data={monthlyCheck === 'Daily' ? users_7_days_data.weekly : users_monthly_data.monthly}
                  unit=""
                  xAxisKey="day"
                  yAxisKey={countCheck === 'Total Count' && 'count'}
                  barKey={countCheck === 'Total Count' ? 'count' : 'amount'}
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={4}>
            <Table
              responsive={false}
              rowsData={rowsData}
              columnNames={columnNames}
              noPadding
              height={300}
              loading={users_loading}
            />
          </GridCol>
        </Grid>
      </Card>

      <Grid xs={24} gap={20}>
        <GridCol xs={24} lg={12}>
          <Card title="Free User Who Became Customers">
            <Loaders loading={users_loading}>
              {users_free_user_data?.freeusers ? (
                <HalfPieChart
                  data={users_free_user_data.freeusers}
                  height={250}
                  loading={users_loading}
                  dataKey="amount"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </Card>
        </GridCol>
        <GridCol xs={24} lg={12}>
          <Card title="Equifax Verification">
            <Loaders loading={users_loading}>
              {users_equifax_data?.equifax ? (
                <PieChartCustomShape data={users_equifax_data.equifax} height={250} dataKey="amount" />
              ) : (
                <NoData />
              )}
            </Loaders>
          </Card>
        </GridCol>
      </Grid>
    </>
  );
}

export function SentinelSubscribers() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);

  const {
    sentinel_monthly_data,
    sentinel_daily_data,
    sentinel_subs_monthly_data,
    sentinel_users_daily_data,
    sentinel_subs_daily_data,
    users_annual_monthly_data,
    sentinel_subscribers_loading,
  } = reportService.GetAllSentinelData(force, fetch);

  const [sentinelSubsChange, setSentinelSubsChange] = useState('Daily');
  const [sentinelTransChange, setSentinelTransChange] = useState('Daily');
  const [sentinelSubsTransChange, setSentinelSubsTransChange] = useState('Daily');
  const columnNames = ['Date', 'Monthly10', 'Monthly', 'Annual95', 'Annual', 'Count'];
  const rowsData =
    sentinelSubsChange === 'Daily'
      ? sentinel_subs_daily_data?.weekly &&
        sentinel_subs_daily_data?.weekly
          .map(item => [
            item.day,
            item.monthly80 ?? 0,
            item.monthly ?? 0,
            item.monthly80 ?? 0,
            item.annual ?? 0,
            item.amount ?? 0,
          ])
          .reverse()
      : sentinel_subs_monthly_data?.monthly &&
        sentinel_subs_monthly_data?.monthly
          .map(item => [
            item.day,
            item.monthly80 ?? 0,
            item.monthly ?? 0,
            item.monthly80 ?? 0,
            item.annual ?? 0,
            item.amount ?? 0,
          ])
          .reverse();

  const sentinelTransactionsColumns = ['Date', 'Amount', 'count'];
  const sentinelTransactionsRow =
    sentinelTransChange === 'Daily'
      ? sentinel_daily_data?.weekly &&
        sentinel_daily_data?.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.total_transactions) ?? 0, item.amount ?? 0])
          .reverse()
      : sentinel_monthly_data?.monthly &&
        sentinel_monthly_data?.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.total_transactions) ?? 0, item.amount ?? 0])
          .reverse();

  const sentinelUsersColumn = ['Date', 'Annual Amount', 'Annual Count', 'Monthly Amount', 'Monthly Count'];
  const sentinelUsersRow =
    sentinelSubsTransChange === 'Daily'
      ? sentinel_users_daily_data?.weekly &&
        sentinel_users_daily_data?.weekly
          .map(item => [
            item.day,
            convertToCurrencyFormat(item.annual_transactions) ?? 0,
            item.amount ?? 0,
            convertToCurrencyFormat(item.monthly_transactions) ?? 0,
            item.monthly_amount ?? 0,
          ])
          .reverse()
      : users_annual_monthly_data?.monthly &&
        users_annual_monthly_data?.monthly
          .map(item => [
            item.day,
            convertToCurrencyFormat(item.annual_transactions) ?? 0,
            item.amount ?? 0,
            convertToCurrencyFormat(item.monthly_transactions) ?? 0,
            item.monthly_amount ?? 0,
          ])
          .reverse();

  const handleSentinelSubsChange = e => setSentinelSubsChange(e.target.value.value);
  const handleSentinelTransChange = e => setSentinelTransChange(e.target.value.value);
  const handleSubsTransChange = e => setSentinelSubsTransChange(e.target.value.value);

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Sentinel Subscribers
        </Heading>
        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid
        md={3}
        gap={20}
        css={`
          margin-bottom: var(--gutter);
        `}>
        <Loaders loading={sentinel_subscribers_loading}>
          <SummaryBox
            title="Today"
            value={`${sentinel_subs_daily_data?.today ? sentinel_subs_daily_data?.today : '---'}`}
          />
        </Loaders>
        <Loaders loading={sentinel_subscribers_loading}>
          <SummaryBox
            title="This Month Subscribers"
            value={`${
              sentinel_subs_monthly_data?.monthly?.length
                ? sentinel_subs_monthly_data?.monthly[sentinel_subs_monthly_data?.monthly?.length - 1]?.amount
                : '---'
            }`}
          />
        </Loaders>
        <Loaders loading={sentinel_subscribers_loading}>
          <SummaryBox
            title="Total Subscribers"
            value={`${sentinel_subs_monthly_data?.monthly?.length ? sentinel_subs_monthly_data?.totalsubs : '---'}`}
          />
        </Loaders>
      </Grid>
      <Card
        title={sentinelSubsChange === 'Daily' ? 'Daily Sentinel Subscribers' : 'Monthly Sentinel Subscribers'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            onChange={handleSentinelSubsChange}
            options={selectOptions}
          />
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={9}>
            <Loaders loading={sentinel_subscribers_loading}>
              {sentinel_daily_data?.weekly && sentinel_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={sentinelSubsChange === 'Daily' ? sentinel_daily_data.weekly : sentinel_monthly_data.monthly}
                  xAxisKey="day"
                  barKey="amount"
                  unit=""
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="subscribersChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              rowsData={rowsData}
              columnNames={columnNames}
              noPadding
              height={300}
              loading={sentinel_subscribers_loading}
              responsive={false}
            />
          </GridCol>
        </Grid>
      </Card>
      <Heading level={3}>Sentinel Transactions</Heading>
      <Grid lg={3} gap={20} css="margin-bottom: var(--gutter);">
        <Loaders loading={sentinel_subscribers_loading}>
          <DetailsCard>
            <Grid xs={2} gap={15}>
              <InfoCard
                title="Today"
                value={sentinel_daily_data?.today ? sentinel_daily_data?.today : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Net Transactions"
                value={
                  sentinel_daily_data?.today_trans ? convertToCurrencyFormat(sentinel_daily_data.today_trans) : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={sentinel_subscribers_loading}>
          <DetailsCard>
            <Grid xs={2} gap={15}>
              <>
                <InfoCard
                  title="This Month"
                  value={`${
                    sentinel_monthly_data?.monthly?.length
                      ? sentinel_monthly_data?.monthly[sentinel_monthly_data?.monthly?.length - 1]?.amount
                      : '---'
                  }`}
                  $unStyled
                  fontbase
                />

                <InfoCard
                  title="Net Transactions"
                  value={
                    sentinel_monthly_data?.monthly?.length
                      ? convertToCurrencyFormat(
                          sentinel_monthly_data?.monthly[sentinel_monthly_data?.monthly?.length - 1]
                            ?.total_transactions,
                        )
                      : '---'
                  }
                  $unStyled
                  fontbase
                />
              </>
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={sentinel_subscribers_loading}>
          <DetailsCard>
            <Grid xs={2} gap={15}>
              <InfoCard
                title="Till Date"
                value={sentinel_monthly_data?.totaltransactions ? sentinel_monthly_data.totaltransactions : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Total Amount"
                value={
                  sentinel_monthly_data?.totalsum ? convertToCurrencyFormat(sentinel_monthly_data.totalsum) : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
      </Grid>
      <Card
        title={sentinelTransChange === 'Daily' ? 'Daily Sentinel Transactions' : 'Monthly Sentinel Transactions'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            onChange={handleSentinelTransChange}
            options={selectOptions}
          />
        }>
        <Grid xs={12} gap={30}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={sentinel_subscribers_loading}>
              {sentinel_daily_data?.weekly && sentinel_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={sentinelTransChange === 'Daily' ? sentinel_daily_data.weekly : sentinel_monthly_data.monthly}
                  xAxisKey="day"
                  barKey="total_transactions"
                  gradientEnd="#02AABD"
                  gradientStart="#00CDAC"
                  gradientId="transactionsChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Loaders loading={sentinel_subscribers_loading}>
              <Table
                rowsData={sentinelTransactionsRow}
                columnNames={sentinelTransactionsColumns}
                loading={sentinel_subscribers_loading}
                noPadding
                height={300}
                responsive={false}
              />
            </Loaders>
          </GridCol>
        </Grid>
      </Card>
      <Card
        title={
          sentinelSubsTransChange === 'Daily' ? 'Daily Subscription Transactions' : 'Monthly Subscription Transactions'
        }
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            onChange={handleSubsTransChange}
            options={selectOptions}
          />
        }>
        <Grid xs={12} gap={30}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={sentinel_subscribers_loading}>
              {sentinel_users_daily_data?.weekly && users_annual_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={
                    sentinelSubsTransChange === 'Daily'
                      ? sentinel_users_daily_data.weekly
                      : users_annual_monthly_data.monthly
                  }
                  xAxisKey="day"
                  barKey="annual_transactions"
                  barKey2="monthly_transactions"
                  gradientEnd="#A1C4FD"
                  gradientStart="#C2E9FB"
                  gradientId="transactionsChart2"
                  legend
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Loaders loading={sentinel_subscribers_loading}>
              <Table
                rowsData={sentinelUsersRow}
                columnNames={sentinelUsersColumn}
                noPadding
                height={300}
                loading={sentinel_subscribers_loading}
                responsive={false}
              />
            </Loaders>
          </GridCol>
        </Grid>
      </Card>
    </div>
  );
}

export function CardRequested() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);

  const { card_request_loading, card_req_7_days_data, card_req_monthly_data, card_req_total_data } =
    reportService.GetAllCardData(force, fetch);

  const [cardRequested, setCardRequested] = useState('Daily');
  const columnNames = ['Date', 'Automatic', 'Damage', 'Emboss', 'Invalid', 'Lost', 'Plastk', 'Re-Issue', 'Count'];
  const rowsData =
    cardRequested === 'Daily'
      ? card_req_7_days_data.weekly &&
        card_req_7_days_data.weekly
          .map(item => [
            item.day,
            item.reasonlist[0].amount,
            item.reasonlist[1].amount,
            item.reasonlist[2].amount,
            item.reasonlist[3].amount,
            item.reasonlist[4].amount,
            item.reasonlist[5].amount,
            item.reasonlist[6].amount,
            item.amount,
          ])
          .reverse()
      : card_req_monthly_data.monthly &&
        card_req_monthly_data.monthly
          .map(item => [
            item.day,
            item.reasonlist[0].amount,
            item.reasonlist[1].amount,
            item.reasonlist[2].amount,
            item.reasonlist[3].amount,
            item.reasonlist[4].amount,
            item.reasonlist[5].amount,
            item.reasonlist[6].amount,
            item.amount,
          ])
          .reverse();

  const handleCardRequestChange = e => setCardRequested(e.target.value.value);

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Card Requested
        </Heading>

        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid
        md={3}
        gap={20}
        css={`
          margin-bottom: var(--gutter);
        `}>
        <Loaders loading={card_request_loading}>
          <SummaryBox title="Today" value={`${card_req_7_days_data?.today ? card_req_7_days_data?.today : '---'}`} />
        </Loaders>
        <Loaders loading={card_request_loading}>
          <SummaryBox
            title="This Month"
            value={`${
              card_req_monthly_data?.monthly?.length
                ? card_req_monthly_data?.monthly[card_req_monthly_data?.monthly?.length - 1].amount
                : '---'
            }`}
          />
        </Loaders>
        <Loaders loading={card_request_loading}>
          <SummaryBox title="Till Date" value={card_req_total_data?.totalsum ? card_req_total_data?.totalsum : '---'} />
        </Loaders>
      </Grid>
      <Card
        title={cardRequested === 'Daily' ? 'Daily Card Requested' : 'Monthly Card Requested'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            options={selectOptions}
            onChange={handleCardRequestChange}
          />
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={card_request_loading}>
              {card_req_7_days_data.weekly && card_req_monthly_data.monthly ? (
                <BarChart
                  height={300}
                  data={cardRequested === 'Daily' ? card_req_7_days_data.weekly : card_req_monthly_data.monthly}
                  xAxisKey="day"
                  barKey="amount"
                  unit=""
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              rowsData={rowsData}
              columnNames={columnNames}
              noPadding
              height={300}
              loading={card_request_loading}
              responsive={false}
            />
          </GridCol>
        </Grid>
      </Card>
      <div
        css={`
          max-width: 800px;
          margin: 0 auto;
        `}>
        <Card title={cardRequested === 'Daily' ? 'Weekly Card Request' : 'Total Card Request'}>
          <Loaders loading={card_request_loading}>
            {card_req_7_days_data?.reasonCount ? (
              <FullPieChart
                data={
                  cardRequested === 'Daily' ? card_req_7_days_data?.reasonCount : card_req_monthly_data?.reasonCount
                }
                dataKey="amount"
                height={250}
              />
            ) : (
              <NoData />
            )}
          </Loaders>
        </Card>
      </div>
    </div>
  );
}

export function UserTransactions() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const [userTrans, setUserTrans] = useState('Daily');
  const { user_trans_loading, user_trans_7_days_data, user_trans_monthly_data, user_trans_total_data } =
    reportService.GetAllUserTransactionData(force, fetch);

  const columnNames = ['Date', 'Amount', 'Count'];
  const rowsData =
    userTrans === 'Daily'
      ? user_trans_7_days_data?.weekly &&
        user_trans_7_days_data?.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.total_transactions), item.amount])
          .reverse()
      : user_trans_monthly_data?.monthly &&
        user_trans_monthly_data?.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.total_transactions), item.amount])
          .reverse();

  const handleUserTransChange = e => setUserTrans(e.target.value.value);

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          User Transactions
        </Heading>

        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid lg={3} gap={20} css="margin-bottom: var(--gutter);">
        <Loaders loading={user_trans_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Today"
                value={user_trans_7_days_data?.today ? user_trans_7_days_data?.today : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Net Transactions"
                value={
                  user_trans_7_days_data?.today_trans
                    ? convertToCurrencyFormat(user_trans_7_days_data?.today_trans)
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={user_trans_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="This Month"
                value={
                  user_trans_monthly_data?.monthly?.length
                    ? user_trans_monthly_data.monthly[user_trans_monthly_data.monthly.length - 1].amount
                    : '---'
                }
                $unStyled
                fontbase
              />
              <InfoCard
                title="Net Transactions"
                value={
                  user_trans_monthly_data?.monthly?.length
                    ? convertToCurrencyFormat(
                        user_trans_monthly_data.monthly[user_trans_monthly_data.monthly.length - 1].total_transactions,
                      )
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={user_trans_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Till Date"
                value={user_trans_total_data?.totaltransactions ? user_trans_total_data.totaltransactions : '---'}
                $unStyled
                fontbase
              />

              <InfoCard
                title="Total Amount"
                value={
                  user_trans_total_data?.totalsum ? convertToCurrencyFormat(user_trans_total_data.totalsum) : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
      </Grid>
      <Card
        title={userTrans === 'Daily' ? 'Daily User Transactions' : 'Monthly User Transactions'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            options={selectOptions}
            onChange={handleUserTransChange}
          />
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={user_trans_loading}>
              {user_trans_7_days_data?.weekly && user_trans_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={userTrans === 'Daily' ? user_trans_7_days_data?.weekly : user_trans_monthly_data?.monthly}
                  xAxisKey="day"
                  barKey="total_transactions"
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              responsive={false}
              rowsData={rowsData}
              columnNames={columnNames}
              noPadding
              height={300}
              loading={user_trans_loading}
            />
          </GridCol>
        </Grid>
      </Card>
    </div>
  );
}

export function StudentOffer() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const {
    student_data_loading,
    appStudent_monthly_data,
    appStudent_weekly_data,
    student_user_monthly_data,
    student_user_weekly_data,
    app_student_affiliate_data,
  } = reportService.GetAllStudentOfferData(force, fetch);
  const [appStudentChange, setAppStudentChangeChange] = useState('Daily');
  const [studentUserChange, setStudentUserChange] = useState('Daily');

  const applicationStudentColumns = ['Date', 'Amount', 'Count'];
  const studentUserColumns = ['Date', 'Amount', 'count'];
  const studentUserRowData =
    studentUserChange === 'Daily'
      ? student_user_weekly_data?.weekly &&
        student_user_weekly_data?.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse()
      : student_user_monthly_data.monthly &&
        student_user_monthly_data.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse();
  const appStudentRowsData =
    appStudentChange === 'Daily'
      ? appStudent_weekly_data?.weekly &&
        appStudent_weekly_data?.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse()
      : appStudent_monthly_data?.monthly &&
        appStudent_monthly_data?.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse();

  const handleAppStudentChange = e => setAppStudentChangeChange(e.target.value.value);
  const handleStudentUserChange = e => setStudentUserChange(e.target.value.value);

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Student Offer (Customers)
        </Heading>

        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Card
        title={studentUserChange === 'Daily' ? 'Daily Student Customers' : 'Monthly Student Customers'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            onChange={handleStudentUserChange}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            options={selectOptions}
          />
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={student_data_loading}>
              {student_user_weekly_data?.weekly && student_user_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={
                    studentUserChange === 'Daily'
                      ? student_user_weekly_data?.weekly
                      : student_user_monthly_data?.monthly
                  }
                  xAxisKey="day"
                  barKey="count"
                  unit=""
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Loaders loading={student_data_loading}>
              <Table
                responsive={false}
                rowsData={studentUserRowData}
                columnNames={studentUserColumns}
                noPadding
                height={300}
              />
            </Loaders>
          </GridCol>
        </Grid>
      </Card>
      <Heading level={3}>Student Offer (Application)</Heading>
      <Card
        title={appStudentChange === 'Daily' ? 'Daily Student Applications' : 'Monthly Student Applications'}
        css={`
          margin-bottom: var(--gutter);
        `}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            onChange={handleAppStudentChange}
            options={selectOptions}
          />
        }>
        <Grid xs={12} gap={30}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={student_data_loading}>
              {appStudent_weekly_data?.weekly && appStudent_monthly_data?.monthly ? (
                <BarChart
                  height={300}
                  data={
                    appStudentChange === 'Daily' ? appStudent_weekly_data?.weekly : appStudent_monthly_data?.monthly
                  }
                  xAxisKey="day"
                  barKey="count"
                  unit=""
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Loaders loading={student_data_loading}>
              <Table
                responsive={false}
                rowsData={appStudentRowsData}
                columnNames={applicationStudentColumns}
                noPadding
                height={300}
              />
            </Loaders>
          </GridCol>
        </Grid>
      </Card>
      <Card title="Affiliates">
        <Loaders loading={student_data_loading}>
          {app_student_affiliate_data?.affiliates ? (
            <BarChart
              height={300}
              data={app_student_affiliate_data?.affiliates}
              xAxisKey="name"
              barKey="amount"
              unit=""
              gradientEnd="#89f7fe "
              gradientStart="#66a6ff"
              gradientId="cardRequestedChart"
            />
          ) : (
            <NoData />
          )}
        </Loaders>
      </Card>
    </div>
  );
}

export function IncomingETransfer() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const [eTransCheck, setETransCheck] = useState('Total Count');
  const [monthlyCheck, setMonthlyCheck] = useState('Daily');
  const [eTransferTypeCheck, setETransferTypeCheck] = useState('Daily');
  const {
    transactions_loading,
    transactions_daily_data,
    transactions_monthly_data,
    transactions_data,
    payments_data,
    payments_valid_data,
  } = reportService.GetAllIncomingTransactionData(force, fetch);

  const monthly_e_transfers_counter = transactions_monthly_data.monthly?.slice(-1).pop().count ?? 0;
  const monthly_e_transfers = transactions_monthly_data.monthly?.slice(-1).pop().amount
    ? convertToCurrencyFormat(transactions_monthly_data.monthly?.slice(-1).pop().amount)
    : 0;

  const columnNames = ['Status', 'Amount', 'Count'];
  const rowsData = payments_data?.payments?.map(item => [item.name, convertToCurrencyFormat(item.amount), item.count]);

  const columnNames2 =
    eTransCheck === 'Total Count'
      ? ['Date', 'Amount', 'Payments', 'Security', 'DPID', 'Count']
      : ['Date', 'Amount', 'Count'];
  const rowsData2 =
    eTransCheck === 'Total Count'
      ? monthlyCheck === 'Daily'
        ? transactions_daily_data.weekly &&
          transactions_daily_data.weekly
            .map(item => [
              item.day,
              convertToCurrencyFormat(item.amount),
              convertToCurrencyFormat(item.payment),
              convertToCurrencyFormat(item.security),
              convertToCurrencyFormat(item.dpid),
              item.count,
            ])
            .reverse()
        : transactions_monthly_data.monthly &&
          transactions_monthly_data.monthly
            .map(item => [
              item.day,
              convertToCurrencyFormat(item.amount),
              convertToCurrencyFormat(item.payment),
              convertToCurrencyFormat(item.security),
              convertToCurrencyFormat(item.dpid),
              item.count,
            ])
            .reverse()
      : monthlyCheck === 'Daily'
      ? transactions_daily_data.weekly &&
        transactions_daily_data.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse()
      : transactions_monthly_data.monthly &&
        transactions_monthly_data.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse();

  const handleETransCheck = e => setETransCheck(e.target.value.value);
  const handleMonthlyCheck = e => setMonthlyCheck(e.target.value.value);
  const handleETransferTypeCheck = e => setETransferTypeCheck(e.target.value.value);

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Incoming E Transfers
        </Heading>

        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid lg={3} gap={20} css="margin-bottom: var(--gutter);">
        <Loaders loading={transactions_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Today"
                value={transactions_daily_data?.today ? transactions_daily_data.today : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Net e transfers"
                value={
                  transactions_daily_data?.today_credit
                    ? convertToCurrencyFormat(transactions_daily_data.today_credit)
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={transactions_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard title="This Month" value={monthly_e_transfers_counter || '---'} $unStyled fontbase />
              <InfoCard title="Net e transfers" value={monthly_e_transfers || '---'} $unStyled fontbase />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={transactions_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Incoming e transfers"
                value={transactions_data?.totaltransactions ? transactions_data?.totaltransactions?.[0] : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Net e transfers"
                value={transactions_data?.totalsum ? convertToCurrencyFormat(transactions_data?.totalsum?.[0]) : '---'}
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
      </Grid>
      <Grid lg={2} gap={20} css="margin-bottom: var(--gutter);">
        <Card title="Payments">
          <Grid xs={12} gap={20}>
            <GridCol xs={12} xxl={7}>
              <Loaders loading={transactions_loading}>
                {payments_data?.payments ? (
                  <FullPieChart legendBottomCenter data={payments_data.payments} dataKey="amount" height={250} />
                ) : (
                  <NoData />
                )}
              </Loaders>
            </GridCol>
            <GridCol xs={12} xxl={5}>
              <Table
                rowsData={rowsData}
                columnNames={columnNames}
                noPadding
                height={300}
                loading={transactions_loading}
                responsive={false}
              />
            </GridCol>
          </Grid>
        </Card>
        <Card title="Validated/Invalidated">
          <Loaders loading={transactions_loading}>
            {payments_valid_data?.validated ? (
              <HalfPieChart data={payments_valid_data?.validated} dataKey="amount" height={250} />
            ) : (
              <NoData />
            )}
          </Loaders>
        </Card>
      </Grid>
      <Card
        css={`
          h3 {
            margin-bottom: var(--gutter);
            @media (max-width: 767px) {
              display: block;
            }
          }
        `}
        title={monthlyCheck === 'Daily' ? 'Daily E Transfers' : 'Monthly E Transfers'}
        filter={
          <Grid md={2} gap={20} colWidth={200}>
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Total Count', value: 'Total Count' }}
              options={[
                { label: 'Total Count', value: 'Total Count' },
                { label: 'Total E-Trans Amount', value: 'Total E-Trans Amount' },
              ]}
              onChange={handleETransCheck}
            />
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Daily', value: 'Daily' }}
              options={selectOptions}
              onChange={handleMonthlyCheck}
            />
          </Grid>
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={transactions_loading}>
              {transactions_daily_data.weekly && transactions_monthly_data.monthly ? (
                <BarChart
                  height={300}
                  data={monthlyCheck === 'Daily' ? transactions_daily_data.weekly : transactions_monthly_data.monthly}
                  unit=""
                  xAxisKey="day"
                  yAxisKey={eTransCheck === 'Total Count' && 'count'}
                  barKey={eTransCheck === 'Total Count' ? 'count' : 'amount'}
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              rowsData={rowsData2}
              columnNames={columnNames2}
              noPadding
              height={300}
              loading={transactions_loading}
              responsive={false}
            />
          </GridCol>
        </Grid>
      </Card>
      <Card
        title={eTransferTypeCheck === 'Daily' ? 'Daily Etransfer By Type' : 'Monthly Etransfer By Type'}
        filter={
          <Select
            sm
            noMargin
            isSearchable={false}
            defaultValue={{ label: 'Daily', value: 'Daily' }}
            options={selectOptions}
            onChange={handleETransferTypeCheck}
          />
        }>
        <Loaders loading={transactions_loading}>
          {transactions_daily_data.weekly && transactions_monthly_data.monthly ? (
            <BarChart
              height={300}
              data={eTransferTypeCheck === 'Daily' ? transactions_daily_data.weekly : transactions_monthly_data.monthly}
              unit=""
              xAxisKey="day"
              yAxisKey="dpid"
              barKey="payment"
              barKey2="dpid"
              gradientEnd="#A1C4FD"
              gradientStart="#C2E9FB"
              gradientId="transactionsChart2"
              legend>
              <Bar dataKey="security" fill="#34dba1" minPointSize={10} radius={[5, 5, 5, 5]} />
            </BarChart>
          ) : (
            <NoData />
          )}
        </Loaders>
      </Card>
    </div>
  );
}

export function AccountRenewals() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const { renewal_daily_data, renewal_data_loading } = reportService.GetRenewalData(force, fetch);
  const renewalColumnNames = ['Date', 'OutStanding ($)', 'Due($)'];
  const renewalRowsData = renewal_daily_data?.weekly
    ?.map(item => [item.day, convertToCurrencyFormat(item.OutStanding), item.due])
    .reverse();

  return (
    <div
      css={`
        padding-top: var(--gutter);
      `}>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Account Renewals
        </Heading>
        {/* <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip> */}
      </div>
      <Card
        title="Daily Renewals (Annual Fees)"
        css={`
          margin-bottom: var(--gutter);
        `}>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={renewal_data_loading}>
              {renewalRowsData ? (
                <BarChart
                  height={300}
                  data={renewalRowsData}
                  xAxisKey="day"
                  barKey="count"
                  gradientEnd="#89f7fe "
                  gradientStart="#66a6ff"
                  gradientId="cardRequestedChart"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              rowsData={renewalRowsData}
              columnNames={renewalColumnNames}
              loading={renewal_data_loading}
              noPadding
              height={300}
              responsive={false}
            />
          </GridCol>
        </Grid>
      </Card>
    </div>
  );
}

export function Applicants() {
  const [force, setForce] = useState(false);
  const { refetch, fetch } = useContext(AuthContext);
  const [eTransCheck, setETransCheck] = useState('Total Count');
  const [monthlyCheck, setMonthlyCheck] = useState('Daily');
  const {
    applications_loading,
    applications_7_days_data,
    applications_monthly_data,
    applications_total_data,
    applications_province_data,
    applications_credit_limit_data,
    applications_affiliate_data,
    applications_about_us_data,
  } = reportService.GetAllApplicationData(force, fetch);
  const { transactions_loading, transactions_daily_data } = reportService.GetAllIncomingTransactionData(force, fetch);

  const columnNames = ['Date', 'Amount', 'Count'];
  const rowsData =
    eTransCheck === 'Total Count'
      ? monthlyCheck === 'Daily'
        ? applications_7_days_data?.weekly &&
          applications_7_days_data?.weekly
            .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
            .reverse()
        : applications_monthly_data?.monthly &&
          applications_monthly_data?.monthly
            .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
            .reverse()
      : monthlyCheck === 'Daily'
      ? transactions_daily_data?.weekly &&
        transactions_daily_data?.weekly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse()
      : applications_monthly_data?.monthly &&
        applications_monthly_data?.monthly
          .map(item => [item.day, convertToCurrencyFormat(item.amount), item.count])
          .reverse();

  const creditLimitColumns = [
    `Credit Limit ${
      applications_total_data?.totalCredit && convertToCurrencyFormat(applications_total_data?.totalCredit)
    }`,
    'Amount',
  ];
  const creditLimitRows =
    applications_credit_limit_data?.creditlimit &&
    applications_credit_limit_data?.creditlimit.map(item => [item.name, item.amount]);

  const aboutUsColumns = ['Application Origin', 'Count'];
  const aboutUsRows =
    applications_about_us_data?.aboutus && applications_about_us_data?.aboutus.map(item => [item.name, item.amount]);

  const handleETransCheck = e => setETransCheck(e.target.value.value);
  const handleMonthlyCheck = e => setMonthlyCheck(e.target.value.value);

  return (
    <>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          margin-top: 15px;
        `}>
        <Heading level={3} css="margin-bottom:0;">
          Applicants
        </Heading>

        <Tooltip title="Hard Refresh" type="dark">
          <Button
            size={40}
            onClick={() => {
              setForce(true);
              refetch();
            }}
            type="outline"
            shape="circle">
            <i className="material-icons-outlined">update</i>
          </Button>
        </Tooltip>
      </div>
      <Grid lg={4} gap={20} css="margin-bottom: var(--gutter);">
        <Loaders loading={applications_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Today"
                value={applications_7_days_data?.today ? applications_7_days_data?.today : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Today's Credit Limit"
                value={
                  applications_7_days_data?.today_credit
                    ? convertToCurrencyFormat(applications_7_days_data.today_credit)
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={applications_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <>
                <InfoCard
                  title="This Month"
                  value={`${
                    applications_monthly_data?.monthly?.length
                      ? applications_monthly_data?.monthly[applications_monthly_data?.monthly?.length - 1]?.count
                      : '---'
                  }`}
                  $unStyled
                  fontbase
                />

                <InfoCard
                  title="Credit "
                  value={
                    applications_monthly_data?.monthly?.length
                      ? convertToCurrencyFormat(
                          applications_monthly_data?.monthly[applications_monthly_data?.monthly?.length - 1]?.amount,
                        )
                      : '---'
                  }
                  $unStyled
                  fontbase
                />
              </>
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={applications_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Till Date"
                value={applications_total_data?.totalApplications ? applications_total_data.totalApplications : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Total Credit Limit"
                value={
                  applications_total_data?.totalCredit
                    ? convertToCurrencyFormat(applications_total_data.totalCredit)
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
        <Loaders loading={applications_loading}>
          <DetailsCard>
            <Grid xs={2} gap={20}>
              <InfoCard
                title="Total Applicants"
                value={applications_total_data?.totalApplications ? applications_total_data?.totalApplications : '---'}
                $unStyled
                fontbase
              />
              <InfoCard
                title="Applicants Credit"
                value={
                  applications_total_data?.totalCredit
                    ? convertToCurrencyFormat(applications_total_data.totalCredit)
                    : '---'
                }
                $unStyled
                fontbase
              />
            </Grid>
          </DetailsCard>
        </Loaders>
      </Grid>
      <Card title="Applicants By Provinces" css="margin-bottom: var(--gutter);">
        <Loaders loading={applications_loading}>
          {applications_province_data?.province ? (
            <BarChart
              height={300}
              data={applications_province_data.province}
              xAxisKey="name"
              barKey="Amount"
              gradientStart="#6190E8"
              gradientEnd="#A7BFE8"
              unit=""
              gradientId="customersByProvince"
            />
          ) : (
            <NoData />
          )}
        </Loaders>
      </Card>
      <Grid xs={24} gap={20} css="margin-bottom: var(--gutter);">
        <GridCol xs={24} lg={9} xxl={6}>
          <Card noPadding>
            <Table
              rowsData={creditLimitRows}
              columnNames={creditLimitColumns}
              noPadding
              height={340}
              loading={applications_loading}
              responsive={false}
            />
          </Card>
        </GridCol>
        <GridCol xs={24} lg={15} xxl={18}>
          <Card title="Affiliates">
            <Loaders loading={applications_loading}>
              {applications_affiliate_data?.affiliates ? (
                <BarChart
                  height={250}
                  data={applications_affiliate_data.affiliates}
                  xAxisKey="name"
                  yAxisKey="amount"
                  barKey="amount"
                  unit=""
                  gradientId="applicationsAffiliate"
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </Card>
        </GridCol>
      </Grid>
      <Card
        css="margin-bottom: var(--gutter);"
        title={monthlyCheck === 'Daily' ? 'Daily Applicants' : 'Monthly Applicants'}
        filter={
          <Grid xs={2} gap={20} colWidth={200}>
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Total Count', value: 'Total Count' }}
              options={[
                { label: 'Total Count', value: 'Total Count' },
                { label: 'Total Credit Limit', value: 'Total Credit Limit' },
              ]}
              onChange={handleETransCheck}
            />
            <Select
              sm
              noMargin
              isSearchable={false}
              defaultValue={{ label: 'Daily', value: 'Daily' }}
              options={selectOptions}
              onChange={handleMonthlyCheck}
            />
          </Grid>
        }>
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={applications_loading || transactions_loading}>
              {applications_7_days_data.weekly &&
              applications_monthly_data.monthly &&
              transactions_daily_data.weekly ? (
                eTransCheck === 'Total Credit Limit' ? (
                  <BarChart
                    height={300}
                    data={monthlyCheck === 'Daily' ? transactions_daily_data.weekly : applications_monthly_data.monthly}
                    unit=""
                    xAxisKey="day"
                    barKey="amount"
                    gradientEnd="#74ebd5"
                    gradientStart="#ACB6E5"
                    gradientId="cardRequestedChart"
                  />
                ) : (
                  <BarChart
                    height={300}
                    data={
                      monthlyCheck === 'Daily' ? applications_7_days_data.weekly : applications_monthly_data.monthly
                    }
                    unit=""
                    xAxisKey="day"
                    yAxisKey="count"
                    barKey="count"
                    gradientEnd="#74ebd5"
                    gradientStart="#ACB6E5"
                    gradientId="cardRequestedChart"
                  />
                )
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              rowsData={rowsData}
              columnNames={columnNames}
              noPadding
              height={300}
              loading={applications_loading}
              responsive={false}
            />
          </GridCol>
        </Grid>
      </Card>

      <Card title="Applicants Origin">
        <Grid xs={12} gap={{ xs: 20, xxl: 30 }}>
          <GridCol xs={12} lg={7} xxl={8}>
            <Loaders loading={applications_loading}>
              {applications_about_us_data.aboutus ? (
                <FullPieChart
                  data={applications_about_us_data.aboutus}
                  height={250}
                  dataKey="amount"
                  label={false}
                  legendBottomCenter
                  colorsArr={[
                    '#001219',
                    '#005f73',
                    '#0a9396',
                    '#94d2bd',
                    '#e9d8a6',
                    '#ee9b00',
                    '#ca6702',
                    '#bb3e03',
                    '#ae2012',
                    '#9b2226',
                  ]}
                />
              ) : (
                <NoData />
              )}
            </Loaders>
          </GridCol>
          <GridCol xs={12} lg={5} xxl={4}>
            <Table
              responsive={false}
              rowsData={aboutUsRows}
              columnNames={aboutUsColumns}
              height={250}
              loading={applications_loading}
            />
          </GridCol>
        </Grid>
      </Card>
    </>
  );
}
