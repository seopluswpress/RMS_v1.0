import React, { useState, useEffect } from "react";
import { properties } from "../../services/api";

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
        console.log('Calling properties.getinvoice(80)...');
        const response = await properties.getinvoice(80);
        console.log('API Response:', response);
        
        if (!response || !response.data) {
          console.error('Invalid response format:', response);
          return;
        }
        
        const invoiceData = response.data;
        console.log('Invoice Data:', invoiceData);
        
        // Calculate payment status based on the invoice data
        const isPaid = invoiceData.status === 'paid';
        const isOverdue = new Date(invoiceData.due_date) < new Date() && !isPaid;
        const isPending = !isPaid && !isOverdue;
        
        const updatedStats = {
          pendingPayments: isPending || isOverdue ? invoiceData.amount : 0,
          totalPayments: isPaid ? invoiceData.amount : 0,
          pendingPercentage: isPending || isOverdue ? 100 : 0,
          paidPercentage: isPaid ? 100 : 0,
          lastMonthPending: 0,
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
            <p className='text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light'>
              <span className={`${paymentStats.pendingPercentage >= 0 ? 'bg-danger-focus text-danger-main' : 'bg-success-focus text-success-main'} px-6 py-2 rounded-2 fw-medium text-sm d-flex align-items-center gap-1`}>
                <i className={`ri-arrow-${paymentStats.pendingPercentage >= 0 ? 'up' : 'down'}-line`} /> 
                {Math.abs(paymentStats.pendingPercentage)}%
              </span>{" "}
              Last month {formatCurrency(paymentStats.lastMonthPending)}
            </p>
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
            <p className='text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light'>
              <span className={`${paymentStats.paidPercentage >= 0 ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main'} px-6 py-2 rounded-2 fw-medium text-sm d-flex align-items-center gap-1`}>
                <i className={`ri-arrow-${paymentStats.paidPercentage >= 0 ? 'up' : 'down'}-line`} /> 
                {Math.abs(paymentStats.paidPercentage)}%
              </span>{" "}
              Last month {formatCurrency(paymentStats.lastMonthPaid)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountEight;
