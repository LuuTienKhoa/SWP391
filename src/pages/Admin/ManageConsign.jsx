import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import ConsignmentTable from '../Consignment/ConsignTable';
import EditConsignmentForm from '../Consignment/EditAndCreateConsign';
import Modal from '../../components/Modal/Modal';

const ManageConsignmentPage = () => {
  const [consignments, setConsignments] = useState([]);
  const [editConsignmentId, setEditConsignmentId] = useState(null);
  const [newConsignment, setNewConsignment] = useState({
    customerID: '',
    type: '',
    fosterPrice: '',
    status: 0
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const response = await api.get('/Consignment/');
      setConsignments(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch consignments');
    }
  };

  const handleCreateConsignment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.post('/Consignment/create', newConsignment, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 201) {
        setConsignments([...consignments, response.data]);
        setShowCreateForm(false);
        setNewConsignment({
          customerID: '',
          consignmentKoiID: '',
          type: '',
          fosterPrice: '',
          status: 0
        });
      } else {
        setErrorMessage("Consignment creation failed");
      }
    } catch (err) {
      setErrorMessage("Failed to create consignment");
    }
  };

  const handleEditConsignment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      // Updated payload to include consignmentID
      const payload = {
        consignmentID: editConsignmentId,  
        customerID: newConsignment.customerID,
        type: newConsignment.type,
        fosterPrice: newConsignment.fosterPrice,
        status: newConsignment.status
      };
  
      console.log("Payload for editing consignment:", payload);
  
      const response = await api.put(`/Consignment/${editConsignmentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      console.log("Response status for edit:", response.status);
  
      if (response.status === 204 || response.status === 200) {
        setConsignments(consignments.map((consignment) =>
          (consignment.consignmentID === editConsignmentId ? { ...newConsignment, consignmentID: editConsignmentId } : consignment)
        ));
        setShowEditForm(false);
        setEditConsignmentId(null);
        setErrorMessage('');
      } else {
        console.error("Unexpected status:", response.status);
        setErrorMessage("Consignment edit failed with unexpected status.");
      }
    } catch (err) {
      console.error("Failed to edit consignment", err);
      setErrorMessage("Failed to edit consignment due to an unknown error.");
    }
  };
  
  const startEditing = (consignment) => {
    setNewConsignment({
      customerID: consignment.customerID || '', 
      type: consignment.type || '',
      fosterPrice: consignment.fosterPrice || '',
      status: consignment.status || 0,
      name: consignment.name  || '',
    });
    setEditConsignmentId(consignment.consignmentID);
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleDeleteConsignment = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this consignment?')) return;
      await api.delete(`/Consignment/${id}`);
      setConsignments(consignments.filter((consignment) => consignment.consignmentID !== id));
    } catch (error) {
      setErrorMessage('Failed to delete consignment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConsignment((prevConsignment) => ({
      ...prevConsignment,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Consignments</h1>
      <div className="text-center mb-6">
        <button onClick={() => setShowCreateForm(true)} className="bg-green-500 text-white px-4 py-2 rounded">Create New Consignment</button>
      </div>

      <ConsignmentTable
        consignments={consignments}
        startEditing={startEditing}
        handleDelete={handleDeleteConsignment}
      />

      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <EditConsignmentForm
            newConsignment={newConsignment}
            handleChange={handleChange}
            handleSave={handleEditConsignment}
          />
        </Modal>
      )}

      {showCreateForm && (
        <Modal onClose={() => setShowCreateForm(false)}>
          <EditConsignmentForm
            newConsignment={newConsignment}
            handleChange={handleChange}
            handleSave={handleCreateConsignment}
            isCreating={true}  // Pass a flag for conditional rendering
          />
        </Modal>
      )}

      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ManageConsignmentPage;
