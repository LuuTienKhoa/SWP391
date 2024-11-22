import React from 'react';
import api from '../../config/axios';
import PropTypes from 'prop-types';
import { TextField, Button, Grid, Typography, Box,MenuItem } from '@mui/material';
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
  
      // Append image files if they exist
      if (koi.image) formData.append('Image', koi.image);
      if (koi.OriginCertificate) formData.append('OriginCertificate', koi.OriginCertificate);
      if (koi.HealthCertificate) formData.append('HealthCertificate', koi.HealthCertificate);
      if (koi.OwnershipCertificate) formData.append('OwnershipCertificate', koi.OwnershipCertificate);
  
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

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" mb={1}>
            Upload Image
          </Typography>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            style={{
              display: 'block',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
            }}
          />
          {koi.image && (
            <StyledImagePreview
              src={typeof koi.image === 'string' ? koi.image : URL.createObjectURL(koi.image)}
              alt="Preview"
            />
          )}
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
    </Box>
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
    image: PropTypes.any,
    OriginCertificate: PropTypes.any,
    HealthCertificate: PropTypes.any,
    OwnershipCertificate: PropTypes.any,
  }).isRequired,
  setKoi: PropTypes.func.isRequired,
  fetchConsignKois: PropTypes.func.isRequired,
  editKoiId: PropTypes.number,
  isCreating: PropTypes.bool,
};
export default EditAndCreateConsignForm;
