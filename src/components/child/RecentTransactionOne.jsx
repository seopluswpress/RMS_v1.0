import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { properties } from '../../services/api'

const RecentTransactionOne = () => {
    const [recentPaid, setRecentPaid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentPaid = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await properties.getinvoices();
                let invoices = res?.data?.data || res?.data || [];
                invoices = Array.isArray(invoices) ? invoices : [];
                // Filter for paid or failed invoices and sort by payment date descending
                const filtered = invoices.filter(inv => {
                    const status = inv.status?.toLowerCase();
                    return status === 'paid' || status === 'failed';
                });
                filtered.sort((a, b) => {
                    const dateA = new Date(a.payment_date || a.updated_at || a.invoice_date || 0);
                    const dateB = new Date(b.payment_date || b.updated_at || b.invoice_date || 0);
                    return dateB - dateA;
                });
                setRecentPaid(filtered.slice(0, 5));
            } catch (err) {
                setError('Failed to load recent transactions.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecentPaid();
    }, []);

    return (
        <div className="col-xxl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Recent Transaction</h6>
                        <Link
                            to="/payments"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0 xsm-table">
                            <thead>
                                <tr>
                                    <th scope="col">Invoice#</th>
                                    <th scope="col">Unit Name</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            {error}
                                        </td>
                                    </tr>
                                ) : (
                                    recentPaid.map((invoice, index) => {
                                        const status = invoice.status?.toLowerCase();
                                        let statusBadge, statusText;
                                        if (status === 'paid') {
                                            statusBadge = 'bg-success-focus text-success-main';
                                            statusText = 'Paid';
                                        } else if (status === 'failed') {
                                            statusBadge = 'bg-danger-focus text-danger-main';
                                            statusText = 'Failed';
                                        } else {
                                            statusBadge = 'bg-secondary text-secondary';
                                            statusText = status;
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <span className="text-primary-light d-block fw-medium">
                                                        {invoice.invoice_id}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-primary-light d-block fw-medium">
                                                        {invoice.unit_name}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-primary-light d-block fw-medium">
                                                        {invoice.amount}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`${statusBadge} px-16 py-4 radius-4 fw-medium text-sm`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <Link
                                                        to={`/invoice/${invoice.id}`}
                                                        className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                                                    >
                                                        View
                                                        <Icon
                                                            icon="solar:alt-arrow-right-linear"
                                                            className="icon"
                                                        />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentTransactionOne;