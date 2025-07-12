import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'https://hemanth525.pythonanywhere.com';

export default function PaymentSuccess() {
  const { invoiceId } = useParams();
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const updateInvoiceStatus = async () => {
      if (!invoiceId || isNaN(invoiceId)) {
        console.warn("⚠️ invoiceId is missing or invalid:", invoiceId);
        setStatus('missing');
        return;
      }

      try {
        const response = await axios.patch(
          `/properties/property/invoice_post/${invoiceId}/`,
          { status: "paid" },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("✅ Invoice updated successfully:", response.data);
        setStatus('success');
      } catch (error) {
        console.error("❌ Failed to update invoice:", error.response?.data || error.message);
        setStatus('error');
      }
    };

    updateInvoiceStatus();
  }, [invoiceId]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(44,62,80,0.08)', padding: '40px 32px', minWidth: 340, maxWidth: 420, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} />
            <h3 className="fw-bold mb-2">Processing Payment...</h3>
            <p className="text-secondary mb-0">Please wait while we verify your payment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <FiCheckCircle size={64} color="#27ae60" className="mb-2" />
            <h3 className="fw-bold mb-2">Payment Successful!</h3>
            <p className="text-secondary mb-4">Your payment has been received and your invoice is now marked as paid.</p>
            <button className="btn btn-primary w-100 mb-2" onClick={() => navigate('/tenant-dashboard')}>Go to Dashboard</button>
            <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/tenant-invoices')}>View My Invoices</button>
          </>
        )}
        {status === 'missing' && (
          <>
            <FiXCircle size={64} color="#e74c3c" className="mb-2" />
            <h3 className="fw-bold mb-2">Payment Not Found</h3>
            <p className="text-secondary mb-4">The invoice ID is missing or invalid. Please contact support if you believe this is an error.</p>
            <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/tenant-dashboard')}>Back to Dashboard</button>
          </>
        )}
        {status === 'error' && (
          <>
            <FiXCircle size={64} color="#e74c3c" className="mb-2" />
            <h3 className="fw-bold mb-2">Payment Failed</h3>
            <p className="text-secondary mb-4">There was an error updating your payment. Please try again or contact support.</p>
            <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/tenant-dashboard')}>Back to Dashboard</button>
          </>
        )}
      </div>
    </div>
  );
}
