import { useState, useEffect } from 'react';
import { properties } from '../services/api';

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'overdue', label: 'Overdue' }
];

export default function EditInvoiceModal({ invoice, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    status: invoice?.status || 'unpaid'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await properties.updateinvoice(invoice.invoice_id, formData);
      if (response.status === 200 || response.data?.status === 1) {
        onUpdate?.(response.data?.data || formData);
        onClose?.();
      } else {
        throw new Error('Failed to update invoice');
      }
    } catch (err) {
      setError('Error updating invoice: ' + (err.response?.data?.message || err.message));
      console.error('Error updating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await properties.deleteinvoice(invoice.invoice_id);
      if (response.status === 200 || response.data?.status === 1) {
        onUpdate?.({ ...invoice, active: false });
        onClose?.();
      } else {
        throw new Error('Failed to delete invoice');
      }
    } catch (err) {
      setError('Error deleting invoice: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return null;

  return (
    <>
    <div
      className="modal-backdrop show"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1040,
      }}
    />
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centers the modal both horizontally and vertically
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          minWidth: '380px',
          maxWidth: '450px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
        }}
      >
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-bold">Edit Invoice #{invoice.invoice_id}</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="submit"
              form="edit-invoice-form"
              className="btn btn-sm btn-primary fw-semibold d-inline-flex align-items-center gap-1"
              disabled={loading}
              style={{ fontWeight: 600 }}
            >
              <span className="d-inline-flex align-items-center">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {loading ? 'Saving...' : 'Save'}
              </span>
            </button>
            <button
              type="button"
              className="btn btn-link text-danger fs-4 p-0 ms-2"
              aria-label="Close"
              onClick={onClose}
              style={{ marginLeft: '8px' }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <form id="edit-invoice-form" onSubmit={handleSubmit}>
          <div className="card-body py-40 px-20">
            {error && (
              <div
                className="alert alert-danger py-2 px-3 mb-3"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="form-label fw-semibold">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </>
  
   
      
   
  );
}
