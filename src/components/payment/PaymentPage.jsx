import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StripeWrapper from './StripeWrapper';
import axios from 'axios';
import { properties } from '../../services/api';
import Tenant2Sidebar from "../Tenant/Tenant2Sidebar";

axios.defaults.baseURL = 'https://hemanth525.pythonanywhere.com';

export default function PaymentPage() {
  const { invoiceId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceAndIntent = async () => {
      try {
        const access = localStorage.getItem('access');

        // Fetch invoice details with authorization
        const invoiceRes = await axios.get(`/properties/property/invoice/${invoiceId}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        });

        const invoiceData = invoiceRes?.data?.data || invoiceRes?.data;
        setInvoice(invoiceData);

        // Fetch PaymentIntent with token
        const intentRes = await axios.post(
          '/accounts/api/create-payment-intent/',
          { invoice_id: invoiceId },
          {
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setClientSecret(intentRes.data.client_secret);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoice/payment intent:', err);
        setError('Unable to initialize payment. Please try again later.');
        setLoading(false);
      }
    };

    fetchInvoiceAndIntent();
  }, [invoiceId]);

  if (loading)
    return (
      <Tenant2Sidebar>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="bg-light rounded shadow p-6 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-700 font-medium">Loading payment form...</span>
          </div>
        </div>
      </Tenant2Sidebar>
    );

  if (error)
    return (
      <Tenant2Sidebar>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="bg-red-100 text-red-700 rounded shadow p-6 flex flex-col items-center">
            <svg className="h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </Tenant2Sidebar>
    );

  return (
    <Tenant2Sidebar>
      {/* ... (keep the existing invoice UI unchanged) ... */}
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
    </Tenant2Sidebar>
  );
}
