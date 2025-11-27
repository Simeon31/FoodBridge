import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect, FormTextarea } from '../components/forms';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal
const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    category: '',
    defaultUnitType: '',
 isPerishable: false,
    optimalStorageCondition: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
 setError(null);
      
    const response = await productsAPI.getAll({
     pageNumber,
        pageSize,
        searchTerm,
        category: categoryFilter,
        sortBy: 'ProductName',
        sortDescending: false // ? Fixed: was sortOrder: 'asc'
  });

      if (response.success) {
        setProducts(response.data.items);
        setTotalPages(response.data.totalPages);
setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, categoryFilter]);

  const handleSearch = () => {
    setPageNumber(1);
    fetchProducts();
  };

  const handleView = async (product) => {
try {
      const response = await productsAPI.getById(product.productId);
   if (response.success) {
        setSelectedProduct(response.data);
        setModalMode('view');
        setShowModal(true);
      }
    } catch (err) {
      setError('Failed to load product details');
  }
  };

  const handleEdit = async (product) => {
    try {
      const response = await productsAPI.getById(product.productId);
    if (response.success) {
      setSelectedProduct(response.data);
        setFormData({
     productCode: response.data.productCode,
     productName: response.data.productName,
          category: response.data.category || '',
       defaultUnitType: response.data.defaultUnitType || '',
   isPerishable: response.data.isPerishable,
          optimalStorageCondition: response.data.optimalStorageCondition || ''
  });
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (err) {
      setError('Failed to load product details');
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await productsAPI.delete(selectedProduct.productId);
      if (response.success) {
        setSuccess('Product deleted successfully');
    setShowDeleteDialog(false);
        fetchProducts();
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
  setFormData({
      productCode: '',
      productName: '',
      category: '',
      defaultUnitType: '',
      isPerishable: false,
      optimalStorageCondition: ''
    });
    setFormErrors({});
    setModalMode('create');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
 setSelectedProduct(null);
    setFormData({
      productCode: '',
      productName: '',
category: '',
    defaultUnitType: '',
      isPerishable: false,
      optimalStorageCondition: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
 const { name, value, type, checked } = e.target;
    setFormData(prev => ({
  ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.productCode.trim()) {
      errors.productCode = 'Product code is required';
 }
    
    if (!formData.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
let response;
   if (modalMode === 'create') {
   response = await productsAPI.create(formData);
      } else {
  response = await productsAPI.update(selectedProduct.productId, formData);
      }

    if (response.success) {
        setSuccess(`Product ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
  handleCloseModal();
      fetchProducts();
      }
    } catch (err) {
  setError(err.response?.data?.message || `Failed to ${modalMode} product`);
    }
  };

  const columns = [
    { header: 'Code', accessor: 'productCode' },
    { header: 'Name', accessor: 'productName' },
    { header: 'Category', accessor: 'category' },
    { header: 'Unit', accessor: 'defaultUnitType' },
  {
      header: 'Perishable',
      render: (row) => (
        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
          row.isPerishable ? 'bg-warning text-warning' : 'bg-success text-success'
     }`}>
    {row.isPerishable ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
          row.isActive ? 'bg-success text-success' : 'bg-danger text-danger'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const categoryOptions = [
  { value: 'Fruits', label: 'Fruits' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Dairy', label: 'Dairy' },
    { value: 'Meat', label: 'Meat' },
    { value: 'Bakery', label: 'Bakery' },
    { value: 'Canned Goods', label: 'Canned Goods' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Other', label: 'Other' }
  ];

  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'L', label: 'Liters (L)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'units', label: 'Units' },
    { value: 'boxes', label: 'Boxes' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Manage Products
       </h2>
   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
  View and manage all products ({totalCount} total)
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
 >
        + Add Product
        </button>
      </div>

      {/* Alerts */}
      {error && (
  <div className="rounded-lg border-l-[6px] border-danger bg-danger bg-opacity-10 px-7 py-4 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
          <div className="flex justify-between items-center">
            <p className="text-danger">{error}</p>
      <button onClick={() => setError(null)} className="text-danger hover:text-opacity-80">×</button>
          </div>
        </div>
      )}
      {success && (
        <div className="rounded-lg border-l-[6px] border-success bg-success bg-opacity-10 px-7 py-4 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
          <div className="flex justify-between items-center">
   <p className="text-success">{success}</p>
       <button onClick={() => setSuccess(null)} className="text-success hover:text-opacity-80">×</button>
</div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="mb-2.5 block text-black dark:text-white">Search</label>
            <input
      type="text"
        placeholder="Search by name, code..."
   value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
 className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
     />
          </div>
      <div className="w-48">
       <label className="mb-2.5 block text-black dark:text-white">Category</label>
            <select
    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
      value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
   >
              <option value="">All Categories</option>
{categoryOptions.map(cat => (
   <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
 </div>
          <button
      onClick={handleSearch}
    className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
   Search
     </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
     <div className="px-4 py-6 md:px-6 xl:px-7.5">
   <h4 className="text-xl font-semibold text-black dark:text-white">Products List</h4>
        </div>
   <DataTable
          columns={columns}
  data={products}
          loading={loading}
  onView={handleView}
   onEdit={handleEdit}
    onDelete={handleDelete}
     emptyMessage="No products found"
        />

        {/* Pagination */}
  {totalPages > 1 && (
 <div className="flex justify-between items-center p-6 border-t border-stroke dark:border-strokedark">
            <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing page {pageNumber} of {totalPages}
          </p>
            <div className="flex gap-2">
     <button
         onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
       disabled={pageNumber === 1}
            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium hover:bg-gray hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark"
         >
    Previous
          </button>
      <button
  onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))}
 disabled={pageNumber === totalPages}
   className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium hover:bg-gray hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark"
  >
         Next
        </button>
            </div>
    </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && modalMode !== 'view' && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b border-stroke dark:border-strokedark pb-4">
              <h3 className="text-xl font-semibold text-black dark:text-white">
    {modalMode === 'create' ? 'Create Product' : 'Edit Product'}
        </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-black dark:hover:text-white">×</button>
    </div>

    <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
     <FormInput
    label="Product Code"
    name="productCode"
        value={formData.productCode}
 onChange={handleInputChange}
      error={formErrors.productCode}
     required
    placeholder="e.g., FRT001"
             />
      <FormInput
       label="Product Name"
                name="productName"
           value={formData.productName}
        onChange={handleInputChange}
       error={formErrors.productName}
       required
           placeholder="e.g., Apple"
            />
      </div>

   <div className="grid grid-cols-2 gap-4">
     <FormSelect
      label="Category"
   name="category"
        value={formData.category}
        onChange={handleInputChange}
                  options={categoryOptions}
   placeholder="Select category"
      />
         <FormSelect
        label="Default Unit"
name="defaultUnitType"
    value={formData.defaultUnitType}
         onChange={handleInputChange}
            options={unitOptions}
       placeholder="Select unit"
       />
     </div>

          <FormInput
        label="Optimal Storage Condition"
        name="optimalStorageCondition"
             value={formData.optimalStorageCondition}
     onChange={handleInputChange}
       placeholder="e.g., Cool, dry place"
              />

              <div className="flex items-center">
        <input
         type="checkbox"
     name="isPerishable"
         checked={formData.isPerishable}
          onChange={handleInputChange}
     className="mr-2"
  />
        <label className="text-black dark:text-white">Is Perishable</label>
              </div>
            </div>

   <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stroke dark:border-strokedark">
  <button
        onClick={handleCloseModal}
           className="inline-flex items-center justify-center rounded-md border border-stroke py-3 px-6 text-center font-medium hover:bg-gray hover:bg-opacity-10 dark:border-strokedark"
              >
    Cancel
    </button>
     <button
         onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
  >
                {modalMode === 'create' ? 'Create' : 'Update'}
        </button>
   </div>
          </div>
 </div>
      )}

      {/* View Modal */}
      {showModal && modalMode === 'view' && selectedProduct && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
       <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-stroke dark:border-strokedark pb-4">
 <h3 className="text-xl font-semibold text-black dark:text-white">Product Details</h3>
       <button onClick={handleCloseModal} className="text-gray-500 hover:text-black dark:hover:text-white">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
   <div>
       <p className="text-sm text-gray-500 dark:text-gray-400">Product Code</p>
                <p className="text-black dark:text-white font-medium">{selectedProduct.productCode}</p>
   </div>
         <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Product Name</p>
         <p className="text-black dark:text-white font-medium">{selectedProduct.productName}</p>
              </div>
          <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
       <p className="text-black dark:text-white font-medium">{selectedProduct.category || 'N/A'}</p>
              </div>
           <div>
     <p className="text-sm text-gray-500 dark:text-gray-400">Default Unit</p>
           <p className="text-black dark:text-white font-medium">{selectedProduct.defaultUnitType || 'N/A'}</p>
              </div>
              <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Perishable</p>
                <p className="text-black dark:text-white font-medium">{selectedProduct.isPerishable ? 'Yes' : 'No'}</p>
    </div>
   <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
     selectedProduct.isActive ? 'bg-success text-success' : 'bg-danger text-danger'
    }`}>
           {selectedProduct.isActive ? 'Active' : 'Inactive'}
                </span>
    </div>
   {selectedProduct.optimalStorageCondition && (
          <div className="col-span-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Storage Condition</p>
         <p className="text-black dark:text-white">{selectedProduct.optimalStorageCondition}</p>
           </div>
              )}
   </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stroke dark:border-strokedark">
      <button
        onClick={handleCloseModal}
  className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
 Close
              </button>
     </div>
          </div>
        </div>
  )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg">
    <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Confirm Delete</h3>
         <p className="text-gray-500 dark:text-gray-400 mb-6">
Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
  <button
      onClick={() => setShowDeleteDialog(false)}
     className="inline-flex items-center justify-center rounded-md border border-stroke py-3 px-6 text-center font-medium hover:bg-gray hover:bg-opacity-10 dark:border-strokedark"
    >
           Cancel
    </button>
            <button
    onClick={confirmDelete}
        className="inline-flex items-center justify-center rounded-md bg-danger py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
         Delete
         </button>
      </div>
     </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
