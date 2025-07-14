// Updated version of Leases.jsx with fallback to API property_name and unit_name
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiFileText, FiHome, FiUser, FiX, FiSearch, FiCheckCircle, FiArchive, FiFilter } from 'react-icons/fi';
import styles from './Leases.module.css';
import { properties } from '../services/api';
import axiosInstance from '../utils/axiosInstance';
import LeaseForm from '../Forms/LeaseForm';

// Helper function to fetch tenant details by ID
const fetchTenantDetails = async (tenantId, tenantsList) => {
  if (!tenantId) return null;
  try {
    const tenant = tenantsList.find(t => t.id === parseInt(tenantId) || t.user_id === parseInt(tenantId));
    if (tenant) return tenant;

    const response = await properties.gettenants();
    const tenantsData = Array.isArray(response?.data?.data) ? response.data.data :
                        Array.isArray(response?.data) ? response.data : [];

    return tenantsData.find(t => t.id === parseInt(tenantId) || t.user_id === parseInt(tenantId)) || null;
  } catch (error) {
    console.error('Error fetching tenant details:', error);
    return null;
  }
};

export default function Leases() {
  // Retrieve access token from localStorage
  const access = localStorage.getItem('access');
  const [leases, setLeases] = useState([]);
  const [inactiveLeases, setInactiveLeases] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [tenantsList, setTenantsList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingLease, setEditingLease] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Search bar is always visible, no need for showSearch state
  const [showFilters, setShowFilters] = useState(false);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters] = useState({
    property: '',
    tenant: '',
    dateFrom: '',
    dateTo: '',
    rentMin: '',
    rentMax: ''
  });

  const permanentlyDeleteLease = async (leaseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this lease? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      console.log('Permanently deleting lease with ID:', leaseId);
      
      // Update the lease to set both active=0 and inactive=0
      await properties.updatelease(leaseId, { active: 0, inactive: 0 });
      
      // Refresh the leases list
      setRefreshKey(prev => prev + 1);
      alert('Lease permanently deleted successfully');
    } catch (error) {
      console.error('Error permanently deleting lease:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Failed to permanently delete lease';
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const toggleLeaseStatus = async (leaseId, isCurrentlyActive) => {
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';
    const confirmMessage = `Are you sure you want to mark this lease as ${newStatus}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsDeleting(true); // Reuse the loading state for toggling status
      console.log(`Changing lease status for ID: ${leaseId} to ${newStatus}`);
      
      if (isCurrentlyActive) {
        // Mark as inactive (active=0, inactive=1)
        // Using the dedicated endpoint for making a lease inactive
        await properties.inactivelease(leaseId);
      } else {
        // Mark as active (active=1, inactive=0)
        // Explicitly set both flags when reactivating a lease
        await properties.updatelease(leaseId, { active: 1, inactive: 0 });
      }
      
      // Refresh the leases list
      setRefreshKey(prev => prev + 1);
      alert(`Lease marked as ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating lease status:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         `Failed to update lease status to ${newStatus}`;
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchLeases = async (isInactive = false) => {
    try {
      // Use the appropriate API endpoint based on whether we're fetching active or inactive leases
      const endpoint = isInactive ? 'properties/lease/inactive/' : 'properties/lease/';
      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      if (!response?.data) throw new Error('No data received from server');

      let leasesData = [];
      if (Array.isArray(response.data)) {
        leasesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        leasesData = response.data.data;
      } else {
        throw new Error('Invalid data format received');
      }
      
      // Backend should already filter correctly, but we'll double-check here
      if (isInactive) {
        leasesData = leasesData.filter(lease => lease.inactive === true);
      } else {
        leasesData = leasesData.filter(lease => lease.active === true);
      }
      return leasesData;
    } catch (err) {
      console.error(`Error fetching ${isInactive ? 'inactive' : 'active'} leases:`, err);
      throw err;
    }
  };

  const fetchPropertiesAndTenantsAndUnits = async () => {
    try {
      setLoading(true);
      const [propertiesRes, tenantsRes, unitsRes] = await Promise.all([
        axiosInstance.get('/properties/property_list/', { headers: { Authorization: `Bearer ${access}` } }),
        axiosInstance.get('user/tenant/', { headers: { Authorization: `Bearer ${access}` } }),
        axiosInstance.get('properties/unit/', { headers: { Authorization: `Bearer ${access}` } })
      ]);

      const processedProperties = Array.isArray(propertiesRes?.data?.data) ? propertiesRes.data.data : 
                                  Array.isArray(propertiesRes?.data) ? propertiesRes.data : [];

      const processedTenants = Array.isArray(tenantsRes?.data?.data) ? tenantsRes.data.data : 
                               Array.isArray(tenantsRes?.data) ? tenantsRes.data : [];

      const processedUnits = Array.isArray(unitsRes?.data?.data) ? unitsRes.data.data : 
                             Array.isArray(unitsRes?.data) ? unitsRes.data : [];

      setPropertiesList(processedProperties);
      setTenantsList(processedTenants);
      setUnitsList(processedUnits);
    } catch (err) {
      console.error('Error fetching properties, tenants, or units:', err);
      setError('Failed to load properties, tenants, or units.');
      setPropertiesList([]);
      setTenantsList([]);
      setUnitsList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeasesWithDetails = async () => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      // Fetch both active and inactive leases
      const [activeLeasesData, inactiveLeasesData] = await Promise.all([
        fetchLeases(false),
        fetchLeases(true)
      ]);
      
      if ((!activeLeasesData || activeLeasesData.length === 0) && 
          (!inactiveLeasesData || inactiveLeasesData.length === 0)) {
        setLeases([]);
        setInactiveLeases([]);
        return;
      }

      const unitsResponse = await axiosInstance.get('properties/unit/', { headers: { Authorization: `Bearer ${access}` } });
      const unitsData = Array.isArray(unitsResponse?.data) ? unitsResponse.data : [];
      const propertiesResponse = await axiosInstance.get('properties/property_list/', { headers: { Authorization: `Bearer ${access}` } });
      const propertiesData = Array.isArray(propertiesResponse?.data) ? propertiesResponse.data : [];

      // Process active leases
      const formattedActiveLeases = await Promise.all(
        activeLeasesData.map(async (lease) => {
          const unit = unitsData.find(u => u.unit_id === lease.unit_id || u.id === lease.unit_id);
          let property = null;
          if (unit?.property_id) {
            property = propertiesData.find(p => p.property_id === unit.property_id || p.id === unit.property_id);
          }
          let tenant = null;
          if (lease.tenant_id || lease.tenant) {
            tenant = await fetchTenantDetails(lease.tenant_id || lease.tenant, tenantsList);
          }

          const tenantInfo = tenant ? {
            id: tenant.id || tenant.user_id || lease.tenant_id || lease.tenant || '',
            username: tenant.username || '',
            email: tenant.email || '',
            full_name: `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || tenant.username || 'Unknown Tenant'
          } : {
            id: lease.tenant_id || lease.tenant || '',
            username: '',
            email: '',
            full_name: 'Unknown Tenant'
          };

          return {
            ...lease,
            unit_id: lease.unit_id || '',
            unit_name: unit?.unit_name || lease.unit_name || `Unit ${lease.unit_id}` || 'Unknown Unit',
            property_id: unit?.property_id || lease.property_id || '',
            property_name: property?.property_name || lease.property_name || 'Unknown Property',
            tenant: tenantInfo,
            tenant_id: tenantInfo.id,
            tenant_name: tenantInfo.full_name,
            tenant_email: tenantInfo.email,
            tenant_username: tenantInfo.username,
            lease_start: lease.lease_start,
            lease_end: lease.lease_end,
            monthly_rent: parseFloat(lease.monthly_rent) || 0,
            status: String(lease.status || 'active').toLowerCase(),
            lease_id: lease.lease_id || lease.id,
            rent: lease.rent,
            percent: lease.increment_percent
          };
        })
      );

      // Process inactive leases
      const formattedInactiveLeases = await Promise.all(
        inactiveLeasesData.map(async (lease) => {
          const unit = unitsData.find(u => u.unit_id === lease.unit_id || u.id === lease.unit_id);
          let property = null;
          if (unit?.property_id) {
            property = propertiesData.find(p => p.property_id === unit.property_id || p.id === unit.property_id);
          }
          let tenant = null;
          if (lease.tenant_id || lease.tenant) {
            tenant = await fetchTenantDetails(lease.tenant_id || lease.tenant, tenantsList);
          }

          const tenantInfo = tenant ? {
            id: tenant.id || tenant.user_id || lease.tenant_id || lease.tenant || '',
            username: tenant.username || '',
            email: tenant.email || '',
            full_name: `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || tenant.username || 'Unknown Tenant'
          } : {
            id: lease.tenant_id || lease.tenant || '',
            username: '',
            email: '',
            full_name: 'Unknown Tenant'
          };

          return {
            ...lease,
            unit_id: lease.unit_id || '',
            unit_name: unit?.unit_name || lease.unit_name || `Unit ${lease.unit_id}` || 'Unknown Unit',
            property_id: unit?.property_id || lease.property_id || '',
            property_name: property?.property_name || lease.property_name || 'Unknown Property',
            tenant: tenantInfo,
            tenant_id: tenantInfo.id,
            tenant_name: tenantInfo.full_name,
            tenant_email: tenantInfo.email,
            tenant_username: tenantInfo.username,
            lease_start: lease.lease_start,
            lease_end: lease.lease_end,
            monthly_rent: parseFloat(lease.monthly_rent) || 0,
            status: 'inactive',
            active: false,
            lease_id: lease.lease_id || lease.id,
            rent: lease.rent,
            percent: lease.increment_percent
          };
        })
      );

      setLeases(formattedActiveLeases);
      setInactiveLeases(formattedInactiveLeases);
    } catch (err) {
      console.error('Error in fetchLeasesWithDetails:', err);
      setError(err.message || 'Failed to load lease data.');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPropertiesAndTenantsAndUnits();
  }, [refreshKey]);

  // Filter leases based on search term, filters, and active tab
  useEffect(() => {
    // Select the appropriate lease array based on active tab
    const sourceLeases = activeTab === 'active' ? leases : inactiveLeases;
    let filtered = [...sourceLeases];
    
    // Apply filters first
    if (filters.property) {
      filtered = filtered.filter(lease => 
        lease.property_name?.toLowerCase().includes(filters.property.toLowerCase())
      );
    }
    
    if (filters.tenant) {
      filtered = filtered.filter(lease => 
        lease.tenant_name?.toLowerCase().includes(filters.tenant.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(lease => {
        const leaseStartDate = new Date(lease.lease_start);
        return leaseStartDate >= fromDate;
      });
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day for inclusive filtering
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(lease => {
        const leaseEndDate = new Date(lease.lease_end);
        return leaseEndDate <= toDate;
      });
    }
    
    if (filters.rentMin) {
      const minRent = parseFloat(filters.rentMin);
      filtered = filtered.filter(lease => {
        const rent = parseFloat(lease.rent);
        return !isNaN(rent) && rent >= minRent;
      });
    }
    
    if (filters.rentMax) {
      const maxRent = parseFloat(filters.rentMax);
      filtered = filtered.filter(lease => {
        const rent = parseFloat(lease.rent);
        return !isNaN(rent) && rent <= maxRent;
      });
    }
    
    // Then apply search filter if search term exists
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(lease => 
        (lease.property_name?.toLowerCase().includes(lowercasedTerm)) ||
        (lease.unit_name?.toLowerCase().includes(lowercasedTerm)) ||
        (lease.tenant_name?.toLowerCase().includes(lowercasedTerm)) ||
        (lease.status?.toLowerCase().includes(lowercasedTerm)) ||
        (lease.lease_id?.toString().includes(searchTerm)) ||
        (lease.rent?.toString().includes(searchTerm))
      );
    }
    
    setFilteredLeases(filtered);
  }, [searchTerm, leases, inactiveLeases, activeTab, filters]);

  // Update filtered leases when active tab or leases change
  useEffect(() => {
    const sourceLeases = activeTab === 'active' ? leases : inactiveLeases;
    setFilteredLeases(sourceLeases);
  }, [activeTab, leases, inactiveLeases]);

  useEffect(() => {
    if (propertiesList.length > 0 && unitsList.length > 0 && tenantsList.length > 0) {
      fetchLeasesWithDetails();
    }
  }, [propertiesList, unitsList, tenantsList, refreshKey]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Hide filters when showing search
  const showSearchFilters = () => {
    setShowFilters(false);
  };
  
  const toggleFilters = () => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    // If showing filters, clear the search term
    if (newShowFilters) {
      setSearchTerm('');
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      property: '',
      tenant: '',
      dateFrom: '',
      dateTo: '',
      rentMin: '',
      rentMax: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group" aria-label="Lease Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`btn d-flex align-items-center py-2 ${activeTab === 'active' ? 'btn-success text-white' : 'btn-outline-secondary'} ${styles.leaseTabBtn}`}
            style={activeTab === 'active' ? { backgroundColor: '#198754', borderColor: '#198754' } : { paddingLeft: '1rem' }}
            type="button"
          >
            <FiCheckCircle className="me-2" />
            Active Leases 
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`btn d-flex align-items-center py-2 ${activeTab === 'inactive' ? 'btn-danger text-white' : 'btn-outline-secondary'} ${styles.leaseTabBtn}`}
            style={activeTab === 'inactive' ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
            type="button"
          >
            <FiArchive className="me-2" />
            Inactive Leases
          </button>
        </div>
        <div className="d-flex align-items-center">
          <FiSearch className="text-secondary me-2" />
          <div className="position-relative me-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search leases..."
              className="form-control py-2"
              style={{ minWidth: '200px' }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ background: 'none', border: 'none' }}
              >
                <FiX className="text-secondary" />
              </button>
            )}
          </div>
          <button 
  onClick={toggleFilters}
  className="btn btn-link text-secondary p-2 ps-3 pe-5 me-3 position-relative"
  aria-label="Filter"
  title="Filter Leases"
  type="button"
>
  {showFilters ? <FiX /> : <FiFilter />}
  {Object.values(filters).some(val => val !== '') && 
    <span className="position-absolute top-0 end-0 translate-middle p-1 bg-primary border border-light rounded-circle"></span>
  }
</button>



        </div>
      </div>
      
      <div className="d-flex flex-column mb-4">
        {/* Search bar is now always visible in the top right corner */}
        
        {showFilters && (
  <div className="bg-light p-4 rounded border mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h8 className="h6  mb-0 text-dark">Filter Leases</h8>
      <button 
        onClick={clearFilters}
        className="btn btn-link btn-sm text-primary p-0"
        type="button"
      >
        Clear all
      </button>
    </div>
    <div className="row g-3">
      <div className="col-md-3">
        <label className="form-label" htmlFor="property-filter">Property</label>
        <select
          id="property-filter"
          name="property"
          value={filters.property}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All Properties</option>
          {propertiesList.map((p) => (
            <option key={p.id || p.property_id} value={p.id || p.property_id}>{p.property_name}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="tenant-filter">Tenant</label>
        <select
          id="tenant-filter"
          name="tenant"
          value={filters.tenant}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All Tenants</option>
          {tenantsList.map((t) => (
            <option key={t.id || t.user_id} value={t.id || t.user_id}>{t.username || t.name}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="date-from-filter">Start Date From</label>
        <input
          id="date-from-filter"
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          className="form-control"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="date-to-filter">Start Date To</label>
        <input
          id="date-to-filter"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          className="form-control"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="rent-min-filter">Min Rent</label>
        <input
          id="rent-min-filter"
          type="number"
          name="rentMin"
          value={filters.rentMin}
          onChange={handleFilterChange}
          className="form-control"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="rent-max-filter">Max Rent</label>
        <input
          id="rent-max-filter"
          type="number"
          name="rentMax"
          value={filters.rentMax}
          onChange={handleFilterChange}
          className="form-control"
        />
      </div>
    </div>
  </div>
)}
      </div>
  
      {error && <p className="text-danger">{error}</p>}
      {activeTab === 'active' ? (
        <div className="bg-success text-white px-4 py-2 rounded-top fw-medium d-flex align-items-center">
          <FiCheckCircle className="me-2" /> Active Leases 
        </div>
      ) : (
        <div className="bg-danger text-white px-4 py-2 rounded-top fw-medium d-flex align-items-center">
          <FiArchive className="me-2" /> Inactive Leases
        </div>
      )}
      
      {loading ? (
        <p className="text-secondary">Loading leases...</p>
      ) : (
        <div className="card mt-4">
        
          <div className="card-body p-0">
            <table className="table bordered-table text-sm">
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Tenant</th>
                  <th scope="col">Start</th>
                  <th scope="col">End</th>
                  <th scope="col">Rent</th>
                  <th scope="col">Status</th>
                  <th scope="col">Percent</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeases.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      {leases.length === 0 ? 'No leases found' : 'No matching leases found'}
                    </td>
                  </tr>
                ) : (
                  filteredLeases.map((lease) => (
                    <tr key={lease.lease_id}>
                      <td>{lease.property_name}</td>
                      <td>{lease.unit_name}</td>
                      <td>{lease.tenant_name}</td>
                      <td>{lease.lease_start}</td>
                      <td>{lease.lease_end}</td>
                      <td>${lease.rent}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 fw-medium text-sm ${lease.active ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                          {lease.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{lease.increment_percent}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {activeTab === 'active' ? (
                            <button
                              onClick={() => toggleLeaseStatus(lease.lease_id, true)}
                              disabled={isDeleting}
                              className="btn btn-warning btn-sm"
                              title="Move to Inactive Leases"
                            >
                              <FiArchive />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleLeaseStatus(lease.lease_id, false)}
                                disabled={isDeleting}
                                className="btn btn-success btn-sm"
                                title="Restore to Active Leases"
                              >
                                <FiCheckCircle />
                              </button>
                              <button
                                onClick={() => permanentlyDeleteLease(lease.lease_id)}
                                disabled={isDeleting}
                                className="btn btn-danger btn-sm"
                                title="Permanently Delete Lease"
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
  
      {showModal && (
        <div className="modal fade" id="leaseModal" tabIndex="-1" aria-labelledby="leaseModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="leaseModalLabel">New Lease</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <LeaseForm
                  onClose={() => setShowModal(false)}
                  onLeaseAdded={() => {
                    setRefreshKey((prev) => prev + 1);
                    setShowModal(false);
                  }}
                  propertiesList={propertiesList}
                  tenantsList={tenantsList}
                  unitsList={unitsList}
                  rent={editingLease?.rent}
                  onLeaseUpdated={() => {
                    setRefreshKey(prev => prev + 1);
                    setShowModal(false);
                    setEditingLease(null);
                  }}
                />
              </div>
            </div>
              onClose={() => setShowModal(false)}
              onLeaseAdded={() => {
                setRefreshKey((prev) => prev + 1);
                setShowModal(false);
              }}
              propertiesList={propertiesList}
              tenantsList={tenantsList}
              unitsList={unitsList}
              rent={editingLease?.rent}
              onLeaseUpdated={() => {
                setRefreshKey(prev => prev + 1);
                setShowModal(false);
                setEditingLease(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
