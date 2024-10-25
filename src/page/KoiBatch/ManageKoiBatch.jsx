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
    handleFilter();
  }, [name, species, minPrice, maxPrice]);

  const handleFilter = async () => {
    if (name.trim() === '' && species.trim() === '' && minPrice === '' && maxPrice === '') {
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Koi Batches Available</h1>

      <div className="text-center mb-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-2 mr-2" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Batch'}
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2" onClick={() => setFilterVisible(!filterVisible)}>
          {filterVisible ? 'Close' : 'Search Batch'}
        </button>
      </div>

      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Species</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No batches available</td>
            </tr>
          ) : (
            currentPosts.map((batch) => (
              <tr key={batch.batchID} className="text-center border-b">
                <td className="p-2 border">{batch.name}</td>
                <td className="p-2 border">{batch.species}</td>
                <td className="p-2 border">${batch.price}</td>
                <td className="p-2 border">{batch.quantity}</td>
                <td className="p-2 border">{batch.description}</td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(batch.batchID)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">
                    Delete
                  </button>
                  <button onClick={() => handleEdit(batch.batchID)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default ManageKoiBatch;
