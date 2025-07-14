import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradePlanPopup = ({ status, daysLeft, planDetails, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="upgrade-plan-popup-overlay">
      <div className='trail-bg text-center d-flex flex-column justify-content-between align-items-center p-16 radius-8 upgrade-plan-popup-card'>
        <button className="close-btn align-self-end mb-2" onClick={onClose}>
          &times;
        </button>
        <h6
          className='text-white text-xl upgrade-plan-link mb-3'
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/subscription')}
        >
          Upgrade Your Plan
        </h6>
        <div>
          {status === 'loading' && <p className='text-white'>Checking your subscription status...</p>}
          {status === 'trial' && daysLeft > 5 && (
            <>
              <p className='text-white'>Your subscription and plan details</p>
              {planDetails && (
                <div className='text-white text-sm mt-2'>
                  <div><strong>Plan:</strong> {planDetails.plan}</div>
                  <div><strong>Start Date:</strong> {new Date(planDetails.start_date).toLocaleDateString()}</div>
                  <div><strong>End Date:</strong> {new Date(planDetails.end_date).toLocaleDateString()}</div>
                </div>
              )}
            </>
          )}
          {status === 'trial' && daysLeft <= 5 && (
            <p className='text-white'>Your free trial expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}</p>
          )}
          {status === 'expired' && <p className='text-white'>Your trial or subscription has expired.</p>}
          {status === 'no_user' && <p className='text-white'>Please log in to manage your subscription.</p>}
          {((status === 'expired') || (status === 'trial' && daysLeft !== null && daysLeft <= 5)) && (
            <button
              type="button"
              className="btn py-8 rounded-pill w-100 bg-gradient-blue-warning text-sm"
              onClick={() => navigate('/subscription')}
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
      <style>{`
        .upgrade-plan-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .upgrade-plan-popup-card {
          min-width: 350px;
          max-width: 90vw;
          max-height: 400px;
          overflow-y: auto;
          position: relative;
        }
        .upgrade-plan-popup-card .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default UpgradePlanPopup;
