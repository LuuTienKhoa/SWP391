// ConsignKoiTable.js
import React from 'react';

const ConsignKoiTable = ({ consignKois, startEditing, handleDelete }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Name</th>
          <th className="py-3 px-6 text-left">Gender</th>
          <th className="py-3 px-6 text-left">Age</th>
          <th className="py-3 px-6 text-left">Size</th>
          <th className="py-3 px-6 text-left">Color</th>
          <th className="py-3 px-6 text-left">Price</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {consignKois.map((koi) => (
          <tr key={koi.consignmentKoiID} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">{koi.name}</td>
            <td className="py-3 px-6 text-left">{koi.gender}</td>
            <td className="py-3 px-6 text-left">{koi.age}</td>
            <td className="py-3 px-6 text-left">{koi.size}</td>
            <td className="py-3 px-6 text-left">{koi.color}</td>
            <td className="py-3 px-6 text-left">{koi.price}</td>
            <td className="py-3 px-6 text-center">
              <button 
                onClick={() => startEditing(koi)} 
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(koi.consignmentKoiID)} 
                className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConsignKoiTable;
