import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Pagination from '../../component/Pagination';

const KoiBatchPage = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  const [species, setSpecies] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  //For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8); // Number of batches per page

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

  const handleFilter = async () => {
    if (species.trim() === '' && minPrice === '' && maxPrice === '') {
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
        },
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching filtered batches:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Koi Batches Available</h1>

      <div className="text-center mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          {filterVisible ? 'Close' : 'What are you looking for'}
        </button>
      </div>
      {filterVisible && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handleFilter}
          >
            Apply Filter
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
              <p className="mb-2"><strong>Remaining Batch:</strong> {batch.remainBatch}</p>
              <p className="mb-4"><strong>Species:</strong> {batch.species}</p>
              <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Buy Now
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

export default KoiBatchPage;