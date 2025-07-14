import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const UnitCountOne = ({ showUserStats = false, showIncome = true }) => {
    const navigate = useNavigate();
    const [totalSubscriptions, setTotalSubscriptions] = useState(0);
    const [totalOwners, setTotalOwners] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalFreeUsers, setTotalFreeUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access");

                const res = await fetch("https://hemanth525.pythonanywhere.com/accounts/user-subscribe/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const json = await res.json();
                const subscriptions = json.subscriptions || [];

                const paidSubs = subscriptions.filter(sub => !sub.is_trial);
                const trialSubs = subscriptions.filter(sub => sub.is_trial);

                setTotalSubscriptions(paidSubs.length);
                setTotalFreeUsers(trialSubs.length);
                setTotalIncome(paidSubs.reduce((sum, sub) => sum + (parseFloat(sub.price) || 0), 0));

                const uniqueOwnerIds = new Set(subscriptions.map(sub => sub.user));
                setTotalOwners(uniqueOwnerIds.size);

            } catch (err) {
                console.error(err);
                setTotalSubscriptions(0);
                setTotalOwners(0);
                setTotalIncome(0);
                setTotalFreeUsers(0);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="row row-cols-2 gy-4">
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Subscription</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totalSubscriptions}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                <Icon icon="fa-solid:award" className="text-white text-2xl mb-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Free Users</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totalFreeUsers}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                <Icon icon="fluent:people-20-filled" className="text-white text-2xl mb-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showIncome && (
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-4 h-100 ">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">Total Income</p>
                                    <h6 className="mb-0">${loading ? 'Loading...' : totalIncome.toFixed(2)}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon icon="solar:wallet-bold" className="text-white text-2xl mb-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="col">
                <div className="card shadow-none border bg-gradient-start-5 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Owners</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totalOwners}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                                <Icon icon="fa6-solid:file-invoice-dollar" className="text-white text-2xl mb-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitCountOne;
