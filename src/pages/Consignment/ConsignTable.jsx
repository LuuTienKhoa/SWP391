import React from 'react';

const ConsignmentTable = ({ consignments, startEditing, handleDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Function to map status code to a descriptive label with colors and icons
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return <span className="text-yellow-600" title="Awaiting Payment">🕒 Awaiting Payment</span>;
      case 1: return <span className="text-green-600" title="Available">✅ Available</span>;
      case 2: return <span className="text-blue-600" title="Finished">✔️ Finished</span>;
      case 3: return <span className="text-orange-600" title="Raising">🌱 Raising</span>;
      case 4: return <span className="text-purple-600" title="Pending">⏳ Pending</span>;
      case 5: return <span className="text-red-600" title="Negotiate">💬 Negotiate</span>;
      default: return <span className="text-gray-600" title="Unknown">❓ Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
          <th className="p-2 border">Price Per Day</th>         
          <th className="p-2 border">Start Day</th>
          <th className="p-2 border">End Day</th>
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
            <td className="p-2 border">
              {consignment.type === 0 ? <span title="Sell">🛒</span> : <span title="Foster">🤝</span>}
            </td>
            <td className="p-2 border">{formatCurrency(consignment.fosterPrice) || 'Unknown'}</td>
            <td className="p-2 border">{formatCurrency(consignment.consignmentPriceList?.pricePerDay)}</td>
            <td className="p-2 border">{formatDate(consignment.startDate)}</td>
            <td className="p-2 border">{formatDate(consignment.endDate)}</td>
            <td className="p-2 border">{getStatusLabel(consignment.status)}</td>
            <td className="p-2 border">
              <button onClick={() => startEditing(consignment)} className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600">
                ✏️
              </button>
              <button onClick={() => handleDelete(consignment.consignmentID)} className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConsignmentTable;
