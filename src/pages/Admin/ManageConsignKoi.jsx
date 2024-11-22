import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import ConsignKoiTable from '../ConsignmentKoi/ConsignKoiTable';
import EditAndCreateConsignForm from '../ConsignmentKoi/EditAndCreateConsignKoi';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination';

const ManageConsignKoi = () => {
  const [consignKois, setConsignKois] = useState([]);
  const [editKoiId, setEditKoiId] = useState(null);
  const [newKoi, setNewKoi] = useState({
    name: '',
    gender: '',
    age: '',
    size: '',
    color: '',
    dailyFeedAmount: '',
    personality: '',
    origin: '',
    selectionRate: '',
    species: '',
    price: '',
    consignmentID: '',
    image: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Number of rows per page

  useEffect(() => {
    fetchConsignKois();
  }, []);

  const fetchConsignKois = async () => {
    try {
      const response = await api.get('/ConsignmentKoi');
      const sortedData = response.data.sort((a, b) => b.consignmentKoiID - a.consignmentKoiID);
      const updatedData = sortedData.map((koi) => ({
        ...koi,
        image: koi.image || '', // Main image
        OriginCertificate: koi.addOn?.OriginCertificate || '',
        HealthCertificate: koi.addOn?.HealthCertificate || '',
        OwnershipCertificate: koi.addOn?.OwnershipCertificate || '',
      }));
  
      setConsignKois(updatedData);
    } catch (error) {
      setErrorMessage('Failed to fetch consignment koi');
    }
  };

  const handleDeleteKoi = async (id) => {
    try {
      await api.delete(`/ConsignmentKoi/${id}`);
      setConsignKois(consignKois.filter((koi) => koi.consignmentKoiID !== id));
    } catch (error) {
      setErrorMessage('Failed to delete consignment koi');
    }
  };

  const startEditing = (koi) => {
    setNewKoi({ 
      ...koi,
      image:koi.image,
      originCertificate: koi.addOn?.originCertificate || '', 
      healthCertificate: koi.addOn?.healthCertificate || '', 
      ownershipCertificate: koi.addOn?.ownershipCertificate || '',
    });
    setEditKoiId(koi.consignmentKoiID);
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  // Calculate displayed rows
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = consignKois.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Consignment Koi</h1>
      <div className="text-center mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Create New Consignment Koi
        </button>
      </div>

      {/* Display Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <ConsignKoiTable
          consignKois={currentPosts}
          startEditing={startEditing}
          handleDelete={handleDeleteKoi}
        />
      </div>

      {/* Pagination */}
      <Pagination
        totalPosts={consignKois.length}
        postPerPage={postsPerPage}
        paginate={paginate}
      />

      {/* Edit Form Modal */}
      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <EditAndCreateConsignForm
            koi={newKoi}
            setKoi={setNewKoi}
            fetchConsignKois={fetchConsignKois}
            editKoiId={editKoiId}
          />
        </Modal>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <Modal onClose={() => setShowCreateForm(false)}>
          <EditAndCreateConsignForm
            koi={newKoi}
            setKoi={setNewKoi}
            fetchConsignKois={fetchConsignKois}
            isCreating={true}
          />
        </Modal>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default ManageConsignKoi;
