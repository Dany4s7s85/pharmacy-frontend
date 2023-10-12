import { format } from 'date-fns';
import { capitalize, getDateObject } from 'helpers/common';
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { MenuItem } from 'components/molecules/MenuButton';
import notificationService from 'services/notificationService';

// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import Loaders from 'components/atoms/Loaders';
import Paragraph from 'components/atoms/Paragraph';
import Tooltip from 'components/atoms/Tooltip';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import Button from '../../atoms/Button';

import {
  NotificationsContainer,
  NotificationsHolder,
  NotificationItem,
  Heading,
  FlexWrap,
  Date as DateStyled,
  StyledInfiniteScroll,
  MenuHolder,
  StyledMenuButton,
  Empty,
  Head,
} from './UserNotifications.styles';

function UserNotifications() {
  const [notificationPage, setNotificationPage] = useState({ page: 1, pageSize: 10 });
  const { isLoggedIn, user } = useContext(AuthContext);
  const [remove_id, setRemoveID] = useState('');

  const {
    notifications_data: { notifications, unread, hasNextPage },
  } = notificationService.GetNotifications(
    { page: notificationPage.page, pageSize: notificationPage.pageSize, isLoggedIn },
    user._id,
    remove_id,
  );
  const [unreadCount, setUnreadCount] = useState('');

  console.log({ unreadCount, unread });

  useEffect(() => {
    setUnreadCount(unread);
  }, [unread]);

  const dropdownEl = useRef(null);
  const menuItemRef = useRef(null);
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownEl.current && !dropdownEl.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    window.addEventListener('FETCH_NOTIFICATION', () => {
      setRemoveID(`R_${getDateObject(new Date()).getTime()}`);
    });
    document.addEventListener('scroll', handleClickOutside);
    return () => {
      document.removeEventListener('scroll', handleClickOutside);
      window.removeEventListener('FETCH_NOTIFICATION', () => {
        setRemoveID(`R_${getDateObject(new Date()).getTime()}`);
      });
    };
  }, [dropdownEl]);

  const readNotification = async id => {
    setLoading(_ => ({ ..._, [id]: true }));
    await notificationService
      .readNotification({
        notification_id: id,
      })
      .catch(err => {
        Toast({
          type: 'error',
          message: err.message,
        });
      });
    setLoading(_ => ({ ..._, [id]: false }));
    setRemoveID(id);
  };

  const unReadNotification = async id => {
    await notificationService
      .unReadNotification({
        notification_id: id,
      })
      .then(() => {})
      .catch(err => {
        Toast({
          type: 'error',
          message: err.message,
        });
      });
  };

  const onUpdateRequest = async (_, status) => {
    await notificationService
      .sendNotification({
        ..._,
        requested_by: _.requested_by._id,
        responded_by: user._id,
        user: _.user._id,
        status,
        notification_id: _._id,
      })
      .then(async () => {
        await readNotification(_._id);
        setRemoveID(`R_${getDateObject(new Date()).getTime()}`);

        Toast({
          type: 'sucess',
          message: 'Notifications updated successfully',
        });
      })
      .catch(ex => {
        Toast({
          type: 'error',
          message: ex.message,
        });
      });
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      setRemoveID(`R_${getDateObject(new Date()).getTime()}`);
      Toast({
        type: 'success',
        message: 'All Notification cleared',
      });
    } catch (er) {
      Toast({
        type: 'error',
        message: er.message,
      });
    }
  };

  const roles = useMemo(() => user?.role_type, [user]);
  const Notice = _ => (
    <NotificationItem loading={loading[_._id]} className={_?.is_read === false && 'active'}>
      {_.notification_text}

      <MenuHolder>
        <StyledMenuButton ref={menuItemRef} icon={<i className="material-icons-outlined">more_horiz</i>}>
          {_.read_by.includes(user._id) && (
            <MenuItem
              onClick={() => {
                unReadNotification(_._id, _, _.is_read);
              }}
              icon={<i className="material-icons-outlined">mark_chat_read</i>}>
              Mark as unread
            </MenuItem>
          )}
        </StyledMenuButton>
      </MenuHolder>
    </NotificationItem>
  );

  const WantsAccess = _ => (
    <Loaders loading={loading[_._id]}>
      <NotificationItem className={_?.is_read === false && 'active'}>
        {(roles?.includes('CSR_ADMIN') || roles?.includes('CSR_SUPER_ADMIN') || roles?.includes('SUPER_ADMIN')) && (
          <span css="margin-right: 10px">
            <b> {capitalize(_.requested_by.username)} </b> want to access
          </span>
        )}
        {roles?.includes('CSR') && (
          <span css="margin-right: 10px">
            Request sent to <b>Supervisor</b> to access
          </span>
        )}
        <span css="display: block;">
          <b> Email:</b> {_.user.email}
        </span>
        <span css="display: block;">
          <b> Reason:</b> {_.notification_text}
        </span>
        <FlexWrap>
          <DateStyled>{format(getDateObject(_.created_at), 'MMMM dd, yyyy hh:mm a')}</DateStyled>
        </FlexWrap>
        <MenuHolder>
          <StyledMenuButton ref={menuItemRef} icon={<i className="material-icons-outlined">more_horiz</i>}>
            {_.read_by.includes(user._id) && (
              <MenuItem
                onClick={() => {
                  unReadNotification(_._id, _.is_read);
                }}
                icon={<i className="material-icons-outlined">mark_chat_read</i>}>
                Mark as uread
              </MenuItem>
            )}
            {(roles?.includes('CSR_ADMIN') || roles?.includes('CSR_SUPER_ADMIN') || roles?.includes('SUPER_ADMIN')) && (
              <>
                <MenuItem
                  onClick={() => {
                    onUpdateRequest(_, 'Approved');
                  }}
                  icon={<i className="material-icons-outlined">done</i>}>
                  Approve
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onUpdateRequest(_, 'Rejected');
                  }}
                  icon={<i className="material-icons-outlined">close</i>}>
                  Reject
                </MenuItem>
              </>
            )}
          </StyledMenuButton>
        </MenuHolder>
      </NotificationItem>
    </Loaders>
  );

  const GrantedToCsr = _ => (
    <Loaders loading={loading[_._id]}>
      <NotificationItem className={_?.is_read === false && 'active'}>
        <span css="margin-right: 10px">
          <b>{capitalize(_.responded_by.username)}</b> Granted Access to <b>{capitalize(_.requested_by.username)}</b>{' '}
          for
        </span>
        <span css="display: block;">
          <b> Email:</b> {_.user.email}
        </span>
        <span css="display: block;">
          <b> Reason:</b> {_.notification_text}
        </span>
        <FlexWrap>
          <DateStyled>{format(getDateObject(_.created_at), 'MMMM dd, yyyy hh:mm a')}</DateStyled>
        </FlexWrap>
        <MenuHolder>
          <StyledMenuButton ref={menuItemRef} icon={<i className="material-icons-outlined">more_horiz</i>}>
            {_.read_by.includes(user._id) && (
              <MenuItem
                onClick={() => {
                  unReadNotification(_._id, _.is_read);
                }}
                icon={<i className="material-icons-outlined">mark_chat_read</i>}>
                {_.read_by.includes(user._id) ? 'Mark as unread' : ''}
              </MenuItem>
            )}
          </StyledMenuButton>
        </MenuHolder>
      </NotificationItem>
    </Loaders>
  );

  const RejectToCsr = _ => (
    <Loaders loading={loading[_._id]}>
      <NotificationItem className={_?.is_read === false && 'active'}>
        <span css="margin-right: 10px">
          <b>{capitalize(_?.responded_by?.username)}</b> Denied Access to <b>{capitalize(_?.requested_by?.username)}</b>{' '}
          for
        </span>
        <span css="display: block;">
          <b> Email:</b> {_.user.email}
        </span>
        <span css="display: block;">
          <b> Reason:</b> {_.notification_text}
        </span>
        {_.rejection_reason && (
          <span css="display: block;">
            <b> Rejection Reason:</b> {_.rejection_reason}
          </span>
        )}
        <FlexWrap>
          <DateStyled>{format(getDateObject(_.created_at), 'MMMM dd, yyyy hh:mm a')}</DateStyled>
        </FlexWrap>
        <MenuHolder>
          <StyledMenuButton icon={<i className="material-icons-outlined">more_horiz</i>}>
            {_.read_by.includes(user._id) && (
              <MenuItem
                ref={menuItemRef}
                onClick={() => {
                  unReadNotification(_._id, _.is_read);
                }}
                icon={<i className="material-icons-outlined">mark_chat_read</i>}>
                {_.read_by.includes(user._id) ? 'Mark as unread' : ''}
              </MenuItem>
            )}
          </StyledMenuButton>
        </MenuHolder>
      </NotificationItem>
    </Loaders>
  );

  const fetchData = () => {
    if (hasNextPage) {
      setNotificationPage({ page: notificationPage?.page + 1, pageSize: 10 });
    }
  };
  return (
    <NotificationsContainer ref={dropdownEl}>
      <Button
        type="white"
        shape="circle"
        size={40}
        iconMobile
        notification={notifications.length || ''}
        onClick={() => {
          setDropdown(!dropdown);
        }}>
        <i
          className="material-icons-outlined"
          css={`
            font-size: var(--font-size-lg) !important;
            line-height: calc(var(--font-size-lg) + 0.3125rem);
          `}>
          notifications
        </i>
      </Button>

      {dropdown && (
        <NotificationsHolder>
          {notifications?.length > 0 ? (
            <>
              <Head>
                <Heading>Notifications</Heading>
                <div
                  css={`
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    flex-grow: 1;
                  `}>
                  <Tooltip title="Clear All">
                    <Button
                      type="outline"
                      size={30}
                      css="flex-shrink:0;"
                      shape="circle"
                      onClick={() => clearAllNotifications()}>
                      <i className="material-icons-outlined">clear</i>
                    </Button>
                  </Tooltip>
                </div>
              </Head>
              <StyledInfiniteScroll
                dataLength={notifications?.length}
                next={fetchData}
                hasMore={hasNextPage}
                loader={<Loaders notificationLoader />}
                height={240}
                endMessage={
                  <Paragraph
                    css={`
                      text-align: center;
                      color: var(--primary);
                      margin: 0;
                    `}>
                    ---Yay! You have seen it all---
                  </Paragraph>
                }>
                {notifications?.map(_ => {
                  if (_.notification_type === 'CSR') {
                    if (_.status === 'Pending') return WantsAccess(_);
                    if (_.status === 'Rejected') return RejectToCsr(_);
                    if (_.status === 'Approved') return GrantedToCsr(_);
                  }
                  return Notice(_);
                })}
              </StyledInfiniteScroll>
            </>
          ) : (
            <Empty>
              <span className="material-icons-outlined">notifications_off</span>
              No Notifications
            </Empty>
          )}
        </NotificationsHolder>
      )}
    </NotificationsContainer>
  );
}

export default UserNotifications;
