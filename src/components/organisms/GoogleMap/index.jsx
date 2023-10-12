import React, { useRef } from 'react';
import { GoogleMap as Map, Marker, useJsApiLoader } from '@react-google-maps/api';

const GoogleMap = ({ style, onLoad, onUnmount, marker, ...rest }) => {
  const ref = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  return isLoaded ? (
    <Map {...rest} ref={ref} mapContainerStyle={style} zoom={15} onLoad={onLoad} onUnmount={onUnmount}>
      <Marker position={marker} />
    </Map>
  ) : (
    'Loading Map ...'
  );
};

export default GoogleMap;
