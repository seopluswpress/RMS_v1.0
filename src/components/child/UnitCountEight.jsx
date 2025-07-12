import React, { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';

const UnitCountEight = () => {
  const [paymentStats, setPaymentStats] = useState({
    pendingPayments: 0,
    totalPayments: 0,
    pendingPercentage: 0,
    paidPercentage: 0,
    lastMonthPending: 0,
    lastMonthPaid: 0
  });

  useEffect(() => {
    // Fetch invoice data from your API
    const fetchPaymentData = async () => {
      console.log('Starting to fetch invoice data...');
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.user_id) {
          console.error('No user found in localStorage');
          return;
        }
        const access = localStorage.getItem('access');
        console.log('Fetching invoices from https://hemanth525.pythonanywhere.com/properties/property/invoice/ ...');
        const response = await axiosInstance.get('/properties/property/invoice/', {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('API Response:', response);
        
        if (!response || !response.data) {
          console.error('Invalid response format:', response);
          return;
        }
        
        const invoices = response?.data?.data || response?.data || [];
        console.log('Invoice Data:', invoices);

        // Sum unpaid and paid invoice amounts
        let pendingPayments = 0;
        let totalPayments = 0;
        invoices.forEach(inv => {
          if (String(inv.status).toLowerCase() === 'paid') {
            totalPayments += Number(inv.amount) || 0;
          } else {
            pendingPayments += Number(inv.amount) || 0;
          }
        });

        // Calculate percentages (optional, simple logic for now)
        const total = pendingPayments + totalPayments;
        const paidPercentage = total > 0 ? Math.round((totalPayments / total) * 100) : 0;
        const pendingPercentage = total > 0 ? Math.round((pendingPayments / total) * 100) : 0;

        const updatedStats = {
          pendingPayments,
          totalPayments,
          pendingPercentage,
          paidPercentage,
          lastMonthPending: 0, // You can fill this if you have last month's data
          lastMonthPaid: 0
        };

        console.log('Updating payment stats:', updatedStats);
        setPaymentStats(updatedStats);
        
      } catch (error) {
        console.error('Error fetching invoice data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
      }
    };

    fetchPaymentData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  return (
    <div className='row gy-4'>
      <div className='col-xxl-5 col-lg-6 col-md-12' style={{paddingTop: '1rem',paddingBottom: '1rem',paddingLeft: '1rem',paddingRight: '1rem'}}>
        <div className='card p-3 ps-3 pt-3 pb-3 shadow-2 radius-8 h-100 gradient-deep-two-1 border border-white'>
          <div className='card-body p-0'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
              <div className='d-flex align-items-center gap-10'>
                <span className='mb-0 w-48-px h-48-px bg-warning-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                  <i className='ri-time-line' style={{ fontSize: 28 }} />
                </span>
                <div>
                  <span className='fw-medium text-secondary-light text-md'>
                    Pending Payments
                  </span>
                  <h6 className='fw-semibold mt-2'>{formatCurrency(paymentStats.pendingPayments)}</h6>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className='col-xxl-5 col-lg-6 col-md-12' style={{paddingTop: '1rem',paddingBottom: '1rem',paddingLeft: '1rem',paddingRight: '1rem'}}>
        <div className='card p-3 pe-3 pt-3 pb-3 shadow-2 radius-8 h-100 gradient-deep-two-3 border border-white'>
          <div className='card-body p-0'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
              <div className='d-flex align-items-center gap-10'>
                <span className='mb-0 w-48-px h-48-px bg-success-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                  <i className='ri-check-double-line' style={{ fontSize: 28 }} />
                </span>
                <div>
                  <span className='fw-medium text-secondary-light text-md'>
                    Total Payments Made
                  </span>
                  <h6 className='fw-semibold mt-2'>{formatCurrency(paymentStats.totalPayments)}</h6>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountEight;
