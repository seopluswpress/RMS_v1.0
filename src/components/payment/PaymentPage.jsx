import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StripeWrapper from './StripeWrapper';
import axios from 'axios';
import { properties } from '../../services/api';
import Tenant2Sidebar from '../Tenant2Sidebar';

axios.defaults.baseURL='https://hemanth525.pythonanywhere.com';

export default function PaymentPage() {
  const { invoiceId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceAndIntent = async () => {
      try {
        // Fetch invoice details using properties.getinvoice
        const invoiceRes = await properties.getinvoice(invoiceId);
        const invoiceData = invoiceRes?.data?.data || invoiceRes?.data;
        setInvoice(invoiceData);

        // Now fetch payment intent (only clientSecret)
        const intentRes = await axios.post('/accounts/api/create-payment-intent/', {
          invoice_id: invoiceId,
        });
        setClientSecret(intentRes.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoice/payment intent:', err);
        setError('Unable to initialize payment. Please try again later.');
        setLoading(false);
      }
    };

    fetchInvoiceAndIntent();
  }, [invoiceId]);

  if (loading) return (
    <Tenant2Sidebar>
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-light rounded shadow p-6 flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span className="text-gray-700 font-medium">Loading payment form...</span>
        </div>
      </div>
    </Tenant2Sidebar>
  );
  if (error) return (
    <Tenant2Sidebar>
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-red-100 text-red-700 rounded shadow p-6 flex flex-col items-center">
          <svg className="h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" /></svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    </Tenant2Sidebar>
  );

  return (
    <Tenant2Sidebar>
  <div className="max-w-5xl mx-auto mt-12 px-4 md:px-0">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary-800">Pay Your Invoice</h1>
      <p className="text-sm text-gray-500">Review the invoice summary and complete payment securely.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary-700">Invoice Summary</h2>
          {invoice?.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              invoice.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              invoice.status.toLowerCase() === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-200 text-gray-700'
            }`}>
              {invoice.status}
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {/* Invoice Info */}
          <div className="overflow-x-auto">
  <table className="table-auto w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
    <tbody className="divide-y divide-gray-100">
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">Invoice #</td>
        <td className="px-4 py-3">{invoice.invoice_number || invoice.invoice_id}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Status</td>
        <td className="px-4 py-3 capitalize">{invoice.status}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Type</td>
        <td className="px-4 py-3 capitalize">{invoice.invoice_type}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Amount</td>
        <td className="px-4 py-3 font-bold text-primary-700">${invoice.amount?.toLocaleString() || '0.00'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Invoice Date</td>
        <td className="px-4 py-3">{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Due Day</td>
        <td className="px-4 py-3">Day {invoice.lease_details?.due_date || 'N/A'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Property</td>
        <td className="px-4 py-3">{invoice.lease_details?.property_name || invoice.property_name || 'N/A'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Unit</td>
        <td className="px-4 py-3">{invoice.lease_details?.unit_name || invoice.unit_name || 'N/A'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Lease Period</td>
        <td className="px-4 py-3">
          {invoice.lease_details?.lease_start ? new Date(invoice.lease_details.lease_start).toLocaleDateString() : '-'} to{' '}
          {invoice.lease_details?.lease_end ? new Date(invoice.lease_details.lease_end).toLocaleDateString() : '-'}
        </td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Rent</td>
        <td className="px-4 py-3">${invoice.lease_details?.rent?.toLocaleString() || '-'}</td>
      </tr>
      <tr>
        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Increment %</td>
        <td className="px-4 py-3">{invoice.lease_details?.increment_percent ? `${invoice.lease_details.increment_percent}%` : '-'}</td>
      </tr>
      <tr className="bg-primary-50 font-semibold text-primary-800 text-base">
        <td className="px-4 py-4">Total Due</td>
        <td className="px-4 py-4">${invoice.amount?.toLocaleString() || '0.00'}</td>
      </tr>
    </tbody>
  </table>
</div>


          {/* Lease Info */}
          <div className="border rounded-lg p-4 bg-white">
            <p className="font-semibold text-gray-700">Property: <span className="font-normal">{invoice.lease_details?.property_name || 'N/A'}</span></p>
            <p className="font-semibold text-gray-700">Unit: <span className="font-normal">{invoice.lease_details?.unit_name || 'N/A'}</span></p>
            <p className="font-semibold text-gray-700">Lease Period: <span className="font-normal">
              {invoice.lease_details?.lease_start ? new Date(invoice.lease_details.lease_start).toLocaleDateString() : '-'} to {invoice.lease_details?.lease_end ? new Date(invoice.lease_details.lease_end).toLocaleDateString() : '-'}
            </span></p>
          </div>

          {/* Amount Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="font-semibold text-gray-700">Amount: <span className="font-bold text-primary-700">${invoice.amount?.toLocaleString() || '0.00'}</span></p>
            <p className="font-semibold text-gray-700">Rent: <span className="font-normal">${invoice.lease_details?.rent?.toLocaleString() || '-'}</span></p>
            <p className="font-semibold text-gray-700">Increment: <span className="font-normal">{invoice.lease_details?.increment_percent ? invoice.lease_details.increment_percent + '%' : '-'}</span></p>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-bold text-primary-800">Total Due:</p>
            <p className="text-2xl font-extrabold text-primary-900">${invoice.amount?.toLocaleString() || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl shadow-md p-6 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-primary-700 mb-2">Payment Form</h3>
        <p className="text-xs text-gray-500 mb-4">All transactions are securely handled. We do not store card information.</p>

        {clientSecret && invoice ? (
          <StripeWrapper clientSecret={clientSecret} invoice={invoice} />
        ) : (
          <div className="flex flex-col items-center text-gray-400 gap-2 py-8">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Unable to load payment form.</span>
          </div>
        )}
      </div>
    </div>
  </div>
</Tenant2Sidebar>

  );
}
