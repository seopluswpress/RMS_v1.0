import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const UnitCountFour = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [daysLeft, setDaysLeft] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [propertyCount, setPropertyCount] = useState(null);
  const [tenantCount, setTenantCount] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [maintenanceCount, setMaintenanceCount] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access');

    if (!user || !token) {
      setStatus('no_user');
      return;
    }

    // Subscription fetch
    axios.get(`/accounts/api/subscribe/?user_id=${user.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          const { end_date, plan, price, start_date } = res.data.subscription;
          setPlanDetails({ plan, price, start_date, end_date });
          const endDate = new Date(end_date);
          const now = new Date();
          const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          if (diff > 0) {
            setStatus('trial');
            setDaysLeft(diff);
          } else {
            setStatus('expired');
            setDaysLeft(0);
          }
        } else {
          setStatus('expired');
        }
      })
      .catch(() => setStatus('expired'));

    // Property count fetch
    axios.get(`https://hemanth525.pythonanywhere.com/properties/property_list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const data = res.data?.data || res.data || [];
        setPropertyCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setPropertyCount(0));

    // Tenant count fetch
    axios.get(`https://hemanth525.pythonanywhere.com/user/tenant/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const data = res.data?.data || res.data || [];
        setTenantCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setTenantCount(0));

    // Income fetch
    axios.get(`https://hemanth525.pythonanywhere.com/properties/property/invoice/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const invoices = res.data?.data || [];
        const paid = invoices.filter(inv => inv.status?.toLowerCase() === 'paid');
        const total = paid.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
        setTotalIncome(total);
      })
      .catch(() => setTotalIncome(0));

    // Maintenance count
    axios.get(`https://hemanth525.pythonanywhere.com/properties/maintainence/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const data = res.data?.data || [];
        setMaintenanceCount(data.length);
      })
      .catch(() => setMaintenanceCount(0));
  }, []);

  return (
    <div className="container-fluid p-0 pt-3 ps-3">
      {/* First Row */}
      <div className="row mb-3">
        {/* Total Tenants */}
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-none border bg-gradient-start-3 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Tenants</p>
                  <h6 className="mb-0">{tenantCount ?? '--'}</h6>
                </div>
                <div className="w-50-px h-50-px bg-warning rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="mdi:account-group" className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Properties */}
        <div className="col-md-6 ps-3">
          <div className="card shadow-none border bg-gradient-start-2 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Properties</p>
                  <h6 className="mb-0">{propertyCount ?? '--'}</h6>
                </div>
                <div className="w-50-px h-50-px bg-primary-600 rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="mdi:home-city" className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="row">
        {/* Total Maintenance Requests */}
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-none border bg-gradient-start-5 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Maintenance Requests</p>
                  <h6 className="mb-0">{maintenanceCount ?? '--'}</h6>
                </div>
                <div className="w-50-px h-50-px bg-danger rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="ph:wrench" className="text-white text-2xl" style={{ position: 'relative', top: '-1px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="col-md-6 ps-3">
          <div className="card shadow-none border bg-gradient-start-4 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Income</p>
                  <h6 className="mb-0">₹ {totalIncome ?? '--'}</h6>
                </div>
                <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="streamline:bag-dollar-solid" className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountFour;
