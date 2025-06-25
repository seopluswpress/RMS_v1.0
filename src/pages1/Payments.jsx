import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { 
  FiDollarSign, 
  FiEdit2, 
  FiTrash2, 
  FiLoader, 
  FiPlus, 
  FiSearch,
  FiFileText,
  FiX,
  FiFilter,
  FiChevronDown
} from 'react-icons/fi';
import { properties } from '../services/api';

export default function Payments() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    type: ''
  });

  // Define fetchInvoices outside useEffect so it can be called manually
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await properties.getinvoices();
      const invoicesData = response?.data?.data || response?.data || [];
     
      if (Array.isArray(invoicesData)) {
        setInvoices(invoicesData);
        console.log('Invoices data refreshed:', invoicesData.length, 'invoices');
      } else {
        console.error('Unexpected invoices data format:', invoicesData);
        setError('Failed to load invoices: Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
 
  // Check for payment completion when component mounts or becomes visible
  useEffect(() => {
    // Initial data load
    fetchInvoices();
   
    // Set up an interval to check for updates (every 30 seconds)
    const refreshInterval = setInterval(() => {
      const lastPaymentTime = localStorage.getItem('lastPaymentTime');
      if (lastPaymentTime) {
        const timeSincePayment = Date.now() - parseInt(lastPaymentTime);
        // If payment was made in the last 2 minutes, refresh data
        if (timeSincePayment < 120000) { // 2 minutes in milliseconds
          console.log('Recent payment detected, refreshing invoices data');
          fetchInvoices();
          // Clear the payment flag after refreshing
          if (timeSincePayment > 10000) { // After 10 seconds, clear the flag
            localStorage.removeItem('lastPaymentTime');
          }
        }
      }
    }, 30000);
   
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);
 
 

  // Filter invoices based on search term and filters using useMemo
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    // Apply filters first
    if (filters.status) {
      result = result.filter(invoice => 
        invoice.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.type) {
      result = result.filter(invoice => 
        invoice.invoice_type?.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        return invoiceDate >= fromDate;
      });
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day for inclusive filtering
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        return invoiceDate <= toDate;
      });
    }
    
    // Then apply search term if present
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(invoice => {
        // Get property and unit names from nested objects if available
        const propertyName = invoice?.lease_details?.property_name || 
                            invoice?.lease?.property?.property_name || 
                            '';
        const unitName = invoice?.lease_details?.unit_name || 
                        invoice?.lease?.unit?.unit_name || 
                        '';
        const tenantName = invoice?.lease_details?.tenant_name || 
                          invoice?.lease?.tenant?.username || 
                          '';
        
        return (
          (invoice.invoice_number?.toLowerCase().includes(lowercasedTerm)) ||
          (tenantName.toLowerCase().includes(lowercasedTerm)) ||
          (propertyName.toLowerCase().includes(lowercasedTerm)) ||
          (unitName.toLowerCase().includes(lowercasedTerm)) ||
          (invoice.status?.toLowerCase().includes(lowercasedTerm)) ||
          (invoice.invoice_type?.toLowerCase().includes(lowercasedTerm)) ||
          (invoice.amount?.toString().includes(searchTerm)) ||
          (invoice.invoice_id?.toString().includes(searchTerm))
        );
      });
    }
    
    return result;
  }, [searchTerm, invoices, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSearch = () => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);
    if (!newShowSearch) {
      // Clear search term when hiding search
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
      dateFrom: '',
      dateTo: '',
      type: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    const className = statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const handleInvoiceAdded = async (newInvoice) => {
    setShowCreateForm(false);
    // Reload all invoices data from server to ensure consistency
    await fetchInvoices();
  };

  const handleInvoiceUpdated = (updatedInvoice) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.invoice_id === updatedInvoice.invoice_id ? { ...inv, ...updatedInvoice } : inv
      )
    );
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      const response = await properties.updateinvoice(invoice.invoice_id, { active: false });
      if (response.status === 200 || response.data?.status === 1) {
        setInvoices(prev => 
          prev.map(inv => 
            inv.invoice_id === invoice.invoice_id ? { ...inv, active: false } : inv
          )
        );
      } else {
        throw new Error('Failed to delete invoice');
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Failed to delete invoice: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span>Show</span>
            <select className="form-select form-select-sm w-auto" defaultValue="10">
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="icon-field">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control form-control-sm w-auto"
              placeholder="Search"
            />
            <span className="icon">
              <FiSearch />
            </span>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <select className="form-select form-select-sm w-auto" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Select Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <div className="d-flex flex-wrap align-items-center gap-3">
          
        </div>
        </div>
      </div>

      {showSearch && (
        <div className="position-relative" style={{maxWidth: 400}}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 d-flex align-items-center" style={{zIndex:2}}>
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search invoices..."
            className="form-control ps-5"
            autoFocus
          />
        </div>
      )}
      
      {showFilters && (
  <div className="col-md-6 mx-auto">
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0">Filter Invoices</h6>
        <button 
          onClick={clearFilters}
          className="btn btn-link text-primary p-0 text-decoration-none"
        >
          Clear all
        </button>
      </div>
      <div className="card-body">
        <div className="row gy-3">
          <div className="col-12">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Invoice Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Types</option>
              <option value="rent">Rent</option>
              <option value="maintenance">Maintenance</option>
              <option value="utility">Utility</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <div className="d-flex align-items-center">
            <div className="me-2 flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '16rem'}}>
          <FiLoader className="spinner-border text-primary" style={{width:'2rem',height:'2rem'}} />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-5">
          <div className="bg-light rounded shadow p-4">
            <FiDollarSign className="d-block mx-auto text-secondary" style={{fontSize:'2.5rem'}} />
            <h3 className="mt-2 h6 fw-medium">
              {searchTerm ? 'No matching invoices found' : 'No invoices found'}
            </h3>
            <p className="mt-1 text-muted">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Get started by creating a new invoice'}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary d-inline-flex align-items-center px-4 py-2"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  New Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-light rounded shadow overflow-auto">
        <div className="table-responsive">
          <table className="table bordered-table mb-0">
            <thead>
              <tr className="bg-primary-600 text-white">
                <th scope="col">Property</th>
                <th scope="col">Unit</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, idx) => (
                <tr key={invoice.invoice_id}>
                  <td>
                    <span className="text-primary-600">{invoice?.lease_details?.property_name || invoice?.lease?.property?.property_name || 'N/A'}</span>
                  </td>
                  <td>{invoice?.lease_details?.unit_name || invoice?.lease?.unit?.unit_name || 'N/A'}</td>
                  <td>{formatDate(invoice.invoice_date)}</td>
                  <td>{invoice.invoice_type?.toLowerCase()}</td>
                  <td>${invoice.amount?.toFixed(2) || '0.00'}</td>
                  <td>
  {String(invoice.status || '').toLowerCase() === 'paid' && (
    <span
      className="d-inline-flex align-items-center justify-content-center bg-success-focus text-success-main fw-medium text-sm"
      style={{
        width: '100px', // Set a fixed width
        height: '30px', // Set a fixed height
        borderRadius: '999px', // Ensures a pill-shaped appearance
        padding: '0 10px', // Optional, to control inner spacing
      }}
    >
      Paid
    </span>
  )}
  {String(invoice.status || '').toLowerCase() === 'pending' && (
    <span
      className="d-inline-flex align-items-center justify-content-center bg-warning-focus text-warning-main fw-medium text-sm"
      style={{
        width: '100px',
        height: '30px',
        borderRadius: '999px',
        padding: '0 10px',
      }}
    >
      Pending
    </span>
  )}
  {String(invoice.status || '').toLowerCase() === 'overdue' && (
    <span
      className="d-inline-flex align-items-center justify-content-center bg-danger-focus text-danger-main fw-medium text-sm"
      style={{
        width: '100px',
        height: '30px',
        borderRadius: '999px',
        padding: '0 10px',
      }}
    >
      Overdue
    </span>
  )}
  {!['paid', 'pending', 'overdue'].includes(String(invoice.status || '').toLowerCase()) && (
    <span
      className="d-inline-flex align-items-center justify-content-center bg-secondary text-white fw-medium text-sm"
      style={{
        width: '100px',
        height: '30px',
        borderRadius: '999px',
        padding: '0 10px',
      }}
    >
      {invoice.status?.toLowerCase() === 'paid' ? (
        <span
          className="text-green-600 font-semibold underline cursor-pointer hover:text-green-800"
          title="View Invoice"
          onClick={() => window.location.href = `/invoice-preview/${invoice.invoice_id}`}
        >
          {invoice.status}
        </span>
      ) : (
        invoice.status || 'Unknown'
      )}
    </span>
  )}
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