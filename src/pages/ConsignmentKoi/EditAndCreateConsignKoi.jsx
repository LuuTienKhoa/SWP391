import React from 'react';
import api from '../../config/axios';
import PropTypes from 'prop-types';
import { TextField, Button, Grid, Typography, Box, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const StyledImagePreview = styled('img')({
  marginTop: '16px',
  height: '100px',
  width: '100px',
  borderRadius: '8px',
  objectFit: 'cover',
});

const EditAndCreateConsignForm = ({ koi, setKoi, fetchConsignKois, editKoiId, isCreating }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const intFields = ['age', 'price', 'consignmentID', 'consignmentKoiID'];
    const newValue = intFields.includes(name) ? parseInt(value, 10) : value;

    setKoi((prevKoi) => ({ ...prevKoi, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setKoi((prevKoi) => ({ ...prevKoi, [name]: files[0] }));
    } else {
      setKoi((prevKoi) => ({ ...prevKoi, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', koi.name || '');
      formData.append('gender', koi.gender || '');
      formData.append('age', koi.age || 0);
      formData.append('size', koi.size || '');
      formData.append('color', koi.color || '');
      formData.append('dailyFeedAmount', koi.dailyFeedAmount || '');
      formData.append('personality', koi.personality || '');
      formData.append('origin', koi.origin || '');
      formData.append('selectionRate', koi.selectionRate || '');
      formData.append('species', koi.species || '');
      formData.append('price', koi.price || 0);
      formData.append('consignmentId', koi.consignmentID || 0);

      if (koi.addOn?.addOnID) {
        formData.append('addOnId', koi.addOn.addOnID);
      }
      // Main image
      if (koi.image instanceof File) {
        formData.append('image', koi.image);
      } else {
        formData.append('existingImage', koi.image);
      }

      if (koi.addOn?.originCertificate instanceof File) {
        formData.append('addOn.originCertificate', koi.addOn.originCertificate);
      } else if (koi.addOn?.originCertificate) {
        formData.append('addOn.existingOriginCertificate', koi.addOn.originCertificate);
      }

      if (koi.addOn?.healthCertificate instanceof File) {
        formData.append('addOn.healthCertificate', koi.addOn.healthCertificate);
      } else if (koi.addOn?.healthCertificate) {
        formData.append('addOn.existingHealthCertificate', koi.addOn.healthCertificate);
      }

      if (koi.addOn?.ownershipCertificate instanceof File) {
        formData.append('addOn.ownershipCertificate', koi.addOn.ownershipCertificate);
      } else if (koi.addOn?.ownershipCertificate) {
        formData.append('addOn.existingOwnershipCertificate', koi.addOn.ownershipCertificate);
      }

      if (isCreating) {
        // POST request for creating a new consignment koi
        await api.post('/ConsignmentKoi', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // PUT request for updating an existing consignment koi
        await api.put(`/ConsignmentKoi/${editKoiId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchConsignKois(); // Refresh data after submit
      alert(isCreating ? 'Consignment Koi created successfully!' : 'Changes saved successfully!');
    } catch (error) {
      console.error('Error saving consignment koi:', error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '700px',
        margin: 'auto',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        {isCreating ? 'Create Consignment Koi' : 'Edit Consignment Koi'}
      </Typography>

      <Grid container spacing={2}>
        {/* Input Fields */}
        {[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'gender', label: 'Gender', type: 'text', required: true },
          { name: 'age', label: 'Age', type: 'number', required: true },
          { name: 'size', label: 'Size', type: 'text' },
          { name: 'color', label: 'Color', type: 'text' },
          { name: 'dailyFeedAmount', label: 'Daily Feed Amount', type: 'text' },
          { name: 'personality', label: 'Personality', type: 'text' },
          { name: 'origin', label: 'Origin', type: 'text' },
          { name: 'selectionRate', label: 'Selection Rate', type: 'text' },
          { name: 'species', label: 'Species', type: 'text', required: true },
        ].map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <TextField
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type}
              value={koi[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              variant="outlined"
            />
          </Grid>
        ))}

        {/* Price Field (Editable only if price > 0) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={koi.price || ''}
            onChange={handleChange}
            disabled={koi.price === 0} // Disable if price is 0
            variant="outlined"
          />
        </Grid>

       <Grid container spacing={3} alignItems="center">
  {[
    { name: 'image', label: 'Upload Main Image' },
    { name: 'originCertificate', label: 'Upload Origin Certificate', isAddOn: true },
    { name: 'healthCertificate', label: 'Upload Health Certificate', isAddOn: true },
    { name: 'ownershipCertificate', label: 'Upload Ownership Certificate', isAddOn: true },
  ].map((uploadField) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={3}
      key={uploadField.name}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="subtitle2" mb={1} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {uploadField.label}
      </Typography>
      <input
        type="file"
        name={uploadField.name}
        onChange={handleImageChange}
        style={{ display: 'block', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '90%' }}
      />
      {uploadField.isAddOn && koi.addOn?.[uploadField.name] && (
        <StyledImagePreview
          src={typeof koi.addOn[uploadField.name] === 'string' ? koi.addOn[uploadField.name] : URL.createObjectURL(koi.addOn[uploadField.name])}
          alt={`${uploadField.label} Preview`}
        />
      )}
      {!uploadField.isAddOn && koi[uploadField.name] && (
        <StyledImagePreview
          src={typeof koi[uploadField.name] === 'string' ? koi[uploadField.name] : URL.createObjectURL(koi[uploadField.name])}
          alt={`${uploadField.label} Preview`}
        />
      )}
    </Grid>
  ))}
</Grid>


      </Grid>

      {/* Submit Button */}
      <Box textAlign="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ paddingX: '24px', paddingY: '10px' }}
        >
          {isCreating ? 'Create' : 'Save'}
        </Button>
      </Box>
    </Box >
  );
};

EditAndCreateConsignForm.propTypes = {
  koi: PropTypes.shape({
    name: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.number,
    size: PropTypes.string,
    color: PropTypes.string,
    dailyFeedAmount: PropTypes.string,
    personality: PropTypes.string,
    origin: PropTypes.string,
    selectionRate: PropTypes.string,
    species: PropTypes.string,
    price: PropTypes.number,
    consignmentID: PropTypes.number,
    image: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    addOn: PropTypes.shape({
      originCertificate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
      healthCertificate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
      ownershipCertificate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
    }),
  }).isRequired,
  setKoi: PropTypes.func.isRequired,
  fetchConsignKois: PropTypes.func.isRequired,
  editKoiId: PropTypes.number,
  isCreating: PropTypes.bool,
};
export default EditAndCreateConsignForm;
