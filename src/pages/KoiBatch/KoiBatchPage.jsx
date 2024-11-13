import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Pagination from '../../components/Pagination';
import { Modal } from 'antd';
import { FiFilter } from "react-icons/fi"; // Icon for the filter button

const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image+Available";

const KoiBatchPage = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigate = useNavigate();
  const [species, setSpecies] = useState('');
  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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
        const response = await api.get('/Batch');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, [navigate]);

  useEffect(() => {
    handleFilter();
  }, [name, species, minPrice, maxPrice]);

  const handleFilter = async () => {
    if (!name && !species && !minPrice && !maxPrice) {
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
          species: species || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          name: name || undefined,
        },
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching filtered batches:', error);
    }
  };

  // Navigate to payment
  const handleNavigateToPayment = (batch) => {
    navigate(`/payment/${batch.batchID}`, { state: { batch } });
  };

  // Open modal on image click
  const handleImageClick = (batch) => {
    setSelectedBatch(batch);
  };

  const closeModal = () => {
    setSelectedBatch(null);
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Koi Batches Available</h1>

      {/* Filter Section */}
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-4 p-4">
          <input
            type="text"
            placeholder="Search Name of Batch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded mr-4"
          />
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300"
          >
            <FiFilter className="mr-2" /> {/* Filter Icon */}
            Filter
          </button>
        </div>

        {filterVisible && (
          <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
            </div>
          </div>
        )}
      </div>

      {/* Batch Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPosts.length === 0 ? (
          <p className="col-span-full text-center">No batches available</p>
        ) : (
          currentPosts.map((batch) => (
            <div
              key={batch.batchID}
              className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => handleImageClick(batch)}
            >
              <img
                src={batch.image || placeholderImage}
                alt={batch.name}
                className="w-full h-48 object-contain rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-center">{batch.name}</h2>
              <p className="text-gray-600 text-center mt-2 font-medium">Price: {formatCurrency(batch.pricePerBatch)}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        totalPosts={batches.length}
        postPerPage={postsPerPage}
        paginate={paginate}
      />

      {/* Modal for Batch Details */}
      {selectedBatch && (
        <Modal
          open={!!selectedBatch}
          onCancel={closeModal}
          footer={null}
          title={selectedBatch?.name}
        >
          <div className="text-center">
            <img
              src={selectedBatch.image || placeholderImage}
              alt={selectedBatch.name}
              className="w-full h-48 object-contain mb-4"
            />
            <p><strong>Price:</strong> ${selectedBatch.pricePerBatch}</p>
            <p><strong>Description:</strong> {selectedBatch.description}</p>
            <p><strong>Remaining Per Batch:</strong> {selectedBatch.remainBatch}</p>
            <p><strong>Species:</strong> {selectedBatch.species}</p>
            <button
              onClick={() => handleNavigateToPayment(selectedBatch)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
            >
              Buy Now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KoiBatchPage;
