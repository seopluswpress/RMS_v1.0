import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import { toast } from "react-toastify";


import { properties } from '../services/api';
import Modal from 'react-modal';

const SubscriptionCard = ({ title, price, period, features, ctaLabel, planId, onSubscribe, isLoading, isSuperAdmin, isPropertyOwner, onEdit, description, hasUsedTrial, subscribing }) => {
  
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onSubscribe(planId);
    setTimeout(() => setClicked(false), 1200); // Optional: revert after 1.2s
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      padding: "0",
      margin: "16px",
      width: "320px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        background: '#30314f',
        color: '#fff',
        padding: '14px 0',
        fontWeight: 700,
        fontSize: '1.15rem',
        textAlign: 'center',
        letterSpacing: '0.01em',
        borderRadius: '18px 18px 0 0'
      }}>{title}</div>
      <div style={{ padding: '0 18px 18px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <span style={{ fontWeight: 700, fontSize: '2.1rem', color: '#2b2d42' }}>{price}</span>
          <span style={{ fontSize: '1rem', color: '#888', fontWeight: 500 }}>{period}</span>
        </div>
        {description && (
          <div style={{ marginBottom: 18, paddingLeft: '10px' }}>
            {description
              // First split by periods
              .split('.')
              // Then further split each item by commas
              .flatMap(sentence => sentence.split(','))
              // Filter out empty items
              .filter(item => item.trim())
              // Create a bullet point for each item
              .map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ 
                    backgroundColor: '#4caf50', 
                    borderRadius: '50%', 
                    width: '22px', 
                    height: '22px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginRight: '8px',
                    flexShrink: 0
                  }}>
                    <Icon 
                      icon="mdi:check" 
                      style={{ color: '#fff' }} 
                      width={16} 
                      height={16} 
                    />
                  </div>
                  <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.4 }}>
                    {item.trim()}
                  </span>
                </div>
              ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '10px' }}>
          {/* Add edit button for all plans except Basic, but only for superadmin users */}
          {isSuperAdmin && title.toLowerCase() !== 'basic' && (
            <button
              style={{
                padding: '8px 20px',
                background: '#30314f',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => onEdit && onEdit({ title, price, period, features, planId, description })}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon="mdi:pencil" style={{ marginRight: '4px' }} />
                <span>Edit</span>
              </div>
            </button>
          )}
          {isPropertyOwner ? (
            <>
              <button
                style={{
                  padding: '10px 28px',
                  background: clicked ? '#d1b480' : '#30314f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : ctaLabel}
              </button>
              {/* Trial logic for property owner */}
              {typeof hasUsedTrial !== 'undefined' && (
                hasUsedTrial ? (
                  <div style={{ marginTop: 10, color: '#888', fontSize: '0.9rem' }}>
                    Trial already used.
                  </div>
                ) : (
                  <button
                    onClick={() => onSubscribe(planId, true) }
                    disabled={subscribing}
                    style={{
                      marginTop: 10,
                      padding: '8px 22px',
                      background: '#4caf50',
                      border: 'none',
                      borderRadius: 6,
                      color: '#fff',
                      fontWeight: 600,
                      cursor: subscribing ? 'not-allowed' : 'pointer',
                      opacity: subscribing ? 0.7 : 1
                    }}
                  >
                    Start Free Trial
                  </button>
                )
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPage() {
  const [editModalPlan, setEditModalPlan] = useState(null);
  const [editError, setEditError] = useState("");
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', price: '', period: '', description: '' });

  // Handler to open modal and prefill form
  const handleEditPlan = (plan) => {
    setEditModalPlan(plan);
    setEditForm({
      title: plan.title || '',
      price: plan.price ? plan.price.replace('$', '') : '',
      period: plan.period || '',
      description: plan.description || ''
    });
  };

  // Handler for form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModalPlan) return;
    try {
      setSubscribing(true);
      const planId = editModalPlan.planId || editModalPlan.plan_id;
      const payload = {
        plan: editForm.title,
        price: editForm.price,
        period: editForm.period,
        description: editForm.description
      };
      await properties.postplan(planId, payload);
      toast.success('Plan updated successfully!');
      setEditModalPlan(null);
      fetchPlans();
    } catch (error) {
      toast.error('Failed to update plan');
    } finally {
      setSubscribing(false);
    }
  };

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    setUserId(user.user_id);
    const superAdmin = user.type === 'superadmin' || user.is_superuser;
    setIsSuperAdmin(superAdmin);
    setIsPropertyOwner(user.type === 'property_owner');
    console.log('SubscriptionPage user:', user, 'isSuperAdmin:', superAdmin, 'isPropertyOwner:', user.type === 'property_owner');
    // Fetch plans only
    fetchPlans();
    fetchCurrentSubscription(user.user_id);
  }, [navigate]);
  
  const fetchPlans = async () => {
    try {
      const response = await axios.get('accounts/plan/');
      if (response.data) {
        setPlans(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
      toast.error('Failed to load subscription plans');
    }
  };
  
  const fetchCurrentSubscription = async (userId) => {
    try {
      const response = await axios.get(`/accounts/subscribe/?user_id=${userId}`);
      if (response.data && response.data.status === 'success') {
        setCurrentSubscription(response.data.subscription);
        setHasUsedTrial(response.data.has_used_trial);
      }
    } catch (error) {
      console.error('Error fetching current subscription:', error);
    }
  };

  
  const [paymentMethod, setPaymentMethod] = useState('direct');
  const [systemSettings, setSystemSettings] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  
  // Fetch system settings to determine available payment methods
  const fetchSystemSettings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // Only fetch settings if user is superadmin
      if (user && user.is_superuser) {
        const response = await axios.get('/accounts/system-settings/');
        setSystemSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };
  
  useEffect(() => {
    fetchSystemSettings();
  }, []);
  
  const handleSubscribe = async (planId, isTrial = false) => {
    if (!userId) {
      toast.error('Please log in to subscribe');
      navigate('/login');
      return;
    }
    setSubscribing(true);
    let response;
    try {
      // If property owner, fetch owners before subscribing
      if (isPropertyOwner) {
        await properties.getowners();
      }

      if (isTrial) {
        const res = await axios.post('/accounts/subscribe/', {
          user_id: userId,
          plan_id: planId,
          is_trial: true
        });

        if (res.data.status === 'success'){
          toast.success('Trial subscription started successfully!');
          fetchPlans();
          setSubscribing(false);
          return;
        }
      } else {
        response = await axios.post('/accounts/subscription/create-checkout/', {
          user_id: userId,
          plan_id: planId
        });
      }
      if (response && response.data && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else if (response) {
        toast.error('Failed to start Stripe checkout.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error(error.response?.data?.error || 'Failed to process subscription');
    } finally {
      setSubscribing(false);
    }
  };


  
  // If loading, show a loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading subscription plans...</div>
      </div>
    );
  }
  
  // Use fetched plans or fallback to default plans
  const displayPlans = plans.length > 0 ? plans.map(plan => ({
    title: plan.plan,
    price: `$${plan.price}`,
    period: "per month",
    description: plan.description || "", 
    features: [],
    ctaLabel: currentSubscription && currentSubscription.plan === plan.plan ? "Current Plan" : "Subscribe Now",
    planId: plan.plan_id,
    isCurrentPlan: currentSubscription && currentSubscription.plan === plan.plan
  })) : [
    {
      title: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Best for large businesses: Manage up to 30 properties and 99 units per property.",
      features: [
        "Up to 30 properties",
        "Up to 99 units per property",
        "For large business"
      ],
      ctaLabel: "Subscribe Now"
    },
    {
      title: "Basic",
      price: "$9.99",
      period: "per month",
      description: "",
      features: [
        "Up to 2 properties",
        "Up to 1 unit per property",
        "For individual"
      ],
      ctaLabel: "Subscribe Now"
    }
  ];


  
  // SuperAdmin Settings Panel
  const SuperAdminPanel = () => {
    if (!isSuperAdmin || !systemSettings) return null;
    
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 100,
        width: '300px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Admin Settings</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Payment Flow:</label>
          <select 
            value={systemSettings.payment_flow}
            onChange={async (e) => {
              try {
                await axios.patch('/accounts/system-settings/', {
                  payment_flow: e.target.value
                });
                setSystemSettings({...systemSettings, payment_flow: e.target.value});
                toast.success('Payment flow updated');
              } catch (error) {
                toast.error('Failed to update settings');
              }
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="direct">Direct Only</option>
            <option value="stripe">Stripe Only</option>
            <option value="both">Both Options</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            id="free-trial"
            checked={systemSettings.allow_free_trial}
            onChange={async (e) => {
              try {
                await axios.patch('/accounts/system-settings/', {
                  allow_free_trial: e.target.checked
                });
                setSystemSettings({...systemSettings, allow_free_trial: e.target.checked});
                toast.success('Free trial setting updated');
              } catch (error) {
                toast.error('Failed to update settings');
              }
            }}
          />
          <label htmlFor="free-trial" style={{ marginLeft: '5px' }}>Allow Free Trial</label>
        </div>
        
        {systemSettings.allow_free_trial && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Trial Days:</label>
            <input 
              type="number" 
              value={systemSettings.trial_days}
              onChange={async (e) => {
                try {
                  await axios.patch('/accounts/system-settings/', {
                    trial_days: parseInt(e.target.value)
                  });
                  setSystemSettings({...systemSettings, trial_days: parseInt(e.target.value)});
                  toast.success('Trial days updated');
                } catch (error) {
                  toast.error('Failed to update settings');
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div style={{
      background: "#f6f8fa",
      minHeight: "100vh",
      paddingTop: 40,
      position: 'relative'
    }}>
      {/* SuperAdmin Settings Panel */}
      <SuperAdminPanel />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <img src="/assets/images/logo-light.png" alt="Logo" style={{
          height: 44,
          width: 'auto',
          objectFit: 'contain',
          display: 'block'
        }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 0 }}>
        <div style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          color: "#2b2d42",
          marginBottom: 8
        }}>
          {isSuperAdmin ? "Subscription Admin Panel" : "Choose your plan"}
        </div>
        <div style={{
          fontSize: "1.15rem",
          color: "#444",
          marginBottom: 12
        }}>
          {isSuperAdmin
            ? <>
                <span style={{ color: '#b36b00', fontWeight: 500 }}>You are in admin mode.</span><br/>
                You can test all payment flows and adjust system settings below. <br/>
                
              </>
            : "Select the plan that best suits your business needs"}
        </div>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "32px",
        minHeight: "60vh",
        background: "#f6f8fa",
        padding: "60px 0",
      }}>
        {displayPlans.map((plan, idx) => (
        <SubscriptionCard
          key={plan.title}
          {...plan}
          onSubscribe={handleSubscribe}
          isLoading={subscribing && selectedPlanId === plan.planId}
          isSuperAdmin={isSuperAdmin}
          isPropertyOwner={isPropertyOwner}
          onEdit={handleEditPlan}
          hasUsedTrial={hasUsedTrial}
          subscribing={subscribing}
        />
      ))}

        {/* Edit Plan Modal for Superadmin */}
        <Modal
          isOpen={!!editModalPlan}
          onRequestClose={() => setEditModalPlan(null)}
          contentLabel="Edit Plan"
          ariaHideApp={false}
          style={{
            content: {
              maxWidth: '440px',
              margin: 'auto',
              padding: '36px',
              borderRadius: '14px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
              background: '#f8fafc',
              border: 'none',
            }
          }}
        >
          <h2 style={{marginBottom: 24, textAlign: 'center', color: '#30314f', fontWeight: 700, fontSize: '1.6rem'}}>Edit Subscription Plan</h2>
          {editModalPlan && (
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{marginBottom: 0}}>
                <label style={{fontWeight: 600, color: '#222', marginBottom: 6, display: 'block'}}>Title</label>
                <input type="text" name="title" value={editForm.title} onChange={handleEditChange} style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3b3b3', fontSize: '1.08rem', background: '#fff'}} required />
              </div>
              <div style={{marginBottom: 0}}>
                <label style={{fontWeight: 600, color: '#222', marginBottom: 6, display: 'block'}}>Price</label>
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3b3b3', fontSize: '1.08rem', background: '#fff'}} required />
              </div>
              <div style={{marginBottom: 0}}>
                <label style={{fontWeight: 600, color: '#222', marginBottom: 6, display: 'block'}}>Period</label>
                <input type="text" name="period" value={editForm.period} onChange={handleEditChange} style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3b3b3', fontSize: '1.08rem', background: '#fff'}} required />
              </div>
              <div style={{marginBottom: 0}}>
                <label style={{fontWeight: 600, color: '#222', marginBottom: 6, display: 'block'}}>Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3b3b3', fontSize: '1.08rem', background: '#fff', minHeight: '80px'}} required />
              </div>
              {editError && (
                <div style={{ color: '#b00020', marginBottom: 8, fontWeight: 500, textAlign: 'center' }}>{editError}</div>
              )}
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8}}>
                <button type="button" onClick={() => setEditModalPlan(null)} style={{padding: '10px 22px', borderRadius: 6, border: 'none', background: '#eee', color: '#222', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" style={{padding: '10px 22px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', opacity: subscribing ? 0.7 : 1}} disabled={subscribing}>
                  {subscribing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
      {/* Profile Dropdown at Top Right */}
      <div style={{ position: 'absolute', top: 28, right: 40, zIndex: 20 }}>
        <div style={{ position: 'relative' }}>
          <div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              <li style={{paddingLeft: 18, display: 'flex', alignItems: 'center', gap: '10px'}}>
                <img
                  src="/assets/images/user.png"
                  alt="avatar"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
                <Link 
                  style={{
                    color: '#333',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  to="/dashboard"
                >
                  Dashboard
                </Link>
                <Link 
                  style={{
                    color: '#333',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: '15px'
                  }} 
                  to="#"
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  <Icon icon="lucide:power" style={{fontSize: '18px'}} /> Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer style={{
        width: '100%',
        background: '#fff',
        color: '#2b2d42',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        padding: '12px 0',
        fontSize: '1rem',
        marginTop: 'auto',
        letterSpacing: '0.01em',
        fontWeight: 500
      }}>
        © 2025 RMS. All rights reserved.
      </footer>
    </div>
  );
}
