import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap as Map, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import Skeleton from 'react-loading-skeleton';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import pointimg from '../../../assets/images/points.svg';
import { ImgHolder, PointsWrap, InfoDetail, Name } from './MapBlock.styles';
import { Img, PointText } from '../../organisms/StoreColumn/StoreColumn.styles';
import { AuthContext } from '../../../context/authContext';
import storeimg from '../../../assets/images/img02.jpg';

function BusinessMap({ campaignsData }) {
  const [selected, setSelected] = useState({});
  const [center, setCenter] = useState({ lat: 51.044308, lng: -114.0630914 });
  const [visible, setVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const { user } = useContext(AuthContext);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const iconSize = 50;
  useEffect(() => {
    const temp = [];
    campaignsData?.stores?.forEach(element => {
      temp.push({
        name: element.name,
        title: element.name,
        img_url: campaignsData?.image_url
          ? campaignsData?.image_url
          : element.image_url
          ? element.image_url
          : user?.attachments?.business_logo?.cloudinary_url
          ? user?.attachments?.business_logo?.cloudinary_url
          : storeimg,
        points:
          campaignsData.offer_type === 'percentBased'
            ? campaignsData?.promotion?.offer_details?.minimum_plastk_point_value
            : campaignsData?.promotion?.offer_details?.plastk_points_value,
        location: {
          lat: element?.address?.latlng?.lat,
          lng: element?.address?.latlng?.lng,
        },
        icon: {
          // Todo: update it to element.category_image_url
          /*    url: `https://www.flaticon.com/svg/static/icons/svg/3448/3448499.svg`, */
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          size: new window.google.maps.Size(iconSize, iconSize),

          scaledSize: new window.google.maps.Size(iconSize, iconSize),
        },
      });
    });
    setLocations(temp);
    setCenter(temp?.[0]?.location ?? { lat: 51.044308, lng: -114.0630914 });
  }, [campaignsData]);
  const onSelect = item => {
    setSelected(item);
    setVisible(true);
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };
  return (
    <>
      {!isLoaded ? (
        <Skeleton height={180} />
      ) : (
        <Map
          google={window.google}
          containerStyle={containerStyle}
          onClick={() => setVisible(false)}
          initialCenter={center}
          center={center}
          zoom={13}
          style={{
            width: '100%',
            height: '180px',
          }}>
          {locations.map((item, key) => (
            <Marker
              title={item.title}
              position={item.location}
              icon={item.icon}
              key={key}
              onClick={() => onSelect(item)}
            />
          ))}
          {selected.location && (
            <InfoWindow
              className="gm-info"
              position={selected.location}
              clickable
              visible={visible}
              onCloseClick={() => setSelected({})}>
              <InfoDetail>
                <Name>{selected.name}</Name>
                <ImgHolder>
                  <img src={selected.img_url} alt="store" />
                </ImgHolder>
                <PointsWrap>
                  <Img src={pointimg} width="16" height="16" alt="img" />
                  <PointText css="justify-content:center">{selected.points}</PointText>
                </PointsWrap>
              </InfoDetail>
            </InfoWindow>
          )}
        </Map>
      )}
    </>
  );
}

export default BusinessMap;
