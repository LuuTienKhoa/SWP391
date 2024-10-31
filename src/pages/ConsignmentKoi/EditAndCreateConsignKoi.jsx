// EditAndCreateConsignForm.js
import React from 'react';
import api from '../../config/axios';

const EditAndCreateConsignForm = ({ koi, setKoi, fetchConsignKois, editKoiId, isCreating }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setKoi((prevKoi) => ({ ...prevKoi, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isCreating) {
        await api.post('/ConsignmentKoi', koi);
      } else {
        await api.put(`/ConsignmentKoi/${editKoiId}`, koi);
      }
      fetchConsignKois();
    } catch (error) {
      console.error('Error saving consignment koi:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" value={koi.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="gender" value={koi.gender} onChange={handleChange} placeholder="Gender" required />
      <input type="number" name="age" value={koi.age} onChange={handleChange} placeholder="Age" required />
      <input type="text" name="size" value={koi.size} onChange={handleChange} placeholder="Size" />
      <input type="text" name="color" value={koi.color} onChange={handleChange} placeholder="Color" />
      <input type="number" name="price" value={koi.price} onChange={handleChange} placeholder="Price" required />
      <input type="number" name="fosteringDays" value={koi.fosteringDays} onChange={handleChange} placeholder="Fostering Days" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {isCreating ? 'Create Consignment Koi' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditAndCreateConsignForm;
