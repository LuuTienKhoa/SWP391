import React from 'react';

const ConsignmentTable = ({ consignments, startEditing, handleDelete }) => {
  // Function to map status code to a descriptive label
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Awaiting Payment';
      case 1: return 'Available';
      case 2: return 'Finished';
      case 3: return 'Raising';
      case 4: return 'Pending';
      case 5: return 'Negotiate';
      default: return 'Unknown';
    }
  };

  return (
    <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Consignment ID</th>
          <th className="p-2 border">Customer ID</th>
          <th className="p-2 border">Consignment Koi ID</th>
          <th className="p-2 border">Type</th>
          <th className="p-2 border">Foster Price</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {consignments.map((consignment) => (
          <tr key={consignment.consignmentID} className="text-center border-b">
            <td className="p-2 border">{consignment.consignmentID}</td>
            <td className="p-2 border">{consignment.customerID || 'Unknown'}</td>
            <td className="p-2 border">{consignment.consignmentKois?.[0]?.consignmentKoiID || 'Unknown'}</td>
            <td className="p-2 border">{consignment.type === 0 ? 'Sell' : 'Foster'}</td>
            <td className="p-2 border">{consignment.fosterPrice || 'Unknown'}</td>
            <td className="p-2 border">{getStatusLabel(consignment.status)}</td>
            <td className="p-2 border">
              <button onClick={() => startEditing(consignment)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(consignment.consignmentID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConsignmentTable;
