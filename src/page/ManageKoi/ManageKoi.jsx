import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ProductsPage = () => {
  const [koiFishs, setKoiFishs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchKoiFish = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/koi/Koi");
      setKoiFishs(response.data);
    } catch (error) {
      console.error("Error fetching koi fish:", error);
      alert("Failed to fetch koi fish.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKoiFish();
  }, [fetchKoiFish]);

  const handleDeleteProduct = async (koiID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/koi/Koi/${koiID}`);
      alert("Product deleted successfully!");
      setKoiFishs(koiFishs.filter((koiFish) => koiFish.koiID !== koiID));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Koi Fish</h1>

      {/* Create Koi Button */}
      <div className="mb-4 text-center">
        <button
          onClick={() => navigate("/admin/manageKoi/createKoi")}
          className="bg-green-500 text-white rounded px-4 py-2"
        >
          Create Koi
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">                
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">Koi ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Color</th>
                <th className="py-2 px-4 border">Size (cm)</th>
                <th className="py-2 px-4 border">Price</th>              
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {koiFishs.map((koiFish) => (
                <tr key={koiFish.koiID} className="text-center border-b">
                  <td className="py-2 px-4 border">
                    <Link to={`/view-details/${koiFish.koiID}`}>
                      <img
                        src={koiFish.image ?? "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s3v1.png"}
                        alt={koiFish.name}
                        className="w-20 h-20 object-cover mx-auto"
                      />
                    </Link>
                  </td>
                  <td className="py-2 px-4 border">{koiFish.koiID}</td>
                  <td className="py-2 px-4 border">{koiFish.name}</td>
                  <td className="py-2 px-4 border">{koiFish.gender}</td>
                  <td className="py-2 px-4 border">{koiFish.color}</td>
                  <td className="py-2 px-4 border">{koiFish.size}</td>
                  <td className="py-2 px-4 border">${koiFish.price}</td>                
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDeleteProduct(koiFish.koiID)}
                      className="bg-red-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/admin/manageKoi/updateKoi/${koiFish.koiID}`)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
