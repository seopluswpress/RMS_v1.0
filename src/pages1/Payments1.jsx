import React, { useState, useEffect, useMemo } from 'react';
import {
  FiDollarSign,
  FiCreditCard,
  FiX,
  FiFilter,
  FiSearch,
  FiFileText,
  FiRefreshCw,
} from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { properties } from '../services/api';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
 
const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' }
];
 
export default function Payments() {
  const { invoice_id } = useParams();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [singleInvoice, setSingleInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    type: ''
  });
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showRefresh, setShowRefresh] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
 
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
      unpaid: 'bg-yellow-100 text-yellow-800',
    };
    const className = statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };
 
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await properties.getinvoices();
      const invoicesData = response?.data?.data || response?.data || [];
      if (Array.isArray(invoicesData)) {
        setInvoices(invoicesData);
        setShowRefresh(false);
        setRetryCount(0);
        toast.info('Invoices refreshed successfully');
      } else {
        throw new Error('Invalid invoices data format');
      }
    } catch (err) {
      console.error('Error refreshing invoices:', err);
      toast.error('Failed to refresh invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const syncInvoiceStatus = async (invoiceId) => {
    try {
      console.log(`Syncing status for invoice ${invoiceId}...`);
      const response = await properties.getinvoice(invoiceId);
     
      if (response.status !== 200) {
        throw new Error(response.data?.error || 'Failed to fetch invoice');
      }
     
      const invoiceData = response.data?.data || response.data;
      console.log('Invoice data from sync:', invoiceData);
     
      if (!invoiceData) {
        throw new Error('No invoice data received');
      }
     
      // Update the invoices list with the latest data
      setInvoices(prev => prev.map(inv =>
        String(inv.invoice_id) === String(invoiceId) ? { ...inv, ...invoiceData } : inv
      ));
     
      // Update single invoice if it's the one being viewed
      if (singleInvoice && String(singleInvoice.invoice_id) === String(invoiceId)) {
        setSingleInvoice(prev => ({ ...prev, ...invoiceData }));
      }
     
      // Check if invoice is paid
      if (invoiceData.status?.toLowerCase() === 'paid') {
        console.log(`Invoice ${invoiceId} is now marked as paid`);
        setRetryCount(0);
        setShowRefresh(false);
        return true;
      }
     
      // If not paid, try syncing with Stripe
      try {
        const syncResponse = await properties.syncInvoiceStatus(invoiceId);
        if (syncResponse.data?.status === 1) {
          console.log(`Successfully synced invoice ${invoiceId} with Stripe`);
          // Refresh the invoice data after sync
          const refreshed = await properties.getinvoice(invoiceId);
          const refreshedData = refreshed.data?.data || refreshed.data;
         
          if (refreshedData?.status?.toLowerCase() === 'paid') {
            setInvoices(prev => prev.map(inv =>
              String(inv.invoice_id) === String(invoiceId) ? refreshedData : inv
            ));
            setRetryCount(0);
            setShowRefresh(false);
            return true;
          }
        }
      } catch (syncError) {
        console.error('Error during Stripe sync:', syncError);
      }
     
      // If we get here, the invoice is still not paid
      console.warn(`Invoice ${invoiceId} is still not marked as paid after sync`);
      return false;
     
    } catch (err) {
      console.error(`Error syncing invoice ${invoiceId} status:`, err);
      toast.error(`Failed to sync invoice ${invoiceId} status. Please try again.`);
      setShowRefresh(true);
      throw err; // Re-throw to allow caller to handle the error
    }
  };
 
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        if (invoice_id) {
          const response = await properties.getinvoice(invoice_id);
          setSingleInvoice(response?.data?.data || response?.data || null);
        } else {
          const response = await properties.getinvoices();
          const invoicesData = response?.data?.data || response?.data || [];
          if (Array.isArray(invoicesData)) {
            setInvoices(invoicesData);
          }
        }
      } catch (err) {
        setError('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [invoice_id]);
 
  useEffect(() => {
    const getStripeConfig = async () => {
      try {
        const response = await properties.getstripeconfig();
        const data = response.data;
        setStripePromise(loadStripe(data.STRIPE_PUBLISHABLE_KEY || data.publishable_key));
      } catch (error) {
        console.error('Error loading Stripe:', error);
        toast.error('Failed to load payment processor');
      }
    };
    getStripeConfig();
  }, []);
 
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
   
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
        const invoiceDate = new Date(invoice.invoice_date || invoice.created_at);
        return invoiceDate >= fromDate;
      });
    }
   
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.invoice_date || invoice.created_at);
        return invoiceDate <= toDate;
      });
    }
   
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(invoice => {
        const propertyName = invoice?.lease_details?.property_name ||
                           invoice?.lease?.property?.property_name ||
                           invoice?.property_name || '';
        const unitName = invoice?.lease_details?.unit_name ||
                        invoice?.lease?.unit?.unit_name || '';
        const tenantName = invoice?.lease_details?.tenant_name ||
                          invoice?.lease?.tenant?.username ||
                          invoice?.tenant_name || '';
       
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
  }, [invoices, filters, searchTerm]);
 
  const handlePayNow = async (invoice) => {
    try {
      console.log('Initiating payment for invoice_id:', invoice.invoice_id);
      setSelectedInvoice(invoice);
      const response = await properties.createpaymentintent({
        invoice_id: String(invoice.invoice_id),
        amount: invoice.amount,
      });
     
      if (response.data.status === 1 && response.data.client_secret) {
        setClientSecret(response.data.client_secret);
        setShowStripeForm(true);
      } else {
        throw new Error(response.data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    }
  };
 
  const handlePaymentSuccess = async () => {
    setShowStripeForm(false);
    setLoading(true);
   
    if (!selectedInvoice?.invoice_id) {
      console.error('No selected invoice ID for syncing');
      toast.error('Error syncing invoice status');
      setLoading(false);
      return;
    }
 
    const invoiceId = selectedInvoice.invoice_id;
    toast.info('Processing payment confirmation...');
   
    // First, try to get the updated invoice
    try {
      const response = await properties.getinvoice(invoiceId);
      const invoiceData = response?.data?.data || response?.data;
     
      if (invoiceData?.status?.toLowerCase() === 'paid') {
        // Update the invoices list with the paid status
        setInvoices(prev => prev.map(inv =>
          String(inv.invoice_id) === String(invoiceId)
            ? { ...inv, ...invoiceData, status: 'paid' }
            : inv
        ));
       
        // Update single invoice if it's the one being viewed
        if (singleInvoice && String(singleInvoice.invoice_id) === String(invoiceId)) {
          setSingleInvoice(prev => ({ ...prev, ...invoiceData, status: 'paid' }));
        }
       
        toast.success('Payment successful! Invoice marked as paid.');
        setRetryCount(0);
        setShowRefresh(false);
        return;
      }
     
      // If not paid yet, wait and retry a few times
      let attempts = 0;
      const maxAttempts = 3;
      const retryDelay = 2000; // 2 seconds
     
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Retry attempt ${attempts} for invoice ${invoiceId}...`);
       
        await new Promise(resolve => setTimeout(resolve, retryDelay));
       
        try {
          const retryResponse = await properties.getinvoice(invoiceId);
          const retryData = retryResponse?.data?.data || retryResponse?.data;
         
          if (retryData?.status?.toLowerCase() === 'paid') {
            // Update the invoices list with the paid status
            setInvoices(prev => prev.map(inv =>
              String(inv.invoice_id) === String(invoiceId)
                ? { ...inv, ...retryData, status: 'paid' }
                : inv
            ));
           
            // Update single invoice if it's the one being viewed
            if (singleInvoice && String(singleInvoice.invoice_id) === String(invoiceId)) {
              setSingleInvoice(prev => ({ ...prev, ...retryData, status: 'paid' }));
            }
           
 
 
            toast.success('Payment successful! Invoice marked as paid.');
            setRetryCount(0);
            setShowRefresh(false);
            return;
          }
        } catch (retryError) {
          console.error(`Retry ${attempts} failed:`, retryError);
        }
      }
     
      // If we get here, all retries failed
      toast.warning(
        <div>
          <p>Payment processing may take a few moments.</p>
          <p>Your invoice will update automatically when confirmed.</p>
          <button
            onClick={() => handleRefresh()}
            className="mt-2 text-blue-400 hover:text-blue-300 underline"
          >
            Refresh Now
          </button>
        </div>,
        { autoClose: 10000 }
      );
      setShowRefresh(true);
     
    } catch (err) {
      console.error('Error in payment success handler:', err);
      toast.error('Error confirming payment status. Please refresh the page to check.');
      setShowRefresh(true);
    } finally {
      setLoading(false);
    }
  };
 
  const toggleSearch = () => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);
    if (!newShowSearch) {
      setSearchTerm('');
    }
    if (newShowSearch) {
      setShowFilters(false);
    }
  };
 
  const toggleFilters = () => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
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
 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiDollarSign className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
 
  if (invoice_id && singleInvoice) {
    return (
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Invoice #{singleInvoice.invoice_id || singleInvoice.id}</h2>
        <div className="text-gray-300">Status: {getStatusBadge(singleInvoice.status)}</div>
        <div className="text-gray-300">Amount: ${singleInvoice.amount?.toFixed(2)}</div>
        <div className="text-gray-300">Property: {singleInvoice?.lease_details?.property_name || singleInvoice?.lease?.property?.property_name || 'N/A'}</div>
        <div className="text-gray-300">Unit: {singleInvoice?.lease_details?.unit_name || singleInvoice?.lease?.unit?.unit_name || 'N/A'}</div>
        <div className="text-gray-300">Due Date: {formatDate(singleInvoice.due_date)}</div>
        <div className="mt-4">
          {['unpaid', 'overdue'].includes(singleInvoice.status?.toLowerCase()) && (
            <button
              onClick={() => handlePayNow(singleInvoice)}
              className="text-blue-400 hover:text-blue-600 mr-4"
              title="Pay Now"
            >
              <FiCreditCard className="inline mr-1" />
              Pay
            </button>
          )}
          <button
            onClick={() => syncInvoiceStatus(singleInvoice.invoice_id)}
            className="text-blue-400 hover:text-blue-600"
            title="Sync Status"
          >
            <FiRefreshCw className="inline mr-1" />
            Sync Status
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Invoices</h1>
          <p className="text-gray-400">Track and manage property invoices</p>
        </div>
        <div className="flex items-center space-x-2">
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Refresh"
              title="Refresh Invoices"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={toggleSearch}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Search"
            title="Search Invoices"
          >
            {showSearch ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleFilters}
            className="p-2 text-gray-400 hover:text-white focus:outline-none relative"
            aria-label="Filter"
            title="Filter Invoices"
          >
            {showFilters ? <FiX className="h-5 w-5" /> : <FiFilter className="h-5 w-5" />}
            {Object.values(filters).some(val => val !== '') &&
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
            }
          </button>
        </div>
      </div>
 
      {showSearch && (
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoices..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
      )}
 
      {showFilters && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">Filter Invoices</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Invoice Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="rent">Rent</option>
                <option value="maintenance">Maintenance</option>
                <option value="utility">Utility</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
 
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">
              {searchTerm || Object.values(filters).some(val => val !== '')
                ? 'No matching invoices found'
                : 'No invoices found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoice_id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {invoice?.lease_details?.property_name ||
                       invoice?.lease?.property?.property_name ||
                       invoice?.property_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {invoice?.lease_details?.unit_name ||
                       invoice?.lease?.unit?.unit_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(invoice.invoice_date || invoice.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                      {invoice.invoice_type?.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${invoice.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {['unpaid', 'overdue'].includes(invoice.status?.toLowerCase()) && (
                        <button
                          onClick={() => handlePayNow(invoice)}
                          className="text-blue-400 hover:text-blue-600"
                          title="Pay Now"
                        >
                          <FiCreditCard className="inline mr-1 h-5 w-5" />
                          Pay
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/invoices/${invoice.invoice_id}`)}
                        className="text-blue-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <FiFileText className="inline mr-1 h-5 w-5" />
                        Details
                      </button>
                      {['unpaid', 'overdue'].includes(invoice.status?.toLowerCase()) && (
                        <button
                          onClick={() => syncInvoiceStatus(invoice.invoice_id)}
                          className="text-blue-400 hover:text-blue-600"
                          title="Sync Status"
                        >
                          <FiRefreshCw className="inline mr-1 h-5 w-5" />
                          Sync
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
 
      {showStripeForm && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Complete Payment</h3>
                <button
                  onClick={() => setShowStripeForm(false)}
                  className="text-gray-400 hover:text-gray-200"
                  aria-label="Close"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
             
              <div className="mb-6">
                <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiFileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-200">
                        Invoice #{selectedInvoice?.invoice_id} • ${selectedInvoice?.amount?.toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm text-blue-200">
                        {selectedInvoice?.lease_details?.property_name || selectedInvoice?.lease?.property?.property_name || selectedInvoice?.property_name || 'N/A'} •
                        {selectedInvoice?.lease_details?.tenant_name || selectedInvoice?.lease?.tenant?.username || selectedInvoice?.tenant_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
             
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowStripeForm(false)}
                  selectedInvoice={selectedInvoice}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
function CheckoutForm({ onSuccess, onCancel, selectedInvoice }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!stripe || !elements) return;
 
    setIsLoading(true);
    setErrorMessage('');
 
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?invoice_id=${selectedInvoice?.invoice_id}`,
      },
      redirect: 'if_required',
    });
 
    setIsLoading(false);
 
    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };
 
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}
 