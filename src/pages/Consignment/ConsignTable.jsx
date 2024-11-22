import React, { useState } from 'react';

const ConsignmentTable = ({ 
  consignments, 
  startEditing, 
  handleDelete, 
  handleUpdateKoiPrice,
  editingKoiPrice,
  setEditingKoiPrice 
}) => {
  const [tempPrice, setTempPrice] = useState('');

  const handlePriceClick = (koi, currentPrice) => {
    setEditingKoiPrice(koi.consignmentKoiID);
    setTempPrice(currentPrice);
  };

  const handlePriceSubmit = (koi) => {
    if (tempPrice && !isNaN(tempPrice) && parseFloat(tempPrice) >= 0) {
      handleUpdateKoiPrice(koi, tempPrice);
    } else {
      alert('Please enter a valid price (must be 0 or greater)');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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
          <th className="p-2 border">Type</th>
          <th className="p-2 border">Selling Price</th>
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
            <td className="p-2 border">
              {consignment.type === 0 ? <span title="Sell">🛒</span> : <span title="Foster">🤝</span>}
            </td>
            <td className="p-2 border">
              {consignment.type === 0 ? (
                editingKoiPrice === consignment.consignmentKois?.[0]?.consignmentKoiID ? (
                  <div className="flex items-center space-x-2 justify-center">
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="w-32 px-2 py-1 border rounded"
                      min="0"
                      step="1000"
                    />
                    <button
                      onClick={() => handlePriceSubmit(consignment.consignmentKois[0])}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      title="Save price"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditingKoiPrice(null)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      title="Cancel"
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => handlePriceClick(
                      consignment.consignmentKois?.[0],
                      consignment.consignmentKois?.[0]?.price
                    )}
                    className="cursor-pointer hover:text-blue-500"
                    title="Click to edit price"
                  >
                    {formatCurrency(consignment.consignmentKois?.[0]?.price || 0)}
                  </span>
                )
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </td>
            <td className="p-2 border">{formatCurrency(consignment.fosterPrice)}</td>
            <td className="p-2 border">{formatCurrency(consignment.consignmentPriceList?.pricePerDay)}</td>
            <td className="p-2 border">{formatDate(consignment.startDate)}</td>
            <td className="p-2 border">{formatDate(consignment.endDate)}</td>
            <td className="p-2 border">{getStatusLabel(consignment.status)}</td>
            <td className="p-2 border">
              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => startEditing(consignment)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600"
                  title="Edit consignment"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(consignment.consignmentID)} 
                  className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                  title="Delete consignment"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConsignmentTable;
