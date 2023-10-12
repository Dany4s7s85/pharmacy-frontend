import React, { useState } from 'react';
import Upload from 'components/molecules/Upload';
import equifaxService from 'services/equifaxService';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Label from 'components/atoms/Label';
import Field from 'components/molecules/Field';
import Toast from 'components/molecules/Toast';

const UploadEquifaxTriggerFileForm = () => {
  const [fileDestination, setFileDestination] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFile(e.target);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (fileDestination !== '' && file !== null) {
        const formData = new FormData();
        formData.append(file.name, file.value);
        formData.append('folder', fileDestination);
        const res = await equifaxService.uploadEquifaxTriggerFile(formData);
        if (res) {
          setLoading(false);
          Toast({
            type: 'success',
            message: res.message,
          });
        }
      } else {
        setLoading(false);
        Toast({
          type: 'error',
          message: 'Values Are Missing',
        });
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  return (
    <>
      <Label>Select File Destination</Label>
      <Grid xs={1} sm={3} gap={15}>
        <Field
          type="radio"
          label="inbox"
          name="radio"
          id="inbox"
          onChange={() => {
            setFileDestination('inbox');
          }}
        />
        <Field
          type="radio"
          label="outbox"
          name="radio"
          id="outbox"
          onChange={() => {
            setFileDestination('outbox');
          }}
        />
        <Field
          type="radio"
          label="keys"
          name="radio"
          id="keys"
          onChange={() => {
            setFileDestination('keys');
          }}
        />
      </Grid>

      <Grid xs={1} sm={1} gap={0}>
        <Upload
          label="Upload File"
          name="file"
          uploadBtnText="Click To Upload File"
          onChange={handleChange}
          disabled={fileDestination && true}
        />
      </Grid>

      <Button type="primary" loading={loading} onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};

export default UploadEquifaxTriggerFileForm;
