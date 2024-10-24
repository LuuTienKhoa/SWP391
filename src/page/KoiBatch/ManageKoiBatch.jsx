import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Pagination from '../../component/Pagination';

const ManageKoiBatch = () => {
  const [batches, setBatches] = useState([]);
  const [editBatchId, setEditBatchId] = useState(null);   
  const [newBatch, setNewBatch] = useState({ name: '', species: '', price: '', quantity: '', description: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); 
  const [filterVisible, setFilterVisible] = useState(false); 
  const [species, setSpecies] = useState('');
  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = batches.slice(firstPostIndex, lastPostIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/batch');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, [navigate]);

    const handleCreateBatch = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.post('/Batch', newBatch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setBatches([...batches, response.data]);
        setShowCreateForm(false);
      } else {
        console.error("Batch creation failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to create batch", err);
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const payload = {
        ...newBatch,
        batchID: editBatchId, 
      };
      const response = await api.put(`/Batch/${editBatchId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Update the batch in the list after editing
        setBatches(batches.map((batch) => (batch.batchID === editBatchId ? { ...newBatch, batchID: editBatchId } : batch)));
        setShowEditForm(false);
        setEditBatchId(null);
      } else {
        console.error("Batch edit failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to edit batch", err);
    }
  };
  const handleDelete = async (batchId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this batch?')) return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.delete(`/Batch/${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setBatches(batches.filter((batch) => batch.batchID !== batchId));
      } else {
        console.error("Batch deletion failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to delete batch", err);
    }
  };
  useEffect(() => {
    handleFilter(); // Gọi hàm lọc khi bất kỳ giá trị nào thay đổi
  }, [name, species, minPrice, maxPrice]); // Theo dõi sự thay đổi của các biến
  

  const handleFilter = async () => {
    if (name.strim == '' && species.trim() === '' && minPrice === '' && maxPrice === '') {
      try {
        const response = await api.get('/batch');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
      return;
    }

    try {
      const response = await api.get('/Batch/Search', {
        params: {
          species: species.trim() !== '' ? species : undefined,
          minPrice: minPrice !== '' ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice !== '' ? parseFloat(maxPrice) : undefined,
          name: name.trim() !== '' ? name : undefined,
        },
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching filtered batches:', error);
    }
  };

  const startEditing = (batch) => {
    setNewBatch({
      name: batch.name,
      species: batch.species,
      price: batch.price,
      quantity: batch.quantity,
      description: batch.description,
    });
    setEditBatchId(batch.batchID);
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Koi Batches Available</h1>

      <div className="text-center mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 mr-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Batch'}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          {filterVisible ? 'Close' : 'Search Batch'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Create New Batch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={newBatch.name}
                onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter batch name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Species</label>
              <input
                type="text"
                value={newBatch.species}
                onChange={(e) => setNewBatch({ ...newBatch, species: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter species"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Price</label>
              <input
                type="number"
                value={newBatch.price}
                onChange={(e) => setNewBatch({ ...newBatch, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={newBatch.quantity}
                onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                value={newBatch.description}
                onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter description"
              />
            </div>
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handleCreateBatch}
          >
            Create Batch
          </button>
        </div>
      )}

      {filterVisible && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Species</label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter species"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter minimum price"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter maximum price"
              />
            </div>
          </div>          
        </div>
      )}

      {showEditForm && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Edit Batch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={newBatch.name}
                onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter batch name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Species</label>
              <input
                type="text"
                value={newBatch.species}
                onChange={(e) => setNewBatch({ ...newBatch, species: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter species"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Price</label>
              <input
                type="number"
                value={newBatch.price}
                onChange={(e) => setNewBatch({ ...newBatch, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={newBatch.quantity}
                onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                value={newBatch.description}
                onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter description"
              />
            </div>
          </div>
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            onClick={handleEdit}
          >
            Save Changes
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPosts.length === 0 ? (
          <p>No batches available</p>
        ) : (
          currentPosts.map((batch) => (
            <div
              key={batch.batchID}
              className="border rounded-lg shadow-lg p-6 text-center bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">Batch: {batch.name}</h2>
              <p className="mb-2"><strong>Price:</strong> ${batch.price}</p>
              <p className="mb-2"><strong>Description:</strong> {batch.description}</p>
              <p className="mb-2"><strong>Quantity Available:</strong> {batch.quantity}</p>
              <p className="mb-4"><strong>Species:</strong> {batch.species}</p>
              <button onClick={() => handleDelete(batch.batchID)} className="bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2">
                Delete
              </button>
              <button onClick={() => startEditing(batch)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2">
                Update
              </button>              
            </div>
          ))
        )}
      </div>

      <Pagination
        totalPosts={batches.length}
        postPerPage={postsPerPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageKoiBatch;
