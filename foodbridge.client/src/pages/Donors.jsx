import React, { useState, useEffect } from 'react';
import { donorsAPI } from '../services/api';
import DataTable from '../components/common/DataTable';
import { FormInput, FormSelect } from '../components/forms';

const DonorsPage = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedDonor, setSelectedDonor] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        donorType: ''
    });

    const fetchDonors = async () => {
        try {
            setLoading(true);
            setError(null);
   
            const response = await donorsAPI.getAll({ 
                pageNumber, 
                pageSize,
                sortBy: 'Name',
                sortDescending: false  // ? Added proper sorting
            });
         
            if (response.success) {
                setDonors(response.data.items || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalCount(response.data.totalCount || 0);
            }
        } catch (err) {
            console.error('Fetch donors error:', err);
            setError(err.response?.data?.message || 'Failed to load donors');
            setDonors([]);  // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, [pageNumber]);

    const handleCreate = () => {
        setFormData({ name: '', email: '', phoneNumber: '', address: '', donorType: '' });
        setModalMode('create');
        setShowModal(true);
    };

    const handleEdit = async (donor) => {
        const response = await donorsAPI.getById(donor.donorId);
        if (response.success) {
            setSelectedDonor(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
                donorType: response.data.donorType || ''
            });
            setModalMode('edit');
            setShowModal(true);
        }
    };

    const handleDelete = async (donor) => {
        if (confirm('Delete this donor?')) {
            const response = await donorsAPI.delete(donor.donorId);
            if (response.success) {
                setSuccess('Donor deleted');
                fetchDonors();
            }
        }
    };

    const handleSave = async () => {
        try {
            let response;
            if (modalMode === 'create') {
                response = await donorsAPI.create(formData);
            } else {
                response = await donorsAPI.update(selectedDonor.donorId, formData);
            }
            if (response.success) {
                setSuccess(`Donor ${modalMode}d successfully`);
                setShowModal(false);
                fetchDonors();
            }
        } catch (err) {
            setError('Failed to save donor');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phoneNumber' },
        { header: 'Type', accessor: 'donorType' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm ${row.isActive ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">Manage Donors ({totalCount})</h2>
                <button onClick={handleCreate} className="bg-primary text-white py-3 px-6 rounded-md">+ Add Donor</button>
            </div>

            {error && <div className="bg-danger bg-opacity-10 text-danger p-4 rounded">{error}</div>}
            {success && <div className="bg-success bg-opacity-10 text-success p-4 rounded">{success}</div>}

            <div className="rounded-sm border bg-white dark:bg-boxdark">
                <DataTable columns={columns} data={donors} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            {showModal && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl bg-white dark:bg-boxdark p-6 rounded-lg">
                        <h3 className="text-xl mb-6">{modalMode === 'create' ? 'Add' : 'Edit'} Donor</h3>
                        <div className="space-y-4">
                            <FormInput label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <FormInput label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                            <FormInput label="Address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            <FormSelect
                                label="Donor Type"
                                name="donorType"
                                value={formData.donorType}
                                onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
                                options={[
                                    { value: 'Individual', label: 'Individual' },
                                    { value: 'Business', label: 'Business' },
                                    { value: 'Organization', label: 'Organization' }
                                ]}
                            />
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

export default DonorsPage;
