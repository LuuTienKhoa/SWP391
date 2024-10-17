import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/axios";

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
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-7">
        <h1 className="text-5xl mb-2 text-center">F Koi Shop</h1>

        {/* Create Koi Button */}
        <div className="mb-4 text-center">
          <button
            onClick={() => navigate("/admin/manageKoi/createKoi")}
            className="bg-green-500 text-white rounded px-4 py-2"
          >
            Create Koi
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            koiFishs.map((koiFish) => (
              <div key={koiFish.koiID} className="max-w-xs overflow-hidden">
                <Link to={`/view-details/${koiFish.koiID}`}>
                  <img
                    src={
                      koiFish.image ??
                      "https://www.kodamakoifarm.com/wp-content/uploads/2024/05/w0503s3v1.png"
                    }
                    alt={koiFish.name}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{koiFish.name}</h2>
                  <p>Price: ${koiFish.price}</p>
                  <p>Size: {koiFish.size} cm</p>

                  <button
                    onClick={() => handleDeleteProduct(koiFish.koiID)}
                    className="bg-red-500 text-white rounded px-4 py-2 mt-2"
                  >
                    Delete Product
                  </button>
                  <button
                    onClick={() => navigate(`/admin/manageKoi/updateKoi/${koiFish.koiID}`)}
                    className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                  >
                    Update Product
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
