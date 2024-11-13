import React from 'react';
import PropTypes from 'prop-types';

const EditConsignmentForm = ({ newConsignment, handleChange, handleSave, customerID }) => {
  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  // Filter status options based on consignment type
  const getStatusOptions = () => {
    if (newConsignment.type === 1) { // Foster type
      return [
        { value: 3, label: 'Raising' },
        { value: 2, label: 'Finished' },
        { value: 5, label: 'Negotiate' },
      ];
    } else if (newConsignment.type === 0) { // Sell type
      return [
        { value: 0, label: 'Awaiting Payment' },
        { value: 1, label: 'Available' },
        { value: 5, label: 'Negotiate' },
      ];
    }
    return [];
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <label>Customer ID</label>
      <input 
        type="text" 
        name="customerID" 
        value={customerID} 
        disabled
        className="w-full p-2 border" 
      />

      {/* Type Field - Read-only when editing */}
      <label>Type</label>
      <select 
        name="type" 
        value={newConsignment.type} 
        onChange={handleChange} 
        className="w-full p-2 border"
        disabled // Make it read-only for editing
      >
        <option value="0">Sell</option>
        <option value="1">Foster</option>
      </select>

      {/* Foster Price Field */}
      <label>Foster Price</label>
      <input 
        type="number" 
        name="fosterPrice" 
        value={newConsignment.fosterPrice} 
        onChange={handleChange} 
        className="w-full p-2 border" 
      />

      {/* Conditional Status Field - Display only relevant statuses based on Type */}
      {newConsignment.type !== undefined && (
        <>
          <label>Status</label>
          <select 
            name="status" 
            value={newConsignment.status} 
            onChange={handleChange} 
            className="w-full p-2 border"
          >
            {getStatusOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Start Date Field */}
      <label>Start Date</label>
      <input
        type="date"
        name="startDate"
        value={formatDate(newConsignment.startDate)}
        onChange={handleChange}
        className="w-full p-2 border"
      />

      {/* End Date Field */}
      <label>End Date</label>
      <input
        type="date"
        name="endDate"
        value={formatDate(newConsignment.endDate)}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">Save</button>
    </form>
  );
};

// Define PropTypes for component props
EditConsignmentForm.propTypes = {
  newConsignment: PropTypes.shape({
    type: PropTypes.number.isRequired,
    fosterPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  customerID: PropTypes.string,
};

export default EditConsignmentForm;
