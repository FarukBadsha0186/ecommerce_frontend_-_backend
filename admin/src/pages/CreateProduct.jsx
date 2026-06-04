

import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import api from "../config/api";

function CreateProduct() {
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load brands when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory.value) {
      fetchBrandsByCategory(selectedCategory.value);
    } else {
      setBrands([]);
      setSelectedBrand(null);
    }
  }, [selectedCategory]);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/all_category_single_category_name");
      console.log("Categories response:", response.data);
      
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
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands by category ID
  const fetchBrandsByCategory = async (categoryId) => {
    if (!categoryId) {
      console.log("No category ID provided");
      setBrands([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log("🔄 Fetching brands for category ID:", categoryId);
      
      // ✅ ব্র্যান্ড GET করার API কল
      const response = await api.get(`/getBrandsByCategory/${categoryId}`);
      
      console.log("📦 Brands response:", response.data);
      
      if (response.data.success && response.data.data) {
        const options = response.data.data.map(brand => ({
          value: brand._id,
          label: brand.brand_name,
          brand_img: brand.brand_img
        }));
        setBrands(options);
        console.log(`✅ Loaded ${options.length} brands for this category`);
      } else {
        console.log("⚠️ No brands found for this category");
        setBrands([]);
      }
    } catch (error) {
      console.error("❌ Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };


  // Create new category
  const handleCreateCategory = async (inputValue) => {
    setLoading(true);
    try {
      const response = await api.post("/category", {
        category_name: inputValue,
        category_img: ""
      });
      
      console.log("Create category response:", response.data);
      
      if (response.data.success) {
        const newCategory = {
          value: response.data.data._id,
          label: response.data.data.category_name,
          slug: response.data.data.slug
        };
        
        setCategories([...categories, newCategory]);
        setSelectedCategory(newCategory);
        setProduct(prev => ({ ...prev, category_id: response.data.data._id }));
        
        alert(`✅ Category "${inputValue}" created successfully!`);
      } else {
        alert(response.data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Create new brand under selected category
 
const handleCreateBrand = async (inputValue) => {
    if (!selectedCategory) {
        alert("⚠️ Please select a category first before creating a brand!");
        return;
    }
    
    setLoading(true);
    try {
        console.log("Creating brand:", inputValue);
        console.log("Under category:", selectedCategory.value, selectedCategory.label);
        
        const response = await api.post("/createBrand", {
            brand_name: inputValue,
            brand_img: "",
            category_id: selectedCategory.value  // ✅ সঠিক category_id পাঠানো হচ্ছে
        });
        
        console.log("Create brand response:", response.data);
        
        if (response.data.success) {
            const newBrand = {
                value: response.data.data._id,
                label: response.data.data.brand_name,
                brand_img: response.data.data.brand_img
            };
            
            // নতুন ব্র্যান্ডটি ব্র্যান্ড লিস্টে যোগ করুন
            setBrands(prev => [...prev, newBrand]);
            setSelectedBrand(newBrand);
            setProduct(prev => ({ ...prev, brand_id: response.data.data._id }));
            
            alert(`✅ Brand "${inputValue}" created successfully under ${selectedCategory.label}!`);
        } else {
            alert(response.data.message || "Failed to create brand");
        }
    } catch (error) {
        console.error("Error creating brand:", error);
        alert(error.response?.data?.message || "Failed to create brand");
    } finally {
        setLoading(false);
    }
};
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert("Only image files are allowed!");
    }
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add color
  const handleColorAdd = () => {
    if (colorInput.trim()) {
      const colors = colorInput.split(",").map(c => c.trim()).filter(c => c);
      setProduct(prev => ({
        ...prev,
        color: [...prev.color, ...colors]
      }));
      setColorInput("");
    }
  };

  // Remove color
  const handleRemoveColor = (index) => {
    setProduct(prev => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index)
    }));
  };

  // Add size
  const handleSizeAdd = () => {
    if (sizeInput.trim()) {
      const sizes = sizeInput.split(",").map(s => s.trim()).filter(s => s);
      setProduct(prev => ({
        ...prev,
        size: [...prev.size, ...sizes]
      }));
      setSizeInput("");
    }
  };

  // Remove size
  const handleRemoveSize = (index) => {
    setProduct(prev => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index)
    }));
  };

  // Validate form before submission
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
    if (imageFiles.length === 0) {
      alert("Please upload at least one product image");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);

    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', product.title.trim());
      formData.append('short_description', product.short_description.trim());
      formData.append('price', Number(product.price));
      formData.append('is_discount', product.is_discount);
      
      if (product.discount_price && product.is_discount) {
        formData.append('discount_price', Number(product.discount_price));
      }
      
      formData.append('remark', product.remark || '');
      formData.append('stock', Number(product.stock));
      formData.append('description', product.description.trim());
      
      // IDs
      formData.append('category_id', selectedCategory.value);
      formData.append('brand_id', selectedBrand.value);
      
      // Arrays
      if (product.color.length > 0) {
        formData.append('color', JSON.stringify(product.color));
      }
      
      if (product.size.length > 0) {
        formData.append('size', JSON.stringify(product.size));
      }
      
      // Images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post("/createProduct", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert("✅ Product created successfully!");
        
        // Reset form
        setProduct({
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
        setSelectedCategory(null);
        setSelectedBrand(null);
        setImageFiles([]);
        setImagePreviews([]);
        setColorInput("");
        setSizeInput("");
      } else {
        alert(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  // Custom styles for react-select
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

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            ✨ Create New Product
          </h1>
          <p className="text-gray-400 mt-2">Fill in the product details below</p>
        </div>

        {/* Loading State */}
        {loading && categories.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading categories and brands...</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!loading || categories.length > 0 ? (
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
                placeholder="Enter product title (e.g., iPhone 15 Pro Max)"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                options={categories}
                value={selectedCategory}
                onChange={(option) => {
                  setSelectedCategory(option);
                  setSelectedBrand(null); // Reset brand when category changes
                  setProduct(prev => ({ 
                    ...prev, 
                    category_id: option?.value || "",
                    brand_id: ""
                  }));
                }}
                onCreateOption={handleCreateCategory}
                isLoading={loading}
                isClearable
                isSearchable
                placeholder="Select or create a category..."
                formatCreateLabel={(inputValue) => `➕ Create "${inputValue}"`}
                noOptionsMessage={() => loading ? "Loading..." : "No categories available"}
                className="text-black"
                styles={selectStyles}
              />
              {selectedCategory && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Selected: {selectedCategory.label}
                </p>
              )}
            </div>

            {/* Brand Selection - Only shows when category is selected */}
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
                onCreateOption={handleCreateBrand}
                isLoading={loading}
                isClearable
                isSearchable
                placeholder={selectedCategory ? "Select or create a brand..." : "⚠️ Please select a category first"}
                isDisabled={!selectedCategory}
                formatCreateLabel={(inputValue) => `➕ Create "${inputValue}" under ${selectedCategory?.label}`}
                noOptionsMessage={() => {
                  if (!selectedCategory) return "Select a category first";
                  if (loading) return "Loading...";
                  return "No brands found. Create a new brand!";
                }}
                className="text-black"
                styles={selectStyles}
              />
              {selectedCategory && brands.length === 0 && !loading && (
                <p className="text-yellow-400 text-xs mt-1">
                  ℹ️ No brands found under "{selectedCategory.label}". Create a new brand!
                </p>
              )}
              {selectedBrand && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Selected: {selectedBrand.label}
                </p>
              )}
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
                placeholder="Brief description of the product"
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
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_discount"
                    checked={product.is_discount}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-gray-300">Apply Discount</label>
                </div>
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
                  placeholder="0"
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
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.color.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600 rounded-full text-sm flex items-center gap-2"
                  >
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
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.size.map((size, index) => (
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

            {/* Image Upload */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Product Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
              />
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Product...
                </span>
              ) : (
                "✨ Create Product"
              )}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default CreateProduct;
