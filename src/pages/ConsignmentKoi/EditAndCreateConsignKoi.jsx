import React from 'react';
import api from '../../config/axios';
import PropTypes from 'prop-types';
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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isCreating ? 'Create Consignment Koi' : 'Edit Consignment Koi'}
      </h2>

      <div className="grid grid-cols-2 gap-6">
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
          { name: 'price', label: 'Price', type: 'number', required: true },
          { name: 'consignmentID', label: 'Consignment ID', type: 'number', required: true },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={koi[field.name] || ''}
              onChange={handleChange}
              placeholder={`Enter ${field.label}`}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          </div>
        ))}

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="mb-1 font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {koi.image && (
            <img
              src={typeof koi.image === 'string' ? koi.image : URL.createObjectURL(koi.image)}
              alt="Preview"
              className="mt-2 h-24 w-24 object-cover rounded"
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          {isCreating ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
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
    image: PropTypes.any, // Accepting File objects or URLs
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
