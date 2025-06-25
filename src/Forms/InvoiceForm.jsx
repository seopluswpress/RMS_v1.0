import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { properties } from '../services/api';

const INVOICE_TYPES = [
  { value: 'Maintannce Fee', label: 'Maintenance Fee' },
  { value: 'Late Fee', label: 'Late Fee' },
  { value: 'Security Deposit', label: 'Security Deposit' },
  { value: 'Rent', label: 'Rent' }
];

export default function InvoiceForm({ lease, onClose, onInvoiceAdded }) {
  const [formData, setFormData] = useState({
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_type: 'Rent',
    amount: lease?.rent || '',
    lease_id: lease?.lease_id || ''
  });
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        setLoading(true);
        const response = await properties.getleases();
        let leasesData = response?.data?.data || [];
        
        if (!Array.isArray(leasesData)) {
          console.error('Unexpected leases data format:', leasesData);
          setError('Failed to load leases: Invalid data format');
          return;
        }

        const processedLeases = leasesData.map(lease => {
          const propertyName = lease?.property_name || 
                             lease?.property_id?.property_name || 
                             'Unknown Property';
          const unitName = lease?.unit_name || 
                         lease?.unit_id?.unit_name ||
                         lease?.unit?.unit_name ||
                         'Unknown Unit';
          const displayName = `Lease #${lease.lease_id} - ${propertyName} - ${unitName}`;
          
          return {
            ...lease,
            property_name: propertyName,
            unit_name: unitName,
            display_name: displayName
          };
        });

        setLeases(processedLeases);

        if (!lease && processedLeases.length > 0) {
          setFormData(prev => ({
            ...prev,
            lease_id: processedLeases[0].lease_id
          }));
        }
      } catch (err) {
        setError('Failed to load lease data: ' + (err.message || 'Unknown error'));
        console.error('Error fetching lease data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, [lease]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const payload = {
        ...formData,
        lease: formData.lease_id,
        amount: Number(formData.amount)
      };
      
      delete payload.lease_id;
      
      const response = await properties.postinvoice(payload);
      
      if (response.status === 201 || response.data?.status === 1) {
        alert('Invoice created successfully');
        onInvoiceAdded?.(response.data);
        onClose?.();
      } else {
        throw new Error('Invoice creation failed');
      }
    } catch (err) {
      setError('Error creating invoice: ' + (err.response?.data?.message || err.message));
      console.error('Error creating invoice:', err);
    }
  };

  if (loading && !lease) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700 dark:text-gray-200">Loading leases...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
     
      <div className="card-body">
        <form id="invoice-form" onSubmit={handleSubmit} className="row g-4 needs-validation" noValidate>
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}
          {!lease && (
            <div className="col-12">
              <label className="form-label fw-semibold">Lease</label>
              <select
                name="lease_id"
                value={formData.lease_id}
                onChange={handleChange}
                className="form-select"
                required
              >
                {leases.map(lease => (
                  <option key={lease.lease_id} value={lease.lease_id}>
                    {lease.display_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Invoice Date</label>
            <input
              type="date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Invoice Type</label>
            <select
              name="invoice_type"
              value={formData.invoice_type}
              onChange={handleChange}
              className="form-select"
              required
            >
              {INVOICE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label fw-semibold">Amount</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-control"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 pt-2">
            <button
              type="submit"
              className="btn btn-primary-600 d-flex align-items-center gap-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
