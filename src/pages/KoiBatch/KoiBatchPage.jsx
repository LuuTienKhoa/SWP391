import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Pagination from '../../components/Pagination';
import Button from "../../components/button/Button";

const KoiBatchPage = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  const [species, setSpecies] = useState('');
  const [name, setName] = useState('');
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
        const response = await api.get('/Batch');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, [navigate]);

  useEffect(() => {
    handleFilter(); // Gọi hàm lọc khi bất kỳ giá trị nào thay đổi
  }, [name, species, minPrice, maxPrice]); // Theo dõi sự thay đổi của các biến

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
          name: name.trim() !== '' ? name : undefined, // Thêm tham số tìm kiếm theo tên
        },
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching filtered batches:', error);
    }
    
  };
  //Navigate toi payment
  const handleNavigateToPayment = (batch) => {
    navigate(`/payment/${batch.batchID}`, { state: { batch } });
  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Koi Batches Available</h1>

      <div className="text-center mb-6">
      <div className="flex justify-between items-center mb-8 p-4">
      <div className="flex-1 mr-4">
            <input
              type="text"
              placeholder="Search Name of Batch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
      <Button
              onClick={() => setFilterVisible(!filterVisible)}
              className={`px-4 py-2 rounded ${
                filterVisible ? 'Close' : 'What are you looking for'
              }`}
            >
              What are you looking for
      </Button>
      </div>
        
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
              <p className="mb-2"><strong>Price:</strong> ${batch.pricePerBatch}</p>
              <p className="mb-2"><strong>Description:</strong> {batch.description}</p>
              <p className="mb-2"><strong>Quantity Available:</strong> {batch.quantityPerBatch}</p>
              <p className="mb-2"><strong>Remaining Batch:</strong> {batch.remainBatch}</p>
              <p className="mb-4"><strong>Species:</strong> {batch.species}</p>
              <button 
              onClick={() => handleNavigateToPayment(batch)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
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
