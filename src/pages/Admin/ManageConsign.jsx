import  { useState, useEffect } from 'react';
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
    type: 0,
    fosterPrice: '',
    status: 0,
    priceListId: 0,
    startDate: '',
    endDate: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [editingKoiPrice, setEditingKoiPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const response = await api.get('/Consignment/');
      const consignmentsWithPrice = response.data.map(consignment => ({
        ...consignment,
        price: consignment.consignmentKois?.[0]?.price || 'N/A'
      }));
      const sortedConsignments = consignmentsWithPrice.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA; // Descending order
      });
  
      setConsignments(sortedConsignments);
    } catch (err) {
      console.log(err);
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
          type: 0,
          status: 0
        });
      } else {
        setErrorMessage("Consignment creation failed");
      }
    } catch (err) {
      console.log(err);
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
  
      const payload = {
        consignmentID: editConsignmentId,  
        customerID: newConsignment.customerID,
        type: parseInt(newConsignment.type, 10),
        fosterPrice: newConsignment.fosterPrice || 0,
        status: parseInt(newConsignment.status, 10),
        startDate: newConsignment.startDate ? new Date(newConsignment.startDate).toISOString() : '',  
        endDate: newConsignment.endDate ? new Date(newConsignment.endDate).toISOString() : '',
        priceListId: newConsignment.priceListId || 1,
      };
      
      console.log("Payload for editing consignment:", payload);
  
      const response = await api.put(`/Consignment/Update`, payload, {
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
        await fetchConsignments();
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
      type: consignment.type || 0,
      status: consignment.status || 0,
      fosterPrice: consignment.fosterPrice || '',
      name: consignment.name || '',
      startDate: consignment.startDate || '', 
      endDate: consignment.endDate || ''
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
      console.log(error);
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

    // Filter consignments based on selected status
    const filteredConsignments = filteredStatus !== null
    ? consignments.filter((consignment) => consignment.status === filteredStatus)
    : consignments;

  const handleUpdateKoiPrice = async (consignmentKoi, newPrice) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create a default object with all required fields
      const defaultKoi = {
        name: '',
        gender: '',
        age: 0,
        size: '',
        color: '',
        dailyFeedAmount: '',
        personality: '',
        origin: '',
        selectionRate: '',
        species: '',
        price: 0,
        consignmentID: consignmentKoi?.consignmentID || 0,
        addOnId: consignmentKoi?.addOnId || null,
        addOn: {
          addOnID: consignmentKoi?.addOn?.addOnID || null,
          originCertificate: null,
          healthCertificate: null,
          ownershipCertificate: null,
          koiID: null,
          consignmentKoiID: consignmentKoi?.consignmentKoiID || null,
          koiInventoryID: null
        },
        ...consignmentKoi // Spread the actual koi data over defaults
      };

      const formData = new FormData();
      
      // Append all fields with null checks and default values
      formData.append('name', defaultKoi.name);
      formData.append('gender', defaultKoi.gender);
      formData.append('age', defaultKoi.age.toString());
      formData.append('size', defaultKoi.size);
      formData.append('color', defaultKoi.color);
      formData.append('dailyFeedAmount', defaultKoi.dailyFeedAmount);
      formData.append('personality', defaultKoi.personality);
      formData.append('origin', defaultKoi.origin);
      formData.append('selectionRate', defaultKoi.selectionRate);
      formData.append('species', defaultKoi.species);
      formData.append('price', newPrice.toString());
      formData.append('consignmentId', defaultKoi.consignmentID.toString());

      // Add addOn related fields
      if (defaultKoi.addOnId) {
        formData.append('addOnId', defaultKoi.addOnId.toString());
      }

      // Add addOn object fields if they exist
      if (defaultKoi.addOn) {
        formData.append('addOn.addOnID', defaultKoi.addOn.addOnID?.toString() || '');
        formData.append('addOn.originCertificate', defaultKoi.addOn.originCertificate || '');
        formData.append('addOn.healthCertificate', defaultKoi.addOn.healthCertificate || '');
        formData.append('addOn.ownershipCertificate', defaultKoi.addOn.ownershipCertificate || '');
        formData.append('addOn.koiID', defaultKoi.addOn.koiID?.toString() || '');
        formData.append('addOn.consignmentKoiID', defaultKoi.addOn.consignmentKoiID?.toString() || '');
        formData.append('addOn.koiInventoryID', defaultKoi.addOn.koiInventoryID?.toString() || '');
      }

      const response = await api.put(
        `/ConsignmentKoi/${consignmentKoi.consignmentKoiID}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.status === 200) {
        await fetchConsignments();
        setEditingKoiPrice(null);
        setErrorMessage('');
      } else {
        setErrorMessage("Failed to update Koi price");
      }
    } catch (err) {
      console.error("Failed to update Koi price", err);
      setErrorMessage(err.response?.data?.message || "Failed to update Koi price");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Consignments</h1>
      {/* Filter Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button onClick={() => setFilteredStatus(null)} className="bg-gray-300 text-black px-4 py-2 rounded">All</button>
        <button onClick={() => setFilteredStatus(0)} className="bg-yellow-500 text-white px-4 py-2 rounded">Awaiting Payement</button>
        <button onClick={() => setFilteredStatus(1)} className="bg-green-500 text-white px-4 py-2 rounded">Available</button>
        <button onClick={() => setFilteredStatus(2)} className="bg-blue-500 text-white px-4 py-2 rounded">Finished</button>
        <button onClick={() => setFilteredStatus(3)} className="bg-orange-500 text-white px-4 py-2 rounded">Raising</button>
        <button onClick={() => setFilteredStatus(4)} className="bg-red-500 text-white px-4 py-2 rounded">Pending</button>
        <button onClick={() => setFilteredStatus(5)} className="bg-red-500 text-white px-4 py-2 rounded">Negotiate</button>
      </div>
      <div className="text-center mb-6">
        <button onClick={() => setShowCreateForm(true)} className="bg-green-500 text-white px-4 py-2 rounded">Create New Consignment</button>
      </div>

      <ConsignmentTable
        consignments={filteredConsignments.map(consignment => ({
          ...consignment,
          price: consignment.price
        }))}
        startEditing={startEditing}
        handleDelete={handleDeleteConsignment}
        handleUpdateKoiPrice={handleUpdateKoiPrice}
        editingKoiPrice={editingKoiPrice}
        setEditingKoiPrice={setEditingKoiPrice}
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
            customerID={newConsignment.customerID}
          />
        </Modal>
      )}

      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ManageConsignmentPage;
