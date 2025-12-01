import React, { useState, useEffect } from 'react';
import { wasteAPI, productsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect } from '../components/forms';

const WastePage = () => {
  const { user } = useAuth();
  const [wasteRecords, setWasteRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [formData, setFormData] = useState({
productId: '',
    quantity: '',
    unitType: '',
    wasteReason: '',
    disposalMethod: '',
    disposedAt: new Date().toISOString().slice(0, 16),
    donationItemId: null
  });

  const fetchWasteRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wasteAPI.getAll({ 
    pageNumber, 
        pageSize,
     sortBy: 'CreatedAt',
        sortDescending: true
      });

      if (response.success) {
        setWasteRecords(response.data.items || []);
    setTotalPages(response.data.totalPages || 1);
setTotalCount(response.data.totalCount || 0);
      }
    } catch (err) {
      console.error('Fetch waste records error:', err);
      setError(err.response?.data?.message || 'Failed to load waste records');
      setWasteRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const response = await productsAPI.getActive();
    if (response.success) setProducts(response.data);
  };

  useEffect(() => {
    fetchWasteRecords();
    fetchProducts();
  }, [pageNumber]);

  const handleCreate = () => {
    setFormData({ 
      productId: '', 
      quantity: '', 
      unitType: '', 
      wasteReason: '', 
      disposalMethod: '',
      disposedAt: new Date().toISOString().slice(0, 16),
      donationItemId: null
    });
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = async (record) => {
    const response = await wasteAPI.getById(record.wasteRecordId);
  if (response.success) {
      setSelectedRecord(response.data);
   setFormData({
        productId: response.data.productId,
      quantity: response.data.quantity,
        unitType: response.data.unitType || '',
        wasteReason: response.data.wasteReason || '',
        disposalMethod: response.data.disposalMethod || '',
        disposedAt: response.data.disposedAt ? new Date(response.data.disposedAt).toISOString().slice(0, 16) : '',
        donationItemId: response.data.donationItemId || null
      });
      setModalMode('edit');
      setShowModal(true);
    }
  };

  const handleDelete = async (record) => {
    if (confirm('Delete this record?')) {
      const response = await wasteAPI.delete(record.wasteRecordId);
      if (response.success) {
        setSuccess('Record deleted');
        fetchWasteRecords();
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
  if (!formData.productId) {
        setError('Please select a product');
 return;
      }
      if (!formData.quantity || parseInt(formData.quantity) <= 0) {
        setError('Please enter a valid quantity');
        return;
      }
      if (!formData.wasteReason) {
        setError('Please select a waste reason');
        return;
      }

      const payload = { 
    productId: parseInt(formData.productId), 
        quantity: parseInt(formData.quantity),
        unitType: formData.unitType || null,
        wasteReason: formData.wasteReason,
        disposalMethod: formData.disposalMethod || null,
        disposedAt: formData.disposedAt ? new Date(formData.disposedAt).toISOString() : null,
   donationItemId: formData.donationItemId || null
  };
    
      console.log('Sending payload:', payload);
      
      let response;
      if (modalMode === 'create') {
   response = await wasteAPI.create(payload);
      } else {
        response = await wasteAPI.update(selectedRecord.wasteRecordId, payload);
      }
 
      if (response.success) {
 setSuccess(`Record ${modalMode}d successfully`);
      setShowModal(false);
        setError(null);
        fetchWasteRecords();
      }
    } catch (err) {
      console.error('Save waste error:', err);
      console.error('Error response:', err.response?.data);
  
      let errorMessage = 'Failed to save record. Please check all required fields.';
   
      if (err.response?.data) {
        const data = err.response.data;
 
        if (data.message) {
          errorMessage = data.message;
        }
        
        if (data.errors && typeof data.errors === 'object') {
       const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => {
   const msgArray = Array.isArray(messages) ? messages : [messages];
           return `${field}: ${msgArray.join(', ')}`;
    })
  .join('; ');
    errorMessage = errorMessages || errorMessage;
        }
        
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.join(', ');
        }
      }
      
    setError(errorMessage);
    }
  };

  const columns = [
    { header: 'Product', accessor: 'productName' },
    { header: 'Category', accessor: 'category' },
    { header: 'Quantity', render: (row) => `${row.quantity} ${row.unitType}` },
    { header: 'Reason', accessor: 'wasteReason' },
    { header: 'Disposal', accessor: 'disposalMethod' },
    { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
  ];

  return (
  <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">Waste Records ({totalCount})</h2>
        <button onClick={handleCreate} className="bg-primary text-white py-3 px-6 rounded-md">+ Add Record</button>
      </div>

      {error && <div className="bg-danger bg-opacity-10 text-danger p-4 rounded">{error}</div>}
      {success && <div className="bg-success bg-opacity-10 text-success p-4 rounded">{success}</div>}

      <div className="rounded-sm border bg-white dark:bg-boxdark">
        <DataTable columns={columns} data={wasteRecords} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white dark:bg-boxdark p-6 rounded-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl mb-6">{modalMode === 'create' ? 'Add' : 'Edit'} Waste Record</h3>

  {error && (
        <div className="mb-4 rounded-lg border-l-[6px] border-danger bg-danger bg-opacity-10 px-4 py-3">
         <p className="text-danger text-sm">{error}</p>
            </div>
            )}

            <div className="space-y-4">
    <FormSelect 
       label="Product" 
            name="productId" 
    value={formData.productId} 
       onChange={(e) => setFormData({...formData, productId: e.target.value})}
                options={products.map(p => ({value: p.productId, label: p.productName}))}
           required 
  />
              <div className="grid grid-cols-2 gap-4">
            <FormInput 
  label="Quantity" 
       name="quantity" 
              type="number" 
   value={formData.quantity} 
         onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
        required 
         min="1"
      />
   <FormInput 
            label="Unit Type" 
         name="unitType" 
              value={formData.unitType} 
            onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                placeholder="kg, units, etc."
             />
     </div>
<FormSelect 
     label="Waste Reason" 
                name="wasteReason" 
       value={formData.wasteReason} 
  onChange={(e) => setFormData({...formData, wasteReason: e.target.value})}
      options={[
           {value: '', label: 'Select a reason'},
     {value: 'Expired', label: 'Expired'},
    {value: 'Damaged', label: 'Damaged'},
            {value: 'Spoiled', label: 'Spoiled'},
         {value: 'Contaminated', label: 'Contaminated'},
        {value: 'Other', label: 'Other'}
   ]}
      required
           />
    <FormInput 
         label="Disposal Method" 
           name="disposalMethod" 
                value={formData.disposalMethod} 
    onChange={(e) => setFormData({...formData, disposalMethod: e.target.value})}
         placeholder="Composting, Landfill, etc."
  />
              <FormInput 
                label="Disposal Date & Time" 
    name="disposedAt" 
                type="datetime-local"
                value={formData.disposedAt} 
           onChange={(e) => setFormData({...formData, disposedAt: e.target.value})}
       placeholder="When was it disposed?"
       />
            </div>
            <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="py-3 px-6 border rounded-md">Cancel</button>
         <button onClick={handleSave} className="py-3 px-6 bg-primary text-white rounded-md hover:bg-opacity-90">
         Save
   </button>
   </div>
          </div>
  </div>
      )}
  </div>
  );
};

export default WastePage;
