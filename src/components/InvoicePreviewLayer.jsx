import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { properties } from '../services/api';
import './invoiceButtonStyles.css';

axios.defaults.baseURL = 'https://hemanth525.pythonanywhere.com';

const InvoicePreviewLayer = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const [tenant, setTenant] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleDownload = () => {
    const invoiceElement = document.getElementById('invoice');
    if (window.html2pdf) {
      window.html2pdf().from(invoiceElement).save(`Invoice_${invoiceId}.pdf`);
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById('invoice').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const access = localStorage.getItem('access');
        const res = await axios.get(`/properties/property/invoice/${invoiceId}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json'
          }
        });
        setInvoice(res.data.data);

        const tenantId = res.data.data?.lease_details?.tenant;
        if (tenantId) {
          try {
            const tenantRes = await properties.gettenants(tenantId);
            setTenant(tenantRes.data);
          } catch (err) {
            console.error('Failed to fetch tenant:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
        setError('Unable to fetch invoice details.');
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!invoice) return <div className="alert alert-info">Loading invoice...</div>;

  const lease = invoice?.lease_details || {};

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
          {user?.type !== 'property_owner' && invoice.status?.toLowerCase() !== 'paid' && (
            <Link to={`/pay/${invoiceId}`} className="btn btn-sm btn-primary radius-8 d-inline-flex align-items-center gap-1">
              <Icon icon="mdi:credit-card-outline" className="text-xl" />
              Make Payment
            </Link>
          )}
          <button type="button" onClick={handleDownload} className="btn btn-sm radius-8 d-inline-flex align-items-center gap-1 invoice-action-btn">
            <Icon icon="solar:download-linear" className="text-xl" />
            Download
          </button>
          <Link to="#" className="btn btn-sm radius-8 d-inline-flex align-items-center gap-1 invoice-action-btn">
            <Icon icon="uil:edit" className="text-xl" />
            Edit
          </Link>
          <button type="button" onClick={handlePrint} className="btn btn-sm radius-8 d-inline-flex align-items-center gap-1 invoice-action-btn">
            <Icon icon="basil:printer-outline" className="text-xl" />
            Print
          </button>
        </div>
      </div>

      <div className="card-body py-40">
        <div className="row justify-content-center" id="invoice">
          <div className="col-lg-8">
            <div className="shadow-4 border radius-8">
              <div className="p-20 position-relative border-bottom">
                <div>
                  <h3 className="text-xl">Invoice #{invoice.invoice_id}</h3>
                  <p className="mb-1 text-sm">Date Issued: {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                  <p className="mb-0 text-sm">Status: {invoice.status}</p>
                </div>
                <div className="position-absolute top-0 end-0 p-2">
                  <img src="/assets/images/logo.png" alt="image_icon" className="mb-0" style={{ maxWidth: '300px', height: 'auto' }} />
                </div>
              </div>

              <div className="py-28 px-20">
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                  <div>
                    <h6 className="text-md">Issued For:</h6>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr><td>Property</td><td className="ps-8">: {lease.property_name || '-'}</td></tr>
                        <tr><td>Unit</td><td className="ps-8">: {lease.unit_name || '-'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr><td>Lease Start</td><td className="ps-8">: {lease.lease_start || '-'}</td></tr>
                        <tr><td>Lease End</td><td className="ps-8">: {lease.lease_end || '-'}</td></tr>
                        <tr><td>Due Day</td><td className="ps-8">: Day {lease.due_date || '-'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-24">
                  <div className="table-responsive scroll-sm">
                    <table className="table bordered-table text-sm">
                      <thead>
                        <tr><th>SL.</th><th>Items</th><th>Qty</th><th>Units</th><th>Unit Price</th><th className="text-end">Price</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>01</td>
                          <td>{invoice.invoice_type}</td>
                          <td>1</td>
                          <td>Month</td>
                          <td>${invoice.amount}</td>
                          <td className="text-end">${invoice.amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div><p className="text-sm mb-0">Thanks for your business!</p></div>
                    <div>
                      <table className="text-sm">
                        <tbody>
                          <tr><td className="pe-64">Subtotal:</td><td className="pe-16"><span className="text-primary-light fw-semibold">${invoice.amount}</span></td></tr>
                          <tr><td className="pe-64">Discount:</td><td className="pe-16">$0.00</td></tr>
                          <tr><td className="pe-64 border-bottom pb-4">Tax:</td><td className="pe-16 border-bottom pb-4">0.00</td></tr>
                          <tr><td className="pe-64 pt-4">Total:</td><td className="pe-16 pt-4"><span className="text-primary-light fw-semibold">${invoice.amount}</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-64">
                  <p className="text-center text-secondary-light text-sm fw-semibold">Thank you for your purchase!</p>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-end mt-64">
                  <div className="text-sm border-top d-inline-block px-12">Signature of Customer</div>
                  <div className="text-sm border-top d-inline-block px-12">Signature of Authorized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewLayer;
