/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { useMediaPredicate } from 'react-media-hook';
import Button from 'components/atoms/Button';
import Switch from 'components/atoms/Switch';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import adminService from 'services/adminService';
import DataTabs from 'components/molecules/DataTabs';
import Field from 'components/molecules/Field';
import ModalContainer from 'components/molecules/ModalContainer';
import { PermissionListGroup, PermissionListHead } from './PermissionSelector.styles';

export default function PermissionSelector({ forRoles, permissions, onDone = () => {} }) {
  const [state, setState] = useState({});
  const [searchPerm, setSearchPerm] = useState({
    group: '',
    permission: '',
  });

  const [searchGroup, setSearchGroup] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const {
    permissions_data: { permissions: all_permissions },
  } = adminService.GetPermissions({ getAll: true });
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  const data = useMemo(
    () =>
      Object.entries(
        all_permissions?.reduce((acc, permission) => {
          const group = permission?.can?.split('.')[0];
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(permission);
          return acc;
        }, {}),
      )
        .filter(
          ([group]) => searchGroup.toLowerCase() === '' || group.toLowerCase().includes(searchGroup.toLowerCase()),
        )
        .map(([group, _]) => ({
          label: group,
          content: (
            <PermissionListGroup>
              <PermissionListHead>
                <Switch
                  noMargin
                  label="Select All"
                  name={`${group}_all`}
                  value={_.every(({ _id }) => state?.find(({ _id: __id }) => __id === _id))}
                  onChange={({ target: { value } }) => {
                    setState(s =>
                      value
                        ? s.concat(_.filter(({ _id }) => !s?.find(({ _id: __id }) => __id === _id)))
                        : s.filter(({ _id }) => !_?.find(({ _id: __id }) => __id === _id)),
                    );
                  }}
                />
                <Field
                  sm
                  type="text"
                  noMargin
                  suffix={<i className="material-icons-round">search</i>}
                  placeholder="search permissions"
                  onChange={({ target: { value } }) => {
                    setSearchPerm({ group, permission: value });
                  }}
                />
              </PermissionListHead>
              <Grid
                xs={1}
                sm={2}
                lg={3}
                colGap={30}
                rowGap={20}
                css={`
                  padding: 15px;
                  overflow-x: hidden;
                  overflow-y: auto;
                  max-height: 500px;
                `}>
                {_.filter(({ can }) =>
                  group.toLowerCase().trim() === searchPerm.group.toLowerCase().trim()
                    ? can.toLowerCase().trim().includes(searchPerm.permission.toLowerCase().trim())
                    : true,
                ).map(({ _id, can }) => (
                  <GridCol key={_id}>
                    <Field
                      noMargin
                      type="checkbox"
                      label={can}
                      name={_id}
                      value={!!state.find(c => c._id === _id)}
                      onChange={({ target: { value } }) => {
                        setState(__ => (value ? [...__, { _id, can }] : __.filter(({ _id: __id }) => __id !== _id)));
                      }}
                    />
                  </GridCol>
                ))}
              </Grid>
            </PermissionListGroup>
          ),
        })),
    [state, searchPerm, searchGroup],
  );

  useEffect(() => {
    const selectedPermissions = all_permissions
      .filter(({ _id }) => permissions.includes(_id))
      .map(({ _id, can }) => ({ _id, can }));
    setState(selectedPermissions);
  }, [all_permissions, permissions, isClosed]);

  return (
    <>
      <ModalContainer
        xl
        onModalClose={() => {
          setIsClosed(() => !isClosed);
        }}
        btnComponent={({ onClick }) => (
          <Button type="primary" xs onClick={onClick} disabled={!permissions?.length && !forRoles}>
            Customize Permissions
          </Button>
        )}
        content={({ onClose }) => (
          <>
            <PermissionListHead topHead>
              <Switch
                noMargin
                type="checkbox"
                label="Select All Groups Permissions"
                name="select_all_permissions"
                value={all_permissions.length === state.length}
                onChange={({ target: { value } }) => {
                  if (value) {
                    setState(all_permissions.map(({ _id, can }) => ({ _id, can })));
                  } else {
                    setState([]);
                  }
                }}
              />
              <Field
                sm
                type="text"
                noMargin
                suffix={<i className="material-icons-round">search</i>}
                placeholder="Search Permission Group"
                onChange={({ target: { value } }) => {
                  setSearchGroup(value);
                }}
              />
            </PermissionListHead>
            <DataTabs data={data} orientation={MaxWidth991 ? 'horizontal' : 'vertical'} />
            <Button
              type="primary"
              xs
              disabled={!state.length}
              onClick={() => {
                onClose();
                onDone(state.map(({ can }) => can));
              }}>
              Confirm
            </Button>
          </>
        )}
      />
    </>
  );
}
