// Updated Tenants.jsx with smart filters and CRUD operations
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch,FiUser } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import axios from 'axios';
import TenantForm from '../Forms/TenantForm';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredTenants, setFilteredTenants] = useState([]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('https://hemanth525.pythonanywhere.com/user/tenant/');
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setTenants(data || []);
    } catch (err) {
      setError('Failed to fetch tenants.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTenant = () => {
    setEditingTenant(null);
    setShowModal(true);
  };

  const handleEditTenant = (tenant) => {
    const tenantId = tenant?.user_id || tenant?.id;
    if (!tenantId) {
      alert("Invalid tenant selected for editing.");
      return;
    }
    setEditingTenant({ ...tenant, id: tenantId });  // ensure tenant.id is set to user_id
    setShowModal(true);
  };
  
  const handleDeleteTenant = async (tenantId) => {
    if (!tenantId || tenantId === 'undefined') {
      alert("Invalid tenant ID.");
      return;
    }
  
    if (!window.confirm('Are you sure you want to deactivate this tenant?')) return;
  
    try {
      await axios.delete(`https://hemanth525.pythonanywhere.com/user/tenant/${tenantId}/`);
      alert('Tenant deleted successfully.');
      fetchTenants();
    } catch (err) {
      console.error('Error deleting tenant:', err);
      alert('Failed to delete tenant.');
    }
  };
  

  const handleTenantAddedOrUpdated = () => {
    fetchTenants();
    setShowModal(false);
    setEditingTenant(null);
  };

  // Filter tenants based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTenants(tenants);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = tenants.filter(tenant => 
        (tenant.username?.toLowerCase().includes(lowercasedTerm)) ||
        (tenant.email?.toLowerCase().includes(lowercasedTerm)) ||
        (tenant.first_name?.toLowerCase().includes(lowercasedTerm)) ||
        (tenant.last_name?.toLowerCase().includes(lowercasedTerm)) ||
        (tenant.phone_number?.includes(searchTerm)) ||
        (tenant.id?.toString().includes(searchTerm))
      );
      setFilteredTenants(filtered);
    }
  }, [searchTerm, tenants]);

  // Initialize filteredTenants when tenants change
  useEffect(() => {
    setFilteredTenants(tenants);
  }, [tenants]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchTerm('');
    }
  };

  return (
    
    <div className="d-flex flex-column gap-2">
      <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
      <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="icon-field">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control form-control-sm w-auto"
              placeholder="Search tenants..."
            />
            <span className="icon">
              <FiSearch />
            </span>
          </div>
          </div>
          
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <button
            onClick={handleNewTenant}
            className="btn btn-sm btn-primary-600 d-flex align-items-center gap-1 px-3 py-1"
          >
            <FiPlus className="h-4 w-4" />
            <span>New Tenant</span>
          </button>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '8rem'}}><span className="spinner-border text-primary" role="status" aria-hidden="true"></span><span className="ms-2">Loading...</span></div>
      ) : filteredTenants.length === 0 ? (
        <div className="bg-light rounded shadow p-4">
          <div className="text-center py-5">
            <FiUser className="d-block mx-auto text-secondary" style={{fontSize:'2.5rem'}} />
            <h3 className="mt-2 h6 fw-medium">
              {searchTerm ? 'No matching tenants found' : 'No tenants found'}
            </h3>
            <p className="mt-1 text-muted">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Get started by creating a new tenant'}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleNewTenant}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add New Tenant
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-light rounded overflow-auto">
         <table   className="table bordered-table text-sm">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredTenants.map((tenant) => {
                const tenantId = tenant.user_id || tenant.id;
                return (
                  <tr key={tenantId}>
                    <td className="align-middle">{tenant.username}</td>
                    <td className="align-middle">{tenant.email}</td>
                    <td className="align-middle">
 
  <button
    type="button"
    onClick={() => handleEditTenant(tenant)}
    className="w-32-px h-32-px me-2 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
    aria-label="Edit tenant"
    style={{ outline: 'none', border: 'none' }}
  >
    <span style={{ pointerEvents: 'none' }}>
      <Icon icon="lucide:edit" style={{ fontSize: '1.2rem' }} />
    </span>
  </button>
  <button
    type="button"
    onClick={() => handleDeleteTenant(tenantId)}
    className="w-32-px h-32-px me-2 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
    aria-label="Delete tenant"
    style={{ outline: 'none', border: 'none' }}
  >
    <span style={{ pointerEvents: 'none' }}>
      <Icon icon="mingcute:delete-2-line" style={{ fontSize: '1.2rem' }} />
    </span>
  </button>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.35)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h6>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <TenantForm
                    onClose={() => setShowModal(false)}
                    onTenantAdded={handleTenantAddedOrUpdated}
                    onTenantUpdated={handleTenantAddedOrUpdated}
                    tenant={editingTenant}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Tenants;
