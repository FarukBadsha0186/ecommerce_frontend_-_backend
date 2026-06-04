


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%239CA3AF' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

// ✅ Guest Check Hook
const useGuestCheck = () => {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const guestAlert = () => {
    if (isGuest) {
      alert('🔒 Demo Mode! This feature is for admin only!');
      return true;
    }
    return false;
  };
  return { isGuest, guestAlert };
};

function AllProducts() {
  const navigate = useNavigate();
  const { isGuest, guestAlert } = useGuestCheck();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRemark, setSelectedRemark] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [pageNo, perPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/all_product/?page=${pageNo}&limit=${perPage}`);
      if (response.data.success) {
        let productsData = [];
        let total = 0;

        if (response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
          total = response.data.total || productsData.length;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
          total = response.data.total || productsData.length;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
          total = productsData.length;
        }

        const fixedProducts = productsData.map(product => ({
          ...product,
          images: product.images && product.images.length > 0
            ? product.images.map(img => {
                if (img && !img.startsWith('http://') && !img.startsWith('https://')) {
                  return `ecommerce-8lhe.onrender.com${img.startsWith('/') ? img : '/' + img}`;
                }
                return img;
              })
            : [DEFAULT_IMAGE]
        }));

        setProducts(fixedProducts);
        setTotalProducts(total);
        setTotalPages(Math.ceil(total / perPage));
      } else {
        setError(response.data.message || "Failed to load products");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (guestAlert()) return; // ✅ Guest check
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);
    try {
      const response = await api.delete(`/productDelete/${productId}`);
      if (response.data.success) {
        alert("✅ Product deleted successfully!");
        fetchProducts();
      } else {
        alert(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (productId) => {
    if (guestAlert()) return; // ✅ Guest check
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/edit-product/${productId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPageNo(1);
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRemark) {
      filtered = filtered.filter(p => p.remark === selectedRemark);
    }
    return filtered;
  };

  const getRemarkBadgeColor = (remark) => {
    switch (remark) {
      case 'popular': return 'bg-red-600';
      case 'new': return 'bg-green-600';
      case 'featured': return 'bg-purple-600';
      case 'trending': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getRemarkEmoji = (remark) => {
    switch (remark) {
      case 'popular': return '🔥';
      case 'new': return '✨';
      case 'featured': return '⭐';
      case 'trending': return '📈';
      default: return '';
    }
  };

  const filteredProducts = getFilteredProducts();
  const paginatedProducts = filteredProducts.slice((pageNo - 1) * perPage, pageNo * perPage);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            📦 All Products
          </h1>
          <p className="text-gray-400 mt-2">Manage your product inventory</p>
          {/* ✅ Guest Mode Banner */}
          {isGuest && (
            <div className="mt-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
              👀 Demo Mode — You can view but cannot edit or delete products
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Filter by Remark</label>
              <select
                value={selectedRemark}
                onChange={(e) => setSelectedRemark(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Remarks</option>
                <option value="popular">🔥 Popular</option>
                <option value="new">✨ New</option>
                <option value="featured">⭐ Featured</option>
                <option value="trending">📈 Trending</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Items Per Page</label>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button
                onClick={() => setPageNo(1)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                🔍 Search
              </button>
              <button
                onClick={() => { setSearchTerm(""); setSelectedRemark(""); setPageNo(1); }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ⚠️ {error}
          </div>
        )}

        {paginatedProducts.length === 0 && !loading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Products Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-700">
                    <img
                      src={product.images?.[0] || DEFAULT_IMAGE}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                    />
                    {product.remark && (
                      <span className={`absolute top-2 right-2 ${getRemarkBadgeColor(product.remark)} px-2 py-1 rounded-lg text-xs font-semibold shadow-lg`}>
                        {getRemarkEmoji(product.remark)} {product.remark}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-white mb-1 line-clamp-1">{product.title}</h2>
                    <div className="text-xs text-gray-400 mb-2">
                      <p>Category: {product.category_id?.category_name || 'N/A'}</p>
                      <p>Brand: {product.brand_id?.brand_name || 'N/A'}</p>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.short_description}</p>

                    {/* Price */}
                    <div className="mb-3">
                      {product.is_discount && product.discount_price > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-400">${product.discount_price}</span>
                          <span className="line-through text-gray-500 text-sm">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-green-400">${product.price}</span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-3">
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Stock: {product.stock} {product.stock > 0 ? 'units' : '(Out of stock)'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-sm ${isGuest ? 'bg-blue-600/40 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-sm disabled:opacity-50 ${isGuest ? 'bg-red-600/40 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {deletingId === product._id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mx-auto"></div>
                        ) : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalProducts > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                  Showing {((pageNo - 1) * perPage) + 1} to {Math.min(pageNo * perPage, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pageNo - 1)}
                    disabled={pageNo === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (pageNo <= 3) pageNum = i + 1;
                      else if (pageNo >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = pageNo - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition ${pageNo === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pageNo + 1)}
                    disabled={pageNo === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
