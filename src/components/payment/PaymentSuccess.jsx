import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'https://hemanth525.pythonanywhere.com';

export default function PaymentSuccess() {
  const { invoiceId } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const updateInvoiceStatus = async () => {
      if (!invoiceId || isNaN(invoiceId)) {
        console.warn("⚠️ invoiceId is missing or invalid:", invoiceId);
        setStatus('missing');
        return;
      }

      try {
        const response = await axios.patch(
          `/properties/property/invoice/${invoiceId}/`,
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
    <div className="text-center mt-20 text-white">
      <h2 className="text-3xl font-bold mb-4">🎉 Payment Successful</h2>
      {status === 'success' && <p className="text-green-400">✅ Invoice marked as paid.</p>}
      {status === 'error' && <p className="text-red-500">❌ Failed to update invoice.</p>}
      {status === 'missing' && <p className="text-yellow-400">⚠️ Invoice ID is missing in the URL.</p>}
      {status === 'loading' && <p>Updating invoice status...</p>}
    </div>
  );
}
