import React, { useState, useEffect } from 'react';
import { wasteAPI, productsAPI } from '../services/api';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect } from '../components/forms';

const WastePage = () => {
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
  disposalMethod: ''
  });

  const fetchWasteRecords = async () => {
  try {
      setLoading(true);
      setError(null);
      const response = await wasteAPI.getAll({ 
      pageNumber, 
 pageSize,
    sortBy: 'CreatedAt',
     sortDescending: true  // ? Added proper sorting (desc for newest first)
     });
    
      if (response.success) {
  setWasteRecords(response.data.items || []);
  setTotalPages(response.data.totalPages || 1);
    setTotalCount(response.data.totalCount || 0);
      }
  } catch (err) {
      console.error('Fetch waste records error:', err);
    setError(err.response?.data?.message || 'Failed to load waste records');
      setWasteRecords([]);  // Set empty array on error
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
    setFormData({ productId: '', quantity: '', unitType: '', wasteReason: '', disposalMethod: '' });
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
  disposalMethod: response.data.disposalMethod || ''
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
const payload = { ...formData, productId: parseInt(formData.productId), quantity: parseInt(formData.quantity) };
      let response;
      if (modalMode === 'create') {
     response = await wasteAPI.create(payload);
      } else {
        response = await wasteAPI.update(selectedRecord.wasteRecordId, payload);
   }
      if (response.success) {
    setSuccess(`Record ${modalMode}d successfully`);
 setShowModal(false);
        fetchWasteRecords();
 }
    } catch (err) {
      setError('Failed to save record');
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
   <div className="w-full max-w-2xl bg-white dark:bg-boxdark p-6 rounded-lg">
     <h3 className="text-xl mb-6">{modalMode === 'create' ? 'Add' : 'Edit'} Waste Record</h3>
      <div className="space-y-4">
     <FormSelect 
    label="Product" 
    name="productId" 
value={formData.productId} 
      onChange={(e) => setFormData({...formData, productId: e.target.value})}
options={products.map(p => ({value: p.productId, label: p.productName}))}
       required 
         />
     <FormInput label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              <FormInput label="Unit Type" name="unitType" value={formData.unitType} onChange={(e) => setFormData({...formData, unitType: e.target.value})} />
        <FormSelect 
        label="Waste Reason" 
   name="wasteReason" 
       value={formData.wasteReason} 
   onChange={(e) => setFormData({...formData, wasteReason: e.target.value})}
                options={[
 {value: 'Expired', label: 'Expired'},
  {value: 'Damaged', label: 'Damaged'},
          {value: 'Spoiled', label: 'Spoiled'},
  {value: 'Contaminated', label: 'Contaminated'},
       {value: 'Other', label: 'Other'}
    ]}
              />
       <FormInput label="Disposal Method" name="disposalMethod" value={formData.disposalMethod} onChange={(e) => setFormData({...formData, disposalMethod: e.target.value})} />
            </div>
      <div className="flex justify-end gap-3 mt-6">
       <button onClick={() => setShowModal(false)} className="py-3 px-6 border rounded-md">Cancel</button>
    <button onClick={handleSave} className="py-3 px-6 bg-primary text-white rounded-md">Save</button>
        </div>
          </div>
     </div>
    )}
    </div>
  );
};

export default WastePage;
