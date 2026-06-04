import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import api from "../config/api";

// লোকাল প্লেসহোল্ডার ইমেজ (Base64 SVG)
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%239CA3AF' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";




function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    title: "",
    images: [],
    short_description: "",
    price: "",
    is_discount: false,
    discount_price: "",
    remark: "",
    stock: "",
    color: [],
    size: [],
    description: "",
    category_id: "",
    brand_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // টোকেন চেক করুন
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    console.log("EditProduct - Token:", token ? "Exists" : "Missing");
    console.log("EditProduct - Product ID:", id);
    
    if (!token) {
      navigate('/login');
    }
  }, [navigate, id]);

  // Load product data and categories
  useEffect(() => {
    if (id) {
      loadProductData();
      fetchCategories();
    }
  }, [id]);

  // Load brands when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory.value) {
      fetchBrandsByCategory(selectedCategory.value);
    }
  }, [selectedCategory]);

  const loadProductData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/single_product/${id}`);
      console.log("Product data:", response.data);
      
      if (response.data.success) {
        const productData = response.data.data || response.data.product;
        setProduct(productData);
        
        // Set existing images
        if (productData.images && productData.images.length > 0) {
          setExistingImages(productData.images);
        }
        
        // Set selected category
        if (productData.category_id) {
          let categoryId, categoryName;
          
          if (typeof productData.category_id === 'object') {
            categoryId = productData.category_id._id;
            categoryName = productData.category_id.category_name || productData.category_id.name;
          } else {
            categoryId = productData.category_id;
            categoryName = productData.category_name || "Loading...";
          }
          
          const categoryObj = {
            value: categoryId,
            label: categoryName
          };
          setSelectedCategory(categoryObj);
        }
        
        // Set selected brand
        if (productData.brand_id) {
          let brandId, brandName;
          
          if (typeof productData.brand_id === 'object') {
            brandId = productData.brand_id._id;
            brandName = productData.brand_id.brand_name || productData.brand_id.name;
          } else {
            brandId = productData.brand_id;
            brandName = productData.brand_name || "Loading...";
          }
          
          const brandObj = {
            value: brandId,
            label: brandName
          };
          setSelectedBrand(brandObj);
        }
      } else {
        setError(response.data.message || "Failed to load product data");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/all_category_single_category_name");
      if (response.data.success && response.data.data) {
        const options = response.data.data.map(cat => ({
          value: cat._id,
          label: cat.category_name,
          slug: cat.slug
        }));
        setCategories(options);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrandsByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/brands_by_category/${categoryId}`);
      if (response.data.success && response.data.data) {
        const options = response.data.data.map(brand => ({
          value: brand._id,
          label: brand.brand_name,
          brand_img: brand.brand_img
        }));
        setBrands(options);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert("Only image files are allowed!");
    }
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setSuccess("");
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setSuccess("");
  };

  const handleColorAdd = () => {
    if (colorInput.trim()) {
      const colors = colorInput.split(",").map(c => c.trim()).filter(c => c);
      setProduct(prev => ({
        ...prev,
        color: [...prev.color, ...colors]
      }));
      setColorInput("");
      setSuccess("");
    }
  };

  const handleRemoveColor = (index) => {
    setProduct(prev => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index)
    }));
    setSuccess("");
  };

  const handleSizeAdd = () => {
    if (sizeInput.trim()) {
      const sizes = sizeInput.split(",").map(s => s.trim()).filter(s => s);
      setProduct(prev => ({
        ...prev,
        size: [...prev.size, ...sizes]
      }));
      setSizeInput("");
      setSuccess("");
    }
  };

  const handleRemoveSize = (index) => {
    setProduct(prev => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index)
    }));
    setSuccess("");
  };

  const validateForm = () => {
    if (!product.title.trim()) {
      alert("Please enter product title");
      return false;
    }
    if (!selectedCategory) {
      alert("Please select a category");
      return false;
    }
    if (!selectedBrand) {
      alert("Please select a brand");
      return false;
    }
    if (!product.short_description.trim()) {
      alert("Please enter short description");
      return false;
    }
    if (!product.price || product.price <= 0) {
      alert("Please enter a valid price");
      return false;
    }
    if (!product.stock || product.stock < 0) {
      alert("Please enter valid stock quantity");
      return false;
    }
    if (!product.description.trim()) {
      alert("Please enter product description");
      return false;
    }
    if (existingImages.length === 0 && imageFiles.length === 0) {
      alert("Please keep at least one product image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', product.title.trim());
      formData.append('short_description', product.short_description.trim());
      formData.append('price', Number(product.price));
      formData.append('is_discount', product.is_discount);
      
      if (product.discount_price && product.is_discount) {
        formData.append('discount_price', Number(product.discount_price));
      } else {
        formData.append('discount_price', 0);
      }
      
      formData.append('remark', product.remark || '');
      formData.append('stock', Number(product.stock));
      formData.append('description', product.description.trim());
      
      // IDs
      formData.append('category_id', selectedCategory.value);
      formData.append('brand_id', selectedBrand.value);
      
      // Arrays - JSON.stringify করে পাঠান
      formData.append('color', JSON.stringify(product.color || []));
      formData.append('size', JSON.stringify(product.size || []));
      
      // Existing images URLs - JSON.stringify করে পাঠান
      if (existingImages.length > 0) {
        formData.append('existing_images', JSON.stringify(existingImages));
      }
      
      // New images
      imageFiles.forEach(file => {
        formData.append('new_images', file);
      });

      console.log("Updating product with ID:", id);
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], "=", pair[1]);
      }
      
      const response = await api.post(`/productUpdate/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Update response:", response.data);
      
      if (response.data.success) {
        setSuccess("✅ Product updated successfully!");
        setTimeout(() => {
          navigate("/all-products");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: state.isFocused ? "#3b82f6" : "#374151",
      borderWidth: "1px",
      borderRadius: "0.5rem",
      minHeight: "42px",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6"
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderRadius: "0.5rem",
      overflow: "hidden"
    }),
    menuList: (base) => ({
      ...base,
      padding: "0",
      "&::-webkit-scrollbar": {
        width: "8px"
      },
      "&::-webkit-scrollbar-track": {
        background: "#374151"
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#4b5563",
        borderRadius: "4px"
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#374151" : "#1f2937",
      color: "white",
      cursor: "pointer",
      padding: "10px 12px",
      "&:active": {
        backgroundColor: "#4b5563"
      }
    }),
    input: (base) => ({
      ...base,
      color: "white"
    }),
    singleValue: (base) => ({
      ...base,
      color: "white"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF"
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9CA3AF",
      "&:hover": {
        color: "#3b82f6"
      }
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#9CA3AF",
      "&:hover": {
        color: "#ef4444"
      }
    })
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/all-products")}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition"
          >
            ← Back to Products
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            ✏️ Edit Product
          </h1>
          <p className="text-gray-400 mt-2">Update product information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              placeholder="Enter product title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              options={categories}
              value={selectedCategory}
              onChange={(option) => {
                setSelectedCategory(option);
                setSelectedBrand(null);
                setProduct(prev => ({ 
                  ...prev, 
                  category_id: option?.value || "",
                  brand_id: ""
                }));
              }}
              isLoading={loading}
              isClearable
              isSearchable
              placeholder="Select category"
              className="text-black"
              styles={selectStyles}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Brand <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              options={brands}
              value={selectedBrand}
              onChange={(option) => {
                setSelectedBrand(option);
                setProduct(prev => ({ ...prev, brand_id: option?.value || "" }));
              }}
              isLoading={loading}
              isClearable
              isSearchable
              placeholder={selectedCategory ? "Select brand" : "Select category first"}
              isDisabled={!selectedCategory}
              className="text-black"
              styles={selectStyles}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="short_description"
              value={product.short_description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              placeholder="Brief description"
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name="is_discount"
                  checked={product.is_discount}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Apply Discount</span>
              </label>
              {product.is_discount && (
                <input
                  type="number"
                  name="discount_price"
                  value={product.discount_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  min="0"
                  step="0.01"
                  placeholder="Discount price"
                />
              )}
            </div>
          </div>

          {/* Remark and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Remark</label>
              <select
                name="remark"
                value={product.remark}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              >
                <option value="">Select Remark</option>
                <option value="popular">🔥 Popular</option>
                <option value="new">✨ New</option>
                <option value="featured">⭐ Featured</option>
                <option value="trending">📈 Trending</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                min="0"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Colors</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="e.g., Black, Silver, Blue (comma separated)"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
              <button
                type="button"
                onClick={handleColorAdd}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium"
              >
                + Add Color
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.color && product.color.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600 rounded-full text-sm flex items-center gap-2"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></span>
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Sizes</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="e.g., S, M, L, XL or 128GB, 256GB (comma separated)"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
              <button
                type="button"
                onClick={handleSizeAdd}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium"
              >
                + Add Size
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.size && product.size.map((size, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-600 rounded-full text-sm flex items-center gap-2"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-y"
              placeholder="Detailed product description..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Product Images <span className="text-red-500">*</span>
            </label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Current Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Upload */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Add New Images:</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
              />
            </div>
            
            {/* New Images Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">New Images to Add:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/all-products")}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition font-semibold text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Product...
                </span>
              ) : (
                "💾 Update Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;