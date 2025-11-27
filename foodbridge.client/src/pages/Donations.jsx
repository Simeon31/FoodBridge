import React, { useState, useEffect } from 'react';
import { donationsAPI, donorsAPI } from '../services/api';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect, FormTextarea } from '../components/forms';

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    donorId: '',
    donationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await donationsAPI.getAll({
        pageNumber,
        pageSize,
        searchTerm,
        status: statusFilter,
     sortBy: 'DonationDate',
     sortDescending: true // ? Fixed: was sortOrder: 'desc'
      });

      if (response.success) {
      setDonations(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch donors for dropdown
  const fetchDonors = async () => {
    try {
      const response = await donorsAPI.getActive();
      if (response.success) {
  setDonors(response.data);
      }
  } catch (err) {
   console.error('Failed to load donors', err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchDonors();
  }, [pageNumber, statusFilter]);

  // Handlers
  const handleSearch = () => {
    setPageNumber(1);
    fetchDonations();
  };

  const handleView = async (donation) => {
    try {
      const response = await donationsAPI.getById(donation.donationId);
      if (response.success) {
   setSelectedDonation(response.data);
        setModalMode('view');
  setShowModal(true);
      }
    } catch (err) {
      setError('Failed to load donation details');
    }
  };

  const handleEdit = async (donation) => {
    try {
      const response = await donationsAPI.getById(donation.donationId);
      if (response.success) {
        setSelectedDonation(response.data);
 setFormData({
        donorId: response.data.donorId,
          donationDate: response.data.donationDate.split('T')[0],
          notes: response.data.notes || ''
     });
        setModalMode('edit');
        setShowModal(true);
  }
    } catch (err) {
setError('Failed to load donation details');
    }
  };

  const handleDelete = (donation) => {
    setSelectedDonation(donation);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
  const response = await donationsAPI.delete(selectedDonation.donationId);
      if (response.success) {
        setSuccess('Donation deleted successfully');
        setShowDeleteDialog(false);
        fetchDonations();
    }
    } catch (err) {
      setError('Failed to delete donation');
    }
  };

  const handleCreate = () => {
  setSelectedDonation(null);
    setFormData({
      donorId: '',
      donationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setFormErrors({});
    setModalMode('create');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDonation(null);
    setFormData({
      donorId: '',
      donationDate: new Date().toISOString().split('T')[0],
notes: ''
    });
    setFormErrors({});
  };

const handleInputChange = (e) => {
const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
  [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.donorId) {
      errors.donorId = 'Donor is required';
    }
    
    if (!formData.donationDate) {
      errors.donationDate = 'Donation date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response;
      const payload = {
    ...formData,
   donorId: parseInt(formData.donorId)
      };

      if (modalMode === 'create') {
        response = await donationsAPI.create(payload);
      } else {
  response = await donationsAPI.update(selectedDonation.donationId, payload);
      }

if (response.success) {
   setSuccess(`Donation ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        handleCloseModal();
        fetchDonations();
 }
} catch (err) {
      setError(err.response?.data?.message || `Failed to ${modalMode} donation`);
    }
  };

  // Table columns
  const columns = [
    {
      header: 'ID',
 accessor: 'donationId',
  render: (row) => `#${row.donationId}`
    },
    {
      header: 'Donor',
      accessor: 'donorName'
    },
    {
      header: 'Date',
      render: (row) => new Date(row.donationDate).toLocaleDateString()
    },
    {
      header: 'Receipt #',
      accessor: 'receiptNumber'
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
          row.status === 'Approved' ? 'bg-success text-success' :
      row.status === 'Rejected' ? 'bg-danger text-danger' :
    row.status === 'Pending' ? 'bg-warning text-warning' :
     'bg-primary text-primary'
        }`}>
       {row.status}
  </span>
  )
    }
  ];

  const donorOptions = donors.map(donor => ({
    value: donor.donorId,
    label: donor.name
}));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Manage Donations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
       View and manage all donations ({totalCount} total)
   </p>
        </div>
        <button
          onClick={handleCreate}
        className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          + Add Donation
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
      <label className="mb-2.5 block text-black dark:text-white">
         Search
       </label>
    <input
  type="text"
 placeholder="Search by donor, receipt number..."
    value={searchTerm}
     onChange={(e) => setSearchTerm(e.target.value)}
       onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
   />
          </div>
          <div className="w-48">
            <label className="mb-2.5 block text-black dark:text-white">
     Status
     </label>
            <select
   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
    value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
        >
            <option value="">All Statuses</option>
    <option value="Pending">Pending</option>
     <option value="Inspection">Inspection</option>
   <option value="Approved">Approved</option>
       <option value="Rejected">Rejected</option>
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
      <h4 className="text-xl font-semibold text-black dark:text-white">
     Donations List
     </h4>
   </div>
     <DataTable
        columns={columns}
          data={donations}
       loading={loading}
          onView={handleView}
     onEdit={handleEdit}
    onDelete={handleDelete}
   emptyMessage="No donations found"
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
          <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-stroke dark:border-strokedark pb-4">
              <h3 className="text-xl font-semibold text-black dark:text-white">
   {modalMode === 'create' ? 'Create Donation' : 'Edit Donation'}
     </h3>
   <button
    onClick={handleCloseModal}
                className="text-gray-500 hover:text-black dark:hover:text-white"
     >
        ×
              </button>
         </div>

      <div className="space-y-4">
              <FormSelect
   label="Donor"
      name="donorId"
        value={formData.donorId}
     onChange={handleInputChange}
       options={donorOptions}
         error={formErrors.donorId}
      required
    placeholder="Select a donor"
       />

      <FormInput
            label="Donation Date"
         name="donationDate"
    type="date"
      value={formData.donationDate}
  onChange={handleInputChange}
   error={formErrors.donationDate}
  required
      />

  <FormTextarea
   label="Notes"
     name="notes"
       value={formData.notes}
           onChange={handleInputChange}
         placeholder="Add any additional notes..."
         rows={4}
          />
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
      {showModal && modalMode === 'view' && selectedDonation && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-stroke dark:border-strokedark pb-4">
        <h3 className="text-xl font-semibold text-black dark:text-white">
      Donation Details
     </h3>
      <button
    onClick={handleCloseModal}
     className="text-gray-500 hover:text-black dark:hover:text-white"
        >
       ×
     </button>
            </div>

       <div className="space-y-4">
    <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Donation ID</p>
   <p className="text-black dark:text-white font-medium">#{selectedDonation.donationId}</p>
   </div>
           <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Donor</p>
         <p className="text-black dark:text-white font-medium">{selectedDonation.donorName}</p>
        </div>
              <div>
           <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
     <p className="text-black dark:text-white font-medium">
       {new Date(selectedDonation.donationDate).toLocaleDateString()}
     </p>
        </div>
              <div>
     <p className="text-sm text-gray-500 dark:text-gray-400">Receipt Number</p>
                <p className="text-black dark:text-white font-medium">{selectedDonation.receiptNumber}</p>
    </div>
     <div>
  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
    <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
   selectedDonation.status === 'Approved' ? 'bg-success text-success' :
          selectedDonation.status === 'Rejected' ? 'bg-danger text-danger' :
     selectedDonation.status === 'Pending' ? 'bg-warning text-warning' :
     'bg-primary text-primary'
       }`}>
       {selectedDonation.status}
    </span>
              </div>
       {selectedDonation.notes && (
                <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
      <p className="text-black dark:text-white">{selectedDonation.notes}</p>
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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
   <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-boxdark p-6 shadow-lg">
  <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          Confirm Delete
  </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
   Are you sure you want to delete this donation? This action cannot be undone.
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

export default DonationsPage;
