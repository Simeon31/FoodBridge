import React, { useState, useEffect } from 'react';
import { inventoryAPI, productsAPI, donationsAPI } from '../services/api';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect } from '../components/forms';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [donationItems, setDonationItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [formData, setFormData] = useState({
        sourceDonationItemId: '',  // ? Changed from productId
        quantityOnHand: '',
        expirationDate: '',
        dateReceived: new Date().toISOString().split('T')[0]
    });
    const [formErrors, setFormErrors] = useState({});

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await inventoryAPI.getAll({
                pageNumber,
                pageSize,
                searchTerm,
                sortBy: 'ProductName',
                sortDescending: false 
            });

            if (response.success) {
                setInventory(response.data.items || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalCount(response.data.totalCount || 0);
            }
        } catch (err) {
            console.error('Fetch inventory error:', err);
            setError(err.response?.data?.message || 'Failed to load inventory');
            setInventory([]);  // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getActive();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (err) {
            console.error('Failed to load products', err);
        }
    };

    // ? NEW: Fetch available donation items (not yet in inventory)
    const fetchAvailableDonationItems = async () => {
        try {
            const response = await donationsAPI.getAvailableItems();
            
            console.log('Available donation items response:', response); // Debug log
 
            if (response.success && response.data) {
                const items = response.data.map(item => ({
                    value: item.donationItemId,
                    label: `${item.productName || 'Unknown Product'} - ${item.quantity} ${item.unitType || 'units'} (Donation #${item.donationId})`,
                    donationItemId: item.donationItemId,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitType: item.unitType,
                    expirationDate: item.expirationDate,
                    donationId: item.donationId
                }));
                
                console.log('Mapped available donation items:', items); // Debug log
                setDonationItems(items);
            }
        } catch (err) {
            console.error('Failed to load available donation items:', err);
            setError('Failed to load available donation items. Please try again.');
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchProducts();
        fetchAvailableDonationItems();
    }, [pageNumber]);

    const handleSearch = () => {
        setPageNumber(1);
        fetchInventory();
    };

    const handleCreate = () => {
        setFormData({
            sourceDonationItemId: '',
            quantityOnHand: '',
            expirationDate: '',
            dateReceived: new Date().toISOString().split('T')[0]
        });
        setFormErrors({});
        setModalMode('create');
        setShowModal(true);
    };

    const handleEdit = async (item) => {
        try {
            const response = await inventoryAPI.getById(item.inventoryItemId);
            if (response.success) {
                setSelectedItem(response.data);
                setFormData({
                    sourceDonationItemId: response.data.sourceDonationItemId,
                    quantityOnHand: response.data.quantityOnHand,
                    expirationDate: response.data.expirationDate ? response.data.expirationDate.split('T')[0] : '',
                    dateReceived: response.data.dateReceived.split('T')[0]
                });
                setModalMode('edit');
                setShowModal(true);
            }
        } catch (err) {
            setError('Failed to load item details');
        }
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await inventoryAPI.delete(selectedItem.inventoryItemId);
            if (response.success) {
                setSuccess('Item deleted successfully');
                setShowDeleteDialog(false);
                fetchInventory();
            }
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // ? When donation item is selected, auto-fill related fields
        if (name === 'sourceDonationItemId' && value) {
            const selectedDonationItem = donationItems.find(di => di.donationItemId === parseInt(value));
            
            if (selectedDonationItem) {
                console.log('Selected donation item:', selectedDonationItem);
   
                setFormData(prev => ({
                    ...prev,
                    sourceDonationItemId: value,
                    quantityOnHand: selectedDonationItem.quantity || '',  // ? Fixed: use quantity
                    expirationDate: selectedDonationItem.expirationDate 
            ? new Date(selectedDonationItem.expirationDate).toISOString().split('T')[0] 
       : '',  // ? Added: Auto-fill expiration date
                    dateReceived: new Date().toISOString().split('T')[0]
     }));
       
    // Clear error for this field
         if (formErrors.sourceDonationItemId) {
       setFormErrors(prev => ({ ...prev, sourceDonationItemId: null }));
       }
        return;
       }
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
  if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
    
   if (!formData.sourceDonationItemId) {
 errors.sourceDonationItemId = 'Donation item is required';
    }
    
  if (!formData.quantityOnHand || formData.quantityOnHand < 0) {
    errors.quantityOnHand = 'Valid quantity is required';
        }

      // ? Validate quantity doesn't exceed donation quantity
   const selectedItem = donationItems.find(
     di => di.donationItemId === parseInt(formData.sourceDonationItemId)
  );
  if (selectedItem && parseInt(formData.quantityOnHand) > selectedItem.quantity) {
       errors.quantityOnHand = `Quantity cannot exceed ${selectedItem.quantity} ${selectedItem.unitType || 'units'}`;
  }
        
        if (!formData.dateReceived) {
      errors.dateReceived = 'Date received is required';
}
        
        setFormErrors(errors);
 return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                sourceDonationItemId: parseInt(formData.sourceDonationItemId),
                quantityOnHand: parseInt(formData.quantityOnHand),
                dateReceived: formData.dateReceived,
                expirationDate: formData.expirationDate || null
            };

            let response;
            if (modalMode === 'create') {
                response = await inventoryAPI.create(payload);
            } else {
                response = await inventoryAPI.update(selectedItem.inventoryItemId, payload);
            }

            if (response.success) {
                setSuccess(`Item ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
                setShowModal(false);
                fetchInventory();
            }
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${modalMode} item`);
        }
    };

    const columns = [
        { header: 'Product', accessor: 'productName' },
        { header: 'Category', accessor: 'category' },
        { header: 'Quantity', accessor: 'quantityOnHand' },
        {
            header: 'Expiration',
            render: (row) => row.expirationDate ? new Date(row.expirationDate).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Days Until Expiry',
            render: (row) => {
                if (!row.daysUntilExpiration) return 'N/A';
                const days = row.daysUntilExpiration;
                return (
                    <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${days < 0 ? 'bg-danger text-danger' :
                            days <= 7 ? 'bg-warning text-warning' :
                                'bg-success text-success'
                        }`}>
                        {days < 0 ? 'Expired' : `${days} days`}
                    </span>
                );
            }
        }
    ];

    const productOptions = products.map(p => ({ value: p.productId, label: p.productName }));
    const donationItemOptions = donationItems
        .filter(di => di.productId) 
        .map(di => ({ 
            value: di.donationItemId, 
            label: `${di.productName} - ${di.quantity} ${di.unitType || 'units'} (Donation #${di.donationId})`  // ? Fixed: use di.quantity
   }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">Manage Inventory</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage inventory ({totalCount} items)</p>
                </div>
                <button onClick={handleCreate} className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90">
                    + Add Item
                </button>
            </div>

            {error && (
                <div className="rounded-lg border-l-[6px] border-danger bg-danger bg-opacity-10 px-7 py-4">
                    <div className="flex justify-between items-center">
                        <p className="text-danger">{error}</p>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                </div>
            )}

            {success && (
                <div className="rounded-lg border-l-[6px] border-success bg-success bg-opacity-10 px-7 py-4">
                    <div className="flex justify-between items-center">
                        <p className="text-success">{success}</p>
                        <button onClick={() => setSuccess(null)}>×</button>
                    </div>
                </div>
            )}

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>
                    <button onClick={handleSearch} className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90">
                        Search
                    </button>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-4 py-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">Inventory List</h4>
                </div>
                <DataTable columns={columns} data={inventory} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-6 border-t">
                        <p>Page {pageNumber} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPageNumber(prev => Math.max(1, prev - 1))} disabled={pageNumber === 1}>Previous</button>
                            <button onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))} disabled={pageNumber === totalPages}>Next</button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-boxdark p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-6">{modalMode === 'create' ? 'Add' : 'Edit'} Inventory Item</h3>

                        {error && (
         <div className="mb-4 rounded-lg border-l-[6px] border-danger bg-danger bg-opacity-10 px-4 py-3">
      <p className="text-danger text-sm">{error}</p>
           </div>
         )}

                        <div className="space-y-4">
        <FormSelect 
      label="Donation Item" 
    name="sourceDonationItemId" 
         value={formData.sourceDonationItemId} 
    onChange={handleInputChange} 
   options={donationItemOptions} 
        error={formErrors.sourceDonationItemId} 
           required 
   placeholder="Select a donation item"
        />

       {formData.sourceDonationItemId && (
    <div className="rounded-lg border border-primary bg-primary bg-opacity-10 p-4">
  <p className="text-sm text-primary">
       <strong>Info:</strong> Quantity and product details will be populated from the selected donation item.
              </p>
         </div>
         )}

  <div className="grid grid-cols-2 gap-4">
<FormInput 
       label="Quantity (from donation)" 
        name="quantityOnHand" 
          type="number" 
   value={formData.quantityOnHand} 
       onChange={handleInputChange} 
         error={formErrors.quantityOnHand} 
          required 
     placeholder="Auto-filled"
          />
               <FormInput 
     label="Date Received" 
           name="dateReceived" 
     type="date" 
     value={formData.dateReceived} 
     onChange={handleInputChange} 
           error={formErrors.dateReceived} 
   required 
/>
   </div>

      <FormInput 
     label="Expiration Date (optional)" 
         name="expirationDate" 
     type="date" 
        value={formData.expirationDate} 
    onChange={handleInputChange} 
      placeholder="Override donation expiration date"
      />

     <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
      <strong>Note:</strong> Storage location management will be added in a future update.
  </p>
         </div>
 </div>

  <div className="flex justify-end gap-3 mt-6">
   <button onClick={() => setShowModal(false)} className="py-3 px-6 border rounded-md hover:bg-gray hover:bg-opacity-10">Cancel</button>
   <button onClick={handleSave} className="py-3 px-6 bg-primary text-white rounded-md hover:bg-opacity-90">Save</button>
  </div>
    </div>
         </div>
  )}

            {showDeleteDialog && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white dark:bg-boxdark p-6">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this item?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteDialog(false)} className="py-3 px-6 border rounded-md">Cancel</button>
                            <button onClick={confirmDelete} className="py-3 px-6 bg-danger text-white rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
