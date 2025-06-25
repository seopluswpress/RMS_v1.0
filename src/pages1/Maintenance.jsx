import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { FiTool, FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import { properties } from '../services/api';
import MaintenanceForm from '../Forms/MaintenanceForm';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [maintainenceType, setMaintainenceType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    property: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch maintenance requests
      const response = await properties.getmaintainence();
      console.log('Maintenance API Response:', response);
      
      // Handle different response formats
      let requestsData = [];
      
      if (Array.isArray(response?.data)) {
        // If data is directly an array
        requestsData = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        // If data is nested under 'data' key
        requestsData = response.data.data;
      } else if (response?.data?.results && Array.isArray(response.data.results)) {
        // If using pagination with 'results' key
        requestsData = response.data.results;
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Unexpected response format from server');
      }
      
      // Process the response data
      const processedRequests = requestsData.map(request => {
        console.log('Original request data:', request);
        return {
          ...request,
          // Ensure we have a consistent ID field
          id: request.id || request.maintainence_id,
          // Check different possible locations for property info
          property: {
            property_name: request.property?.property_name || 
                         request.property_details?.property_name || 
                         request.property_name || 
                         'Unknown Property',
            property_address: request.property?.property_address || 
                            request.property_details?.property_address || 
                            request.property_address || 
                            ''
          },
          priority: request.priority || 'Medium' // Default to Medium if priority is not set
        };
      });
      
      console.log('Processed Requests:', processedRequests);
      setRequests(processedRequests);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
      setError('Failed to load maintenance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search term and filters
  useEffect(() => {
    let filtered = [...requests];
    
    // Apply filters first
    if (filters.status) {
      filtered = filtered.filter(request => 
        request.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.priority) {
      filtered = filtered.filter(request => 
        request.priority?.toLowerCase() === filters.priority.toLowerCase()
      );
    }
    
    if (filters.property) {
      filtered = filtered.filter(request => 
        request.property?.property_name?.toLowerCase().includes(filters.property.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.maintainence_date);
        return requestDate >= fromDate;
      });
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day for inclusive filtering
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.maintainence_date);
        return requestDate <= toDate;
      });
    }
    
    // Then apply search term if present
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        (request.property?.property_name?.toLowerCase().includes(lowercasedTerm)) ||
        (request.maintainence_type?.toLowerCase().includes(lowercasedTerm)) ||
        (request.status?.toLowerCase().includes(lowercasedTerm)) ||
        (request.priority?.toLowerCase().includes(lowercasedTerm)) ||
        (request.id?.toString().includes(searchTerm))
      );
    }
    
    setFilteredRequests(filtered);
  }, [searchTerm, requests, filters]);

  // Initialize filteredRequests when requests change
  useEffect(() => {
    setFilteredRequests(requests);
  }, [requests]);

  useEffect(() => {
    fetchMaintenanceData();
  }, [refreshKey]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSearch = () => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);
    if (!newShowSearch) {
      setSearchTerm('');
    }
    // Hide filters when showing search
    if (newShowSearch) {
      setShowFilters(false);
    }
  };
  
  const toggleFilters = () => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    // Hide search when showing filters
    if (newShowFilters) {
      setShowSearch(false);
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
      status: '',
      priority: '',
      property: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleNewRequest = () => {
    setShowModal(true);
    setMaintainenceType(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRequest(null);
  };

  const handleRequestAdded = (newRequest) => {
    console.log('New maintenance request added:', newRequest);
    setShowModal(false);
    setEditingRequest(null);
    // Refresh the list
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleEdit = (request) => {
    // Format the request data to match the form's expected format
    const formattedRequest = {
      ...request,
      property_id: request.property_id || (request.property && request.property.id) || '',
      maintainence_type: request.maintainence_type || '',
      maintainence_date: request.maintainence_date || '',
      maintainence_cost: request.maintainence_cost || '',
      priority: request.priority || 'Medium',
      status: request.status || 'pending',
      description: request.description || ''
    };
    setEditingRequest(formattedRequest);
    setShowModal(true);
  };

  const handleUpdate = async (maintenanceId, updatedData) => {
    try {
      console.log('Updating maintenance with ID:', maintenanceId, 'Data:', updatedData);
      // Use the correct API method name 'updatemaintenance'
      const response = await properties.updatemaintenance(maintenanceId, updatedData);
      console.log('Update response:', response);
      
      // Refresh the list to get the updated data from the server
      setRefreshKey(prevKey => prevKey + 1);
      
      // Show success message
      alert('Maintenance request updated successfully');
      setShowModal(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message ||
                         'Failed to update maintenance request';
      alert(errorMessage);
      // Re-throw the error to be handled by the form
      throw error;
    }
  };

  const handleDelete = async (maintenanceId) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return;
    
    try {
      setIsDeleting(true);
      console.log('Soft deleting maintenance with ID:', maintenanceId);
      
      // Instead of deleting, update the record to set active=0
      await properties.updatemaintainence(maintenanceId, { active: 0 });
      
      // Refresh the list to reflect the changes
      setRefreshKey(oldKey => oldKey + 1);
      alert('Maintenance request deleted successfully');
    } catch (error) {
      console.error('Error archiving maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Failed to archive maintenance request';
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'yellow', text: 'Pending' },
      in_progress: { color: 'blue', text: 'In Progress' },
      completed: { color: 'green', text: 'Completed' },
      cancelled: { color: 'red', text: 'Cancelled' },
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || { color: 'gray', text: 'Unknown' };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
        {statusInfo.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: { color: 'green', text: 'Low' },
      medium: { color: 'yellow', text: 'Medium' },
      high: { color: 'red', text: 'High' },
    };
    
    const priorityInfo = priorityMap[priority?.toLowerCase()] || { color: 'gray', text: 'Normal' };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${priorityInfo.color}-100 text-${priorityInfo.color}-800`}>
        {priorityInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          
          <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
  <div className="d-flex flex-wrap align-items-center gap-3">
    <div className="icon-field">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control form-control-sm w-auto"
        placeholder="Search"
        aria-label="Search Maintenance Requests"
      />
      <span className="icon">
        <Icon icon="ion:search-outline" />
      </span>
    </div>
  </div>
  <div className="d-flex flex-wrap align-items-center gap-3">
    <button
      onClick={toggleFilters}
      className="btn btn-light p-2 text-secondary position-relative"
      aria-label="Filter"
      title="Filter Maintenance Requests"
      type="button"
    >
      {showFilters ? <FiX style={{fontSize:'1.2rem'}} /> : <FiFilter style={{fontSize:'1.2rem'}} />}
      {Object.values(filters).some(val => val !== '') &&
        <span className="position-absolute top-0 end-0 translate-middle p-1 bg-primary border border-light rounded-circle"></span>
      }
    </button>
     <div className="d-flex flex-wrap align-items-center gap-3">
    <button
      onClick={handleNewRequest}
      className="btn btn-sm btn-primary-600"
      type="button"
    >
      <Icon icon="ri:add-line" className="me-1" /> New Request
    </button>
    </div>
  </div>
</div>
        </div>
        {showSearch && (
  <div className="mb-3">
    <div className="input-group w-100">
      <span className="input-group-text bg-light border-end-0">
        <FiSearch style={{color: '#6c757d'}} />
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search maintenance requests..."
        className="form-control bg-light border-start-0"
        autoFocus
      />
    </div>
  </div>
)}
        
        {showFilters && (
  <div className="bg-light p-4 rounded border mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="h6 fw-bold mb-0 text-dark">Filter Maintenance Requests</h3>
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
        <label className="form-label" htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="property-filter">Property</label>
        <input
          id="property-filter"
          type="text"
          name="property"
          value={filters.property}
          onChange={handleFilterChange}
          className="form-control"
          placeholder="Property name"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="date-from-filter">Date From</label>
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
        <label className="form-label" htmlFor="date-to-filter">Date To</label>
        <input
          id="date-to-filter"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          className="form-control"
        />
      </div>
    </div>
  </div>
)}
      </div>
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0,0,0,0.6)',zIndex:1040}} />
          <div className="modal d-block" tabIndex="-1" style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%, -50%)',zIndex:1050,display:'flex',alignItems:'center',justifyContent:'center',width:'100vw',height:'100vh'}}>
            <div style={{minWidth: '340px', maxWidth: '400px', width: '100%', margin:'auto'}}>
  <div className="card-header py-2 px-3">
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
      <div className="d-flex align-items-center gap-2">
        
       
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-link text-danger fs-5 p-0 ms-2"
          aria-label="Close"
          onClick={handleCloseModal}
          style={{marginLeft:'6px'}}
          disabled={isDeleting}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
  <div className="card-body py-4 px-3">
    <div className="radius-8 p-3 bg-white">
      <MaintenanceForm
        formId="maintenance-modal-form"
        onClose={handleCloseModal}
        onMaintenanceAdded={handleRequestAdded}
        editData={editingRequest}
        onUpdate={(id, data) => handleUpdate(id, data)}
      />
    </div>
  </div>
</div>
          </div>
        </>
      )}
      {filteredRequests.length === 0 ? (
        <div className="bg-light rounded p-4">
          <div className="text-center py-5">
            <FiTool className="d-block mx-auto text-secondary" style={{fontSize:'2.5rem'}} />
            <h3 className="mt-2 h6 fw-medium">No maintenance requests</h3>
            <p className="mt-1 text-muted">All properties are in good condition.</p>
          </div>
        </div>
      ) : (
        <div className="bg-light rounded overflow-auto">
          <div className="table-responsive">
            <table   className="table bordered-table text-sm">
              <thead>
                <tr>
                  <th scope="col" className="text-sm">
                    Maintenance Type
                  </th>
                  <th scope="col" className="text-sm">
                    Property
                  </th>
                  <th scope="col" className="text-sm">
                    Maintenance Date
                  </th>
                  <th scope="col" className="text-sm">
                    Priority
                  </th>
                  <th className="text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-light text-dark">
                {filteredRequests.map((request) => (
                  <tr> 
                    <td className="align-middle">
                      <div className="fw-medium">
                        {request.maintainence_type || 'No type specified'}
                      </div>
                    </td>
                    <td className="align-middle">
                      <div className="fw-normal">
                        {request.property?.property_name || 'N/A'}
                      </div>
                      <div className="text-muted">
                        {request.property?.property_address || ''}
                      </div>
                    </td>
                    <td className="align-middle">
                      <div className="text-secondary">
                        {formatDate(request.maintainence_date)}
                      </div>
                    </td>
                    <td className="align-middle">
                      {getPriorityBadge(request.priority)}
                    </td>
                    <td className="align-middle text-end">
                      <button
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                        title="Edit Maintenance Request"
                        onClick={() => handleEdit(request)}
                        style={{outline: 'none'}}
                      >
                        <Icon icon="lucide:edit" width={18} height={18} />
                      </button>
                      <button
                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                        title="Delete Maintenance Request"
                        onClick={() => handleDelete(request.maintainence_id)}
                        disabled={isDeleting}
                        style={{outline: 'none'}}
                      >
                        <Icon icon="mingcute:delete-2-line" width={18} height={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
