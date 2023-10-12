/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Heading from 'components/atoms/Heading';
import Icon from 'components/atoms/Icon';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import ModalContainer from 'components/molecules/ModalContainer';
import Toast from 'components/molecules/Toast';
import styled, { css } from 'styled-components/macro';
import { formatISO } from 'date-fns/esm';
import { AuthContext } from 'context/authContext';
import { MinimumVisits, SelectCity, SelectOfferType, SelectProvince } from 'helpers/constants';
import Paragraph from 'components/atoms/Paragraph';
import Upload from 'components/molecules/Upload';
import { convertToBase64, getOfferDetails } from 'helpers/common';
import RcPicker from 'components/atoms/RcPicker';
import StoreService from 'services/businessStoreService';
import PromotionService from 'services/businessCampaignsService';
import PromotionPreviewModal from '../PromotionPreviewModal';
import {
  TextWrap,
  Holder,
  LeftColumn,
  ImgColumn,
  RadioWrap,
  FieldHolder,
  BtnHolder,
  StyledList,
  VisitsHolder,
} from './CreatePromotion.styles';

function CreatePromotion({ promotion, clone, onClose, extend, business }) {
  const [form] = useForm();
  const [combinedOptions, setCombinedOptions] = useState([]); // TODO SHFT BACKEND
  const [filteredCities, setFilteredCities] = useState(SelectCity);
  const [filteredProvinces] = useState(SelectProvince);
  const [state, setState] = useState({ initial_offer: {} });
  const [customImg, setCustomImg] = useState(false);
  const [defaultImg, setDefaultImg] = useState(true);
  const [customImgSrc, setCustomImgSrc] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const [storeNames, setStoreNames] = useState([]);
  const [previewData, setPreviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateCheck, setDateCheck] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [dateValid, setDateValid] = useState(false);
  const [removedStores, setRemovedStores] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filteredStores, setFilteredStores] = useState([]);
  const [prevDuration, setPrevDuration] = useState(null);
  const [current1, setCurrent1] = useState(null);
  const [current2, setCurrent2] = useState(null);
  const { refetch } = useContext(AuthContext);
  const [loadingImg, setLoadingImg] = useState(false);
  const { stores_data, stores_loading } = StoreService.GetStores(
    {
      page: 1,
      pageSize: 10,
      searchText: '',
      filterText: 'Active',
      getAll: true,
      businessId: business?.user_id,
    },
    refetch,
  );
  const { storeGroups_data } = StoreService.GetStoreGroups({
    page: 1,
    pageSize: 10,
    searchText: '',
    getAll: true,
    businessId: business?.user_id,
  });
  const { stores } = useMemo(
    () => ({
      stores: stores_data?.data?.items?.map(({ name, _id, ...data }) => ({
        _id,
        name,
        value: _id,
        label: name,
        ...data,
      })),
    }),
    [stores_data],
  );
  const { storeGroups } = useMemo(
    () => ({
      storeGroups: storeGroups_data?.store_groups,
    }),
    [storeGroups_data],
  );
  const filterStoresAndGroups = ({ selectedStores, selectedStoreGroups, disabledOptions = [] }) => {
    const { province, city } = form.getFieldsValue();
    const selected_provinces = province?.map(({ value }) => value.toLowerCase());
    const selected_cities = city?.map(({ label }) => label.toLowerCase());
    const all_province_check = selected_provinces.includes('all');
    const all_cities_check = selected_cities.includes('all');
    let tempStores = [];
    let tempStoreGroups = [];

    tempStores = disabledOptions?.length
      ? [
          ...disabledOptions
            .filter(grp => !grp.stores)
            ?.map(data => ({
              ...data,
              isDisabled:
                selectedStoreGroups.length && !data.isDisabled
                  ? !!selectedStoreGroups?.filter(({ stores }) => stores?.includes(data?.value))?.length
                  : data.isDisabled,
            })),
        ]
      : [];

    tempStoreGroups = disabledOptions?.length
      ? [
          ...disabledOptions
            .filter(grp => grp.stores)
            ?.map(data => ({
              ...data,
              isDisabled: !data.isDisabled
                ? !!(
                    data?.stores?.filter(x => selectedStores?.map(({ _id }) => _id).includes(x))?.length ||
                    selectedStoreGroups?.filter(
                      ({ stores, _id }) =>
                        stores?.filter(n => data?.stores?.indexOf(n) !== -1)?.length && _id !== data?._id, // checking the intersection of the stores
                    )?.length
                  )
                : data.isDisabled,
            })),
        ]
      : [];

    if (all_province_check && all_cities_check) {
      setCombinedOptions(() => [...tempStores, ...tempStoreGroups]);
    } else {
      let stores = [];
      if (all_cities_check) {
        stores = tempStores.filter(item => selected_provinces?.includes(item?.address?.state?.toLowerCase?.()));
      } else if (all_province_check) {
        stores = tempStores.filter(item => selected_cities?.includes(item?.address?.city?.toLowerCase?.()));
      } else {
        stores = tempStores?.filter(
          item =>
            selected_provinces.includes(item?.address?.state?.toLowerCase?.()) &&
            selected_cities.includes(item?.address?.city?.toLowerCase?.()),
        );
      }
      const store_ids = stores?.map(({ _id }) => _id);
      const groups = tempStoreGroups?.filter(({ stores }) => !stores?.filter(id => !store_ids?.includes(id)).length);
      setCombinedOptions([...stores, ...groups]);
    }
  };

  useEffect(() => {
    if (promotion && stores?.length) {
      form.setFieldsValue({
        name: clone ? promotion?.name.concat(' cloned') : promotion.name,

        offer_type: {
          value: promotion.offer_type,
          label: SelectOfferType.filter(_ => _.value === promotion.offer_type)[0].label,
        },
        minimum_amount: promotion?.offer_details?.minimum_amount,
        maximum_amount: promotion?.offer_details?.maximum_amount,
        max_spend_value: promotion?.offer_details?.max_spend_value,
        minimum_visit: promotion?.offer_details?.minimum_visit,
        point_value: promotion?.offer_details?.plastk_points,
        selected_stores: stores?.filter(store => promotion?.stores?.map(({ _id }) => _id)?.includes(store._id)),
        store_groups: promotion?.store_groups ?? [],
      });

      if (!clone) {
        form.setFieldsValue({
          duration: {
            startDate: new Date(promotion.duration.startDate),
            endDate: new Date(promotion.duration.endDate),
          },
        });
        if (!extend) {
          // eslint-disable-next-line no-use-before-define
          handleDate({
            target: {
              value: {
                startDate: new Date(promotion.duration.startDate),
                endDate: new Date(promotion.duration.endDate),
                isValid: true,
              },
            },
          });
        }
      }
      setStoreNames(
        stores
          ?.filter(store => promotion?.stores?.map(({ _id }) => _id)?.includes(store._id))
          .map(({ name }) => `"${name}"`),
      );
      setSelectedStores(
        stores?.filter(store => promotion?.stores?.map(({ _id }) => _id)?.includes(store._id)).map(({ _id }) => _id),
      );

      if (!clone) {
        // setStoreNames(
        //   stores
        //     ?.filter(store => promotion?.stores?.map(({ _id }) => _id)?.includes(store._id))
        //     .map(({ name }) => `"${name}"`),
        // );
        // setSelectedStores(
        //   stores?.filter(store => promotion?.stores?.map(({ _id }) => _id)?.includes(store._id)).map(({ _id }) => _id),
        // );

        if (promotion?.image_url) {
          setCustomImg(true);
          setCustomImgSrc(`${promotion.image_url}?${new Date().getTime()}`);
          setDefaultImg(false);
        } else {
          setDefaultImg(true);
        }
      }
    }
    const all_city_label = SelectCity.filter(({ label }) => label === 'All');
    form.setFieldsValue({
      province: [{ label: 'All', value: 'All' }],
      city: all_city_label,
      offer_type: { label: 'Initial Offer', value: 'initialOffer' },
      name: `Kick-off-${business?.kick_off_count + 1}`,
    });
  }, [stores]);

  const handleProvince = ({ target: { value } }) => {
    const selected_provinces = value?.map(({ value }) => value.toLowerCase());
    const all_check = selected_provinces?.includes('all');
    const last_value = value[value?.length - 1]?.value === 'All';

    if (!all_check) {
      const cities = SelectCity.filter(_ => selected_provinces.includes(_.myValue.toLowerCase()));

      cities.unshift({ label: 'All', value: 0, myValue: 'All' });
      setFilteredCities(() => cities);
      // form.setFieldsValue({ city: [{ label: 'All', value: 0, myValue: 'All' }] });
    } else {
      setFilteredCities(() => SelectCity);
    }
    if (last_value) {
      form.setFieldsValue({ province: value.filter(({ value }) => value === 'All') });
    } else if (all_check && selected_provinces.length > 1) {
      form.setFieldsValue({ province: value.filter(({ value }) => value !== 'All') });
    } else {
      form.setFieldsValue({ province: value });
    }
    if (dateCheck) {
      const storeGroupIds = form.getFieldValue('selected_stores')?.map(({ _id }) => _id) ?? [];
      const selectedStores = disabledOptions?.filter(({ value }) => storeGroupIds?.includes(value));
      let selectedStoreGroups =
        disabledOptions?.filter(grps => grps.stores)?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];
      selectedStoreGroups = selectedStoreGroups.length ? selectedStoreGroups?.map(({ stores }) => stores)?.flat() : [];
      filterStoresAndGroups({ selectedStores, selectedStoreGroups, disabledOptions });
    }
  };
  const handleCity = ({ target: { value } }) => {
    form.setFieldsValue({ city: value });
    if (dateCheck) {
      const storeGroupIds = form.getFieldValue('selected_stores')?.map(({ _id }) => _id) ?? [];
      const selectedStores = disabledOptions?.filter(({ value }) => storeGroupIds?.includes(value));
      let selectedStoreGroups =
        disabledOptions?.filter(grps => grps.stores)?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];
      selectedStoreGroups = selectedStoreGroups.length ? selectedStoreGroups?.map(({ stores }) => stores)?.flat() : [];
      filterStoresAndGroups({ selectedStores, selectedStoreGroups, disabledOptions });
    }
  };
  const handleStore = ({ target: { value } }) => {
    if (dateCheck) {
      if (!value?.length) {
        setCombinedOptions(disabledOptions);
        form.setFieldsValue({ selected_stores: [], store_groups: [] });
        form.setFieldsError({ selected_stores: { message: 'Please select a store' } });
        if (!promotion) {
          // eslint-disable-next-line no-use-before-define
          resetOfferFields();
        }

        setSelectedStores([]);
        setStoreNames([]);
        return;
      }

      form.setFieldsValue({ selected_stores: value });
      const storeGroupIds = form.getFieldValue('selected_stores')?.map(({ _id }) => _id) ?? [];
      const selectedStores = disabledOptions
        ?.filter(grps => !grps.stores)
        ?.filter(({ value }) => storeGroupIds?.includes(value));
      let selectedStoreGroups =
        disabledOptions?.filter(grps => grps.stores)?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];
      form.setFieldsValue({ store_groups: selectedStoreGroups?.map(({ _id }) => _id) });
      filterStoresAndGroups({ selectedStores, selectedStoreGroups, disabledOptions });

      selectedStoreGroups = selectedStoreGroups.length ? selectedStoreGroups?.map(({ stores }) => stores)?.flat() : [];

      setSelectedStores([...selectedStores.map(({ _id }) => _id), ...selectedStoreGroups]);
      setStoreNames([
        ...new Set([
          ...selectedStores.map(({ name }) => name),
          ...stores.filter(({ _id }) => selectedStoreGroups?.includes(_id))?.map(({ name }) => name),
        ]),
      ]);
    } else if (!value?.length) {
      form.setFieldsValue({ selected_stores: [], store_groups: [] });
      form.setFieldsError({ selected_stores: { message: 'Please select a store' } });

      if (!promotion) {
        // eslint-disable-next-line no-use-before-define
        resetOfferFields();
      }

      // const storeGroupIds = [];
      // const selectedStores = stores?.filter(({ value }) => storeGroupIds?.includes(value));
      // const selectedStoreGroups = storeGroups?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];

      // here empty arrays are assigned because storeGroupIds are empty and after the filter's applied they will still remain empty
      filterStoresAndGroups({ storeGroupIds: [], selectedStores: [], selectedStoreGroups: [] });
    } else {
      form.setFieldsValue({ selected_stores: value });
      const storeGroupIds = form.getFieldValue('selected_stores')?.map(({ _id }) => _id) ?? [];
      const selectedStores = stores?.filter(({ value }) => storeGroupIds?.includes(value));
      let selectedStoreGroups = storeGroups?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];

      filterStoresAndGroups({ selectedStores, selectedStoreGroups, disabledOptions });
      selectedStoreGroups = selectedStoreGroups?.map(({ stores }) => stores)?.flat();

      setSelectedStores([...selectedStores.map(({ _id }) => _id), ...selectedStoreGroups]);

      setStoreNames([
        ...new Set([
          ...selectedStores.map(({ name }) => name),
          ...stores.filter(({ _id }) => selectedStoreGroups?.includes(_id))?.map(({ name }) => name),
        ]),
      ]);
    }
  };

  const handleCustomImg = async ({ target: value }) => {
    setCustomImg(true);
    setDefaultImg(false);
    if (value?.value?.length && value?.value?.includes('data')) {
      setCustomImgSrc(value?.value);
      form.setFieldsValue({
        image: value?.value,
      });
    }
  };
  const onUploadImg = async target => {
    if (target?.target?.value) {
      const base64 = await convertToBase64(target?.target?.value);
      setCustomImgSrc(base64);
    } else {
      setCustomImgSrc();
    }
  };
  const handleDefaultImg = () => {
    setCustomImg(false);
    setDefaultImg(true);
  };
  const getInitialOfferObj = () => {
    if (Object.keys(state?.initial_offer)?.length === state?.minimum_visit?.value) {
      return state?.initial_offer;
    }
    const initialOffer = Object.entries(state.initial_offer)?.reduce((acc, [key, value]) => {
      if (Number(key) <= state?.minimum_visit.value) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});
    return initialOffer;
  };
  useEffect(() => {
    if (
      Object.keys(state?.initial_offer).length !== state?.minimum_visit?.value &&
      Object.keys(state?.initial_offer).length > 0
    ) {
      const initialOfferObject = state?.initial_offer;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= state?.minimum_visit?.value; i++) {
        const objLength = Object.keys(initialOfferObject).length;
        if (objLength > state?.minimum_visit?.value) {
          delete initialOfferObject[objLength];
        }
      }
      setState({
        ...state,
        initial_offer: initialOfferObject,
      });
    }
  }, [state?.minimum_visit?.value]);
  const getPayload = e => ({
    ...e,
    offer_type: e?.offer_type?.value,
    minimum_amount: e?.minimum_amount ?? 0,
    maximum_amount: e?.maximum_amount ?? 0,
    point_value: e?.point_value ?? 0,
    max_spend_value: e?.max_spend_value ?? 0,
    duration: [new Date(e?.duration?.startDate), new Date(e?.duration?.endDate)],
    plastk_points: e?.point_value ?? 0,
    minimum_visit: e?.minimum_visit?.value ?? 0,
    stores: selectedStores,
    extend: !!extend,
    image: e?.image ?? null,
    store_groups: e?.store_groups ?? [],
    initial_offer: getInitialOfferObj(),
  });

  const validateStores = async () => {
    if (extend) {
      return true;
    }
    try {
      const res = await PromotionService.checkStoresInOtherCampaigns({
        stores: selectedStores,
        startDate: state?.duration?.startDate,
        id: clone ? '' : promotion?._id,
        businessId: business?.user_id,
      });
      if (res?.stores?.length) {
        const s = stores?.filter(stores => res?.stores?.includes(stores?._id))?.map(({ name }) => `"${name}"`);
        form.setFieldsError({ selected_stores: { message: `Existing stores are ${s?.join(', ')}` } });
        Toast({
          type: 'error',
          message: res?.message,
        });
        setLoading(false);

        return false;
      }
      form.setFieldsError({ selected_stores: { message: '' } });
      setLoading(false);
      return true;
    } catch (er) {
      Toast({
        type: 'error',
        message: er.message,
      });
      setLoading(false);
      return false;
    }
  };
  const handleOfferVisits = (value, field_name, visit) => {
    form.setFieldsValue({ [field_name]: value });

    const initial_offr = {
      ...state?.initial_offer,
      [visit]: value,
    };
    setState(prev => ({ ...prev, initial_offer: initial_offr }));
  };
  const handleSubmit = async e => {
    setLoading(true);
    if (customImg && !customImgSrc) {
      setLoading(false);
      Toast({
        type: 'error',
        message: 'Please upload image',
      });
      return;
    }

    if (await validateStores()) {
      if (!promotion || clone) {
        PromotionService.createPromotion({ ...getPayload(e), businessId: business?.user_id })
          .then(res => {
            Toast({
              type: 'success',
              message: res?.message,
            });
            setLoading(false);
            refetch();
            onClose();
          })
          .catch(err => {
            Toast({
              type: 'error',
              message: err?.message,
            });
            setLoading(false);
          });
      } else {
        PromotionService.updatePromotion(promotion?._id, getPayload(e))
          .then(res => {
            Toast({
              type: 'success',
              message: res?.message,
            });
            setLoading(false);
            refetch();
            onClose();
          })
          .catch(err => {
            Toast({
              type: 'error',
              message: err?.message,
            });
            setLoading(false);
          });
      }
    }
  };

  const offerText = useCallback(() => {
    const _ = form.getFieldsValue();

    return getOfferDetails({
      offer_type: _?.offer_type?.value,
      offer_details: {
        minimum_amount: _?.minimum_amount ?? 0,
        minimum_visit: _?.minimum_visit?.value ?? 0,
        maximum_amount: _?.maximum_amount ?? 0.0,
        plastk_points_value:
          _?.offer_type?.value === 'initialOffer'
            ? ((state.initial_offer[_?.minimum_visit?.value] / 100) * _?.maximum_amount * 200).toFixed(0)
            : _?.offer_type?.value === 'percentBased'
            ? (_?.maximum_amount * _?.point_value) / 100 / 0.005
            : _?.point_value / 0.005,
        plastk_points: _?.point_value ?? 0.0,
      },
      duration: { startDate: _?.duration?.startDate, endDate: _?.duration?.endDate },
      stores: storeNames,
      state,
    });
  }, [state]);

  const getDefaultStoreImg = stores => {
    setLoadingImg(true);

    let image = '';
    if (stores?.length > 1) {
      setLoadingImg(false);

      return '';
    }
    StoreService.getImageFromPlaceId(stores[0]?.address?.place_id)
      .then(img => {
        if (img?.image) {
          image = img?.image;
        }
        setLoadingImg(false);
      })
      .catch(() => {});
    setLoadingImg(false);

    return image;
  };
  const handlePreview = async onClick => {
    const __ = form.getFieldsValue();

    if (customImg && !customImgSrc) {
      Toast({
        type: 'error',
        message: 'Please upload an image',
      });
      return;
    }
    if (__.offer_type?.value === 'percentBased') {
      if (
        !__.minimum_amount ||
        !__.maximum_amount ||
        !__.point_value ||
        __.maximum_amount === '' ||
        __.minimum_amount === '' ||
        __.point_value === ''
      ) {
        Toast({
          type: 'error',
          message: 'Please fill all the required fields',
        });
        return;
      }
    } else if (__.offer_type?.value === 'repeatVisit') {
      if (!__.minimum_visit || !__.point_value || (__.minimum_visit === '' && __.point_value === '')) {
        Toast({
          type: 'error',
          message: 'Please fill all the required fields',
        });
        return;
      }
    } else if (__.offer_type?.value === 'dollarBased') {
      if (!__.minimum_amount || !__.point_value || (__.minimum_amount === '' && __.point_value === '')) {
        Toast({
          type: 'error',
          message: 'Please fill all the required fields',
        });
        return;
      }
    } else if (__.offer_type?.value === 'initialOffer') {
      if (
        !__.minimum_visit?.value ||
        Object.keys(state?.initial_offer).length !== Object.values(state?.initial_offer).length ||
        (() => {
          const arr = Object.entries(state.initial_offer).map(([key, value]) => {
            if (!value) return false;
            return true;
          });
          return arr.includes(false);
        })()
      ) {
        Toast({
          type: 'error',
          message: 'Please fill all the required fields',
        });
        return;
      }
    }

    if (
      !!__?.offer_type?.value &&
      !!__.duration?.startDate &&
      !!__.duration?.endDate &&
      !!__.name &&
      !!__.selected_stores?.length
    ) {
      if (await validateStores()) {
        const data = {
          stores: stores?.filter(store => selectedStores?.includes(store._id)),
          offer_type: __?.offer_type.value,
          duration: { startDate: __?.duration?.startDate, endDate: __?.duration?.endDate },
          name: __?.name,
          offer_details: {
            minimum_amount: __?.minimum_amount ?? 0,
            minimum_visit: __?.minimum_visit?.value ?? 0,
            maximum_amount: __?.maximum_amount ?? 0,
            minimum_plastk_point_value:
              __?.offer_type?.value === 'percentBased' ? (__?.maximum_amount * __?.point_value) / 100 / 0.005 : 0,
            plastk_points_value:
              __?.offer_type?.value === 'initialOffer'
                ? ((state.initial_offer[__?.minimum_visit?.value] / 100) * __?.maximum_amount * 200).toFixed(0)
                : __?.point_value / 0.005,
            plastk_points: __?.point_value ?? 0,
            initial_offer: getInitialOfferObj(),
          },
          image_url: customImg && customImgSrc ? customImgSrc : getDefaultStoreImg(stores),
        };
        if (!loadingImg) {
          setPreviewData(data);

          onClick();
        }
      }
    } else {
      Toast({
        type: 'error',
        message: 'Please fill all the required fields',
      });
    }
  };
  const handleDate = async ({ target: value, message, isValid = true }) => {
    if (value?.value?.startDate) {
      form.setFieldsValue({ duration: value?.value });
      if (!isValid) {
        setDateValid(false);

        form.setFieldsError({ duration: { message } });
      } else {
        setDateValid(true);

        if (!current1) {
          setCurrent1(value?.value);
        } else {
          // current is available

          setPrevDuration(current1);
          setCurrent2(value?.value);
        }
      }
      if (isValid) {
        if (!extend) {
          if (stores.length) {
            try {
              const res = await PromotionService.checkStoresInOtherCampaigns({
                stores: stores?.map(({ _id }) => _id),
                startDate: formatISO(value?.value?.startDate),
                id: clone ? '' : promotion?._id,
                selected_stores: selectedStores,
                businessId: business.user_id,
              });
              if (res?.options?.length) {
                setDisabledOptions(res?.options);

                const storeGroupIds = form?.getFieldValue('selected_stores')?.map(({ _id }) => _id) ?? [];
                const selectedStores = res?.options?.filter(({ value }) => storeGroupIds?.includes(value));
                let selectedStoreGroups =
                  res?.options?.filter(grps => grps.stores)?.filter(({ _id }) => storeGroupIds?.includes(_id)) ?? [];
                selectedStoreGroups = selectedStoreGroups.length
                  ? selectedStoreGroups?.map(({ stores }) => stores)?.flat()
                  : [];

                filterStoresAndGroups({ selectedStores, selectedStoreGroups, disabledOptions: res?.options });
                //-----------------------------

                setDateCheck(true);

                const stores = form?.getFieldValue('selected_stores') ?? [];

                if (stores?.length) {
                  const disabledStores = res?.options
                    .filter(store => stores.map(({ _id }) => _id).includes(store._id) && store.isDisabled)
                    .map(({ _id }) => _id);
                  const filteredStores = stores.filter(_ => !disabledStores?.includes(_._id));

                  //------------------------------

                  //------------------------------

                  // disabled stores = storesId that will be removed from the list
                  const removeStores = stores
                    ?.filter(grp => !grp.stores)
                    ?.filter(stores => disabledStores?.includes(stores._id))
                    .map(({ name }) => name);
                  const removeGrps = stores
                    ?.filter(grp => grp.stores)
                    .filter(grp => grp.stores.map(id => disabledStores.includes(id)))
                    .map(({ label }) => `${label}-Group`);

                  if (disabledStores?.length) {
                    setRemovedStores([...removeStores, ...removeGrps]); // names of stores which will be removed
                    setFilteredStores(filteredStores); // stores which will be kept
                    // open modal
                    setIsVisible(true);
                  }

                  if (!promotion && !clone && disabledStores?.length) {
                    Toast({
                      type: 'error',
                      message: res?.message,
                    });
                  }
                }
              }
            } catch (er) {
              Toast({
                type: 'error',
                message: er?.message,
              });
            }
          }
        }
      }
    } else {
      setDateCheck(false);
      setPrevDuration(null);
      setCurrent1(null);
      setCurrent2(null);
      filterStoresAndGroups({ selectedStores: [], selectedStoreGroups: [], disabledOptions: [] });

      form.setFieldsValue({ duration: '', selected_stores: [] });
      form.setFieldsError({ selected_stores: undefined });
      setSelectedStores([]);
    }
  };

  const handleOfferType = async ({ target: value }) => {
    if (value?.value) {
      form.setFieldsValue({
        offer_type: value?.value,
        minimum_amount: '',
        maximum_amount: '',
        max_spend_value: '',
        point_value: '',
        minimum_visit: '',
        plastk_points: '',
      });
      form.setFieldsError({
        minimum_amount: undefined,
        maximum_amount: undefined,
        max_spend_value: undefined,
        point_value: undefined,
        minimum_visit: undefined,
        plastk_points: undefined,
      });
    }
  };
  const resetOfferFields = () => {
    form.setFieldsValue({
      minimum_amount: '',
      maximum_amount: '',
      max_spend_value: '',
      point_value: '',
      minimum_visit: '',
      plastk_points: '',
    });
    form.setFieldsError({
      minimum_amount: undefined,
      maximum_amount: undefined,
      max_spend_value: undefined,
      point_value: undefined,
      minimum_visit: undefined,
      plastk_points: undefined,
    });
  };
  const ExistingStores = ({ stores, filteredStores }) => {
    const onRemove = () => {
      if (!filteredStores.length) {
        form.setFieldsValue({ selected_stores: [], store_groups: [] });
        // remove all stores from selected stores
        setSelectedStores([]);
      } else {
        // remove disabled ones
        form.setFieldsValue({ selected_stores: filteredStores });
        // get store names from selected stores which will be removed
        setSelectedStores([...filteredStores?.map(({ _id }) => _id)]);
      }
      setIsVisible(false);
    };
    const onCancel = () => {
      if (!prevDuration) {
        form.setFieldsValue({ duration: '' });
        setCurrent1(null);
      } else {
        form.setFieldsValue({ duration: prevDuration });
        setCurrent2(null);
      }
      setIsVisible(false);
    };
    return (
      <div>
        <Paragraph xl>
          These stores already exists in other promotions and will be <strong>removed</strong> on clicking Remove. If
          you cancel, your promotion duration will be set to <strong>previous</strong> selected duration
        </Paragraph>
        <StyledList ordered>
          {stores.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </StyledList>
        <BtnHolder>
          <Button type="light" css="margin: 0 5px;" rounded sm width="150" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            type="danger"
            css="margin: 0 5px;"
            rounded
            sm
            width="150"
            onClick={() => {
              onRemove();
            }}>
            Remove
          </Button>
        </BtnHolder>
      </div>
    );
  };
  const ExistingStoresModal = () => (
    <>
      <ModalContainer
        isOpen
        title="Remove Stores"
        isClosable={false}
        width="900"
        content={() => <ExistingStores stores={removedStores} filteredStores={filteredStores} />}
      />
    </>
  );

  return (
    <>
      {/* {isVisible && <ExistingStoresModal />} */}
      <Form
        form={form}
        onSubmit={handleSubmit}
        onTouched={e => {
          setState(_ => ({ ..._, ...e }));
        }}>
        <FieldHolder>
          <Heading level={2}>Step 1: Promotion Details</Heading>
          <Grid xs={1} md={2} lg={3} colGap={{ xs: 20, md: 28 }} rowGap={1}>
            <Form.Item
              type="text"
              label="Promotion Name"
              name="name"
              // disabled={!!extend}
              disabled
              placeholder="Promotion #4"
              rules={[
                { required: true, message: 'Promotion Name is required' },
                {
                  pattern: /^[a-zA-Z0-9 .;:'"/?,[\]{}()-=_+*&^%$#@!~`]{3,40}$/,

                  message: 'Please Enter a valid Promotion Name (minimum 3 and maximum 40 characters)',
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              label="Promotion Duration"
              name="duration"
              type="initialOffer"
              extend={extend}
              value={state?.duration}
              promotion={!!promotion}
              rules={[
                { required: true, message: 'Date is required' },
                {
                  transform: value => {
                    if (value && value?.isValid === false) {
                      Toast({
                        type: 'error',
                        message: value?.message,
                      });
                      return true;
                    }
                    return false;
                  },
                  message: 'Please select a valid duration',
                },
              ]}
              onChange={handleDate}
              form={form}
              labelIcon={
                <Icon
                  showTooltip
                  size="1rem"
                  toolTipContent="On remove duration all selected stores will be removed"
                  iconName="help_outline"
                />
              }>
              <RcPicker />
            </Form.Item>
          </Grid>
        </FieldHolder>
        <FieldHolder>
          <Heading level={2}>Step 2: Select Stores</Heading>
          <Grid xs={1} md={2} lg={3} colGap={{ xs: 20, md: 28 }} rowGap={1}>
            <Form.Item
              id="province"
              type="select"
              label="Select Province"
              name="province"
              isMulti
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              labelIcon={
                <Icon
                  size="1rem"
                  showTooltip
                  toolTipContent="Select duration to see provinces"
                  iconName="help_outline"
                />
              }
              disabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              isDisabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              options={filteredProvinces}
              onChange={handleProvince}
              placeholder="All"
              rules={[{ required: true, message: 'Select a Province' }]}>
              <Select />
            </Form.Item>
            <Form.Item
              id="city"
              type="select"
              label="Select City"
              name="city"
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              isMulti
              labelIcon={
                <Icon size="1rem" showTooltip toolTipContent="Select duration to see cities" iconName="help_outline" />
              }
              options={filteredCities}
              onChange={handleCity}
              placeholder="All"
              disabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              isDisabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              rules={[{ required: true, message: 'Select a City' }]}>
              <Select />
            </Form.Item>
            <Form.Item
              id="store"
              type="select"
              label="Select Stores / Groups"
              name="selected_stores"
              loading={stores_loading}
              options={combinedOptions}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              isMulti
              labelIcon={
                <Icon size="1rem" showTooltip toolTipContent="Select duration to see stores" iconName="help_outline" />
              }
              disabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              isDisabled={!form?.getFieldValue('duration')?.startDate || !!extend || !dateValid}
              onChange={handleStore}
              placeholder="All"
              rules={[{ required: true, message: 'Please select a store' }]}>
              <Select />
            </Form.Item>
          </Grid>
        </FieldHolder>
        <FieldHolder>
          <Heading level={2}>Step 3: Offer Details</Heading>
          <Grid xs={1} md={2} lg={3} colGap={{ xs: 20, md: 28 }} rowGap={1}>
            <Form.Item
              id="offer"
              type="select"
              label="Offer type"
              name="offer_type"
              disabled={
                !!extend ||
                form.getFieldValue('selected_stores')?.length === 0 ||
                form.getFieldValue('selected_stores')?.length === undefined
              }
              //   isDisabled={
              //     !!extend ||
              //     form.getFieldValue('selected_stores')?.length === 0 ||
              //     form.getFieldValue('selected_stores')?.length === undefined
              //   }
              isDisabled
              options={SelectOfferType}
              placeholder="Offer Type"
              onChange={handleOfferType}
              rules={[{ required: true, message: 'Please Select an Offer Type' }]}>
              <Select />
            </Form.Item>

            <Form.Item
              type="number"
              label="Minimum Amount Spent"
              disabled={!!extend}
              prefix="$"
              name="minimum_amount"
              placeholder="$0"
              rules={[
                { required: true, message: 'Minimum Amount is required' },
                {
                  pattern: /^[1-9]+[0-9]*$/,
                  message: 'Enter whole numbers only',
                },
                {
                  pattern: /^.{0,20}$/,
                  message: 'Maximum Character Limit Is 20',
                },
                {
                  transform: value => +value <= 0,
                  message: `Amount should be greater than $ 0`,
                },
              ]}>
              <Field />
            </Form.Item>

            <Form.Item
              type="number"
              label="Maximum Amount"
              name="maximum_amount"
              disabled={!!extend}
              placeholder="$0"
              prefix="$"
              rules={[
                { required: true, message: 'Maximum Amount is required' },
                {
                  pattern: /^[1-9]+[0-9]*$/,
                  message: 'Enter whole numbers only',
                },
                {
                  transform: value => +value <= 0,
                  message: `Amount should be greater than $ 0`,
                },
                {
                  transform: value => +value <= +form.getFieldValue('minimum_amount'),
                  message: `Amount should be greater than minimum amount`,
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              type="number"
              label="Expected Budget"
              prefix="$"
              name="max_spend_value"
              placeholder="MAX Limit you want to spend on this promotion"
              rules={[
                { required: true, message: 'Expected Budget is required' },
                { pattern: /^[0-9]*(\.[0-9]{0,2})?$/, message: 'Only 2 decimal places allowed' },
                {
                  transform: value => +value <= 0,
                  message: `Amount should be greater than $ 0`,
                },
                {
                  transform: value => +value < +form.getFieldValue('maximum_amount'),
                  message: `Amount should be greater than or equal to Maximum Amount`,
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              label="Maximum Visits"
              name="minimum_visit"
              disabled={!!extend}
              options={MinimumVisits}
              placeholder="no of visits"
              rules={[{ required: true, message: 'Minimum Visits is required' }]}>
              <Select />
            </Form.Item>
          </Grid>
          {state?.minimum_visit?.value && (
            <VisitsHolder>
              <Heading level={4}>Enter amount per visit</Heading>
              <Grid xs={1} md={2} lg={5} colGap={{ xs: 20, md: 15 }} rowGap={1}>
                {Array(state?.minimum_visit?.value)
                  .fill(null)
                  .map((_, i) => i + 1)
                  .map(visit => (
                    <Form.Item
                      type="number"
                      label={`${(() => {
                        switch (visit) {
                          case 1:
                            return `${String(visit)}st`;
                          case 2:
                            return `${String(visit)}nd`;
                          case 3:
                            return `${String(visit)}rd`;
                          default:
                            return `${String(visit)}th`;
                        }
                      })()} Visit`}
                      name={`offer_on_visit_${visit}`}
                      onChange={({ target: { value } }) => {
                        handleOfferVisits(value, `offer_on_visit_${visit}`, visit);
                      }}
                      placeholder="in Plastk Points"
                      prefix="%"
                      rules={[
                        { required: true, message: 'Amount is required' },

                        {
                          pattern: /^[1-9]+[0-9]*$/,
                          message: 'Enter whole numbers only',
                        },
                        {
                          transform: value => +value <= 0,
                          message: `Amount should be greater than $ 0`,
                        },
                      ]}>
                      <Field />
                    </Form.Item>
                  ))}
              </Grid>
            </VisitsHolder>
          )}
          {(state?.duration?.startDate &&
            state?.duration?.endDate &&
            state?.offer_type?.value &&
            state?.point_value > 0 &&
            state.selected_stores?.length) ||
          (state?.duration?.startDate &&
            state?.duration?.endDate &&
            state?.offer_type?.value &&
            state?.minimum_visit?.value &&
            state?.initial_offer[state?.minimum_visit?.value] &&
            Object.keys(state?.initial_offer).length === state?.minimum_visit?.value &&
            state.selected_stores?.length) ? (
            state?.offer_type?.value === 'initialOffer' ? (
              offerText()
            ) : (
              <TextWrap>{offerText()}</TextWrap>
            )
          ) : null}
        </FieldHolder>
        <FieldHolder>
          <Heading level={2}>Step 4: Image & Preview</Heading>
          <Holder>
            <LeftColumn>
              <RadioWrap>
                <Field
                  id="default_img"
                  type="radio"
                  label="Use Default Store Image"
                  name="radio1"
                  value={defaultImg}
                  disabled={!!extend}
                  onChange={handleDefaultImg}
                />
                <Field
                  id="custom_img"
                  type="radio"
                  label="Use Custom Promotion Image"
                  name="radio1"
                  value={customImg}
                  disabled={!!extend}
                  onChange={handleCustomImg}
                />
              </RadioWrap>
              {customImg && (
                <Upload
                  allowPreview
                  uploadBtnText="Upload Promotion Image"
                  name="Promotion Image"
                  value={customImgSrc}
                  onChange={info => {
                    onUploadImg(info);
                  }}
                />
              )}
            </LeftColumn>
          </Holder>
        </FieldHolder>

        <BtnHolder>
          <ModalContainer
            title="Preview"
            width={1020}
            imgPreview
            btnComponent={({ onClick }) => (
              <Button
                css="margin: 0 5px;"
                type="light"
                rounded
                sm
                width="175"
                onClick={() => {
                  handlePreview(onClick);
                }}>
                Preview
              </Button>
            )}
            content={({ onClose }) => <PromotionPreviewModal onClose={onClose} promotion={previewData} />}
          />
          <Button css="margin: 0 5px;" type="primary" rounded sm width="150" htmlType="submit" loading={loading}>
            {extend ? 'Extend' : promotion && !clone ? 'Update' : 'Create'}
          </Button>
        </BtnHolder>
      </Form>
    </>
  );
}

export default CreatePromotion;
