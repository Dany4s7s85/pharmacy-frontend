import React, { useEffect, useRef, useState } from 'react';

import Field from '../../molecules/Field';

let autoComplete;
const PlacesAutoComplete = ({ search = '', onChange = () => {}, ...rest }) => {
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  const handlePlaceSelect = async () => {
    const { address_components, geometry, place_id, formatted_address } = autoComplete.getPlace();
    const address = {};
    address_components?.forEach(({ short_name, types }) => {
      if (types.includes('administrative_area_level_1')) {
        address.state = short_name;
      } else if (types.includes('administrative_area_level_2')) {
        address.county = short_name;
      } else if (types.includes('locality')) {
        address.city = short_name;
      } else address[types[0]] = short_name;
    });
    setQuery(formatted_address);
    onChange({
      target: {
        value: {
          ...address,
          place_id,
          latlng: {
            lat: geometry?.location?.lat(),
            lng: geometry?.location?.lng(),
          },
          formatted_address,
        },
        name: rest.name,
      },
    });
  };

  const handleScriptLoad = () => {
    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      componentRestrictions: { country: ['CA'] },
    });
    autoComplete.addListener('place_changed', () => handlePlaceSelect());
    autoCompleteRef.current.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  };

  useEffect(() => {
    handleScriptLoad();
  }, []);

  return (
    <Field
      {...rest}
      ref={autoCompleteRef}
      onChange={event => {
        setQuery(event.target.value);
      }}
      placeholder="Search Here"
      value={query}
    />
  );
};
export default PlacesAutoComplete;
